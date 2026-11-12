# Lessons

What went wrong while making each episode, and the rule that now prevents it. The rule itself is in the file named in the last column; this list is only the record. Add a row when a fault is found; do not add a rule twice.

## nvidia-ceo-probe (November 2026)

| What went wrong | What it cost | Rule now | Where |
|---|---|---|---|
| The episode was spread over four branches, none of which had `main`'s newer rules; a new session started on a branch without the episode folder. | A session that could not find the work. | One branch per episode; fetch, find and merge at the start of every session. | `CLAUDE.md` 10 |
| The story kept moving (after-hours fall on Wed 11 Nov, board meeting and interim-CEO reports on Thu 12 Nov) after the script was approved and voiced. | Two script updates, re-recorded lines, retimed shots, Gate 2 partly repeated. | Everything that can change sits in the last chapter with its date in the sentence; a currency check on the render day and the upload day. | `FORMAT_BOOK.md` 1, `fact-checker.md`, `scriptwriter.md` 8b |
| 22 corrections at the fact-check: an analyst given his former firm, quotes given to the wrong outlet, a day count worked out by hand, claims stronger than their source, absolutes with no date. | A second fact-check pass and a rewritten CH3 and CH5. | The list of these faults, by name. | `scriptwriter.md` 8 |
| Unlabelled humans on screen while a real person or a firm was named (Jobs/Cook, the plaintiff, a Trefis employee); a cast member who looks like the CEO at the leader's podium. | Three of seven QA blockers. | No unlabelled human while a real person is named; a labelled living thing plays the firm. | `art-director.md` |
| Text covered or cut: a poster cut by the frame edge, flags behind a walking figure, a name strip over its own figure, a bars shot of 2 seconds. | Four QA blockers and a second layout pass. | The layout check before hand-over; stop short of named signs; bars and counters at least 3.5 s. | `art-director.md`, `layout-check.mjs` |
| A chapter card that read "And then, on Wednesday". | A re-recorded line. | A chapter card carries the turn, never "And then". | `art-director.md`, `qa-reviewer.md` |
| A script line changed after the voice was recorded and kept its old clip (L151). | Found by hand, late. | Re-make only the changed ids and name them; the editor compares `lines.json` with the script before the render. | `voice-producer.md` 4b, `editor.md` 4 |
| A full render was nearly started before QA, and before the voice and currency questions were settled. | An hour per render. | QA before render; three checks before the full render. | `CLAUDE.md` 9, `editor.md` 4 |
| The session ended by handing three decisions back to the user that were partly answered in the files. | A round trip. | Ask only for what the files record as open, once, with a recommendation. | `CLAUDE.md` 12 |
| The CEO resigned on the day of the render, hours after the currency check; the video says "as of Thursday morning: nobody appointed". | The video went out with an update note in the description and a changed title instead of a new CH9 and a second two-hour render. | For a story that is still moving, render on the upload day, not before; when the story moves after the render, the fact-checker writes a dated update note and checks the title, and the user chooses between the note and a new last chapter. | `FORMAT_BOOK.md` 1 |
| The thumbnail was the engine's wide first frame: tiny figures, weak beside other channels' close-up faces. The user saw it only at upload. | A new thumbnail made during the upload. | The thumbnail is a close-up with one large face, painted when needed, and is judged beside competing thumbnails before Gate 3. | `FORMAT_BOOK.md` 15 |
| The packaged description was 5,928 characters; YouTube's limit is 5,000. | Trimmed during the upload. | The packager counts the description and keeps it under 4,500 characters; extra sources go in the pinned comment. | `packager.md` |
