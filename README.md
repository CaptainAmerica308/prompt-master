# Prompt Master

A Claude Code mod that rewrites your rough draft into a sharper prompt — in place, before you send.

A small **✨ Prompt Master** button sits in the band just above the composer. Type a rough prompt, click the button (or run `/promptmaster`), and it rewrites your draft into a clear, well-structured prompt and drops it straight back into the box for you to review and send. It preserves your intent and specifics — it never answers the prompt, it just sharpens it.

While it works, the button reads **✨ Rewriting…**.

## Install

At the prompt of a terminal Claude Code session:

```
/plugin install prompt-master --marketplace CaptainAmerica308/prompt-master
```

Answer `y` to add the marketplace, then pick a scope (user scope is first).

From a shell instead:

```
claude plugin install prompt-master --marketplace CaptainAmerica308/prompt-master
```

In the desktop app, where `/plugin` does not run: click **+** next to the prompt box, then **Plugins**, **Add marketplace** with `CaptainAmerica308/prompt-master`, then **Add plugin**.

## How it works

- `hooks/register.tsx` renders the button in the `AbovePrompt` band and registers the `/promptmaster` command.
- On press it reads the current draft (`$.prompt.read`), rewrites it with a single `$.model.complete` call (Sonnet, medium effort), and replaces the draft (`$.prompt.fill`).
- No draft is sent anywhere until you press Enter yourself.
