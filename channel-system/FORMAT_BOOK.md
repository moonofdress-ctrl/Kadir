# Format book

The rules every episode follows, written to make people click, stay and come back. They come from a frame-by-frame study of a video that reached 794,000 views in three days on a channel with 4,000 subscribers (`research/paper_billions_video_analysis.md`, `research/paper_billions_retention_review.md`). We copy the mechanics, never the look, the characters or a sentence.

**Second measurement, 13 Nov 2026.** The same channel told our first episode's story two days before us and reached 1.5 million views; ours reached 4. Both videos were measured cut by cut (`research/paper_billions_spy_video_comparison.md`, section 9). The rival is made the same way as ours (code-drawn figures; only its thumbnails are painted), so the gap was in these rules. Where a number below says "the rival", it comes from that measurement, and it replaces the older, softer target.

Who uses this file: the scriptwriter (sections 1–10, 12–13), the art director (3, 6, 11, 12), the QA reviewer (all) and the packager (1, 15, 16). `STORY_ROUTES.md` next to it holds twelve ways to organise a money story. Most numeric targets are checked by a tool:

```bash
node studio/tools/retention-lint.mjs channel-system/episodes/<slug>
```

A FAIL blocks the episode from moving to the next step.

## 1. Topic and title
- A market event people are searching for **now**. Publish within 72 hours; faster is better. The rival published our first story two days before us, so a news topic is taken only when the whole build fits in 48 hours (one session per gate, no waiting between them); otherwise choose a story that holds for a week. For a scheduled event (earnings, a vote, a court date), research and build the sets in advance and publish within hours.
- The title is the exact question a viewer types: "Why the Stock Market Just Crashed", "Why Your Power Bill Just Jumped". Plain words, no jargon, under 60 characters.
- **A story that is still moving** (an investigation, a vote count, a price still falling) goes out of date between the script and the upload. Keep everything that can change in the last chapter, in as few lines as possible, each with its date in the sentence ("as of Thursday, the twelfth"); the other chapters say only what stays true. Never "so far", "yet", "nobody has" or "today" without a date. `brief.md` records "State of the story as of <date>", and the fact-checker repeats the currency check on the day of the render and again on the day of the upload. If the story moved, only the last chapter's lines, clips and shots change. Render on the upload day, after that day's check. If the story moves after the render, the fact-checker writes a dated update note for the top of the description and the pinned comment and checks that the title does not promise what the video lacks; the user chooses between that note and a new last chapter.
- **Story before lesson.** The viewer clicks on people in trouble, not on a finance lesson. Pick the event for the **human story inside it**: one or two named people, something one of them does not know, a moment of danger. The rival's two biggest videos are about a person or a moment of danger; its smallest (a tenth of the views) is about a figure. "How this touches your money" goes to the end. The topic file lists what the largest channels in the niche have already published on the story (title, date, views, angle). If one of them told the same story in the last three days, we take a different angle or a different story. `brief.md` says what the editorial limits leave out and why the angle still carries a title people click.
- The money figure goes in the thumbnail, not in the title. Title asks, thumbnail answers with a number.

## 2. Length and shape
- 12–15 minutes, 1,900–2,400 spoken words including skits, about 157 words a minute.
- 6–9 chapters of 1–3 minutes. Each chapter has a 2–4 word title on a chapter card. The first chapter has no card: the video opens on the picture, and the second chapter's card comes after 0:45.

## 3. The opening (first 50 seconds)
No logo, no greeting, no "in this video". The opening is a **scene**, not a summary: one place, two named people, and one thing the viewer knows that the person in the scene does not. Our first episode showed a tent and a counter, never showed its hero, and began a bar-chart lesson at 0:41; the rival was still building its mystery at 0:41.

| Time | Beat |
|---|---|
| 0:00–0:12 | One place, in the dark, with one light. The story's person in close-up with a name strip, then the second person. The first sentence is what they are doing and what is wrong with it. **The first frame shows the thumbnail's scene.** |
| 0:12–0:25 | What the viewer knows and the person does not: who is watching, what is already lost. One new picture per short sentence. The first character line is spoken here. |
| by 0:30 | The one big number, once, as a counter or a slam. No other figure on screen in the opening. |
| by 0:45 | Ask the title question out loud, word for word, on a text card. |
| 0:45–0:50 | Open the long story with a date and a place: "It starts on a Tuesday in March, in a town of nine hundred people." |

- **12 or more shots in the first 30 seconds, 20 or more in the first 60** (the rival: 12 and 20; we had 9 and 15).
- **No chapter card, no chart and no lesson before 0:45.** The answer is not listed here; the opening only makes the viewer need it.
- Figures are not lined up facing the camera at one size: wide for the place, close for the face, something seen through a window, from above or from under the table.
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

- **A character speaks every 30 seconds**, and never more than 45 seconds pass without one (the rival: every 28 seconds). **Two skits or more in every chapter. Dialogue is a quarter of the spoken words or more** (the rival: about a third; our first episode: 9%). See section 6.
- **One line that returns.** A short sentence a character says early comes back two or three times, changed by what has happened, and once more near the end.
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
- 2–6 lines, 4–15 seconds total, characters from `characters/cast.md` only (plus a guest caricature when the story is about a public figure).
- A skit turns the fact just stated into a joke, a fear or a reaction. It never carries new facts.
- **The chapter is a scene, the narrator is the bridge.** Where the story has two sides (a seller and a buyer, a boss and a board, a spy and a host), the cast plays them out in a place, and the narrator only says what the scene cannot show. A chapter that is narration over props with one joke at the end is the first episode's fault.
- Useful shapes: the rule of three with a break ("No. No. No. ... Yes!"), the confession line-up (each party says one "I just..." line), the absurd winner on the worst day.
- Real people in skits: only clearly comic lines, never a fake quote that sounds real. Their real quotes are shown as evidence cards (section 11), never spoken in an imitation of their voice.

## 7. Sources and legal language
- Every claim has an owner on screen or in narration: a person, a firm, a filing, a news agency.
- Allegations stay allegations: "the FTC alleges", "according to the lawsuit". Include the other side's response.
- No financial advice. Never "buy", "sell" or "you should" about a security.
- Numbers are checked by the fact-checker against a primary or two independent sources before voice is recorded. The fact-checker comes back once more after the storyboard: `node studio/tools/screen-text.mjs <episode>` lists every word and number on screen, and each one that states a fact is checked the same way.

## 8. The ending
- Answer the title question honestly, in one short line ("No." "Not this time.").
- One twist "almost nobody noticed".
- The next date to watch (earnings day, a vote, a court date): a reason to come back.
- The last line calls back to the opening, and the last picture is the opening's place again, changed by what happened.
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
Measured on the reference channel; the lint checks them (its check ids are in brackets).

| Rule | Target | The rival | Our first episode |
|---|---|---|---|
| Average shot length [P1] | 3.5 s or less | 3.4 s (median 2.5 s) | 4.7 s |
| Shots in the first 30 s [P4] | 12 or more | 12 | 9 |
| Shots longer than 10 s [P5] | one a chapter at most | 4 in 17 minutes | 12 in 13 minutes |
| Longest stretch with nothing new on screen [P2] | 6 s | | |
| Dark, lit pictures [D1] | half of the picture time or more | 60% of frames | 25% |
| Places [K1, K2] | 6 or more in every chapter; a place returns at most 3 times in a chapter | about 70 | 11 (the lawn 41 times) |
| Pictures with something to read [W1] | a third or fewer | very few | 162 of 203 shots |
| Things to read in one shot [W2] | one | | 323 items in 203 shots |
| Text cards [C1–C3] | one every 25 s or faster, 8–16% of runtime, none over 5.5 s | 53 cards, 13% | |
| Camera [P3] | every shot moves; no move twice in a row | | |
| Colour grade [M4] | follows the mood, 3 or more grades per episode | | |

- **Dark is the default.** A room at night, a deal, a phone call, a server hall, a courtroom corridor: one `"light"` (a lamp, a screen, a doorway) and darkness around it. Daylight is for relief and for the viewer's own world (a kitchen, a bus stop), not for the story's rooms.
- **Many places, each used briefly.** A chapter moves through six or more places. A place is a set, a set dressed so that it reads as somewhere else (tagged `"place": "<name>"`; the QA reviewer checks on the frame sheet that it really looks different), or a painted background. New sets are built for each episode by the scene builder. Returning to one place more than three times in a chapter is the lawn fault.
- **Little to read.** Subtitles carry the words. In a picture there is at most **one** label or **one** number at a time, and two pictures in three have none. No band, strip or caption that repeats the narrator. A living thing carries its name the first time it appears in a chapter; after that its shape is enough.
- **Shot sizes change.** Wide for a place, close for a face, a detail (a glass, a hand, a phone), a view through a window or from above. Two shots in a row at the same size with the figures facing the camera is a fault.
- **Text cards** carry the turn lines and the big numbers. The words appear with the voice, one at a time.
- **The numbers the story turns on are drawn**, one at a time: a counter that rolls, bars that grow, a line that draws itself. A number that only supports the sentence is spoken and not drawn. A date that matters is a calendar page. A by-the-clock chapter keeps a clock in the corner of every shot.
- **One running number** (13 Nov 2026, from a study of two What If channels with 6 M views each in a month): every episode keeps one number on screen that returns at least once a chapter, changed each time (Poppi: the price tag $1.95B -> $1.65B -> $12M). Viewers stay to see its next value. The thumbnail shows its first value.
- **Subtitles are on** in every video; they rest while a text card is showing its own words.
- **Every quote is evidence**: a document card, a post card or a lower third with the name and role, with the key words highlighted. Lesser-known people get a name strip and a caricature within the style guide's limits.
- **Lists build on screen**: one short sentence, one new panel of a split screen.
- **Every analogy is a place**, drawn literally.
- Background ticker boards use made-up names. Real figures appear only as overlays, with a source.

### Every shot is a small joke
What holds a viewer is the middle of the video, not its first frame. A shot of somebody standing in a room while the narrator talks is a wasted shot. Every scene and every split panel answers four questions (lint G1–G5):

1. **Where are we?** A specific place that fits the sentence, never a plain wall.
2. **Who is doing what?** Somebody acts the sentence out: hands the money over, grabs it, hides, celebrates, shrugs.
3. **Is there one thing to read, or none?** When the sentence turns on a name, a price or a date, one sign, price tag or badge in the scene carries it. Otherwise nothing is written: the action tells it (limits W1 and W2 in the table above).
4. **Who is the abstract player?** A company, a market, a regulator or a bill becomes a **living thing**: a plain object with a face and gloves and its name written on it (a parcel for a marketplace, a chip for a chipmaker, a domed building for a parliament, a banknote for "your hundred dollars"). Never a logo.

- **Something moves between the cuts.** A figure walks, lunges or backs away (`"to"`); a prop travels (`"move"`). A shot where only a face changes is a still picture.
- **Faces fill the frame in skits**: `"frame": "medium"` or `"close"`. Wide shots are for places and crowds.
- **One light per mood**: night, a server room, a deal behind closed doors or a phone at 2 a.m. get a `"light"`: one source, darkness around it.
- **Scale is a joke**: a giant building over a tiny person, a pile of cash taller than the buyer.
- **The loud faces** (`panic`, `furious`, `crying`, `greedy`) are for hooks, climaxes and the thumbnail. Everyday reactions use the quiet ones.
- **The hidden piggy bank**: a small `piggy` tucked into a corner of a scene about every three minutes, never mentioned by the narrator. Its state follows the story: cracked on bad news, asleep at night, sunglasses on a good day. The pinned comment may ask who found it.
- Write our own gags. Never reuse another channel's analogy, object or running joke.

### Painted pictures: thumbnails, and backgrounds when a place needs one
On 12 Nov 2026 we decided to paint every place and figure, because the rival's frames looked richer. The measurement of 13 Nov showed the rival's video is **not** painted: its figures are drawn in code like ours, and only its thumbnails are painted. So:

- **The cast and the living things stay in the engine.** No painted cast sheets, and no painted figures in the video. The depth comes from light, shot size and many places (the table above).
- **Thumbnails are painted** (section 15).
- **A painted background is allowed** for a place that would cost too much to build as a set: a shot with `"set": "picture"` and `"opts": { "src": "art/<id>.jpg", "shows": "the place", "dim": 0.2 }`. It shows the place only, with no figures, words, numbers or logos; the engine's figures act in front of it, and every sign, tag and counter is drawn by the engine, so the screen-text list and the fact-check stay complete. It uses the style lock in STYLE_GUIDE, and a person looks at every one on a contact sheet before the build.
- **The story's real people act.** A public figure of the story appears in the scenes as an engine caricature (a guest figure: two or three traits) doing what they did in public: signing, phoning, walking out. Never an invented line that sounds real in their mouth (STYLE_GUIDE, Real people).
- **The first 30 seconds first (the Look gate).** They are storyboarded, built and put beside the rival's first 30 seconds, frame by frame, before the rest of the storyboard is written. The user gives the verdict when they are in the session; when the user has said to go on without them, the QA reviewer writes the comparison in `qa.md` against the table above and the user sees the sheet at Gate 3. No lint replaces this look.

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
- **Music changes with the chapter.** The house music has three beds (`steady`, `calm`, `uneasy`) that take turns under the chapter cards; `"audio": { "beds": [...] }` sets the order.
- **Effects follow the picture, rarely** (13 Nov 2026): the engine places them on the events themselves (stamp, slam, card, chapter, document; `tools/cues.mjs`), and they land on at most one cut in five (the rival: 16%; lint A8).
- **Music is a quiet bed**, about 18–20 dB under the voice, a little louder in the climax chapters and rising under the last 15 seconds.
- **Sound effects are rare and soft.** Use them on stamps, slams and card hits, not on every cut.
- Loudness of the final mix: −14 LUFS, peaks under −1 dBTP.

Before a voice is recorded, the voice producer writes one delivery note per line (`audio/direction.md`): what the line is for (hook, turn, number, mechanism, reveal, joke) and how to say it. A number gets room to land; a turn line gets a breath before it; a limit or an allegation is said as plainly as the claim.

The tools do this, and the lint checks the result (A1–A7):
```bash
node studio/tools/mix.mjs channel-system/episodes/<slug> --tighten
```
`--tighten` cuts silence at the ends of every clip and shortens pauses inside them; the mix levels the speakers, lays the bed 19 dB under the voice, dips it at chapter cards, lifts it in the climax and under the last lines, and places effects on stamps, slams and cards. Music: put files you have a licence for in `audio/music/` and credit each one in `audio/CREDITS.md`; with none, the house bed made in code is used.
- **The voice is chosen before Gate 2.** The voice producer makes the hook (the first 30 seconds) in each candidate voice; the user chooses by ear; the choice is recorded in `README.md`. No upload on the scratch voice: the first episode went out on it.

## 14. Originality and YouTube policy
Since 16 July 2026 YouTube does not monetize three kinds of "inauthentic content": repetitive template videos, content built to manipulate emotions, and AI personas discussing sensitive topics such as finance. Every episode must clear all three.

- **Original reporting in every episode**: our own research file with primary sources, our own angle, our own analogy and motif. The fact-check file and source list ship with the video.
- **No two episodes look the same**: new sets, a new motif and new skits per story. The engine is a toolbox, not a template.
- **No fear bait**: titles and thumbnails state what happened. No "it's over", no countdowns to collapse.
- **No imitation of real people**: no cloned voices, no invented quotes, no realistic likeness. Caricatures are clearly cartoons and only say obviously comic lines.
- **A human decides**: three approval gates per episode (topic, script, final cut).
- Voice: decide with the user between a human narrator and a disclosed synthetic voice before the first upload, and re-check the policy text at that point.
- **Painted thumbnails and backgrounds** are generated illustrations in our own style: clearly cartoons, made for this story only, each checked by a person. Re-read YouTube's current text on generated and altered content before each upload and set the label it asks for.

## 15. Packaging
The title and the thumbnail are one promise made in two parts. The picture shows a moment; the title supplies the question. Neither repeats the other.

- **Three pairs, three reasons to click.** Every episode ships three title-and-thumbnail pairs for YouTube's own A/B test (up to three options; the winner is the one with the most watch time, not the most clicks). Each pair tests a different reason: usually the **consequence** (what happened to somebody), the **contrast** (two things that should not be true together) and the **open question**. Three colours of one idea are not three options.
- **Pair A is the first frame**: the scene in thumbnail A is the scene at 0:00. Pairs B and C may show another moment, but only one the video reaches in its first 30 seconds, so every click is confirmed at once.
- **The picture**: a moment frozen while something is happening (a hand taking the money, a face reacting). **One figure or two, never more; one object that glows; a dark ground behind.** The rival's three thumbnails all follow this; ours had four faces and told no story. Exaggerate what is really in the video; never show what is not in it.
- **The band**: two to four words and at most one figure, adding to the title, never the title again: the number, the verdict or the missing word. Subject in white, figure in red. Keep it out of the lower right corner, where YouTube puts the duration.
- **Readable at 160×90.** If the face or the number is lost at that size, simplify. A wide shot with small figures loses to every neighbour on the page: the thumbnail is a close-up, one face filling a third of the frame or more, always painted (STYLE_GUIDE, Thumbnail). Judge it beside three thumbnails of the biggest channels on the same topic, not alone.
- **Look at the shelf first.** Before the pairs are written, search YouTube for the story and list the titles and bands of the biggest videos on it. Our band never repeats theirs (same subject word and nearly the same figure reads as a copy), and our title takes the angle none of them has. On the day news breaks, the title may open with the fact everyone is searching ("Nvidia's CEO Resigned.") and then ask the one question this video answers; the opening must confirm it within 20 seconds.
- **One title for three pictures.** Write at least one title that fits all three thumbnails, because YouTube's test may compare only the pictures.
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
- The engine builds them: `node studio/tools/build.mjs <episode> --short L012-L020 --title "..."` makes a vertical cut with the question on top, the picture in the middle and large subtitles below. Then mix, lint, look at the frames and render that folder like any episode.
