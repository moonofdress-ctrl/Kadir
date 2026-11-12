# Kadir

A cartoon finance channel made by the agents in `.claude/agents/`. The pipeline and the gates are in `channel-system/README.md`; the engine is in `studio/`.

## Token rules (for the main session and every agent)

1. **Read sections, not files.** When a task names sections of `FORMAT_BOOK.md`, `cast.md`, `STYLE_GUIDE.md` or `studio/README.md`, find the headings with Grep (`^## `) and Read only those line ranges. Read a whole file only when the task says "all".
2. **Do not open** `channel-system/research/` (how the rules were measured; the rules themselves are in the format book), `amazon-hidden-tax/` (an older episode), any `vendor/` file, `studio/index.html` (generated) or `package-lock.json`, unless the task is about that file.
3. **Pass paths, not contents.** When starting an agent, give it the episode folder and the step. Do not paste the script, the research or a storyboard into the prompt; the agent reads what it needs.
4. **Short reports.** An agent ends with at most 8 lines: files written, the lint's summary line, what is still open. The work is in the files; do not repeat it in the reply, and the main session does not re-read a file just to confirm it exists.
5. **One chapter at a time.** For a long episode, read and write `storyboard/ch<N>.json`, not the joined storyboard. Use Grep on a shot id or line id to find one shot.
6. **Tools before reading.** Use the lint, `screen-text.mjs` and the frame sheet to find a problem, then open only the lines it names. Look at one frame sheet per check; ask for `--t <times>` instead of a second full sheet.
7. **Edit, do not rewrite.** Fix a line with Edit; do not write a whole script or storyboard again to change part of it.
8. **A new session per gate.** After Gate 1, Gate 2 and Gate 3, start a new session: everything the next step needs is in the episode folder, and a long conversation is paid for again on every turn.
9. **QA before render.** The full MP4 render takes about an hour. Build, look at frames, run the QA reviewer and make its fixes first; render once, on `Verdict: pass` in `qa.md`. Never start a full render to "see how it looks": use the frame sheet, or render a few seconds with `--start`/`--end`.
10. **Pictures cost tokens too.** Do not Read painted pictures one by one: make one contact sheet (`stills.mjs frames`) and look once. Generate in batches and keep every prompt in the episode's `prompts.md`, so a redo does not need the conversation.

## Where the work is (read at the start of every session)

11. **One branch per episode.** A new session starts on a new, empty branch, and the episode is not on it. Before anything else run `git fetch origin` and `git branch -r --sort=-committerdate`, find the newest branch that has `channel-system/episodes/<slug>/`, and merge it into the session's branch together with `origin/main`. Do not start an episode's work on a branch that lacks its folder, and do not leave rule or engine changes on `main` that the episode branch has not merged. At the end of a session, commit and push; say in the last message which branch holds the work.
12. **Lessons go into the rules.** When QA, the fact-checker or the user finds a fault, fix the episode and then write the rule that would have prevented it into the file the responsible agent reads (its definition in `.claude/agents/`, or the format book), in one or two lines. The list of what each episode taught is in `channel-system/LESSONS.md`; add to it, and do not repeat a lesson that is already a rule.
13. **Do not hand decisions back that the files already answer.** The voice decision, the editorial limits and the gates are recorded in `channel-system/README.md` and the episode's `brief.md`. Ask the user only for what is recorded as open there, once, with a recommendation.
