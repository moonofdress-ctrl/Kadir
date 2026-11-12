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
| The band NVIDIA -$430B was almost the band of a competitor's video on the same story (NVIDIA -$400B); the title did not use what people searched on the day, nor the angle nobody else had. | Title and thumbnails redone a third time at upload. | Look at the shelf first: list competing titles and bands, never repeat a band, take the missing angle; one title that fits all three pictures. | `FORMAT_BOOK.md` 15 |

## Direction set by the user on 12 Nov 2026 (for the next episode, not yet done)

Beside the channel the format book was measured on (Paper Billions: three videos, over a million views each), our episode is weaker in picture and in story, not only in the thumbnail. The user's decision: from the next episode the system follows that channel's logic more closely. To do in a new session, before the next topic:
- Compare one of their videos with ours shot by shot (the measurements are in `channel-system/research/`): how much of each frame is a painted character and face, how the real people of the story are shown, how the first 30 seconds are staged, how a chapter is told as a scene with characters instead of a narrator over props.
- Decide what changes: richer painted or generated art for key shots and the thumbnail (the engine's flat frames for the rest), the story told through its real people as caricatures within the style guide's limits, a stronger hook.
- Write the result into `FORMAT_BOOK.md`, `STYLE_GUIDE.md` and the agents. Take their method, never their figures, lettering, analogies or jokes (FORMAT_BOOK 14).

### Retrospective after the first upload (12 Nov 2026): proposals, not yet decided by the user

What the comparison with `research/paper_billions_video_analysis.md` section 3 shows: we copied the structure (cards, counters, calendars, motifs, shot length; the lint measures these and passed 38 of 41) and missed what the eye and ear judge first. Their frames are detailed, textured, lit pictures with a slow camera move; ours are flat code-drawn figures. The lint measures structure, not appeal, so a passing lint said nothing about this.

1. **Picture: a hybrid.** Painted or generated key art for backgrounds and main figures (about 40-60 pictures an episode, reused with camera moves), with the engine keeping what it does well: counters, cards, labels, name strips, timing, subtitles. A new place then costs one picture instead of new engine code. Needs a fixed style reference and cast reference so figures stay the same, a paid image budget, and a check of YouTube's current rules on generated content.
2. **Voice: decide the final voice product before the next script.** The first upload went out on the scratch voice.
3. **A reference gate.** Before Gate 2 (first 30 seconds of the storyboard) and Gate 3, put six of our frames beside six of theirs, and our thumbnail beside theirs at 160x90. A person judges; no lint replaces this.
4. **Speed over gates for news.** The story moved three times during a two-day build. Either choose stories that hold for a week, or cut the path for news: one branch, one session per gate, render on the upload day, package (title, description under 4,500 characters, thumbnails) checked before the render, not after.
5. **Story before lesson.** The same Nvidia story, told two days earlier by the reference channel as a story about people, passed a million views; ours is the finance lesson with the people kept at a distance. Decide per episode what the editorial limits cost and whether the angle still carries a title people click.
6. **Read the numbers first.** Click-through rate, average view duration and the retention at 0:30 of this upload say whether the package or the video is the weaker part; the analyst writes `learnings.md` from them before the system is changed.
