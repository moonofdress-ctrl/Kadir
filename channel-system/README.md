# Channel system

A newsroom of agents that turns a market event into a 12–15 minute cartoon explainer, with three human approval gates. The pictures are **drawn in code** by the engine in `../studio/`, so there is no image generation step in the video.

## Pipeline

```
1  trend-scout    → topics/<date>.md: 3 scored topics            ─┐
                                                                  ├─ GATE 1: you pick a topic
2  researcher     → episodes/<slug>/research.md (sourced)        ─┘
3  scriptwriter   → script.md (FORMAT_BOOK, with the loop ledger)
4  fact-checker   → factcheck.md, fixes in the script            ─── GATE 2: you approve the script
5  art-director   → storyboard.json (or one file per chapter in storyboard/), thumbnails.md, build-requests.md
5b fact-checker   → second pass on screen-text.md: every word and number on screen
6  scene-builder  → new sets, props and guest figures in studio/engine/
7  voice-producer → audio/<id>.wav (narrator + character lines), dead air cut
8  editor         → sound mix, build, lint, frame check (no render yet)
9  qa-reviewer    → qa.md from the frames, sends fixes back; repeat 5–9 until it passes
9b editor         → render to MP4 once, after QA passes → render/
10 illustrator    → thumbnail art that matches the first frame
11 packager       → package.md: three title+thumbnail pairs,     ─── GATE 3: you approve and upload
                    captions, the Shorts plan
12 analyst        → learnings.md, a few days after the upload
```

Agent definitions live in `.claude/agents/` at the repository root, so every Claude Code session in this repo can run them by name.

Steps 5–9 are held to measured targets by one tool. A FAIL sends the episode back:

```bash
node studio/tools/retention-lint.mjs channel-system/episodes/<slug>
```

## Folders

| Path | What |
|---|---|
| `FORMAT_BOOK.md` | The rules for script, picture, sound, policy, packaging and Shorts. The single most important file. |
| `STORY_ROUTES.md` | Twelve ways to organise a money story so each beat makes the next one necessary. |
| `characters/STYLE_GUIDE.md` | The house look, limits for real people and logos, the thumbnail formula. |
| `characters/cast.md` | Recurring characters: who they are and how to use them. |
| `episodes/_template/` | Empty episode folder to copy. |
| `episodes/demo/` | A 19-second demo with scratch voices, staged by the picture rules. |
| `research/` | How the rules were measured: the reference video's analysis and retention review. |
| `learnings.md` | Written by the analyst after each upload (created with the first one). |
| `../studio/` | The engine, the build and lint tools and a gallery of every component. |

## Tools and who does what today

| Step | Tool | Status |
|---|---|---|
| Research, script, fact-check | Claude (web search, primary documents) | Ready |
| Pictures | `studio/` engine, drawn in code | Ready; each new story adds sets and props |
| Frame check | `node studio/tools/stills.mjs frames <episode>` saves a contact sheet; `preview.mjs` for a browser | Ready (the contact sheet needs Playwright) |
| Voice | Decided by the user on 2026-11-12: a synthetic voice, disclosed in the video and the description, with YouTube's altered-content label set. Re-check the policy text before the first upload. Which voice product makes the final track is still open; `studio/tools/voice.mjs` makes a Kokoro scratch track. | Scratch ready, final voice product pending |
| Music and effects | `studio/tools/mix.mjs`: effects and a house music bed made in code, so nothing to license. Drop licensed tracks in `audio/music/` to use those instead (the YouTube Audio Library is the safe source). | Ready; the choice of music is yours |
| Render to MP4 | HyperFrames (Apache 2.0) + FFmpeg | Tested in a cloud session; a local machine needs FFmpeg on its PATH |
| Thumbnail | `studio/tools/stills.mjs thumb`: the first shot with the text band. Richer art from Higgsfield is optional. | Ready; painted art is a manual step |
| Upload | The user, in YouTube Studio | Manual step |

## Keeping a full episode affordable
A 13-minute episode is about 250 lines and 200 shots: too much for one agent in one go.

- **Storyboard by chapter.** Run one art director per chapter, each writing `storyboard/ch<N>.json` with only that chapter's lines. They can run at the same time; the build joins the files.
- **Every agent has a fixed model**, so none of them inherits a more expensive one from the session. The steps that decide the episode's quality (scriptwriter, fact-checker, art director, QA reviewer) use `opus`. The steps that collect, build or follow a checklist (trend scout, researcher, scene builder, voice producer, editor, illustrator, packager, analyst) use `sonnet`; their work is checked afterwards by the fact-checker, the lint or the frame sheet. Change the `model:` line in an agent's definition to move it.
- **Tools before agents.** Voice (`voice.mjs`), sound (`mix.mjs`), frames (`stills.mjs`) and the checks are plain commands; an agent is needed only to judge the result.
- **Agents read sections, not files.** The token rules are in `CLAUDE.md` at the repository root: each agent reads only the parts of the format book, cast and style guide its step needs, reports in a few lines, and code search skips `vendor/`, the old `amazon-hidden-tax/` engines and `research/` (see `.ignore`).
- **A new session per gate.** The episode folder carries everything forward, so a new session after each gate starts with an empty conversation instead of paying for the old one on every turn.
- Render once, after QA passes. A 13-minute episode took 1 h 4 min on the user's laptop (2 workers); a fix found after the render costs the whole hour again. To look at a fix, render only that part (`--start <s> --end <s>`). Run the full render in the background.

## Running an episode

In a Claude Code session in this repo:
1. "Run trend-scout" → pick one of the three topics.
2. "Make the episode for <topic>" → the agents run steps 2–4 and stop at Gate 2.
3. Approve the script → steps 5–11 run. You generate the thumbnail image when the illustrator hands you `prompts.md`.
4. A few days after the upload, share the YouTube Studio numbers → the analyst updates `learnings.md`.
