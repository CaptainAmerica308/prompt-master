import { expect, test } from 'claude-code/testing'

test('the band draws the Prompt Master button on every surface', async ($, on) => {
  on('command.register', () => ({ value: { command: 'promptmaster' } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  for (const surface of ['terminal', 'desktop', 'vscode', 'mobile'] as const) {
    await $.session.start({ cwd: '/', surface, isInteractive: true })
    const ui = await $.ui.mount({
      plugin: 'prompt-master',
      component: 'AbovePrompt',
      surface,
      props: { hasSurvey: false },
    })
    const button = await ui.find({ type: 'Button', key: 'promptmaster' })
    expect(button === null || button === undefined).toBe(false)
    await ui.unmount()
  }
})
