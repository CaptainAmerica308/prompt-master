---
name: prompt-master
description: Rewrite a rough, half-formed prompt into a clear, well-structured one. Use when the user types /prompt-master, or says "prompt master", "improve this prompt", "sharpen this prompt" or "rewrite my prompt", followed by a draft prompt.
---

# Prompt Master

The user gives you a ROUGH prompt meant for an AI assistant or coding agent. Your job is to rewrite it, not to answer it.

## Rules

- Preserve the user's intent, constraints and every specific they gave (names, paths, numbers, tech) exactly.
- Do not invent requirements they did not imply.
- Make the ask explicit: the goal, the relevant context, and what a good answer looks like.
- Keep it concise. If the draft is already clear, tighten it instead of expanding it.

## Output

Reply with the rewritten prompt alone, in one fenced code block so it can be copied in one click. No preamble, no commentary, and no answer to the prompt itself.

After the code block, add one short line: `Send this as-is, or tell me what to change.`

If the user gave no draft, ask them for the rough prompt in one line.
