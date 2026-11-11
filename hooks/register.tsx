import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

/** Flips while a rewrite is running so the band can show a working label. */
const isBusy = atom({ plugin: 'prompt-master', key: 'isBusy' } as const, false)

/** What the model rewrites a rough prompt into. It must return ONLY the new
 *  prompt text — never an answer to it, never commentary. */
const REWRITE_RULES = `You are Prompt Master, a prompt rewriter.

You are given a user's ROUGH, half-formed prompt for an AI coding/assistant agent.
Rewrite it into a single clear, well-structured prompt that will get a better
result. Preserve the user's original intent, constraints, and any specifics
(names, paths, numbers, tech) exactly. Do not invent requirements they did not
imply. Make the ask explicit: state the goal, the relevant context, and what a
good answer looks like. Keep it concise — no padding.

Output ONLY the rewritten prompt. Do not answer the prompt. Do not add preamble,
quotes, markdown fences, or notes like "Here is the improved prompt". If the
input is already a clear instruction, tighten it rather than expand it.`

async function polish($: EngineInterface) {
  // read the current draft
  const { text } = await $.prompt.read()
  const draft = text.trim()

  if (draft.length === 0) {
    $.ui.toast('Prompt Master: type a rough prompt first, then click me.')
    return
  }

  await update($, isBusy, () => true)

  try {
    const r = await $.model.complete({
      model: 'sonnet',
      system: REWRITE_RULES,
      prompt: draft,
      effort: 'medium',
      maxTokens: 2000,
      timeoutMs: 45000,
    })

    if (!r.isAnswered) {
      $.ui.toast(`Prompt Master couldn't rewrite that (${r.reason}).`)
      return
    }

    const improved = r.text.trim()
    if (improved.length === 0) {
      $.ui.toast('Prompt Master got an empty reply — left your draft as is.')
      return
    }

    const filled = await $.prompt.fill({ text: improved, mode: 'replace' })
    if (filled.isFilled) {
      $.ui.toast('Prompt Master polished your prompt ✨ — review, then send.')
    } else {
      $.ui.toast('Prompt Master could not write to the composer right now.')
    }
  } finally {
    await update($, isBusy, () => false)
  }
}

export const register: Register = (on, options) => {
  // A slash command alternative, so the rewrite is reachable by keyboard too.
  on('session.start', ($, e, next) => {
    $.command.register({
      name: 'promptmaster',
      description: 'Rewrite your current draft into a sharper prompt, in place.',
    })
    return next(e)
  })

  on('command.run', { command: 'promptmaster' }, async ($, _e, _next) => {
    await polish($)
    return {}
  })

  // The button, in the band directly above the composer (next to the + area).
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)

    const busy = await read($, isBusy)
    const { Box, Button } = $.ui.resolve(e)

    return (
      <Box>
        <Button
          key="promptmaster"
          variant="primary"
          label={busy ? '✨ Rewriting…' : '✨ Prompt Master'}
          onPress={() => {
            if (busy) return
            void polish($)
          }}
        />
      </Box>
    )
  })
}
