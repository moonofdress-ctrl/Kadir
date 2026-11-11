# Channel system

A newsroom of agents that turns a market event into a 12–15 minute cartoon explainer, with three human approval gates.

## Pipeline

```
1 trend-scout    → 3 scored topic ideas                  ─┐
                                                          ├─ GATE 1: you pick a topic
2 researcher     → episodes/<slug>/research.md (sourced) ─┘
3 scriptwriter   → episodes/<slug>/script.md (FORMAT_BOOK)
4 fact-checker   → episodes/<slug>/factcheck.md, fixes   ─── GATE 2: you approve the script
5 art-director   → episodes/<slug>/shotlist.json + prompts.md
6 illustrator    → episodes/<slug>/images/  (from Higgsfield history today; direct generation later)
7 voice-producer → episodes/<slug>/audio/   (narrator + character lines)
8 editor         → engine/cartoon render → episodes/<slug>/render/
9 qa-reviewer    → episodes/<slug>/qa.md, sends fixes back
10 packager      → episodes/<slug>/package.md, thumbnail, captions ─ GATE 3: you approve and upload
```

Agent definitions live in `.claude/agents/` at the repository root, so every Claude Code session in this repo can run them by name.

## Folders

| Path | What |
|---|---|
| `FORMAT_BOOK.md` | Script rules. The single most important file. |
| `characters/STYLE_GUIDE.md` | Art style lock, caricature limits, thumbnail layout. |
| `characters/cast.md` | Recurring characters and their image prompts. |
| `characters/sheets/` | Approved model sheets (reference images for every generation). |
| `episodes/_template/` | Empty episode folder to copy. |
| `research/` | Teardowns and competitor notes. |
| `../amazon-hidden-tax/engine/cartoon/` | The render engine for this format. |

## Tools and who does what today

| Step | Tool | Status |
|---|---|---|
| Research, script, fact-check | Claude (web search, primary documents) | Ready |
| Images | Higgsfield, Nano Banana Pro (unlimited on the Plus plan). The user generates from `prompts.md`; the illustrator pulls results from Higgsfield history. | Manual step |
| Voice | Open decision: ElevenLabs API, or Kokoro for characters + ElevenLabs narrator. Kokoro scratch voice works today. | Pending |
| Render | HyperFrames (Apache 2.0), engine/cartoon | Ready |
| Upload | The user, in YouTube Studio | Manual step |

## Running an episode

In a Claude Code session in this repo:
1. "Run trend-scout" → pick one of the three topics.
2. "Make the episode for <topic>" → the agents run steps 2–4 and stop at Gate 2.
3. Approve the script → steps 5–10 run; generate images in Higgsfield when the art director hands you `prompts.md`.
