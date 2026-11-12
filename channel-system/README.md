# Channel system

A newsroom of agents that turns a market event into a 12–15 minute cartoon explainer, with three human approval gates. The engine in `../studio/` draws the whole video in code: the cast, the places, the light, the numbers and the subtitles, timed to the voice. Only the thumbnails are painted (and a background, when a place is too costly to draw). This was settled on 13 Nov 2026, after the rival's video on our first story was measured: it is made the same way, and it won on staging, not on paint (`LESSONS.md`; the targets are in `FORMAT_BOOK.md` 3, 4 and 11).

## Pipeline

```
1  trend-scout    → topics/<date>.md: 3 scored topics, each with   ─┐
                    what the big channels already published        │
                                                                  ├─ GATE 1: you pick a topic
2  researcher     → episodes/<slug>/research.md (sourced)        ─┘
3  scriptwriter   → script.md (FORMAT_BOOK, with the loop ledger)
4  fact-checker   → factcheck.md, fixes in the script
4b voice-producer → the hook in each candidate voice (once per    ─── GATE 2: you approve the script
                    voice product), then audio/<id>.wav                and the voice
5  art-director   → the first 30 seconds of the storyboard,      ─── LOOK GATE: twelve frames of the first 30
                    thumbnails.md, build-requests.md (new places)      seconds beside the rival's, before the rest
5a scene-builder  → the new sets, props and living things the episode needs (15-25 places)
5c art-director   → the rest: storyboard/ch<N>.json, one chapter at a time
5b fact-checker   → second pass on screen-text.md: every word and number on screen
7  voice-producer → audio/<id>.wav in the chosen voice (narrator + character lines), dead air cut
8  editor         → sound mix, build, lint, frame check (no render yet)
9  qa-reviewer    → qa.md from the frames, sends fixes back; repeat 5–9 until it passes
9a fact-checker   → currency check on the render day, for a story that is still moving (FORMAT_BOOK 1)
9b editor         → render to MP4 once, after QA passes → render/
10 illustrator    → three painted thumbnails (one or two figures, one glowing object), judged beside the competing ones
11 packager       → package.md and youtube-upload.txt: three       ─── GATE 3: you approve and upload
                    title+thumbnail pairs,
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
| `LESSONS.md` | What went wrong while making each episode and which rule now prevents it. |
| `../studio/` | The engine, the build and lint tools and a gallery of every component. |

## Tools and who does what today

| Step | Tool | Status |
|---|---|---|
| Research, script, fact-check | Claude (web search, primary documents) | Ready |
| Pictures | The `studio/` engine: cast, sets, light, shot sizes, numbers and timing in code. New places are built per episode by the scene builder. | Ready; the lint holds the staging targets (P, D, K, W, S, H checks) |
| Frame check | `node studio/tools/stills.mjs frames <episode>` saves a contact sheet; `preview.mjs` for a browser | Ready (the contact sheet needs Playwright) |
| Voice | Decided by the user on 2026-11-12: a synthetic voice, disclosed in the video and the description, with YouTube's altered-content label set. Re-check the policy text before the first upload. Which voice product makes the final track is still open; `studio/tools/voice.mjs` makes a Kokoro scratch track. | Scratch ready, final voice product pending |
| Music and effects | `studio/tools/mix.mjs`: effects and a house music bed made in code, so nothing to license. Drop licensed tracks in `audio/music/` to use those instead (the YouTube Audio Library is the safe source). | Ready; the choice of music is yours |
| Render to MP4 | HyperFrames (Apache 2.0) + FFmpeg | Tested in a cloud session; a local machine needs FFmpeg on its PATH |
| Thumbnail | Three painted pictures, generated with the image tool the session has or by the user from `prompts.md` (Gemini's Nano Banana Pro, Higgsfield), banded with `studio/tools/stills.mjs thumb --image` | Ready; three pictures an episode |
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
3. Approve the script and the voice → the first 30 seconds are storyboarded and built, and you compare them with the rival's (Look gate). Then steps 5–11 run. When the session has no image tool, the illustrator hands you `prompts.md` and you generate the three thumbnails.

**When you say "do it all".** The user may waive Gate 1, Gate 2 and the Look gate for an episode ("pick the topic and finish it"). The session records that in `brief.md` with the date, takes the trend scout's first topic, and replaces each waived approval with a check it can run itself: the fact-checker and the lint for the script, the QA reviewer's written comparison for the Look gate. Gate 3 is never waived: the upload is the user's, and the open choices (the final voice, the thumbnail pictures) are put to the user there, once, with a recommendation.
4. A few days after the upload, share the YouTube Studio numbers → the analyst updates `learnings.md`.
