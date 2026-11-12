# YouTube package: Why Is Nvidia Down Over Its CEO?

Prepared 2026-11-12 for Gate 3. Nothing is uploaded. Voice in the current render: SCRATCH (synthetic).

## Open before upload

1. **Narrator.** The render uses a scratch synthetic voice (Kokoro). Replace it with a human narrator or keep a synthetic voice and disclose it (FORMAT_BOOK 14). The narrator is the user's decision. Captions below are timed to the scratch voice and must be regenerated after any voice or line change.
2. **Remake the full render.** `render/nvidia-ceo-probe.mp4` predates the QA fixes (B1-B7 in qa.md). Rebuild, mix, lint, render, pull frames.
3. **The user re-reads CH8 and CH9** (brief.md, Gate 2 condition).
4. **Lines and shots out of date against Thursday 12 Nov reporting** (factcheck.md `## QA fixes check 2026-11-12`, Q9): L132 (says "two newspapers"; Reuters, Bloomberg, the FT have reported since), L151 (Reuters says the board met late Wednesday; only "no decision" still holds), L162 and shot c9s54 (the "neither report names anyone" framing implies more of a vacuum than the latest reporting), and shots c9s49b ("TWO REPORTS") and c9s50f ("WSJ REPORTS: COULD MEET SOON"). Also check L032 and L112 ("nobody named") and L138 (the Thursday close will exist) on upload day. The writer decides whether to rewrite or to re-date.
5. **Thumbnail B must be re-made** with a new band (the fact-checker rejected "SAME SALES"): see pair B. Thumbnail C needs a decision (see pair C: its scene is outside the first 30 seconds).
6. **Re-run the title search on upload day** (research.md `## Title check 2026-11-11`: searches return page data, not YouTube's own results; new videos on this story appear hourly). Re-check each title and the description against the day's news.
7. **qa.md's re-check verdict.** qa.md says FAIL with 7 blocking findings (B1-B7); no re-check verdict is on file. Nothing ships until it is PASS.
8. **Shorts are planned, not built** (this step wrote only package.md). Build, mix, lint and look at the frames after the full render is final; see the Shorts plan.
9. **Captions** (end of this file) are a draft from `audio/lines.json` and `timing.json`; save the block as `nvidia-ceo-probe.srt` for upload, after item 1 and item 4.

## Three pairs (FORMAT_BOOK 15)

Files: `images/thumbnail_a.png`, `images/thumbnail_b.png`, `images/thumbnail_c.png` (1280x720) with `_small.png` (160x90) beside each. Made by `node studio/tools/stills.mjs thumb channel-system/episodes/nvidia-ceo-probe ... --out <file>`.

| Pair | Reason to click | Title (characters) | Thumbnail scene and time | Band text | What it promises, and where the video pays it |
|---|---|---|---|---|---|
| A (first frame) | Consequence: a huge loss happened to a giant | Why Is Nvidia Down Over Its CEO? (32) | Shot c1s01, 0:00-0:05: the tent at dusk, the NVIDIA chip clinging to the pole in `panic`, Benny with a red phone, Martha with a bill. Thumbnail taken at t=1.5 s. | white `NVIDIA` + red `-$430B` | Promises the reason behind a two-day fall of about $430B; paid from 0:13 (the question on a card) and answered at 12:59 ("one man's trouble made everyone look up at the same time"), with the chain in CH3 to CH9. |
| B | Contrast: two things that should not be true together | Why Did Nvidia Fall With No Forecast Cut? (41) | Shot c1s01b, 0:05-0:08: chip warehouse, crates marked CHIPS, the sign CHIP SALES: NO DROP REPORTED, the chip shrugging at the camera. **To be re-made** (see below). | white `2 DAYS` + red `-9.5%` (new; the old band `SAME SALES` is rejected) | Promises the explanation of a fall while nothing in the business was reported to change; the setup is at 0:00-0:13 ("No forecast was cut."), paid in CH6 ("two fears", 5:40) and CH8 (forecast about $108B unchanged, assumed no China chip sales, 9:20-9:50). |
| C | Open question: who sits here? | Why Does One Man Matter So Much to Nvidia? (42) | Shot c9s54, 12:39-12:45: one office chair, spotlit, nameplate NEXT, nobody in it, the chip looking up; card AS OF WED 11 NOV, NIGHT: NOBODY NAMED. **Outside the first 30 seconds** (see below). | white `ONE` + red `EMPTY CHAIR` | Promises why one person carries so much weight; the empty chair is planted at 0:21-0:27 ("One man. One empty chair.") and 0:38, paid in CH3 (One pole, 1:35) and the last minute (12:39). |

**Pair B, band.** The fact-checker rejected `SAME SALES`: it asserts a fact that cannot be shown before the 17 Nov results. The picture already carries the supported wording on its sign (screen text `CHIP SALES: NO DROP REPORTED`), so the band does not repeat it; it adds the figure the script gives (CH5: "Two days. About nine and a half percent."). If the user prefers the sign's words as the band, `CHIP SALES` + `NO DROP REPORTED` (5 words) is also supported by the script, but then the sign in the picture should change. The band `2 DAYS -9.5%` is two words and one figure and stays out of the lower right corner. Image B must be re-made; the title does not change the claim ("No forecast was cut", L004).

```bash
node studio/tools/stills.mjs thumb channel-system/episodes/nvidia-ceo-probe --white "2 DAYS" --red "-9.5%" --t 6.5 --out channel-system/episodes/nvidia-ceo-probe/images/thumbnail_b.png
```

**Pair C, the rule exception.** FORMAT_BOOK 15 lets B and C show only a moment from the first 30 seconds. The chair is drawn as a single frame only at 12:39; at 0:24 it is one panel of the three-panel c1s05 (0:23.7-0:27.6). thumbnails.md chose 12:39 on purpose. This is the one place the package departs from the rule, and it is the user's call: either accept the exception, or re-make C from c1s05 at about t=25 (the chair panel, band unchanged), which obeys the rule but may read smaller. Two more conditions on C: (a) after the QA fix B7 the CLEANER must be out of the picture or holding the duster clear of the chair, so no figure reads as a candidate; (b) the strip `NOBODY NAMED` is true as of Wednesday night only, and Thursday's reporting (factcheck.md Q9) says a search for replacements is under way, so C needs a new look, or a drop of the strip, if a decision is announced before upload. The band is the script's own words and names nobody.

**Thumbnail checks (images looked at, 1280x720 and `_small` at 160x90):**
- A: the chip's face and `-$430B` still read at 160x90; the lower right holds Martha and the tent edge, nothing that matters. **A matches the first frame**: the same shot, c1s01, the same tent, chip, Benny and Martha (the counter rolls in from 0:01, so the number is not yet on screen at frame 0; the thumbnail's band carries it). qa.md B5 (a dark smear behind the counter on c1s01) must be fixed in the render; the thumbnail is clean.
- B (current draft, before the re-make): face and figure read, nothing important in the lower right (stacked CHIPS crates only). The old band is to be replaced as above.
- C: the chair, `ONE EMPTY CHAIR` and the chip read at 160x90; the chip stands low right, its bottom edge just above where YouTube puts the duration, and should be nudged up if the re-make allows. The dated strip is too small to read at 160x90; it is not needed there.
- Not checked: how the thumbnails look on a phone feed against other videos.

**Start with: A.** It is the first frame, so the click is confirmed at once, and it is the plainest question with the one figure the fact-check confirmed. This is a judgment, not a measurement; nobody knows the winner before viewers choose.

**A/B test note.** YouTube's Test and compare takes up to three thumbnails, titles or pairs and picks by watch time, not clicks. Run A, B and C as three pairs. The result (winner, watch time per pair, and why we think so) is for the analyst; this file does not predict it.

## Description

Nvidia lost about $430 billion in market value over two days (the Friday 6 Nov close to the Tuesday 10 Nov close; about $428-429 billion by our own arithmetic, one outlet gives about $430 billion). Its shares fell 4.27% on Monday 9 Nov and 5.47% on Tuesday 10 Nov, about 9.5% in all, after its board announced on Sunday 8 Nov an independent investigation prompted by reporting that its chief executive had been "the target of a foreign intelligence effort." News reports say US officials believe a former executive of Megaspeed, one of its customers, worked for Chinese intelligence; China denies it, Megaspeed denies illegal chip transfers, the reports rest on unnamed sources, and nothing has been proven in public. The board said it has no reason to believe national security or company secrets were compromised. This video explains why a company's dependence on one person moves the price, and why it reaches ordinary savers: in one popular S&P 500 index fund, Nvidia was about 7% of the holdings (7.3% on 4 Nov, per Trefis), so on $100,000 in that fund Nvidia's two-day fall alone took roughly $600 off, our own arithmetic.

We set the fall against Apple in 2011, Berkshire Hathaway in 2025 and Tesla in 2018, look at Nvidia's own forecast of about $108 billion in sales for the quarter (which assumes no data center chip sales to China), and cover the rebound at Wednesday's close and the fall of more than 8% in after-hours trading that followed two newspaper reports from unnamed sources, which Nvidia has not confirmed. Results are due Tuesday 17 November after the close. This video reflects what was public as of Wednesday night, 11 Nov 2026; later events are not covered.

What did you know about how much of your index fund sits in one company? Tell us in the comments.

Chapters
0:00 The two-day drop
0:31 Seven Dollars
1:35 One Pole
2:42 The Customer
3:59 The Statement
5:40 Two Fears
7:14 Other Tents
8:56 The Bounce
10:04 After the Bell

Figures as of 11 Nov 2026 (Wednesday night), from reporting by CNBC, CBS News, Reuters (as relayed by others), The Wall Street Journal and The New York Times (as reported by others), IBTimes, Trefis, The Motley Fool, Fortune and Newsweek, and from Nvidia's own statements and filings.

Sources
- Nvidia board statement: https://nvidianews.nvidia.com/news/statement-from-nvidia-board-of-directors
- Message to Nvidia's company: https://nvidianews.nvidia.com/news/a-message-to-our-company
- Nvidia results call date: https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Sets-Conference-Call-for-Third-Quarter-Financial-Results/
- Nvidia annual report FY2007 (key-person warning): https://www.sec.gov/Archives/edgar/data/0001045810/000104581007000008/fy2007annualreportonform10-k.htm
- Nvidia second-quarter results release: https://www.sec.gov/Archives/edgar/data/0001045810/000104581026000073/q2fy27pr.htm
- Two-day fall, IBTimes: https://www.ibtimes.com.au/nvidia-shares-rebound-ai-rally-jensen-huang-pressure-1878438
- Index fund weight, Trefis: https://www.trefis.com/articles/623122/how-much-nvidia-do-you-really-own/2026-11-06
- Index weights, The Motley Fool: https://www.fool.com/investing/2026/11/05/these-6-stocks-make-up-a-big-share-of-the-sp-500/
- Analyst forecast, Newsweek: https://www.newsweek.com/who-could-replace-jensen-huang-as-nvidia-ceo-nobody-12695728
- Analyst note, AOL: https://www.aol.com/articles/jensen-huang-departure-shave-30-152600000.html
- Washington and China chips, Yahoo Finance: https://finance.yahoo.com/markets/article/jensen-huangs-spy-scandal-may-cost-nvidia-the-china-chip-fight-it-was-winning-121310306.html
- Defense bill, Korea Times: https://www.koreatimes.co.kr/world/20261111/us-lawmakers-push-for-tougher-china-export-controls-in-defense-bill-amid-nvidia-scrutiny
- Senator Bennet's letter: https://www.bennet.senate.gov/2026/11/11/bennet-presses-trump-administration-on-failure-to-stop-megaspeeds-apparent-ai-tech-diversion-to-china/
- Singapore's reply on export controls: https://www.meti.gov.sg/newsroom/oral-reply-to-pqs-on-singapore-s-approach-to-export-controls/
- Chief executive's Bloomberg remarks, via The Standard: https://www.thestandard.com.hk/innovation/article/346990/Nvidias-Huang-says-dealings-with-firm-in-US-spy-probe-were-normal-Bloomberg-News-reports
- CoreWeave results, CNBC: https://www.cnbc.com/2026/11/10/coreweave-crwv-q3-earnings-report-2026.html
- Baird downgrade, CNBC: https://www.cnbc.com/2026/11/11/nvidia-baird-downgrade-ceo-ai-capex.html
- Analysts' estimate, The Motley Fool: https://www.fool.com/investing/2026/11/10/prediction-nov-17-will-be-a-huge-day-for-the-stock-market/
- After-hours fall, CBS News: https://www.cbsnews.com/news/nvidia-board-ceo-jensen-huang-china/
- Tesla 2018, Fortune: https://fortune.com/2018/09/27/elon-musk-sec-lawsuit-response-twitter/
- Berkshire 2025, Reuters via Yahoo: https://finance.yahoo.com/news/berkshire-hathaway-shares-fall-buffett-082154502.html
- How internal investigations work, Harvard Law School Forum: https://corpgov.law.harvard.edu/2017/07/06/internal-investigations-special-committees-resource/
- Inflation data, US Bureau of Labor Statistics: https://www.bls.gov/news.release/cpi.nr0.htm

This video is not financial advice. Allegations described are unproven.

Description checks: no woman from the reports is named (source URLs in factcheck.md that carry her name, or removal wording in the address, are left out on purpose; the after-hours figure rests on CBS and GamesBeat pages in factcheck.md, whose addresses are not listed for that reason, and the CBS link above should be checked to be the page that carries the 8% figure); nothing says or implies the CEO was removed or names a successor; the money figure is in the description, not in any title; the Apple 2011 source (a Fortune page, factcheck.md Added A) has no URL that this check could copy, so it is not listed: add it before upload. Update the description on upload day if Thursday's events change what is public.

## Tags

nvidia, nvidia stock, nvidia ceo, jensen huang, nvidia investigation, nvidia board, why is nvidia down, nvidia shares, nvda, megaspeed, china chip export controls, index fund, s&p 500 index fund, how much nvidia do you own, stock market explained, finance explained, cartoon explainer, nvidia earnings 17 november, key person risk

(No tags with removal, scandal, replacement or successor wording.)

## Pinned comment

What did you know about how much of your index fund sits in one company? Tell us in the comments.

## End screen suggestion

Last 20 seconds of YouTube's end-screen area (a YouTube element, not a call to action inside the video): one video tile for the channel's most recent finance explainer, and one playlist or subscribe element. The video's own last shot (Benny, the jar and the pole, "...and count the poles.") holds for about 1 s and should not be extended; the user may need a short end-screen tail, which is a new shot, not text added to the narration.

## Shorts plan (FORMAT_BOOK 16)

Three moments, one question, one cause, one answer each, 20-45 seconds, different lessons. Times are from `timing.json` of the scratch voice and will move with the final voice. None of them uses CH8 or CH9 material, so Thursday's news does not date them. Not built yet (see Open before upload, item 8).

| # | Lesson | Lines | New first line, if needed | Question on screen |
|---|---|---|---|---|
| 1 | Surprising consequence | L017-L019 (66.0-91.2 s, about 25 s, plus the new line about 4 s) | Yes: "In a popular index fund, about seven dollars of every hundred was Nvidia." (L017 starts at "The arithmetic is simple" and leans on that seven.) Answer: when Nvidia moves 10%, the index moves about 0.7%; on $100,000, Nvidia's two-day fall took more than $600 off, though the rest of the market rose Monday. | HOW MUCH OF YOUR FUND IS ONE STOCK? |
| 2 | Common belief corrected ("I don't own Nvidia") | L011-L016 (35.2-65.8 s, about 31 s, plus about 3 s) | Yes: "You don't own Nvidia? Check your index fund." Cause: index funds weight by size, not equally. Answer: about 7.3% of one big S&P 500 fund on 4 Nov (Trefis), about 8% in a popular Nasdaq fund; ends on the Martha and Chad skit. The long video's "Keep that seven in mind" line (L014) stays as a tag. | DO YOU OWN NVIDIA WITHOUT KNOWING IT? |
| 3 | Comparison and limit (a named heir does not stop a fall) | L100-L104 (457.8-482.6 s, about 25 s) | No: it starts on the event ("May 2025. Warren Buffett told shareholders he would step down..."). Cause: a CEO handover announced. Answer: Berkshire's shares still fell about 5% (about $59B) the next trading day, although the heir had been named years before. | DOES NAMING AN HEIR STOP A FALL? |

Build commands (run after the final voice is in; then mix, lint and look at each short's frames like an episode):

```bash
node studio/tools/build.mjs channel-system/episodes/nvidia-ceo-probe --short L017-L019 --title "HOW MUCH OF YOUR FUND IS ONE STOCK?" --name short1
node studio/tools/build.mjs channel-system/episodes/nvidia-ceo-probe --short L011-L016 --title "DO YOU OWN NVIDIA WITHOUT KNOWING IT?" --name short2
node studio/tools/build.mjs channel-system/episodes/nvidia-ceo-probe --short L100-L104 --title "DOES NAMING AN HEIR STOP A FALL?" --name short3
```

The build's `--short` option takes a line range; how a new first line is recorded (a new voice line recorded before L017 and before L011) is for the voice step. Each Short may point to the long video only after its own answer. Lines L017-L019 and L011-L016 carry the "Nvidia's share cost $600" wording corrected in factcheck row 7; keep it.

## Disclosure

Narration: **synthetic voice** (Kokoro scratch track) in the current render. Pictures are cartoons: no real person's face, voice or realistic likeness; real quotes appear on evidence cards. If a human narrator replaces the scratch voice, the answer changes to "human"; if a synthetic voice is kept, the user sets YouTube's altered or synthetic content label for it, after re-reading YouTube's current policy text on synthetic narration and on finance (FORMAT_BOOK 14: "AI personas discussing sensitive topics such as finance" is not monetized, and the user decides between a human narrator and a disclosed synthetic voice before the first upload). This is the user's decision and is open.

## Captions (SRT) draft

Generated from `audio/lines.json` and `timing.json` (scratch voice, 259 cues, lines of up to 42 characters). Lines L132, L151 and L162 are the out-of-date ones; regenerate after any rewrite or a new voice.

```srt
1
00:00:00,200 --> 00:00:04,719
In two days, Nvidia lost about four
hundred and thirty billion dollars in

2
00:00:04,719 --> 00:00:08,310
value... and no one had reported it
selling one chip less.

3
00:00:08,450 --> 00:00:09,780
No factory closed.

4
00:00:09,920 --> 00:00:11,470
No customer walked away.

5
00:00:11,610 --> 00:00:12,950
No forecast was cut.

6
00:00:13,090 --> 00:00:15,630
So why is Nvidia down over its CEO?

7
00:00:15,810 --> 00:00:17,454
I don't even own Nvidia.

8
00:00:17,594 --> 00:00:21,344
You own an index fund. You own a lot of
Nvidia.

9
00:00:21,524 --> 00:00:25,405
The short answer is three things. One man.
One empty chair.

10
00:00:25,405 --> 00:00:27,444
And one argument in Washington.

11
00:00:27,584 --> 00:00:31,704
It starts on a Sunday, the eighth of
November, with a statement from the board.

12
00:00:32,844 --> 00:00:35,064
But first... why is this your problem?

13
00:00:35,204 --> 00:00:39,985
The most popular kind of index fund in
America holds five hundred companies.

14
00:00:39,985 --> 00:00:44,514
They are not equal slices. The bigger the
company, the bigger its slice.

15
00:00:44,654 --> 00:00:49,134
Before the drop, about seven dollars of
every hundred in that fund was one

16
00:00:49,134 --> 00:00:50,224
company. This one.

17
00:00:50,364 --> 00:00:55,494
The research firm Trefis checked one big
S&P 500 fund as of the fourth of

18
00:00:55,494 --> 00:01:00,554
November: seven point three percent. A
popular Nasdaq fund, about eight.

19
00:01:00,694 --> 00:01:02,214
Keep that seven in mind.

20
00:01:02,394 --> 00:01:04,234
I picked the boring fund on purpose.

21
00:01:04,374 --> 00:01:05,774
Boring fund. Spicy chip.

22
00:01:05,954 --> 00:01:10,720
The arithmetic is simple. When Nvidia
moves ten percent, the whole index moves

23
00:01:10,720 --> 00:01:15,424
about seven tenths of one percent... with
every other company standing still.

24
00:01:15,564 --> 00:01:19,931
So do the sum. If you had a hundred
thousand dollars in that fund, Nvidia's

25
00:01:19,931 --> 00:01:23,483
two-day fall alone took more than six
hundred dollars off it.

26
00:01:23,483 --> 00:01:26,394
The rest of the market rose on Monday, and
hid it.

27
00:01:26,534 --> 00:01:29,292
You didn't pick the stock. You didn't read
the headline.

28
00:01:29,292 --> 00:01:31,164
You were just standing under the tent.

29
00:01:31,344 --> 00:01:32,694
What's holding this thing up?

30
00:01:32,834 --> 00:01:33,994
Don't look up.

31
00:01:34,174 --> 00:01:34,964
He looks up.

32
00:01:36,104 --> 00:01:37,064
It's one pole.

33
00:01:37,204 --> 00:01:43,280
Nvidia was founded in 1993. Its chief
executive, Jensen Huang, has run it ever

34
00:01:43,280 --> 00:01:46,084
since. Thirty-three years, one boss.

35
00:01:46,224 --> 00:01:50,684
The company grew from a start-up into one
of the most valuable businesses on

36
00:01:50,684 --> 00:01:52,444
earth. The pole never changed.

37
00:01:52,584 --> 00:01:57,464
The company knew it. Years ago, its own
annual report warned that losing its key

38
00:01:57,464 --> 00:02:00,514
people, and it named him, would harm the
business.

39
00:02:00,654 --> 00:02:02,844
And it said it carried no insurance on
him.

40
00:02:03,024 --> 00:02:05,144
I'd like to insure one pole.

41
00:02:05,284 --> 00:02:07,524
How many poles do you have?

42
00:02:07,664 --> 00:02:08,404
One.

43
00:02:08,544 --> 00:02:09,454
Next.

44
00:02:09,634 --> 00:02:13,494
So who takes over if he goes? Publicly,
nobody has been named.

45
00:02:13,634 --> 00:02:18,093
One Wall Street analyst, Dan Ives of
Yorkville Ives, put it bluntly.

46
00:02:18,093 --> 00:02:20,454
He said there is no succession plan.

47
00:02:20,594 --> 00:02:25,042
In a note to clients, he used two more
words about the chief executive.

48
00:02:25,042 --> 00:02:26,044
Not replaceable.

49
00:02:26,184 --> 00:02:30,841
And the pole has a second job. When Washington
talks about banning chip sales to

50
00:02:30,841 --> 00:02:33,984
China, he is the one who shows up to argue
against it.

51
00:02:34,164 --> 00:02:36,534
Who speaks for the chip business?

52
00:02:36,674 --> 00:02:37,124
Him.

53
00:02:37,264 --> 00:02:38,954
And if he can't?

54
00:02:39,094 --> 00:02:39,883
...Also him.

55
00:02:40,063 --> 00:02:42,803
One man. Two jobs. Now meet the customer.

56
00:02:43,943 --> 00:02:46,506
Because this story did not start with a
board.

57
00:02:46,506 --> 00:02:47,843
It started with a buyer.

58
00:02:47,983 --> 00:02:52,959
Megaspeed is a company based in Singapore.
According to news reports, it was

59
00:02:52,959 --> 00:02:58,000
spun out of a Chinese firm, and it has
bought billions of dollars of Nvidia's

60
00:02:58,000 --> 00:02:58,393
chips.

61
00:02:58,533 --> 00:03:03,215
Here is why that matters. American rules
stop Nvidia from selling its most

62
00:03:03,215 --> 00:03:04,733
advanced chips to China.

63
00:03:04,873 --> 00:03:06,233
But what about renting them?

64
00:03:06,373 --> 00:03:09,354
Think of an oven you're not allowed to
ship abroad.

65
00:03:09,354 --> 00:03:13,620
Fine. The oven stays put. But can a
customer far away rent the kitchen...

66
00:03:13,620 --> 00:03:15,023
and cook over the phone?

67
00:03:15,203 --> 00:03:17,903
Did the oven leave the country?

68
00:03:18,043 --> 00:03:18,663
No, sir.

69
00:03:18,803 --> 00:03:20,023
Did the dinner?

70
00:03:20,163 --> 00:03:21,018
...Define dinner.

71
00:03:21,198 --> 00:03:26,339
That is the gap lawmakers are now arguing
about: whether renting that computing

72
00:03:26,339 --> 00:03:29,658
power to users in China counts as an
export at all.

73
00:03:29,798 --> 00:03:35,048
And Singapore says it has no legal duty to
enforce another country's export

74
00:03:35,048 --> 00:03:35,468
rules.

75
00:03:35,608 --> 00:03:39,261
Reporters began asking about Megaspeed
back in 2025.

76
00:03:39,261 --> 00:03:44,599
Nvidia's answer was steady. In the last
days of October this year, its chief

77
00:03:44,599 --> 00:03:50,078
executive told Bloomberg those dealings
were, quote, "normal and not unusual."

78
00:03:50,258 --> 00:03:51,837
Anything unusual in there?

79
00:03:51,977 --> 00:03:53,697
Nothing unusual.

80
00:03:53,837 --> 00:03:55,137
That's what the sign says.

81
00:03:55,277 --> 00:03:56,856
I wrote the sign.

82
00:03:57,036 --> 00:03:59,896
Days later, the story stopped being about
a customer.

83
00:04:01,036 --> 00:04:02,656
Sunday, the eighth of November.

84
00:04:02,796 --> 00:04:06,209
Nvidia's board announces an independent
investigation.

85
00:04:06,209 --> 00:04:10,886
Its reason, in its own words: reporting
that its chief executive had been,

86
00:04:10,886 --> 00:04:14,236
quote, "the target of a foreign
intelligence effort."

87
00:04:14,376 --> 00:04:19,149
Here is what is claimed, and by whom. News
reports say American officials

88
00:04:19,149 --> 00:04:23,661
believe a former Megaspeed executive
worked for Chinese intelligence.

89
00:04:23,661 --> 00:04:28,892
China denies it. The reports rest on unnamed
people, and nothing has been proven

90
00:04:28,892 --> 00:04:29,546
in public.

91
00:04:29,686 --> 00:04:34,715
The same day, the company publishes an
email from the chief executive to staff.

92
00:04:34,715 --> 00:04:39,807
In it, he admits he was unfaithful to his
wife, names nobody, and writes that he

93
00:04:39,807 --> 00:04:41,526
had, quote, "fallen short."

94
00:04:41,666 --> 00:04:46,654
The board adds one more line. It says it
has no reason to believe that national

95
00:04:46,654 --> 00:04:49,496
security or company secrets were
compromised.

96
00:04:49,636 --> 00:04:54,194
The investigation is run by directors who
don't work for him, with an outside

97
00:04:54,194 --> 00:04:58,930
law firm. At the time, the company said he
planned to stay in the job while they

98
00:04:58,930 --> 00:04:59,226
look.

99
00:04:59,406 --> 00:05:01,106
Should I be reading this at midnight?

100
00:05:01,246 --> 00:05:01,726
No.

101
00:05:01,866 --> 00:05:02,786
...I'm reading it.

102
00:05:02,966 --> 00:05:07,449
Monday. The opening bell. By the close,
the shares are down a little more than

103
00:05:07,449 --> 00:05:08,196
four percent.

104
00:05:08,336 --> 00:05:12,967
That same day, a shareholder files a
lawsuit. It says calling those dealings

105
00:05:12,967 --> 00:05:16,866
normal was misleading, and that investors
were kept in the dark.

106
00:05:16,866 --> 00:05:19,486
Those claims have not been tested in
court.

107
00:05:19,626 --> 00:05:22,846
Tuesday. Down again. Almost five and a
half percent.

108
00:05:22,986 --> 00:05:27,562
To be fair, Tuesday had a second problem.
Inflation came in hot that morning,

109
00:05:27,562 --> 00:05:29,286
and the whole market slipped.

110
00:05:29,466 --> 00:05:31,156
Is it the boss or is it inflation?

111
00:05:31,296 --> 00:05:32,096
Yes.

112
00:05:32,276 --> 00:05:34,466
Two days. About nine and a half percent.

113
00:05:34,606 --> 00:05:38,206
But an investigation doesn't change how
many chips you sell.

114
00:05:38,206 --> 00:05:40,666
So what, exactly, were investors selling?

115
00:05:41,806 --> 00:05:43,246
They were selling two fears.

116
00:05:43,386 --> 00:05:44,926
Fear one. The pole leaves.

117
00:05:45,066 --> 00:05:50,126
Dan Ives, the same analyst, wrote that the
company would be worth twenty-five to

118
00:05:50,126 --> 00:05:53,668
thirty percent less if the chief executive
were removed.

119
00:05:53,668 --> 00:05:55,566
That's a forecast, not a fact.

120
00:05:55,706 --> 00:05:58,996
Put his what-if into your hundred thousand
dollars from earlier.

121
00:05:59,136 --> 00:06:02,276
Up to about two thousand dollars, from one
company.

122
00:06:02,416 --> 00:06:05,376
That's our arithmetic on his what-if, not
a prediction.

123
00:06:05,516 --> 00:06:10,090
On Wednesday, the firm Baird cut its
rating on the stock, and cut its price

124
00:06:10,090 --> 00:06:13,018
target from five hundred dollars to two
hundred.

125
00:06:13,018 --> 00:06:16,616
One reason it gave: it can't tell whether
he keeps the job.

126
00:06:16,796 --> 00:06:17,986
What's your price target?

127
00:06:18,126 --> 00:06:19,136
Depends.

128
00:06:19,276 --> 00:06:19,976
On what?

129
00:06:20,116 --> 00:06:22,186
On one guy's calendar.

130
00:06:22,366 --> 00:06:24,446
Fear two. The argument is lost.

131
00:06:24,586 --> 00:06:29,564
On Tuesday, the news site The Information
reported that the former executive

132
00:06:29,564 --> 00:06:34,608
helped arrange about seven and a half
billion dollars of Nvidia chip sales to

133
00:06:34,608 --> 00:06:35,787
Chinese companies.

134
00:06:35,927 --> 00:06:41,155
Megaspeed denies any illegal chip transfers.
And no investigation has published

135
00:06:41,155 --> 00:06:41,817
a finding.

136
00:06:41,957 --> 00:06:44,768
Washington moved anyway. Remember the
kitchen?

137
00:06:44,768 --> 00:06:49,595
Lawmakers are pushing three China chip
bills into this year's defense bill, and

138
00:06:49,595 --> 00:06:53,017
some have asked the chief executive to
come and explain.

139
00:06:53,157 --> 00:06:57,493
One senator, Michael Bennet, pressed the
administration on why it had not

140
00:06:57,493 --> 00:06:59,037
stopped Megaspeed already.

141
00:06:59,217 --> 00:07:00,627
He used to walk in here and win.

142
00:07:00,767 --> 00:07:03,057
He used to walk in here.

143
00:07:03,237 --> 00:07:07,289
So that is the trade. If he goes, the
company loses its builder.

144
00:07:07,289 --> 00:07:12,227
If he stays, it may lose its best argument.
Either way, the price had to move.

145
00:07:12,367 --> 00:07:14,757
But how big is big, for a boss in trouble?

146
00:07:15,897 --> 00:07:17,677
Other tents have shaken before.

147
00:07:17,817 --> 00:07:21,127
Three companies. Three bosses. Three very
different days.

148
00:07:21,267 --> 00:07:25,449
August 2011. Steve Jobs resigned as
Apple's chief executive.

149
00:07:25,449 --> 00:07:30,537
His successor, Tim Cook, had already been
running the company day to day.

150
00:07:30,677 --> 00:07:34,157
The next day, Apple's shares closed down
less than one percent.

151
00:07:34,297 --> 00:07:37,617
The market as a whole fell more, about one
and a half percent.

152
00:07:37,757 --> 00:07:42,734
May 2025. Warren Buffett told shareholders
he would step down as Berkshire

153
00:07:42,734 --> 00:07:46,097
Hathaway's chief executive at the end of
the year.

154
00:07:46,237 --> 00:07:49,166
His heir, Greg Abel, had been named years
before.

155
00:07:49,166 --> 00:07:51,437
And Buffett would stay on as chairman.

156
00:07:51,577 --> 00:07:55,363
The next trading day, the shares still
fell about five percent.

157
00:07:55,363 --> 00:07:58,247
About fifty-nine billion dollars of value,
gone.

158
00:07:58,427 --> 00:07:59,917
They had a spare pole for years!

159
00:08:00,057 --> 00:08:02,577
Still cost five percent to swap it.

160
00:08:02,757 --> 00:08:08,779
September 2018. America's market regulator,
the SEC, sued Elon Musk, Tesla's

161
00:08:08,779 --> 00:08:10,047
chief executive.

162
00:08:10,187 --> 00:08:14,898
It accused him of securities fraud over
tweets about taking Tesla private, and

163
00:08:14,898 --> 00:08:17,737
asked to bar him from running a public
company.

164
00:08:17,877 --> 00:08:20,247
The company wasn't the defendant. He was.

165
00:08:20,387 --> 00:08:23,527
The next day, Tesla's shares fell nearly
fourteen percent.

166
00:08:23,667 --> 00:08:28,492
He had called the case unjustified, and
settled the day after without admitting

167
00:08:28,492 --> 00:08:29,347
or denying it.

168
00:08:29,487 --> 00:08:33,784
Line them up. Apple had an heir ready, and
lost less than one percent.

169
00:08:33,784 --> 00:08:36,914
Berkshire had one too, and still lost five
percent.

170
00:08:36,914 --> 00:08:41,027
Tesla's danger was to the man himself, and
it lost almost fourteen.

171
00:08:41,167 --> 00:08:45,834
Nvidia's two days, about nine and a half
percent, sit between Berkshire and

172
00:08:45,834 --> 00:08:46,207
Tesla.

173
00:08:46,347 --> 00:08:51,627
Nvidia has no heir named in public. And
this review is about its boss, not about

174
00:08:51,627 --> 00:08:52,287
its chips.

175
00:08:52,427 --> 00:08:55,097
That's a comparison of size, not a
forecast.

176
00:08:55,237 --> 00:08:57,057
And then, on Wednesday, it went up.

177
00:08:58,197 --> 00:08:59,507
Wednesday, the eleventh.

178
00:08:59,647 --> 00:09:04,589
A company called CoreWeave, which rents
out Nvidia chips, had reported strong

179
00:09:04,589 --> 00:09:09,467
results the evening before. Chip stocks
jumped, and Nvidia jumped with them.

180
00:09:09,647 --> 00:09:10,266
We're back!

181
00:09:10,406 --> 00:09:11,776
We're Wednesday.

182
00:09:11,956 --> 00:09:15,912
By the closing bell, nothing about the
investigation had changed.

183
00:09:15,912 --> 00:09:20,416
What Wednesday's trading showed is that
the demand had not changed either.

184
00:09:20,556 --> 00:09:25,356
Nvidia's own forecast for this quarter is
about one hundred and eight billion

185
00:09:25,356 --> 00:09:29,096
dollars in sales. It has announced no
change to that number.

186
00:09:29,236 --> 00:09:32,693
By the close, your seven dollars got a
little of itself back.

187
00:09:32,693 --> 00:09:33,146
Not all.

188
00:09:33,286 --> 00:09:35,986
And here is the part almost nobody
noticed.

189
00:09:36,126 --> 00:09:39,785
That forecast assumes no data center chip
sales to China.

190
00:09:39,785 --> 00:09:40,106
None.

191
00:09:40,246 --> 00:09:43,854
So the fight in Washington is over money
that isn't in the number.

192
00:09:43,854 --> 00:09:47,736
The risk is not this quarter. It's the
rules for the quarters after it.

193
00:09:47,876 --> 00:09:52,350
If the kitchen door gets locked, the
buyers who rent that kitchen need fewer

194
00:09:52,350 --> 00:09:55,176
ovens. That is the sale investors can't
see yet.

195
00:09:55,356 --> 00:09:56,656
So the business is fine.

196
00:09:56,796 --> 00:09:58,096
The business is fine.

197
00:09:58,236 --> 00:10:00,506
Then why did it cost me six hundred
dollars?

198
00:10:00,646 --> 00:10:01,366
...Look up.

199
00:10:01,546 --> 00:10:04,496
Then the closing bell rang. And Wednesday
wasn't over.

200
00:10:05,636 --> 00:10:07,506
After the close, the bounce ran out.

201
00:10:07,646 --> 00:10:12,116
Two newspapers published reports. Both
rest on people they did not name.

202
00:10:12,256 --> 00:10:16,688
The New York Times reported a second
relationship, which the company has not

203
00:10:16,688 --> 00:10:17,446
commented on.

204
00:10:17,586 --> 00:10:22,334
And The Wall Street Journal reported that
Nvidia's board is preparing to remove

205
00:10:22,334 --> 00:10:23,536
its chief executive.

206
00:10:23,676 --> 00:10:28,496
Nvidia did not immediately respond to
requests for comment on that report.

207
00:10:28,636 --> 00:10:32,096
As of Wednesday night, the board had made
no new public statement.

208
00:10:32,236 --> 00:10:36,867
In after-hours trading, before Thursday's
open, the shares fell more than eight

209
00:10:36,867 --> 00:10:37,336
percent.

210
00:10:37,476 --> 00:10:39,646
That wiped out Wednesday's gain, and more.

211
00:10:39,786 --> 00:10:44,506
Remember the seven dollars? On a hundred
thousand dollars in that fund, that's

212
00:10:44,506 --> 00:10:48,500
roughly another five or six hundred
dollars from Nvidia's slice...

213
00:10:48,500 --> 00:10:49,226
if it holds.

214
00:10:49,366 --> 00:10:53,346
It's a snapshot, not a close. And that's
our arithmetic, not a forecast.

215
00:10:53,526 --> 00:10:54,796
You said, "We're Wednesday."

216
00:10:54,936 --> 00:10:56,601
It's still Wednesday.

217
00:10:56,781 --> 00:10:57,841
So is it over?

218
00:10:57,981 --> 00:10:58,771
Not yet.

219
00:10:58,911 --> 00:11:04,074
The price is waiting on three doors. Door
one, the board's investigation, which

220
00:11:04,074 --> 00:11:06,361
has found nothing in public so far.

221
00:11:06,501 --> 00:11:08,321
How does a review like this work?

222
00:11:08,461 --> 00:11:13,262
A guide by two corporate lawyers, published on
Harvard Law School's governance

223
00:11:13,262 --> 00:11:15,231
forum, lays out the usual shape.

224
00:11:15,371 --> 00:11:18,176
The committee directs the review, not its
lawyers.

225
00:11:18,176 --> 00:11:22,271
And the lawyers should answer to the
committee alone, not to the company.

226
00:11:22,411 --> 00:11:25,622
At the end, the committee reports its
findings to the board.

227
00:11:25,622 --> 00:11:28,031
The guide doesn't say they must be
published.

228
00:11:28,171 --> 00:11:30,291
Nvidia's board gave no deadline.

229
00:11:30,431 --> 00:11:34,858
But The Wall Street Journal reports the
board could meet soon to decide his

230
00:11:34,858 --> 00:11:35,271
future.

231
00:11:35,411 --> 00:11:38,381
No decision had been reported by Wednesday
night.

232
00:11:38,521 --> 00:11:42,461
Door two, Washington, where none of those
bills is law so far.

233
00:11:42,601 --> 00:11:46,246
Door three is a date. Tuesday, the
seventeenth of November.

234
00:11:46,246 --> 00:11:51,064
After the closing bell, Nvidia is due to
report its results, and whoever leads

235
00:11:51,064 --> 00:11:54,771
it then takes questions from the people
who price the stock.

236
00:11:54,911 --> 00:11:58,881
The next day, three House committee chairs
want a closed-door briefing.

237
00:11:59,061 --> 00:12:00,751
What's the first question going to be?

238
00:12:00,891 --> 00:12:02,161
It won't be about chips.

239
00:12:02,341 --> 00:12:07,492
The bar is already up. Analysts, on average,
expect a little more than Nvidia's

240
00:12:07,492 --> 00:12:12,642
own forecast: nearly one hundred and nine
billion dollars, according to a tally

241
00:12:12,642 --> 00:12:13,881
in The Motley Fool.

242
00:12:14,021 --> 00:12:16,841
That's more than a billion dollars of
sales a day.

243
00:12:16,981 --> 00:12:20,387
Listen for three things that day. Does the
forecast move?

244
00:12:20,387 --> 00:12:24,451
Does the board say anything new? And does
anyone say the word China?

245
00:12:24,591 --> 00:12:29,127
On the first one, a writer at The Motley
Fool points to the forecast for the

246
00:12:29,127 --> 00:12:33,424
next quarter. A weak one, he argues, could
be a sign that AI spending is

247
00:12:33,424 --> 00:12:35,751
slowing. That's an opinion, not a fact.

248
00:12:35,891 --> 00:12:39,438
Whatever the board decides, one thing has
already changed.

249
00:12:39,438 --> 00:12:44,207
Investors have now seen the empty chair.
As of Wednesday night, neither report

250
00:12:44,207 --> 00:12:48,732
names anyone to fill it. A company this
big does not get to leave it empty

251
00:12:48,732 --> 00:12:49,221
forever.

252
00:12:49,361 --> 00:12:53,509
And you have seen your seven dollars. You
own this story whether you follow it

253
00:12:53,509 --> 00:12:53,881
or not.

254
00:12:54,061 --> 00:12:55,321
Is one pole normal?

255
00:12:55,461 --> 00:12:57,201
It's not unusual.

256
00:12:57,381 --> 00:12:59,921
So why is Nvidia down over its CEO?

257
00:13:00,061 --> 00:13:03,135
Not because anyone reported it selling one
chip less.

258
00:13:03,135 --> 00:13:07,021
Because one man's trouble made everyone
look up at the same time...

259
00:13:07,161 --> 00:13:08,291
...and count the poles.
```
