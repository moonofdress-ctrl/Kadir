# Format book

The rules every script follows. Derived from the teardown in `research/paper_billions_teardown.md` and adapted to our cast. The scriptwriter agent must follow this file; the QA agent checks against it.

## 1. Topic and title
- A market event people are searching for **today**. Publish within 24–48 hours.
- The title is the exact question a viewer types: "Why the Stock Market Just Crashed", "Why Nvidia Lost $400 Billion". Plain words, no jargon, under 60 characters.
- One concrete money figure goes in the thumbnail, not necessarily in the title.

## 2. Length and shape
- 12–15 minutes, 1,900–2,300 words of narration plus skits.
- 6–9 chapters of 1–3 minutes. Each chapter has a 2–4 word title shown on a chapter card.

## 3. The opening (first 45 seconds)
| Time | Beat |
|---|---|
| 0:00–0:08 | The biggest number plus a contradiction ("lost $400 billion, and it hadn't done anything wrong"). |
| 0:08–0:20 | Two or three "it wasn't X, it wasn't Y" lines that deepen the mystery. |
| by 0:20 | Ask the title question out loud, word for word. |
| 0:20–0:30 | First skit (two short lines). |
| by 0:40 | The short answer as a list of three concrete things. |
| 0:40–0:50 | Open the long story with a date and a place: "It starts on the sixth of October, in Santa Clara, California." |

## 4. Rhythm rules
- **A skit every 50–70 seconds** (12–16 per video). See section 6.
- **Put the viewer in the story at least three times**: their index fund, their 401(k), their power bill, their job, their age. Benny (our host) usually carries this.
- **Every big number gets a human scale** in the same breath: "eight cents of every dollar in the S&P 500", "twice Amazon's building budget for the year", "$990 out of a $250,000 fund".
- **Numbered lists** for complex causes ("Crack one... Crack four").
- **Plant and pay off**: at least one "hold that thought" that returns later, and the last line calls back to something from the first two minutes.
- **Tell a single day of drama by the clock** ("Nine thirty. The bell rings in New York.").
- **One analogy per hard idea** (a restaurant, a railway, insurance).

## 5. Sentences
- Short. Most sentences under 15 words. One idea per sentence.
- Spoken English, contractions allowed. No "In today's video", no "Let's dive in", no "Buckle up".
- Turn points with short lines: "That bet is expensive." "Hold that thought." "Not yet."
- Never copy a sentence from another channel. Copy the rhythm, write our own words.

## 6. Skits
- 2–4 lines, 4–10 seconds total, characters from `characters/cast.md` only (plus a guest caricature when the story is about a public figure).
- A skit turns the fact just stated into a joke, a fear or a reaction. It never carries new facts.
- Format in the script:
  ```
  [SKIT k07 | bg: trading floor]
  CHAD: Buy the dip!
  BENNY: Which one? There are four.
  ```
- Real people in skits: only clearly comic lines, never a fake quote that sounds real. Their real quotes go in narration with attribution.

## 7. Sources and legal language
- Every claim has an owner on screen or in narration: a person, a firm, a filing, a news agency.
- Allegations stay allegations: "the FTC alleges", "according to the lawsuit". Include the other side's response.
- No financial advice. Never "buy", "sell" or "you should" about a security.
- Numbers are checked by the fact-checker against a primary or two independent sources before voice is recorded.

## 8. The ending
- Answer the title question honestly, in one short line ("Not yet.").
- One twist "almost nobody noticed".
- The next date to watch (earnings day, a vote, a court date): a reason to come back.
- Last line calls back to the opening.

## 9. Writing for the voice engine
- Money and percentages in words ("four hundred billion dollars", "twenty-five percent"). Years as digits.
- "..." for a beat, "—" for a turn. No stage directions in narration lines.
- Narration lines start with `N:`, skit lines with the character's name in capitals.

## 10. Script file format
```
# TITLE: Why the Stock Market Just Crashed
## CH1 The $400 billion morning
[SCENE s01 | bg: empty trading floor at dawn | cam: push_in | text: "−$400B"]
N: On Thursday, Nvidia lost more than four hundred billion dollars in a single morning...
[SKIT k01 | bg: Benny's office cubicle]
BENNY: My index fund just... did what?
## CH2 The top
...
```
`[SCENE]` and `[SKIT]` lines are read by the art director to build `shotlist.json`. Everything after `N:` or `NAME:` is spoken.
