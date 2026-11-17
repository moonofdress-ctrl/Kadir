# YouTube package

Status 17 Nov 2026 (upload day, 18:00 TR = 10:00 ET, before the 16:20 ET results). Written on the current `timing.json` (747.7 s = 12:27); the detail pass may move chapter stamps and cues by a few seconds, so re-run the two generators in "Files" after the last build. Nothing was built or rendered for this package. The three painted thumbnails are NOT made yet (`images/` is empty): see "Thumbnails".

## Shelf check (FORMAT_BOOK 15)

Could see: `research.md` section 11 and "YouTube demand, measured 14 Nov" (titles from a search result list, view counts from search and the rival's page on 14 Nov). Could not see: this session has no YouTube access, so the shelf was not re-searched on 17 Nov, and thumbnails and bands were never seen (no band can be listed). Repeat the search in YouTube on upload day, with views visible, before the user confirms.

Titles and views on the shelf (14 Nov): "jensen huang resigns": CNN 1.77M (1 day), Sky News 177K, Valuetainment 140K, Bloomberg 128K and 123K, NBC 114K, DW 95K. Rival @PaperBillionsTV: "How a Chinese Spy Got Inside Nvidia" 2.4M; "Why Nvidia Would Fail Without Jensen Huang" 994K; "Why the Stock Market Just Crashed" 1.1M. Small channels: "Jensen Huang Resigns - Would You Have Fired Him?"; "Jensen Huang Resigns After 33 Years: How He Built Nvidia"; "Jensen Huang Resigns From Nvidia - Here's Who Could Replace Him"; "Nvidia CEO Jensen Huang quits after affair with 'Chinese spy'"; BBC "Reports of second Jensen Huang affair deepens Nvidia scandal" (~186k); Cramer on CNBC about Kress (205K); "Who is Colette Kress?" (17 to 2.8K views).

What it shows: every big title is the scandal, "who could replace him" or "without Jensen". The finance chief alone pulled little (205K for Cramer, the rest tiny); the brief records the CFO angle as weak. So our titles open with the fact people search ("Nvidia's CEO Resigned.") and then ask what only this video answers: who runs it now and what Tuesday's call decides. None of ours uses "Jensen Huang", "replace", "spy", "affair" or "without Jensen". Bands: none of the rivals' could be read; ours avoid the words "RESIGNS" and "SPY" and the figure $4.5T.

## Three pairs

| Pair | Reason to click | Title (chars) | Thumbnail scene and time | Band (white + red) | What it promises, and where the video pays it |
|---|---|---|---|---|---|
| A (first frame) | Consequence | Nvidia's CEO Resigned. Its Finance Chief Runs It Now (52) | `c1s01`, 0:00: the night corner office, the founder's jacket on the empty chair, Colette Kress (neutral caricature, close, face a third of the frame) at her own desk. Glowing object: the desk lamp's warm pool on her calculator. | white `HER FIRST CALL` red `4:20` | What happened to one person: the seat landed on the person who counts the money. Paid at 0:00-0:16 (L001-L002), the clock at 0:30 (L007), her story at 5:35. |
| B | Contrast | Nvidia Is Worth Trillions. Its Boss Is Temporary. (49) | `c1s02`, 0:02: close on the chief executive's door plate, the title covered by a strip of tape that says INTERIM. Glowing object: the taped plate under one lamp. No figure needed (or Kress's shoulder at the edge). | white `THE FIX:` red `TAPE` | A giant held by a strip of tape. Paid at 0:02 (the tape), 0:19 (about four trillion, L005), 4:25 ("Tape.", L087) and the interim title at 4:26 (L088). |
| C | Open question | Nvidia's CEO Resigned. Who Is Running It Now? (45) | `c1k01a`, 0:17: Nvidia the chip climbs on the desk and points at the empty chair with the jacket on it. Glowing object: the empty chair. | white `WHO'S IN` red `THE CHAIR` | The question and its answer. Asked at 0:17 (L003), answered at 0:18 (L004) and 0:47 (L013); answered fully at 4:26 and 12:14. |

**One title for all three pictures: "Nvidia's CEO Resigned. Who Is Running It Now?"** (45 characters; pair C's own title). It fits Kress alone at the desk, the taped door and the chip pointing at the chair. If YouTube's test compares only pictures, use it. The fact it opens with is confirmed in the first 8 seconds (L001-L002).

Start with: C's title with picture C (the fact people search, then one plain question), and let YouTube's test run all three. This is a judgment, not a measurement; the analyst records which pair won. If the user prefers the picture of the first frame, A is the same story from its first second.

## Thumbnails

`thumbnail_a.png`, `thumbnail_b.png`, `thumbnail_c.png` (1280x720, painted by the illustrator, band added by `stills.mjs thumb`) are owed. Concepts are in `thumbnails.md` (updated with the three pairs above; `prompts.md` is the illustrator's). Commands, once the pictures exist (frames shown are in the build; the first 30 s are final):

```bash
node studio/tools/stills.mjs thumb channel-system/episodes/nvidia-cfo-era --white "HER FIRST CALL" --red "4:20" --t 0 --out channel-system/episodes/nvidia-cfo-era/images/thumbnail_a.png
node studio/tools/stills.mjs thumb channel-system/episodes/nvidia-cfo-era --white "THE FIX:" --red "TAPE" --t 3 --out channel-system/episodes/nvidia-cfo-era/images/thumbnail_b.png
node studio/tools/stills.mjs thumb channel-system/episodes/nvidia-cfo-era --white "WHO'S IN" --red "THE CHAIR" --t 17.2 --out channel-system/episodes/nvidia-cfo-era/images/thumbnail_c.png
```

Checks owed before upload, for each `_small.png` (160x90): the face (A) or the glowing object (B, C) and the band read; nothing important in the lower right corner. **A matches the first frame**: its scene is `c1s01` at 0:00 (the same office, jacket on the chair, Kress at her desk). Safeguards (brief.md): Kress is a neutral likeness, calm face, no gag pose; Huang is not shown; nothing shows what the video does not show.

## Shorts (FORMAT_BOOK 16): planned, not built

Build later (this machine is busy): `node studio/tools/build.mjs channel-system/episodes/nvidia-cfo-era --short <first>-<last> --title "<question>" --name short<N>`, then mix, lint, look at frames, render. Every first line below stands alone with its on-screen question, so no new clip is needed; every Short is Lawrence's own narration (no scratch voice). Line ranges come from the current timing (a Short's cues move with any retiming).

| # | Lesson | Lines (time in the long video) | Length | New first line | Question on screen |
|---|---|---|---|---|---|
| 1 | Consequence: what the week cost | L130-L138 (7:03-7:35; includes the Chad/Hal banter L131-L134) | about 32 s | none | `WHAT DID NVIDIA'S WEEK COST?` |
| 2 | Belief corrected: the CFO is not a separate person from the boss | L107-L117 (5:37-6:18) | about 41 s | none | `WHO RUNS NVIDIA AND SIGNS ITS NUMBERS?` |
| 3 | Comparison and limit: your index fund | L155-L164 (8:35-9:10) | about 35 s | none | `DO YOU OWN NVIDIA?` |
| R | Result Short (new; Wed 18 Nov) | New lines recorded with Lawrence after the call, plus the clip's own lines L165-L166 for the date and time if needed | 25-40 s | yes: written from Nvidia's release and checked by the fact-checker | `DID NVIDIA'S FIRST CALL WITHOUT HUANG BEAT $109B?` (or the figure that happened) |

Cause and answer: Short 1, Thursday's 12-percent drop and the four-trillion against four-and-a-half-trillion, about $490 billion of market value (our subtraction from Yahoo Finance's live blog, said so on screen), more than four times the expected quarter's sales. Short 2, she signs the numbers, reads them to the market and now runs the company, on a temporary title. Short 3, about seven dollars of every hundred in an S&P 500 fund was Nvidia before the fall, no current figure seen. Each answers on its own and does not point to the long video before it has answered. Watch in lint: Short 1 begins "Thursday, the shares fell..." (the question carries "Nvidia"); if the lint objects, start at L135 (23 s) with the question `HOW MUCH OF NVIDIA DISAPPEARED?`.

## Description, tags, pinned comment, Studio settings

All in `youtube-upload.txt` (description 2,742 characters; limit 5,000; ours under 4,500). Captions: `nvidia-cfo-era.srt` (310 cues, last cue ends 12:26.7; built from `audio/*.words.json`, `audio/lines.json` and `timing.json`, same method as Poppi). The video says no figure about the outcome; the result goes into the pinned comment and a description update (below), the video is not re-rendered.

**The late result (brief.md):** after the call (00:20-01:00 TR Wed 18 Nov) the user (or the analyst) fills the blanks in `youtube-upload.txt` "RESULT UPDATE" and "PINNED COMMENT UPDATE": revenue, guidance, any word on the CEO search, from Nvidia's own release (cite it) and the call; add "Update 18 Nov:" as the first line of the description. The fact-checker checks those figures and checks the title still promises nothing the video lacks ("Who Is Running It Now?" stays true while Kress is interim; if a permanent CEO is named, the fact-checker writes the dated note and the user chooses between it and a new last chapter).

**Currency check owed (Tue 17 Nov morning, brief.md):** CH8 dated lines (no permanent CEO as of Sat 14 Nov; the FT report; no statement from Huang; whether the review goes on) and Monday's close. The description says "as of 14 November" until the fact-checker re-dates it; if the story moved, change that line before upload.

## End screen

Last 20 seconds: 12:07 to 12:27 (727.7-747.7 s). The video keeps the right half clear (look.md: the door at night, Benny on the left, the right half dark; confirm in the last frame sheet). Elements: a video element for episode 1, **Nvidia's CEO Probe** (`nvidia-ceo-probe`, https://www.youtube.com/watch?v=_cfb_NZ1haE), the story that leads to this one (the probe, the 9.5 percent fall and the resignation), and a Subscribe element. Studio changes need the user's yes.

## Posting plan (approved 14 Nov 2026)

| What | Date and time |
|---|---|
| Episode 3 upload | Tue 17 Nov 2026, 18:00 TR (= 10:00 ET), approved by the user 14 Nov; before the 16:20 ET results |
| Result Short (R) | Wed 18 Nov, 22:00 TR (= 14:00 ET), built and checked that morning after the 00:20 TR release |
| Short 1, what the week cost | Thu 19 Nov, 22:00 TR |
| Short 2, who signs the numbers | Fri 20 Nov, 22:00 TR |
| Short 3, do you own Nvidia? | Sat 21 Nov, 22:00 TR |

Episode 2's Shorts and episode 4's slot may already take some of these days: the user's Studio calendar decides; move a Short to the next free day between long videos. Scheduling in Studio only with the user's yes.

## Channel links (brand/BRAND.md Channel set-up)

- Playlist: **CEO Stories** (this is the sequel to the probe, which is in the same series). A "Crashes and Scandals" entry is also reasonable; one playlist only, the user decides.
- This episode's end screen points to episode 1 (above).
- Episode 1's end screen should now point to this episode (the user's yes; its Test & Compare is running, and an end-screen change touches neither title nor thumbnail). Episode 2's end screen: leave.

## Disclosure

Narration: synthetic voice (ElevenLabs, narrator Lawrence - Bright and Informative; the characters are synthetic voices too). The description says so. README.md records the user's decision of 12 Nov 2026 to disclose; set YouTube's altered-content label as that decision says (yes) after re-reading YouTube's current text. The characters are cartoons; Huang, Kress and Jones are caricatures that resemble them (brief.md), and they say only words on record, marked as quotes.

## A/B test note

YouTube compares up to three thumbnails (and titles) and picks by watch time. Nobody knows the winner in advance. Leave the result for the analyst.
