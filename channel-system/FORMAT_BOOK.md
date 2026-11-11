# Format book

The rules every episode follows, written to make people click, stay and come back. They come from a frame-by-frame study of a video that reached 794,000 views in three days on a channel with 4,000 subscribers (`research/paper_billions_video_analysis.md`, `research/paper_billions_retention_review.md`). We copy the mechanics, never the look, the characters or a sentence.

Who uses this file: the scriptwriter (sections 1–10, 12–13), the art director (3, 6, 11, 12), the QA reviewer (all) and the packager (1, 15, 16). `STORY_ROUTES.md` next to it holds twelve ways to organise a money story. Most numeric targets are checked by a tool:

```bash
node studio/tools/retention-lint.mjs channel-system/episodes/<slug>
```

A FAIL blocks the episode from moving to the next step.

## 1. Topic and title
- A market event people are searching for **now**. Publish within 72 hours; faster is better. For a scheduled event (earnings, a vote, a court date), research and build the sets in advance and publish within hours.
- The title is the exact question a viewer types: "Why the Stock Market Just Crashed", "Why Your Power Bill Just Jumped". Plain words, no jargon, under 60 characters.
- The money figure goes in the thumbnail, not in the title. Title asks, thumbnail answers with a number.

## 2. Length and shape
- 12–15 minutes, 1,900–2,400 spoken words including skits, about 157 words a minute.
- 6–9 chapters of 1–3 minutes. Each chapter has a 2–4 word title on a chapter card. The first chapter has no card: the video opens on the picture.

## 3. The opening (first 50 seconds)
No logo, no greeting, no "in this video". The first word is the event.

| Time | Beat |
|---|---|
| 0:00–0:08 | The biggest number plus a contradiction (a record loss on a day when nothing had gone wrong). The number counts up on screen. **The first frame shows the thumbnail's scene.** |
| 0:08–0:20 | Two or three "it wasn't X, it wasn't Y" lines. One new picture per short sentence. |
| by 0:25 | Ask the title question out loud, word for word, on a text card. |
| 0:25–0:35 | First skit (two short lines). |
| by 0:45 | The short answer as a list of three concrete things. |
| 0:45–0:50 | Open the long story with a date and a place: "It starts on a Tuesday in March, in a town of nine hundred people." |

- A new picture about every 3 seconds in this stretch (the reference has 17 setups in 49 seconds).
- Plant here every image the ending will pay off (section 12).

## 4. Rhythm rules

### The promise and the chain
Rhythm keeps a viewer for a minute; a story that makes sense keeps them to the end. Before any chapter is written, the script states three things in a `## PROMISE` block (section 10):

- **QUESTION**: the one question the viewer can answer after watching. It is the title.
- **ANSWER**: the honest short answer, in one sentence. It may be given early: a viewer who knows the outcome stays to learn how it was possible.
- **CHAIN**: four to seven links, each causing the next ("the fee is charged → so the seller raises the price → so the price rises everywhere → so the regulator sues").

Then pick one route from `STORY_ROUTES.md` as the backbone. Three tests, which the QA reviewer repeats:

1. Every chapter change can be said with "because", "so", "but" or "unless". "And here is another fact" is not a transition.
2. The opening promises exactly what the ending delivers: the same question, nearly the same words.
3. Where the evidence stops, the script says so as clearly as it states the claim: an allegation, a model and a forecast are named as such.

- **A skit every 50–70 seconds** (11–16 per video). See section 6.
- **Open every chapter with a turn and close it with a hook.** One short line that changes direction: "Then the regulator called." "That lasted one day." "It doesn't." The last line of a chapter points at the next.
- **Put the viewer in the story at least three times**: their index fund, their 401(k), their power bill, their job, their age.
- **Every big number gets a human scale** in the same breath: "three dollars of every hundred in your index fund", "a month of rent for a family in Ohio".
- **Numbered lists** for complex causes ("Reason one... Reason four").
- **Ask the viewer's question, then answer it** in the next line: "Did anyone pay for it? Not one cent."
- **Tell a single day of drama by the clock** ("Nine thirty. The opening bell.").
- **One analogy per hard idea**, and the analogy gets drawn as a real place (a diner, a pawn shop, a toy railway).

## 5. Sentences
- Short. Average 15 words or fewer. One idea per sentence.
- Spoken English, contractions allowed. No "In today's video", no "Let's dive in", no "Buckle up".
- Turn points with short lines: "That was the easy part." "Keep that number in mind." "Not one."
- Never copy a sentence from another channel. Copy the rhythm, write our own words.

## 6. Skits
- 2–4 lines, 4–10 seconds total, characters from `characters/cast.md` only (plus a guest caricature when the story is about a public figure).
- A skit turns the fact just stated into a joke, a fear or a reaction. It never carries new facts.
- Useful shapes: the rule of three with a break ("No. No. No. ... Yes!"), the confession line-up (each party says one "I just..." line), the absurd winner on the worst day.
- Real people in skits: only clearly comic lines, never a fake quote that sounds real. Their real quotes are shown as evidence cards (section 11), never spoken in an imitation of their voice.

## 7. Sources and legal language
- Every claim has an owner on screen or in narration: a person, a firm, a filing, a news agency.
- Allegations stay allegations: "the FTC alleges", "according to the lawsuit". Include the other side's response.
- No financial advice. Never "buy", "sell" or "you should" about a security.
- Numbers are checked by the fact-checker against a primary or two independent sources before voice is recorded.

## 8. The ending
- Answer the title question honestly, in one short line ("No." "Not this time.").
- One twist "almost nobody noticed".
- The next date to watch (earnings day, a vote, a court date): a reason to come back.
- The last line calls back to the opening, and the last picture is a callback too.
- **Stop on the last line.** No outro, no "like and subscribe", no channel plug anywhere in the video. The only ask is one question in the description and pinned comment.

## 9. Writing for the voice engine
- Money and percentages in words ("four hundred billion dollars", "twenty-five percent"). Years as digits.
- "..." for a beat, "—" for a turn. No stage directions in narration lines.
- Narration lines start with `N:`, skit lines with the character's name in capitals.

## 10. Script file format
```
# TITLE: Why Your Power Bill Just Jumped
## PROMISE
ROUTE: 3 The hidden cost
QUESTION: Why did your power bill just jump?
ANSWER: Because new data centers are buying power faster than anyone can build it, and the grid spreads that cost over every bill.
CHAIN: data centers sign for power -> the grid must add capacity -> the cost is shared by all customers -> the bill rises before the plants exist -> voters start saying no
## DEVICES
MOTIF: the tower | each cause adds a block; it leans further every time it returns
PLANT: the kettle that takes four minutes to boil (0:15) -> PAYOFF: CH6 and the last minute
PLANT: Martha's power bill (CH3) -> PAYOFF: CH4 ballot box, final shot
VIEWER: BENNY at his desk (CH2), on his phone (CH6), final minute
## CH1 The twenty-seven dollar morning
[SCENE s01 | set: kitchen at night, the tower outside the window | text: counter +$27]
N: Last month, a power bill in Ohio went up by twenty-seven dollars... and nobody in the house had changed a thing.
[CARD]
N: So why did your power bill just jump?
[SKIT k01 | set: kitchen]
MARTHA: Who left the lights on?
BENNY: Nobody. That's the problem.
## CH2 The top
...
```
- `## PROMISE` is the story in four lines (section 4). `## DEVICES` is the loop ledger (section 12). The art director and the QA reviewer read both. Only the chapters (`## CH...`) hold spoken lines.
- `[SCENE]` and `[SKIT]` describe the picture in plain words; the art director turns them into `storyboard.json`.
- `[CARD]` marks the next narration line (or its first sentence) as a word-by-word text card.
- Everything after `N:` or `NAME:` is spoken.

## 11. Picture rules (the storyboard)
Measured on the reference video; the lint checks them.

| Rule | Target | Reference |
|---|---|---|
| Average shot length | 5.5 s or less | 4.7 s |
| Longest stretch with nothing new on screen | 6 s | under 10% of frames are static |
| New picture in the first 50 s | every 3.5 s or faster | 2.9 s |
| Text cards | one every 25 s or faster, 8–16% of runtime, none over 5.5 s | every 19 s, 13% |
| Camera | every shot moves; no move twice in a row | |
| Colour grade | follows the mood, 3 or more grades per episode | green euphoria, red panic, sepia history, night aftermath |

- **Text cards** carry the turn lines and the big numbers. The words appear with the voice, one at a time.
- **Every number is drawn**: counters that roll, bars that grow, lines that draw themselves. Every date is a calendar page. A by-the-clock chapter keeps a clock in the corner of every shot.
- **Every quote is evidence**: a document card, a post card or a lower third with the name and role, with the key words highlighted. Lesser-known people get a name strip, not a caricature.
- **Lists build on screen**: one short sentence, one new panel of a split screen.
- **Every analogy is a place**, drawn literally.
- Background ticker boards use made-up names. Real figures appear only as overlays, with a source.

### Every shot is a small joke
What holds a viewer is the middle of the video, not its first frame. A shot of somebody standing in a room while the narrator talks is a wasted shot. Every scene and every split panel answers four questions (lint G1–G5):

1. **Where are we?** A specific place that fits the sentence, never a plain wall.
2. **Who is doing what?** Somebody acts the sentence out: hands the money over, grabs it, hides, celebrates, shrugs.
3. **What is written in the scene?** One sign, banner, price tag, badge or label carries the fact: a name, a price, an age, a date. Facts live in the scene first and in overlays second.
4. **Who is the abstract player?** A company, a market, a regulator or a bill becomes a **living thing**: a plain object with a face and gloves and its name written on it (a parcel for a marketplace, a chip for a chipmaker, a domed building for a parliament, a banknote for "your hundred dollars"). Never a logo.

- **Faces fill the frame in skits**: `"frame": "medium"` or `"close"`. Wide shots are for places and crowds.
- **One light per mood**: night, a server room, a deal behind closed doors or a phone at 2 a.m. get a `"light"`: one source, darkness around it.
- **Scale is a joke**: a giant building over a tiny person, a pile of cash taller than the buyer.
- **The loud faces** (`panic`, `furious`, `crying`, `greedy`) are for hooks, climaxes and the thumbnail. Everyday reactions use the quiet ones.
- **The hidden piggy bank**: a small `piggy` tucked into a corner of a scene about every three minutes, never mentioned by the narrator. Its state follows the story: cracked on bad news, asleep at night, sunglasses on a good day. The pinned comment may ask who found it.
- Write our own gags. Never reuse another channel's analogy, object or running joke.

## 12. The loop ledger (plant and pay off)
Fill in `## DEVICES` before writing the chapters.

- **One anchor motif per episode**: a single object that stands for the whole story (ours for a given episode might be a leaning tower of blocks, a dam, a tightrope). It appears in the first minute, returns at every numbered step and at the end, and is more damaged or more loaded each time. Six or more appearances in a 13-minute episode. Never reuse another channel's motif.
- **Two or more visual plants in the first 30 seconds** that return at the climax and in the last minute.
- **Loops of different lengths**: one paid off within a minute ("Keep that number in mind"), one mid-episode, one that waits for the last line.
- **The viewer stand-in** (Benny or Martha) appears four or more times and owns the final shot.
- Tag the shots in `storyboard.json` with `"motif": "<name>"` and `"callback": "<what returns>"` so the lint can count them.

## 13. Sound
Measured on the reference: the voice never stops, and everything else stays out of its way.

- **No dead air.** Cut every pause between sentences to under a quarter of a second. In 15 minutes the reference has only ten gaps longer than that.
- **Breathe only at chapter cards**: about one second of near-silence under each card, and before a punchline.
- **Music is a quiet bed**, about 18–20 dB under the voice, a little louder in the climax chapters and rising under the last 15 seconds.
- **Sound effects are rare and soft.** Use them on stamps, slams and card hits, not on every cut.
- Loudness of the final mix: −14 LUFS, peaks under −1 dBTP.

Before a voice is recorded, the voice producer writes one delivery note per line (`audio/direction.md`): what the line is for (hook, turn, number, mechanism, reveal, joke) and how to say it. A number gets room to land; a turn line gets a breath before it; a limit or an allegation is said as plainly as the claim.

The tools do this, and the lint checks the result (A1–A7):
```bash
node studio/tools/mix.mjs channel-system/episodes/<slug> --tighten
```
`--tighten` cuts silence at the ends of every clip and shortens pauses inside them; the mix levels the speakers, lays the bed 19 dB under the voice, dips it at chapter cards, lifts it in the climax and under the last lines, and places effects on stamps, slams and cards. Music: put files you have a licence for in `audio/music/` and credit each one in `audio/CREDITS.md`; with none, the house bed made in code is used.

## 14. Originality and YouTube policy
Since 16 July 2026 YouTube does not monetize three kinds of "inauthentic content": repetitive template videos, content built to manipulate emotions, and AI personas discussing sensitive topics such as finance. Every episode must clear all three.

- **Original reporting in every episode**: our own research file with primary sources, our own angle, our own analogy and motif. The fact-check file and source list ship with the video.
- **No two episodes look the same**: new sets, a new motif and new skits per story. The engine is a toolbox, not a template.
- **No fear bait**: titles and thumbnails state what happened. No "it's over", no countdowns to collapse.
- **No imitation of real people**: no cloned voices, no invented quotes, no realistic likeness. Caricatures are clearly cartoons and only say obviously comic lines.
- **A human decides**: three approval gates per episode (topic, script, final cut).
- Voice: decide with the user between a human narrator and a disclosed synthetic voice before the first upload, and re-check the policy text at that point.

## 15. Packaging
The title and the thumbnail are one promise made in two parts. The picture shows a moment; the title supplies the question. Neither repeats the other.

- **Three pairs, three reasons to click.** Every episode ships three title-and-thumbnail pairs for YouTube's own A/B test (up to three options; the winner is the one with the most watch time, not the most clicks). Each pair tests a different reason: usually the **consequence** (what happened to somebody), the **contrast** (two things that should not be true together) and the **open question**. Three colours of one idea are not three options.
- **Pair A is the first frame**: the scene in thumbnail A is the scene at 0:00. Pairs B and C may show another moment, but only one the video reaches in its first 30 seconds, so every click is confirmed at once.
- **The picture**: a moment frozen while something is happening (a hand taking the money, a face reacting), one character with one loud emotion, one object, one situation behind. Exaggerate what is really in the video; never show what is not in it.
- **The band**: zero to five words that add to the title, never the title again: the number, the verdict or the missing word. Subject in white, figure in red. Keep it out of the lower right corner, where YouTube puts the duration.
- **Readable at 160×90.** If the face or the number is lost at that size, simplify.
- **No fear bait and no invented numbers** (section 14). A hypothetical or an allegation stays visibly that in the title.
- **Description**: two paragraphs of plain facts with the key numbers, one question for the comments, chapter timestamps from `timing.json`, then "Figures as of <date>, from reporting by <outlets>." and the not-financial-advice line.
- **Pinned comment**: the same question.
- Nobody knows the winner before viewers choose. The analyst records which pair won and why we think so.

```bash
node studio/tools/stills.mjs thumb channel-system/episodes/<slug> --white "AMAZON KEEPS" --red "\$52" --t 0.5 --out channel-system/episodes/<slug>/thumbnail_a.png
```

## 16. Shorts
A Short is its own small video, not the loudest twenty seconds of the long one.

- **One question, one cause, one answer**, 20–45 seconds. A viewer who never sees the long video still gets a complete thought.
- **Three per episode, three different lessons**: one surprising consequence, one common belief corrected, one comparison or limit. Each may point to the long video only after it has delivered its own answer.
- **Starts on the event**, like the long video: no greeting, no "in this video". If the chosen moment leans on something said earlier, write a new first line for it.
- The packager picks the three moments from the finished episode and lists them in `package.md` with their line ids, a new opening line where needed and the on-screen question.
- Status: the engine draws 16:9 only. The vertical (9:16) cut is built after the first long episode is published; until then the list in `package.md` is the plan.
