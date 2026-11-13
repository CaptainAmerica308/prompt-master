# Prompt Master

Rewrites your rough draft into a sharper prompt before you send it. It preserves your intent and specifics, and it never answers the prompt: it only sharpens it.

It ships in two forms, because no single mechanism reaches every kind of chat:

| Where you are | What you get | How |
| --- | --- | --- |
| A Claude Code session (desktop Code tab, terminal) | **✨ Prompt Master** button above the composer, plus `/promptmaster` | the mod (plugin) |
| Any chat, including normal Claude chats and the first message of a new session | `/prompt-master <rough prompt>` or "prompt master: <rough prompt>" | the skill |

## 1. The button (Claude Code mod)

Type a rough prompt, click **✨ Prompt Master** (or run `/promptmaster`), and the draft is rewritten in place for you to review and send. While it works, the button reads **✨ Rewriting…**.

Install at user scope so it loads in every session:

```
claude plugin install prompt-master --marketplace CaptainAmerica308/prompt-master
```

In the desktop app: click **+** next to the prompt box, then **Plugins**, **Add marketplace** with `CaptainAmerica308/prompt-master`, then **Add plugin**. Restart the app afterwards.

Things to know:

- **It needs a recent Claude Code engine.** Verified on 2.1.321. Older builds (2.1.150, for one) cannot read a hooks module and report `Hook load failed: expected record, received undefined`.
- **The desktop app runs its own bundled engine, not the `claude` on your PATH.** If `claude plugin list` says the mod failed to load, check the version first: the app logs the binary it uses in `~/Library/Logs/Claude/main.log` (`Using Claude Code binary at: …`). Run `plugin list` with that binary to see the real status.
- **The button is drawn by a running session's engine.** It cannot appear in normal Claude chats, which do not run Claude Code mods. Use the skill there.

## 2. The skill (works in every chat)

Claude Code (all sessions, from the first message):

```
mkdir -p ~/.claude/skills && cp -R skill/prompt-master ~/.claude/skills/
```

Then type `/prompt-master fix the login thing its broken on mobile` and you get the rewritten prompt back in a copyable block.

Normal Claude chats (claude.ai and the desktop Chat tab): upload `prompt-master-skill.zip` under **Settings → Capabilities → Skills**, then say "prompt master: <your rough prompt>" in any chat.

## How the mod works

- `hooks/register.tsx` renders the button in the `AbovePrompt` band and registers the `/promptmaster` command.
- On press it reads the current draft (`$.prompt.read`), rewrites it with a single `$.model.complete` call (Sonnet, medium effort), and replaces the draft (`$.prompt.fill`).
- No draft is sent anywhere until you press Enter yourself.
- `hooks/register.test.tsx` checks that the button draws on the terminal, desktop, VS Code and mobile surfaces: `claude plugin test .`
