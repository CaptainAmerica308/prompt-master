# Prompt Master

A Claude Code mod that rewrites your rough draft into a sharper prompt — in place, before you send.

A small **✨ Prompt Master** button sits in the band just above the composer. Type a rough prompt, click the button (or run `/promptmaster`), and it rewrites your draft into a clear, well-structured prompt and drops it straight back into the box for you to review and send. It preserves your intent and specifics — it never answers the prompt, it just sharpens it.

While it works, the button reads **✨ Rewriting…**.

## Show it in every chat (desktop app)

This is the reliable way to load the button in **every new chat** in the Claude desktop app. Name the mod folder in `CLAUDE_CODE_PLUGIN_DIRS`, which the app reads at startup:

1. Put this mod at a stable folder, e.g. `~/.claude/mods/prompt-master` (clone this repo there, or copy the folder).
2. In `~/.claude/settings.json`, add an `env` block pointing at that folder:

   ```json
   {
     "env": {
       "CLAUDE_CODE_PLUGIN_DIRS": "/Users/<you>/.claude/mods/prompt-master"
     }
   }
   ```

   Separate multiple folders with `:` (macOS/Linux) or `;` (Windows).
3. Fully quit and reopen the app. The **✨ Prompt Master** button appears above the composer in every chat, and `/promptmaster` works too.

Edits you make to the folder take effect on the next restart — no reinstall needed.

## Install via marketplace (terminal)

At the prompt of a terminal Claude Code session:

```
/plugin install prompt-master --marketplace CaptainAmerica308/prompt-master
```

Answer `y` to add the marketplace, then pick a scope (user scope is first). From a shell instead:

```
claude plugin install prompt-master --marketplace CaptainAmerica308/prompt-master
```

> **Note:** the `claude plugin install` / `/plugin` route currently loads hooks through the terminal CLI's *classic* command-hook loader, which rejects this mod's module hooks (`hooks/hooks.json` uses `{ "modules": ["./register.tsx"] }`) and reports `Hook load failed: expected record, received undefined`. To load the button in the desktop app, use the **Show it in every chat** method above instead.

## How it works

- `hooks/register.tsx` renders the button in the `AbovePrompt` band and registers the `/promptmaster` command.
- On press it reads the current draft (`$.prompt.read`), rewrites it with a single `$.model.complete` call (Sonnet, medium effort), and replaces the draft (`$.prompt.fill`).
- No draft is sent anywhere until you press Enter yourself.
