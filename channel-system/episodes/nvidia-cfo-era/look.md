# Look plan

Written by the creative director after Gate 2, before any storyboard (FORMAT_BOOK 11 and 13; `channel-system/checklists/storyboard.md`). Every chapter art director reads this file and their chapter of the script, nothing else from the episode. Keep it to what a storyboard needs.

Written 14 Nov 2026 (after Gate 2). Quality reference checked the same day: the rival's rows are grey on this machine (frames only on the user's PC), so the bar is our own row, which is navy with one spotlight in five of six frames. This episode must not look like that row.

## The film in three lines
- **What it looks like.** One home colour, the corner office in blue-violet under a warm desk lamp, that we leave and return to (11 visits); every place we leave it for has its own family: wood and green-lamp boardroom, teal executive corridor, cream bus stop, green exchange floor, and a different colour at each skit. Each chapter swings night (lamp, screen, bulb, neon, fire) to day (window, noon sun, dusk) at least twice: CH1 and CH3 are the darkest, CH2 and CH4 the brightest, CH6 opens in hard daylight and ends at dusk, CH7 opens in a morning kitchen and goes to night, CH8 is night with one grey rainy afternoon. Navy appears once, on purpose: the black sea at the lighthouse (CH8).
- **What it sounds like.** Office room tone and a ticking clock under the corner office every time we return; crowd beds on the exchange floor and in the sports bar; machines at the teleprinter, the press and the laundromat; street and rain at the bus stop and the phone booth. The music is `uneasy` at night, `calm` for history and the viewer's world, and rises three times: the after-hours fall (CH3), the twelve-percent day (CH6) and the countdown (CH8, rising under the last 15 s).
- **The one picture it must leave.** The door at night with its three layers (INTERIM tape, the CFO plate, an empty frame with a question mark), the wall clock beside it at 4:20, the bare chair with CALL 5:00 PM ET on its seat, Benny in the doorway on the left, the right half dark for the end screen (s58).

## Rules every chapter keeps
- **Palette names** are the engine's: teal, green, blue, navy, red, amber, violet, wood, cream, pink, mint, slate, ochre, olive, plum. Write `"opts": { "palette": "<name>" }` on every shot from the table below, `"night": true` on night shots. A recurring place keeps its colour in every chapter.
- **Night is dark in the place's own colour.** One `light` per night shot, `dark` 0.5 or less, `r` 750 or more, the colour from the Light column. Never `color` navy or plain white on a coloured set.
- **Light kinds** the engine has (`features.json`): `spot`, `window`, `screen`, `neon`, `day`. Lamp, bulb, chandelier, projector, floodlight and beam are `spot` in the colour given; `fire` (the library fireplace, k17) is requested in `build-requests.md`, until then `spot` in `#ffb060`.
- **Daylight** (`"night": false`, no `light` or a window light) on every shot marked DAY; each chapter has at least two.
- **Real people** (brief.md safeguards): Kress, Jones, Luria, the four analysts in s34 and Frank Lee are neutral likenesses with faces `neutral`, `plain` or `deadpan` only, poses `rest`, `hold`, `present`, `think`; never a loud face, never a gag pose, never `"angle": "high"` on them. Huang only from behind (s11, s24b), no face, no line. The approached executive in s53 is a faceless silhouette. No woman from the reports is drawn. Real people speak no lines; their quotes are `doc` cards with the source line.
- **Ambience** comes from the set; write `"ambience"` only where the table says it differs from the set's own bed.

## Places
One row per place, in story order. Neighbouring places never share a palette; 50-75% of the picture time dark, two or more daylight shots in every chapter; crowded places get extras. NEW sets are in `build-requests.md` (scene builder); "dress" means an existing set with the named `opts.dress`.

| Ch | Place (`"place"` tag) | Set | Palette | Light | Extras | Ambience bed | Who acts here |
|---|---|---|---|---|---|---|---|
| 1 | corner office (s01, k01, s03, s03a) | NEW `corner_office` | violet | night, desk lamp warm `#ffd27a` on Kress's desk | 0 | office (+ clock tick) | Kress (neutral), gloved hand, CHIP, Hal in doorway |
| 1 | boardroom (s02, s04) | `boardroom` + dress `head_chair` | wood | night, green banker's lamp `#b8f0a0` | 0 | room | Jones (neutral); THE BOARD (living table) |
| 1 | bus stop (k02) | NEW `bus_stop` | cream | DAY, grey morning sky | 6 queueing commuters | street | Benny, Chad |
| 1 | newsroom wire desk (s05) | NEW `newsroom` | slate | night, one monitor, screen cold `#cfe8ff` | 0 | machine | teleprinter (living), stamp DENIED BY CHINA |
| 1 | bank trading floor at dawn (s06) | `trading_floor` + dress `dawn` | blue | DAY, grey dawn through tall windows | 8 traders at screens | crowd | traders; coffee cup slides |
| 1 | diner (k03) | NEW `diner` | red | DAY, morning window on the table | 3 in other booths | shop | Martha, Hal |
| 1 | executive corridor (k04) | `corridor` + dress `exec` (glass door, plate) | teal | night, one bulb over the plate `#ffe9a8` | 0 | room | Martha, Hal |
| 2 | empty cinema (s10, s11) | NEW `cinema` | red | night, projector beam `#e8f4ff` from the back | 1 usher ("empty cinema") | room | Huang from behind, usher |
| 2 | playground (k05a) | `lawn` + dress `playground` (slide, bench) | green | DAY, noon sun | 6 children queueing at the slide | outdoors | Benny, Martha |
| 2 | records office (k05) | NEW `records_office` | ochre | DAY, window | 1 clerk behind cabinets | room | Reggie, CHIP |
| 2 | executive corridor, before (s12) | `corridor` + dress `exec` | teal | DAY, sunny glass, `grade` sepia (the past) | 2 passers-by in the glass | room | door plate only |
| 2 | TV studio (s13) | NEW `tv_studio` | blue | night, one key light `#fff4dc` | 0 | studio | Gil Luria (neutral) |
| 2 | theatre coat check (k06a) | NEW `theatre` + dress `coat_check` | plum | night, one lamp over the counter | 0 | room | Reggie, CHIP |
| 2 | gym (k06) | NEW `gym` | slate | night, one strip light `#e8fff4` | 0 | room | Chad, Hal |
| 2 | rooftop terrace (s15, k07) | NEW `rooftop` | mint | DAY, bright Friday sun, `grade` green on s15 | 0 | outdoors | CHIP in sunglasses, Benny |
| 3 | stock exchange floor (s20) | `trading_floor` + dress `exchange` (ticker board, bell) | green | DAY, late-afternoon gold window, `grade` green | 10 traders packing up | crowd | the dancing trader (extra in front) |
| 3 | Chad's bedroom at dusk (k08) | `bedroom` | pink | DAY dusk window, plus gaming monitor green `#7dffa0` | 0 | night | Chad; Hal as a phone on speaker |
| 3 | printing press (s21) | NEW `printing_press` | olive | night, one hanging lamp `#ffe0a0` | 0 | machine | NYT and WSJ newspapers (living), the chip's tag |
| 3 | dark corridor of closed doors (s22) | `corridor` + dress `doors` (exit sign) | red | night, exit sign `#ff6a5a` | 0 ("empty corridor", on purpose) | room | nobody; the stamp |
| 3 | courthouse corridor (k09a) | `corridor` + dress `courthouse` (wood bench, notice board) | amber | night, buzzing strip light `#fff6c8` | 0 | room | Reggie, Chad |
| 3 | Benny's living room after midnight (k09) | `living_room` | plum | night, phone red glow `#ff8a7a` on his face | 0 | night | Benny; Chad as a phone on speaker |
| 3 | after-hours office (s23) | `office` + dress `after_hours` | blue | night, one monitor `#d8ecff` | 0 ("empty office") | office | the red line, the plant |
| 3 | laundromat (k10) | NEW `laundromat` | mint | night, fluorescent `#f0fff8` (neon kind) | 2 folding at the back | machine | Martha, Hal |
| 3 | records room (s24a) | NEW `records_office`, night | ochre | night, one desk lamp | 0 | room | the FILINGS drawer |
| 4 | corner office at dawn (s24) | NEW `corner_office` | violet | DAY, pale dawn window | 0 | office | the printer (living); bare chair |
| 4 | glass lobby (s24b) | NEW `lobby` | cream | DAY dawn, long shadows | 2 security / cleaner, small | room | Huang from behind, walking out |
| 4 | executive corridor, door plate (s25) | `corridor` + dress `exec` | teal | DAY dawn | 0 | room | gloved hand, screwdriver, box MISC |
| 4 | engraver's shop (k11) | `back_shop` + dress `engraver` (blank brass plates) | ochre | DAY, shop window | 0 | shop | Martha in apron, Chad |
| 4 | corner office, Kress's desk (s26) | NEW `corner_office`, view `desk` | violet | night, desk lamp | 0 | office | Kress (neutral, reading) |
| 4 | boardroom (s27, k13) | `boardroom` + dress `two_chairs` | wood | night, green banker's lamp | 0 | room | CHIP, Reggie |
| 4 | document desk (s28, s29) | `desk_top` | amber | night, one lamp | 0 | office | `doc` cards with source line |
| 4 | print shop (k13a) | `back_shop` + dress `print` (copier, counter lamp) | olive | night, one lamp over the counter | 0 | shop | Martha, Benny |
| 4 | recruiter's office (s30, k14) | `night_office` + dress `recruiter` (corkboard, ticket dispenser 001) | slate | night, desk lamp | 0 | office | Hal behind desk, Chad with CV |
| 5 | executive corridor, two plates (s31) | `corridor` + dress `exec` | teal | night (quiet evening), corridor light | 0 | room | door plate |
| 5 | corner office, Kress's desk (s32) | NEW `corner_office`, view `desk` | violet | night, desk lamp (the lamp has a face) | 0 | office | Kress's hand (neutral), desk lamp (living) |
| 5 | car repair garage (k15) | NEW `garage` | red | DAY, noon through the roller door | 0 | machine | Hal on a creeper, Martha with clipboard |
| 5 | conference room, earnings call (s33) | `pitch_stage` + dress `earnings` (screen EARNINGS CALL, lectern) | plum | night, projector beam | 0 ("empty conference room") | studio | CHIP at the microphone |
| 5 | food truck (k15a) | NEW `food_truck` | amber | DAY, lunchtime sun | 5 customers queueing | street | Chad cooking, Hal at the window |
| 5 | Benny's cubicle (k16) | `office` + dress `cubicle` | slate | night, desk lamp | 0 | office | Benny, CHIP |
| 5 | four TV studios (s34) | NEW `tv_studio` in a `split` | blue | night, one key light per panel | 0 | studio | four analysts (neutral), CHIP hopping |
| 5 | library reading room (k17) | NEW `library` | green | night, green lamps plus a fireplace `#ffb060` (fire kind) | 1 reader asleep at the back | room | Martha, Hal |
| 5 | hilltop weather station (s35) | NEW `weather_station` | pink | DAY dusk, wide sky | 0 | outdoors | CHIP with wet finger |
| 6 | stock exchange floor (s36, k18) | `trading_floor` + dress `exchange` | green | DAY, bright Thursday morning, `grade` red on s36 | 12 traders leaning back in one wave | crowd | Chad, Hal in the crowd |
| 6 | auction house (s37) | NEW `auction_house` | plum | night, one chandelier `#ffe6a0`, `grade` gold | 5 bidders in rows (audience) | crowd (low) | CHIP on the block |
| 6 | night market stalls (s38) | `farmers_market`, night, string lights | olive | night, string lights `#ffd27a` | 4 shoppers | market | COREWEAVE, NEBIUS on stools |
| 6 | hospital waiting room (k19) | NEW `hospital` | mint | DAY, window | 2 waiting patients | room | Martha in scrubs, the two chips with ice packs |
| 6 | bank front office (s39, k20) | `bank` + dress `counter` (desk sign, wall chart) | blue | DAY, cold daylight | 1 teller behind glass | room | Frank Lee (neutral, s39), Hal with HOLD stamp (k20), CHIP |
| 6 | executive corridor (s40) | `corridor` + dress `exec` | teal | night, one bulb | 0 | room | door plate rattling |
| 6 | shuttered street at dusk (s41, k21) | `street` + dress `shuttered` | ochre | night (dusk), sodium street lamp `#ffb04a` | 0 ("empty street", on purpose) | street | CHIP, the newspaper box (living), Benny |
| 7 | Martha's kitchen (s44, k23, s45) | `kitchen` + dress `jar` | amber | DAY, morning window | 0 | room | Martha, Benny; jar INDEX FUND; 401(k) envelope (living) |
| 7 | corner office (s46) | NEW `corner_office` | violet | night, the lamp swings onto the clock | 0 | office | wall clock, calendar TUE 17 NOV |
| 7 | radio studio (s47) | NEW `radio_studio` | red | night, ON AIR light `#ff5a4a` (neon kind) | 0 | studio | empty microphone, clock 5:00 |
| 7 | train platform (k24a) | `train_platform`, night, departure board | teal | night, departure board `#ffcf5a` (screen kind) | 3 waiting commuters | street | Benny, Hal |
| 7 | sports bar (k24) | NEW `sports_bar` | green | night, big screen `#cfe8ff` plus neon | 10 facing the screen | crowd | Chad (foam finger), Hal at the bar |
| 7 | theatre box office (s48, k25) | NEW `theatre` + dress `box_office` | ochre | night, one bulb | 0 | street | Benny with ticket, Reggie behind glass |
| 7 | dressing room (s49) | NEW `theatre` + dress `dressing_room` | pink | night, mirror ring bulbs (one pops) | 0 | room | empty chair, script, calculator |
| 7 | park bench (k25a) | `lawn` + dress `park` (bench, lamp post), night | blue | night, lamp post `#ffe0a0` | 0 | night | Benny, Martha; piggy asleep under the bench |
| 8 | empty stadium (s50, k26a, k26) | `stadium`, night, scoreboard | green | night, floodlights `#f4fbff` | 1 cleaner ("empty stadium", on purpose) | `"ambience": "outdoors"` (the set's crowd bed would fill the empty seats) | Chad, Hal, Martha |
| 8 | lighthouse (s51, k27) | NEW `lighthouse` | navy (the only navy place: black sea) | night, sweeping beam `#fff1b0` | 0 | outdoors (wind, sea) | CHIP with telescope, Chad |
| 8 | executive corridor, empty frame (s52) | `corridor` + dress `exec` | teal | night, one bulb | 0 | room | door plate |
| 8 | phone booth on a rainy street (s53, k28) | NEW `phone_booth` | red | DAY, grey rainy afternoon | 3 passers-by with umbrellas | street (+ rain) | silhouette (faceless), Benny and Martha under one umbrella |
| 8 | document desk (s54) | `desk_top` | amber | night, one lamp | 0 | office | `doc` card, source line |
| 8 | bus stop at night (k29) | NEW `bus_stop`, night, rain | cream | night, street lamp `#ffb04a` | 0 ("empty bus stop", on purpose) | street (+ rain) | Benny, CHIP on the bench |
| 8 | corner office, Kress's desk (s56) | NEW `corner_office`, view `desk` | violet | night, desk lamp | 0 | office | the phone, note TODAY |
| 8 | executive corridor (k30) | `corridor` + dress `exec` | teal | night, one bulb | 0 | room | Benny reading the door |
| 8 | corner office (k31, s58) | NEW `corner_office` | violet | night, the same lamp as s01 | 0 | office (clock tick loud on s58) | CHIP under the clock, Benny in the doorway |

**Day and dark by chapter** (planned; the lint's D1-D3 decide): CH1 day = bus stop, trading floor, diner (about 35%); CH2 day = playground, records office, corridor before, rooftop (about 50%, the brightest); CH3 day = exchange floor, bedroom at dusk (about 25%, the darkest); CH4 day = office at dawn, lobby, door plate, engraver (about 40%); CH5 day = garage, food truck, hilltop (about 35%); CH6 day = exchange floor, hospital, bank (about 45%); CH7 day = the kitchen (about 30%); CH8 day = phone booth (about 15%: keep s53 and k28 to two shots or more). Whole film: about 65% dark.

**Palette share**: violet (corner office) is the largest at about 12% of the picture time; no other colour above 10%. If the corner office runs over a third of any chapter, the art director cuts a return, not a colour.

**A reused set reads as somewhere else** by palette, dress and time of day: `corridor` is four places (teal executive corridor, red dark corridor, amber courthouse corridor); `trading_floor` is two (blue bank floor at dawn, green exchange); `back_shop` two (ochre engraver by day, olive print shop by night); `lawn` two (green playground at noon, blue park at night); `theatre` three dresses (plum coat check, ochre box office, pink dressing room); `tv_studio` and `records_office` keep one colour each because they are the same place twice.

## Camera moments
Every two-person skit is cut as shot and reverse shot on the line (`close` or `medium`, `"focus"` on the speaker), with one `"frame": "ots"` shot in each conversation of three lines or more (the listener's shoulder near, the speaker beyond). A phone conversation cuts between the face and the phone. Real people get no ots, they do not converse.

| Ch | Conversation (who, where) to cut as shot and reverse shot with one over-the-shoulder | Low angle (power, line) | High angle (small, line) | Push-in kept for (line) |
|---|---|---|---|---|
| 1 | k01 CHIP / Hal (office; ots over CHIP onto Hal in the doorway on "Nobody. That's the news."); k02 Benny / Chad (bus stop; ots over Chad onto Benny on "Is that good?"); k03 Martha / Hal (diner; ots over Martha onto Hal on "I sold Monday."); k04 Martha / Hal (corridor, both at the door: one ots from behind Martha onto the plate) | s02 Jones at the head of the table, on "the board's first-ever chair" (neutral); s04 THE BOARD opening REVIEW | s06 the traders under the red ticker, from above | s03a the sticky note TUE 5:00 PM |
| 2 | k05a Benny / Martha (bench); k05 Reggie / CHIP (counter; ots over CHIP onto Reggie's stamp); k06a Reggie / CHIP (coat check); k06 Chad / Hal (gym; ots over Hal onto Chad under the bar); k07 Benny / CHIP (rooftop) | s11 the middle seat from below, the jacket on three seats (Huang from behind) | k06 Chad on the bench as the bar wobbles | s12 the three brass plates hiding behind the doorknob |
| 3 | k08 Chad / phone (bedroom: Chad's face and the phone close); k09a Reggie / Chad (courthouse; ots over Reggie onto Chad pacing); k09 Benny / phone (living room); k10 Martha / Hal (laundromat; ots over Hal's newspaper onto Martha) | s21 the two newspapers rolling off the belt toward the camera | s22 the empty dark corridor from above, or s23 the wilting plant | s24a the FILINGS drawer, sheet dated WED 11 NOV |
| 4 | k11 Martha / Chad (engraver's counter); k13 Reggie / CHIP (boardroom, two chairs); k13a Martha / Benny (print shop; ots over Benny's shoulder onto Martha reading); k14 Hal / Chad (recruiter: ots over Chad's CV onto Hal, then the reverse) | s26 Kress at her desk with the INTERIM tape (neutral, working) | s25 the three plates dropping into the box MISC | k13a Martha flips the page: the back is blank |
| 5 | k15 Hal / Martha (garage); k15a Chad / Hal (food truck window; ots over Hal onto Chad); k16 Benny / CHIP (cubicle; ots over CHIP onto Benny on "So who's in the chair?"); k17 Martha / Hal (library table) | s33 CHIP at the lectern microphone | k15a Chad between the grill and the till | s32 two plates, one calculator |
| 6 | k18 Chad / Hal (in the crowd); k19 Martha / COREWEAVE and NEBIUS (waiting room); k20 Hal / CHIP (bank desk; ots over CHIP onto Hal's HOLD stamp); k21 Benny / CHIP (kerb) | k20 Hal raising the HOLD stamp | s38 the two small chips wobbling on their stools, or s41 CHIP walking alone | s37 the tag: $4.5T crossed out, $4.0T, -$493B |
| 7 | k23 Martha / Benny (kitchen table; ots over Benny's toast onto Martha's calculator); k24a Benny / Hal (platform); k24 Chad / Hal (bar); k25 Benny / Reggie (box office: ots through the glass over Benny onto Reggie); k25a Benny / Martha (bench) | s47 the ON AIR microphone from below | s48 Benny reading LISTEN ONLY at the window | s45 the 401(k) envelope sweating |
| 8 | k26a Chad / Hal (under the scoreboard); k26 Martha / Hal (front row); k27 Chad / CHIP (lighthouse rail; ots over CHIP onto Chad at the telescope); k28 Benny / Martha (under the umbrella); k29 Benny / CHIP (bench; ots over CHIP onto Benny on "Who's in the chair on Tuesday?"); k31 Benny / CHIP (doorway to desk) | k26a the scoreboard from below (MARGIN ~74%) | k29 Benny and CHIP alone at the rainy stop | s56 the note TODAY (the answer to s03a's push-in) |

Push-ins: these eight and the opening shot's slow move; no other push-in in the film (about 3% of shots). Places get pans and pull-outs; reveals get a `shake` only on a slam (s36).

**Dialogue camera (settled at the animatic, 14 Nov; replaces "dialogue holds almost still").** The lint's P3 (no move twice in a row, under 25% still) and P6 (no move over 25%) win. In a conversation the speaker's shot is either `still` or one slow `pan`/`tilt` toward the listener, alternating line by line, never two `still` in a row; the ots shot takes a `pull_out` or a `pan`. "Still" means the figures do not jump: the movement comes from the body (an act on the line), not from a push-in.

## Cast and running pieces
- **Cast per chapter.** CH1 Kress, Jones (guests); CHIP, Hal, Benny, Chad, Martha; THE BOARD, the teleprinter. CH2 Huang from behind, Luria (guests); Benny, Martha, Reggie, Chad, Hal, CHIP; an usher. CH3 Chad, Hal (phone), Reggie, Benny, Martha; NYT and WSJ newspapers, CHIP's tag. CH4 Huang from behind, Kress (guests); the printer, Martha, Chad, CHIP, Reggie, Benny, Hal. CH5 Kress's hand (guest); the desk lamp, Hal, Martha, Chad, Benny, CHIP; four analysts in s34 (guests). CH6 Frank Lee (guest); Chad, Hal, CHIP, COREWEAVE, NEBIUS, Martha, Benny; the newspaper box. CH7 Martha, Benny, Hal, Chad, Reggie; the 401(k) envelope, CHIP's tag. CH8 Chad, Hal, Martha, CHIP, Benny; a faceless silhouette.
- **Guest caricatures** (neutral likenesses; looks from the scene builder's guest sheet, `"cast"` in the storyboard). Kress: calm, at work (reading, a page turned, the calculator), seen most as hands and desk. Jones: stands, holds a printed statement, still. Huang: seen only from behind, swept silver hair and the black leather jacket. Luria, the s34 analysts, Frank Lee: at a desk with a name strip and the outlet's card, `neutral` face. Our cast keeps its traits: Hal's tiny espresso and three-piece suit, Chad's energy drink and phone sideways, Martha's calculator and mug, Reggie's giant stamp, Benny's phone.
- **Running number** (the price tag on CHIP's corner): CH1 $4.0T (s03, flips) / CH2 $4.5T (s15, sunbathing) / CH3 swinging with a red -8% AFTER HOURS sticker (s21) / CH4 $4.0T (s27) / CH5 $4.0T (s33, at the microphone) / CH6 $4.5T crossed, $4.0T, -$493B stamp (s37) / CH7 clipped to Benny's 401(k) envelope (s45) / CH8 $4.0T ... ? under the 4:20 clock (k31). Yellow `pricetag`, the same size and the same corner every time.
- **The motif's states** (the door plate, always the teal corridor door, always framed from the same angle so the changes read): s01 CHIEF EXECUTIVE, INTERIM tape pressed over it (seen through the office glass) / s12 before: one plate and three small brass plates CEO, PRESIDENT, BOARD, the last behind the doorknob (day, sepia) / s25 the brass plates unscrewed into the box MISC (dawn) / s31 a CFO plate screwed on under the tape (evening) / s40 tape and CFO plate rattling (night) / s52 an empty frame with a question mark above the tape / k30 Benny reads all three / s58 the same door at night, clock at 4:20. Supporting plants: the jacket on the chair (s01 on, s11 on three seats, s24 gone, s58 bare chair with the agenda); the wall clock (s01 hands in shadow, s46 lit with TUE 17 NOV, s53 hands racing, s58 4:20); the phone note (s01/s03a TUE 5:00 PM, s56 TODAY); the calculator (s01, s32, s56).

## The first 30 seconds (for the Look gate)
Fourteen shots by 0:30 (H1-H8). Narration at 157 words a minute; the voice decides the exact cut points. The first frame is the thumbnail's scene: the corner office, the empty chair with the jacket, the woman at the next desk.

| # | About | Place / palette / light | Shot | Says |
|---|---|---|---|---|
| 1 | 0:00 | corner office / violet / night, desk lamp | wide: the empty chair with the jacket left, Kress small at her desk right, the glass door behind; slow `pan_right` | "Thursday, the twelfth of November." |
| 2 | 0:02 | corner office (the door, from inside) | close, `focus` the plate: the gloved hand presses INTERIM tape over CHIEF EXECUTIVE, the roll runs out on the last letter; `still` | "...chief executive chair..." |
| 3 | 0:04 | corner office | detail: the jacket on the chair back; `tilt_down` to the empty seat | "...is empty..." |
| 4 | 0:06 | corner office | `medium` Kress at work, CFO plate, calculator, the phone with its yellow note; `lower_third` COLETTE KRESS (by 0:07); `still` | "...still at her old desk." |
| 5 | 0:08 | corner office | detail: the wall clock above her, hands lost in shadow; `pan_left` | |
| 6 | 0:10 | corner office | close, `focus` the CFO plate and calculator, her hand turns a page; `still` | "Colette Kress, the finance chief, has just been named interim chief executive." |
| 7 | 0:13 | boardroom / wood / night, green banker's lamp | wide, `"angle": "low"`: Jones at the head of the table with the statement; `lower_third` HARVEY C. JONES | "Harvey Jones becomes the board's first-ever chair." |
| 8 | 0:15 | boardroom | detail: the head chair still in plastic wrap with a shop tag; `pan_right` | "...first-ever chair." |
| 9 | 0:17 | corner office | `medium` CHIP peeking over the calculator at the empty chair (label NVIDIA) | CHIP: "Who's in the chair?" |
| 10 | 0:19 | corner office | `"frame": "ots"` over CHIP's head onto Hal in the doorway with the espresso | HAL: "Nobody. That's the news." |
| 11 | 0:21 | card | the script's [CARD], one short line, 2.5 s or less | |
| 12 | 0:23 | corner office | close CHIP on the desk: the price tag flips to $4.0T, CHIP gulps (the one number, by 0:24); `still`; riser stinger | "...about four trillion dollars." |
| 13 | 0:27 | corner office | `pull_out` from CHIP to the desk and the empty chair behind | "Keep that number in mind." |
| 14 | 0:29 | corner office | detail, high: a coin jar INDEX FUND on Kress's shelf, one coin with the chip's face (plants CH7's jar); `pan_left` | "A slice of it sits in every S&P 500 index fund." |
| 15 | 0:32 | corner office | close, `push_in` on the phone: the note TUE 5:00 PM curls under the lamp's heat | "And on her desk... a date." |

Then k02 at the bus stop is the first daylight (about 0:38), and the title question card must land by 0:45 (the script estimates 0:46: keep shots 11-15 tight, or the card goes on "So who is running Nvidia now").

## Animatic fixes (14 Nov, creative director)
Structure fixed in the chapter files (316 shots after the rebuild): text cards (chapter cards included) cut from 45 to 39 (10.5% of the runtime): c1t02 (Benny's calendar flips to TUE 17), c1t04 (the chip on the bank floor, -9.5% counter), c4t04 (a candidate walks into the recruiter's office), c7s18 (Martha's calendar to 17 NOV) are now scenes; c6t03 and c6t04 removed. Kept as text cards on purpose: the title question c1t01 and its return c8t07, the chapter cards, and the short turn cards. The calculator desk is now in the first 30 s twice (c1s06, c1s12), not four times: c1k01a and c1s09 moved to the wide view with the chair; c4s07, c5s04 and c8s56b are wide with Kress beside the chair; c4s09 moved to the boardroom (two chairs, CFO and CEO); c7s20 is a high angle with the quarter-end date. Document desk: every blank board now carries its doc card (Fox Business, 12 Nov, for Streeter, Ives, Kenwell; NVIDIA RELEASE, 12 NOV 2026 for Jones in c8s54/b, the fact-check's owed source line), the living desk lamp and a jar or the piggy; c8s54c/d carry the two newspapers and one sign each. The motif: one tag `door plate` on every door shot (14 tagged shots, two in the last 75 s), and the plate states now read: rattle (c6s40), empty frame (c8s52, c8k30, c8k31, c8s58); c8s58 has the bare chair with the agenda and the empty-frame plate; `dark_right` was tried and taken off, because its dark rectangle (x 900 on) hides the door plate, so the end-screen space is still open (shift the door left in the set or darken from x 1150). CH6 bank: target tag $365, then $170 falling off the chart, the HSBC living bank, CHIP, Frank Lee's lower third and his quote as a doc card (Yahoo live blog, 13 Nov), a teller. s36 carries the owed `OVER 12% DOWN`. Single-figure pictures filled: c2s11b (SUCCESSOR chair with cobwebs), c2s13c (CHIP on the seesaw), c3s22c (the second newspaper), c4s05/06 (box MISC, CHIP), c6s40b, c8s51 (Chad at the rail), c8s52b, c8s53c (Benny and Martha watching the booth), c8s50 (Chad walks in). Header title set (T5).

**For the detail pass, per chapter (art directors):**
- **All.** G1 58% (want 85%), G7 36% (want 60%), G8 33% (want 20%): every scene gets a prop or a busy figure, an act on the line or a walk, two things in frame. Fix the layout check's 110 faults (c6s36: the slam sits on the ticker board, move it or accept the background). Piggy bank in 4 to 17 pictures (now 4).
- **CH1.** Keep the first 30 s as rebuilt for the Look gate; check c1s09's low angle on CHIP with the $4.0T counter reads.
- **CH4.** c4k11c: the ots listener hides the frame; pull the speaker into view.
- **CH5.** c5s13 (3-panel split): the earnings screen cuts across the desk and the podium hides Kress; recompose as two panels or one scene. c5s11: smaller ots listener.
- **CH7.** c7s14, c7s15 ("FUND" under a head), c7s28, c7s36 (text off the frame).
- **CH8.** c8k26c ($109B and Chad's cap cut), c8k27 (NEXT QUARTER cut), c8k26h, c8k27b-d, c8k29d, c8s56/b, c8k30a-b, c8k31a-b, c8s58a, c8s58 (text under heads or the edge); the end-screen right half in c8s58 without covering the door plate.

## Look gate notes
(written after the Look gate: what the user or QA said, and what the detail pass must keep or change)
