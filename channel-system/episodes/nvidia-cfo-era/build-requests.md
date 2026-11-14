# Build requests

Places, objects and guest figures this episode needs that the engine does not have yet. The scene builder works through this list.

Written by the creative director on 14 Nov 2026 from `look.md` (palettes, light and extras are there). Order of work: the first-30-seconds pieces (block A) before everything else, because the Look gate draft is built from them on Sun 15 Nov; then block B in story order, then C. Every set: three layers (foreground the camera passes, middle for figures, back wall with eight or more objects and one living detail), a day and a night look, takes `opts.palette`, declares its ambience bed in `SET_AMBIENCE` and its default in `SET_PALETTE`, keeps faces and text inside x 170-1750, y 110-970, and leaves room for `"extras"` where the row says so.

## A. The first 30 seconds (build first)

| Name in the storyboard | Kind (set / prop / motif / guest) | What it shows, and the states it needs | Shots |
|---|---|---|---|
| `corner_office` | set (NEW) | The anchor place, 11 visits. Default palette violet, night first, bed `office` with a quiet clock tick. Views: `wide` (the chief executive's chair and desk left, Kress's smaller desk right, the glass door with its plate at the back between them, a window with the night city), `desk` (Kress's desk close: lamp, calculator, CFO plate, desk phone, papers), `door` (the glass door from inside, the plate at face height). Back wall: the wall clock above Kress's desk (option `clock_lit`: false = hands in shadow, true = lit; option `clock` "4:20"), a shelf with binders and a coin jar, framed chart, plant, cable, switch, vent. Day look = pale dawn through the window (s24). Room for 2 figures in the doorway, no extras | s01, k01, s03, s03a, s24, s26, s32, s46, s56, k31, s58 |
| `exec_chair` | prop | The chief executive's high-backed chair. States: `jacket` (black leather jacket on the back), `bare`, `agenda` (a paper on the seat: CALL 5:00 PM ET) | s01, s24, s58 |
| `door_plate` | motif | The plate on the glass door (shared by `corner_office` view `door` and the corridor dress `exec`). States: `before` (CHIEF EXECUTIVE with three small brass plates CEO, PRESIDENT, BOARD under it, the last half hidden by the doorknob), `taped` (INTERIM masking tape over the name; act: a gloved hand presses it on, the roll runs out on the last letter), `unscrewed` (holes where the brass plates were), `two` (tape + a CFO plate under it), `rattle` (act: tape and plate shake), `frame` (tape + CFO plate + an empty frame with a question mark above). Always drawn at the same size and place so the changes read | s01, s12, s25, s31, s40, s52, k30, s58 |
| `desk_phone` | prop | Desk phone with a yellow sticky note on its receiver. Note text option (`TUE 5:00 PM`, `TODAY`); act: the note's corner curls up; state `tangled` (cord round the calculator) | s01, s03a, s56 |
| `calculator`, `name_plate` | props | A desk calculator; a desk name plate with text (`CFO`, `INTERIM CEO` as masking tape beside it) | s01, s26, s32, s56 |
| `boardroom` dress `head_chair` | set dressing | Existing `boardroom` in palette wood at night with a green banker's lamp on the table (light `#b8f0a0`); the head chair still in plastic wrap with a shop tag. Dress `two_chairs` (CH4): two empty chairs side by side with labels CHAIR and CEO | s02, s04, s27, k13 |
| `the_board` | living thing | The boardroom table with a face and gloves, THE BOARD on its edge; act: opens a thick folder REVIEW, the lamp tips over | s04 |
| Kress, Jones | guests | Neutral likenesses for the storyboard's `"cast"` (brief.md safeguards 5: no mocking, sexual or demeaning look; faces neutral, plain, deadpan only). Kress seated at a desk, working poses (`hold`, `think`, a page turn); Jones standing with a printed statement. Sheet goes to the fact-checker before use | s01, s02, s26, s32 |

## B. New places, in story order

| Name in the storyboard | Kind (set / prop / motif / guest) | What it shows, and the states it needs | Shots |
|---|---|---|---|
| `bus_stop` | set (NEW) | Palette cream, bed `street`. A shelter with a timetable and an ad poster, a kerb, a road where a bus or cars pass, a bin and a lamp post. Day = grey morning; night = rain (a rain layer, streaks on the shelter glass) under a sodium street lamp. Room for 6 queueing extras in the back | k02, k29 |
| `newsroom` | set (NEW) | Palette slate, bed `machine`. A wire desk with one glowing monitor, stacked papers, a wall of clocks for world cities, pinned front pages, a coffee mug. Night first; day = blinds half open | s05 |
| `teleprinter` | living thing | A teleprinter with a face spitting paper ALLEGATION that piles up and buries a mug | s05 |
| `trading_floor` dress `dawn` and `exchange` | set dressing | `dawn` (palette blue): a bank's trading floor, rows of desks with screens, tall windows with grey dawn, a red ticker band. `exchange` (palette green): a stock exchange floor with a big ticker board (red or green, slam act), a closing bell on a balcony, booths. Room for 8-12 extras | s06, s20, s36, k18 |
| `diner` | set (NEW) | Palette red, bed `shop`. Booths with vinyl seats, a counter with stools, a pie case, a window with morning street, a menu board, a coffee pot steaming. Day first; night = neon sign in the window. Room for 3 extras in other booths | k03 |
| `corridor` dresses `exec`, `doors`, `courthouse` | set dressing | `exec` (palette teal): an office corridor of glass doors, the corner office's door with the `door_plate` motif, one bulb at night, sunny glass by day. `doors` (palette red): closed office doors in a row, one exit sign, no figures. `courthouse` (palette amber): wood panelling, a bench under a buzzing strip light, a notice board | k04, s12, s25, s31, s40, s52, k30, s22, k09a |
| `cinema` | set (NEW) | Palette red, bed `room`. Rows of seats seen from the front or behind, a screen, a projector beam from the back (a `spot` with dust in the beam), aisle steps with floor lights. Night first; day = house lights up. Room for 1 usher. Prop `jacket` draped over a seat | s10, s11 |
| `lawn` dress `playground` and `park` | set dressing | `playground` (palette green, noon): a slide with a queue of 6 children (extras, child size if the skeleton allows, else short adults), a bench, swings. `park` (palette blue, night): a bench under one lamp post, hedges, a path; a `piggy` asleep under the bench | k05a, k25a |
| `records_office` | set (NEW) | Palette ochre, bed `room`. Tall filing cabinets, a counter with a bell, a window, boxes of files; a drawer FILINGS that slides open by itself (act) with a sheet dated WED 11 NOV. Day (counter, window light) and night (one desk lamp) | k05, s24a |
| `tv_studio` | set (NEW) | Palette blue, bed `studio`. An anchor desk with a name strip, a monitor wall behind (can show a `seesaw`), one key light, a studio camera in the foreground, the outlet's small card on the desk (text option: FOX BUSINESS, CNBC, YAHOO FINANCE). Must work in a four-panel `split` | s13, s34 |
| `theatre` dresses `coat_check`, `box_office`, `dressing_room` | set (NEW) | One building, three rooms. `coat_check` (palette plum): a counter, hooks with one black jacket, claim tickets. `box_office` (palette ochre, bed `street`): a ticket window with glass and a speaking hole, a sign in the window, marquee bulbs. `dressing_room` (palette pink): a mirror ringed with bulbs (act: one pops), a counter, an empty chair | k06a, s48, k25, s49 |
| `gym` | set (NEW) | Palette slate, bed `room`. A bench press with a bar that wobbles (act), weight racks, a mirror wall, one strip light, a water cooler | k06 |
| `rooftop` | set (NEW) | Palette mint, bed `outdoors`. A deck with deck chairs, a parasol, a side table with a desk calendar (act: page flutters FRI 6 NOV toward SUN), the city skyline in sun. Day first | s15, k07 |
| `bedroom` (Chad's) | set dressing | Existing `bedroom` in palette pink at dusk: a gaming monitor glowing green, posters, a dusk window | k08 |
| `printing_press` | set (NEW) | Palette olive, bed `machine`. A press with a moving belt, rolls of paper, a hanging lamp, ink drums. Night first | s21 |
| `newspaper` | living thing | A folded newspaper with a face, masthead text option (THE NEW YORK TIMES, THE WALL STREET JOURNAL); act: rolls off the belt | s21 |
| `office` dresses `after_hours` and `cubicle` | set dressing | `after_hours` (palette blue): an empty office, one monitor lit with a red line, a desk plant that wilts (act). `cubicle` (palette slate): Benny's cubicle with partitions, a desk lamp, a keyboard | s23, k16 |
| `laundromat` | set (NEW) | Palette mint, bed `machine`. A row of washers with round windows spinning, plastic chairs, a folding table, fluorescent tubes (one flickers), a change machine. Night first. Room for 2 extras | k10 |
| `lobby` | set (NEW) | Palette cream, bed `room`. A glass lobby with a revolving door (act: turns as a figure walks out), a reception desk, marble floor, long dawn shadows. Room for 2 small extras | s24b |
| `printer` | living thing | An office printer with a face, sweating, pushing out one page | s24 |
| `back_shop` dresses `engraver` and `print` | set dressing | `engraver` (palette ochre, day): a counter full of blank brass plates, an engraving machine, a shop window. `print` (palette olive, night): a copier, a counter under one lamp | k11, k13a |
| `night_office` dress `recruiter` | set dressing | Palette slate: a corkboard with one card WANTED, CEO, INSIDE OR OUTSIDE, a take-a-number dispenser showing 001, a visitor's chair | s30, k14 |
| `garage` | set (NEW) | Palette red, bed `machine`. A roller door open to noon light, a car on a lift or on the floor with a creeper under it (act: rolls out), tool chests, tyres, a calendar. Day first | k15 |
| `pitch_stage` dress `earnings` | set dressing | Palette plum: a darkened conference room, a screen EARNINGS CALL in a projector beam, an empty lectern with a microphone (act: squeals) | s33 |
| `food_truck` | set (NEW) | Palette amber, bed `street`. A food truck side with a serving window, a menu board, a grill and a till inside, a pavement. Day first. Room for 5 queueing extras | k15a |
| `library` | set (NEW) | Palette green, bed `room`. A long reading table with green banker's lamps, tall shelves, a ladder, a fireplace (needs light kind `fire`, below). Night first. Room for 1 extra | k17 |
| `weather_station` | set (NEW) | Palette pink, bed `outdoors`. A hilltop at dusk with an anemometer spinning, a small hut, wide sky, grass bending | s35 |
| `auction_house` | set (NEW) | Palette plum, bed `crowd` (low murmur). An auction block on a stage, a chandelier, rows of chairs for 5 bidder extras with paddles, an easel. Night first. Day = tall windows | s37 |
| `farmers_market` night | set dressing | Existing set at night in palette olive with string lights; two stools; room for 4 extras | s38 |
| `coreweave`, `nebius` | living things | Two smaller chips with faces and the names on them; states: wobble, ice pack | s38, k19 |
| `hospital` | set (NEW) | Palette mint, bed `room`. A waiting room with rows of plastic chairs, a reception window, a number display, a water cooler, a window. Day first. Room for 2 extras | k19 |
| `bank` dress `counter` | set dressing | Palette blue, cold daylight: a desk with a name strip and a desk sign (text option, HSBC), a wall chart whose arrow runs from $365 to $170, off the chart and onto the carpet | s39, k20 |
| `street` dress `shuttered` | set dressing | Palette ochre at dusk: shuttered shop fronts, one sodium street lamp, a kerb | s41, k21 |
| `newspaper_box` | living thing | A street newspaper box with a face that turns to watch | s41 |
| `kitchen` dress `jar` | set dressing | Martha's kitchen (amber, morning): a glass jar INDEX FUND full of coins, one stack wearing a tiny chip face | s44, k23, s45 |
| `envelope` | living thing | Benny's 401(k) statement as an envelope with a face, sweating; the chip's price tag clipped to it | s45 |
| `radio_studio` | set (NEW) | Palette red, bed `studio`. A desk with an empty microphone on an arm, a red ON AIR light (act: flickers as it warms up), foam panels, a clock (5:00), a mixing desk. Night first | s47 |
| `train_platform` night | set dressing | Existing set in palette teal at night, a departure board showing one train 4:20; room for 3 extras | k24a |
| `sports_bar` | set (NEW) | Palette green, bed `crowd`. A big screen showing a countdown, a bar with stools and taps, neon signs (no real brands), pennants. Night first. Room for 10 extras facing the screen | k24 |
| `stadium` night `scoreboard` | set dressing | Existing set at night with floodlights and a giant scoreboard: columns EXPECTED (a `counter` rolling to ~$109B) and RESULT (blank), a small line MARGIN ~74%; empty seats; 1 cleaner extra with a broom | s50, k26a, k26 |
| `lighthouse` | set (NEW) | Palette navy (the episode's only navy place), bed `outdoors`. The gallery rail of a lighthouse, a sweeping beam over a black sea (act), a telescope on the rail, a fog bank with a label (NEXT QUARTER) | s51, k27 |
| `phone_booth` | set (NEW) | Palette red, bed `street` + rain. A phone booth on a rainy street in grey afternoon daylight; inside, a faceless silhouette with a receiver (brief.md safeguard 1); a stamp on the glass (text option); room for 3 passers-by with umbrellas | s53, k28 |

## C. Engine features

| Name in the storyboard | Kind (set / prop / motif / guest) | What it shows, and the states it needs | Shots |
|---|---|---|---|
| `"light": { "kind": "fire" }` | engine | A warm flickering light (fireplace) for the library; the light-kind list has spot, window, screen, neon, day | k17 |
| `"sound": "sting"` | engine | A short musical hit for the five stingers in `audio/music-cues.md`; until then the storyboard uses `riser` | s03, s21, k13a, s37, s56 |
| rain layer | engine or set option | Rain streaks and a rain ambience for night and grey-day exteriors | k29, s53, k28 |
| Huang from behind, Luria, four analysts (s34), Frank Lee | guests | Neutral likenesses for `"cast"` (brief.md safeguard 5): Huang only from behind (swept silver hair, black leather jacket), never a face; the analysts seated with a name strip, neutral face | s11, s24b, s13, s34, s39 |
