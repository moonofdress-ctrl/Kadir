# Kadir

A YouTube channel that explains big market and company news as cartoon videos, made by a team of Claude agents with three human approval gates.

| Folder | What |
|---|---|
| `channel-system/` | How an episode is made: the format book, the style guide, the cast, the episode folders and the research behind the rules. Start with `channel-system/README.md`. |
| `studio/` | The engine that draws every picture in code, plus the build, preview and retention-lint tools. See `studio/README.md`. |
| `.claude/agents/` | The agents: trend-scout, researcher, scriptwriter, fact-checker, art-director, scene-builder, voice-producer, editor, qa-reviewer, illustrator, packager, analyst. |
| `amazon-hidden-tax/` | An earlier documentary-style episode and its three older render engines. |

Try the engine (Node 22+, nothing else to install):

```bash
node studio/tools/build.mjs channel-system/episodes/demo
```
```bash
node studio/tools/preview.mjs
```

Then open `http://127.0.0.1:8780/sheet.html?t=2,6,12,19&cols=2`.
