# Build requests

Places, objects and guest figures this episode needs that the engine does not have yet. The scene builder works through this list. Written by the art director on 13 Nov 2026 from every `[SCENE]` and `[SKIT]` tag of `script.md`; the storyboard already uses these names, so the build warns about them until they exist.

Engine today: SETS `plain picture studio board office trading_floor kitchen street suburb server_room lawn stage warehouse bus boardroom night_city`; THINGS `box chip tower dome bank factory server cloud coin bag house barrel newspaper note`.

Every new set has a `night: true` option with the one light named below (the storyboard also puts a `"light"` there), and a `view` or `dress` option where one set stands for several places. Cut-paper construction, ink outline, cut shadow, no gradients except the light cone (STYLE_GUIDE, Sets and props).

## (a) New sets (23)

| Name in the storyboard | What it shows; options | The one light (night) | Chapters (shots in the script) |
|---|---|---|---|
| `pitch_stage` | A TV pitch stage: a small high table on a dark floor; a curved row of five investors' chairs; tiered audience seats; lighting rig in the rafters; stage wings with an exit door. `view`: `table` (Allison's side, chairs dark behind), `chairs` (from the table: the curved row of five chairs facing us), `desk` (from under the investors' desk, chairs in a curve facing out), `seats` (from the back row down to the lit table), `rafters` (from above: the table a small lit disc, chairs around it), `wings` (side corridor, wall, exit door). `lit_chair`: index of the one lit chair (0-4); `empty: true` clears the table. | A hard white-yellow spotlight cone from above on the table (or on one chair); in `wings`, a small red-green exit sign over the door | CH1 (s01-s04, k01, k02), CH2 (s10, s11, k05), CH7 (s40, k30), CH8 (s50, k38) |
| `living_room` | A small living room: sofa, side table, TV on a low stand, wall calendar. `dress`: `rehearsal` (stuffed toys lined up on the sofa), `sunday` (family on the sofa, the pitch on the TV), `martha` (Martha's sofa). | The TV screen's blue glow, or a phone torch (`light: "phone"`) | CH2 (s09, s13, k08) |
| `farmers_market` | An open-air market: folding tables with cloth, crates, a canopy pole, other stalls as dark shapes. | One string of warm bulbs across the top (dawn: a pale band low in the sky) | CH1 (s06) |
| `night_office` | A small office after hours: desk, chair, shelves, window to a dark city. `dress`: `buyer` (product samples on shelves), `supplier` (wall calendar, invoices), `hal` (wood panels), `newsroom` (two monitors, stacked papers), `executive` (tall leather chair), `filing` (rows of file drawers, thick binders), `clerk` (a very tall clerk's desk for Reggie, the trademark office). | One desk lamp; green banker's lamp for `hal`, `filing` and `clerk` | CH1 (k03), CH3 (s15, k10, s21, k14), CH5 (s31), CH7 (k31), CH8 (s45, s47) |
| `car_lot` | A used-car lot: chain-link fence, bunting of little flags, a family car (the `car` prop) centre. `dress`: `garage` (a low concrete parking garage with pillars). | One floodlight on a pole (garage: one overhead tube) | CH1 (s07), CH7 (s44) |
| `bottling_plant` | A tiny bottling room: hand-cranked bottling line along the back, a filler with a crank wheel, pallets, a roller door. The line carries the `bottles` prop. | One bare bulb on a cord | CH1 (s08, k04) |
| `back_shop` | A narrow shop behind a counter. `dress`: `pawn` (glass counter, shelves of odd goods, guitars), `tailor` (mannequin, cutting table, bolts of cloth), `print` (a small press, stacks of labels, a cracked mirror on the wall). | One hanging bulb (tailor and print: one work lamp) | CH2 (k06, k09), CH6 (s35, k25) |
| `corridor` | A long institutional corridor: plastic chairs along one wall, doors. `dress`: `hospital` (pale green walls, trolley parking bay), `court` (wood panels, a bench, tall doors). | One ceiling light (court: one wall sconce) | CH2 (s12, k07), CH6 (s33) |
| `design_studio` | A studio at 2 a.m.: drafting table, a lightbox, pinned sketches, a tall dark window. | One drafting lamp; the lightbox glows | CH3 (s16, k11) |
| `empty_hall` | A big empty hall. `dress`: `convention` (a half-built trade stand, double doors with a banner across them), `gym` (a school gym: wall bars, folded bleachers, a mirror ball). | One emergency light over the doors (gym: the mirror ball's spots) | CH3 (s17, k12), CH5 (k22) |
| `bedroom` | A small room with a desk and a bed. `dress`: `teen` (Chad's room: posters as plain shapes, a gaming chair), `loft` (an influencer's loft: brick wall, ring light on a stand, a big window). | A phone screen on the face (loft: the ring light) | CH3 (s19, k13), CH4 (s26, k19) |
| `bank` | `dress`: `vault` (round vault door open, steel shelves, a nearly empty one), `counter` (a teller window with a grille). | One bulb in the vault; the teller's lamp at the counter | CH3 (s20), CH7 (k32) |
| `red_carpet` | A red carpet between rope posts, a backdrop wall (plain, no logos), a press pen. | Camera flashes: a white burst at the `flash` times | CH4 (s23, k15) |
| `supermarket` | A soda aisle: glowing fridges both sides, shelf edges. `dress`: `aisle` (closed store, fridges glowing), `shelf` (a single grocery shelf before opening, a stock-room door). | The fridges' cold light (shelf: one stock-room light through the door) | CH4 (k16), CH8 (s49, k37) |
| `mall` | An empty mall: shop shutters down, a running escalator rising into the dark. | The escalator's handrail strip lights | CH4 (s24, k17) |
| `stadium` | A football stadium: pitch below, a giant screen at the far end, the stands. `view`: `field` (wide, the screen and a crowd of tiny phone lights), `stands` (two seats close, rows behind). | Floodlight towers; the phones in the crowd | CH4 (s25, k18) |
| `lab` | A laboratory: benches with beakers and flasks, a fume hood, shelves of bottles. | One lab lamp on an arm | CH5 (s28, k20) |
| `scrapyard` | A scrapyard: a heap of crushed cans and drums, a crane with a magnet. | One crane light from above | CH5 (s29, k21) |
| `night_road` | `dress`: `highway` (an empty road to the horizon, a courthouse silhouette far away), `racetrack` (pit wall, track kerbs, grandstand shapes). | Headlights (racetrack: one row of track lights) | CH5 (s32), CH7 (k33) |
| `courtroom` | A courtroom: the judge's bench, a witness box, a jury box in shadow, flags as plain shapes. | One lamp on the bench | CH6 (s34, k24) |
| `stairwell` | A stairwell seen from the side, several landings going down into the dark. | One bulb per landing (`bulbs: n`), the bottom landing brightest | CH6 (s38, k28), CH8 (s46, k34) |
| `train_platform` | A platform edge, a train with lit windows pulling out, a station clock (no numbers needed). | One platform lamp | CH7 (s43) |
| `desk_top` | A desk seen from straight above: wood grain, a blotter, the pool of a lamp; made for document cards (`doc`) and a hand stamping. | The lamp's pool in the centre | CH2 (s14), CH5 (s31), CH6 (s37), CH7 (s41), CH8 (s47) |

Options on existing sets (not new sets): `kitchen` needs `fridge: "open"` (the fridge door open, its light the only light; CH5 k23, CH8 s48, k36) and `dress: "martha"` (a pendant lamp over a kitchen table; CH6 k27, CH8 k35); `warehouse` needs `night: true` with one forklift headlamp (CH3 s18); `boardroom` needs `night: true` with one pendant lamp and `glass: true` (glass walls, dawn sky; CH4 s22, CH6 s36/k26 as a mediation room, CH7 s39); `night_city` needs two lit-from-below towers at either side (CH5 s30, the giants stand in front of them).

## (b) New living things (3)

| Name | How it looks | Who speaks through it | Shots |
|---|---|---|---|
| `soda` | The drink itself, the episode's anchor motif (`"motif": "word on the can"`). A plain object with the house face and white gloves. `shape`: `bottle` (a round-shouldered glass swing-top bottle, pale amber liquid inside, a wide paper label; CH1-CH3 s15) or `can` (a slim tall can, pastel coral with a cream band; from CH3 s16) or `plain` (the slim can with no label at all; the last shot). `label`: the word on it (MOTHER, poppi, NO FAULT, or empty). `tag`: a price tag on a string from its neck: `"tag": "$1.95B"`, `"tagDown": true` (the tag hangs face-down, blank: nothing to read), `"tagFlip": <seconds>` (the face-down tag flips over; with no `tag` text it shows a gold blank while a `counter` overlay carries the number, as in CH1 c1s10), `"tagTear": <seconds>` (a strip tears off and floats away, the text changes to `tagAfter`, CH7 s42). `sweat: true` (drops on the glass). Never a real Poppi can design: no brand fonts, no fruit illustration, no logo. | SODA | Most chapters; CH1 s01, k01, s03, k02 |
| `giant` | The cola giant: a very tall plain can with a face, deep navy with one plain silver band, gloves. Same object as `soda` but `scale` up to 3 and a `color` option (`navy` for PEPSICO, plain red with a white band for COCA-COLA in CH5 s30, slim teal for OLIPOP). `coat: "lab"` for the lab coat (CH5 s28). Never a real can design: no globe, no wave, no ribbon script, no brand colours copied beyond a plain base colour. | GIANT | CH1 s03 (rafters), CH5, CH7 |
| `vending` | A pink vending machine with a face in its glass front, gloves, rows of cans behind the glass. | (silent, reacts) | CH4 s26, k19 |

A smaller can marked SOULBOOST (CH5 s28-s29) is `soda` with `shape: "can"`, `color: "#7fd0f0"`, `scale: 0.6`; JETTY (CH8 s49) is `soda` with `shape: "bottle"`, `color: "#c95f8d"`. Cardboard boxes with faces (CH3 s18) and the claim form stay as the existing `box` and `note`.

## (c) Guest figures (5)

Added to `CAST` in `rig.js` under these names, each a figure with a `style` (STYLE_GUIDE, Real people: two or three traits, clearly a cartoon, only what they did in public; a name strip the first time). The scene builder checks each trait against one public photo before drawing; nothing here is a likeness to be traced.

| Name | Traits | Notes |
|---|---|---|
| `ALLISON_ELLSWORTH` | Long straight blonde hair to the shoulders; a bright solid-colour dress (coral); a `pregnant: true` body option (a round belly, used in CH1-CH2 only). | Co-founder. Appears at the pitch table, the kitchen, the market, the plant, the phone screen, the shelf, the garage. Never shown drinking or holding the product to camera as an endorsement. |
| `STEPHEN_ELLSWORTH` | Short brown hair, a short trimmed beard, an open-collar checked shirt with rolled sleeves. | Co-founder, her husband. Must not share Allison's or Oza's look. |
| `ROHAN_OZA` | Dark swept-back hair with grey at the sides, light stubble, a dark suit with an open collar and no tie; `pose: "fold"` (folded arms) would help. Briefcase as his prop. | Investor, the guest Shark. The lit chair. Never placed in a chair that a cast member uses. |
| `RAMON_LAGUARTA` | Short grey-white hair, a grey suit, dark tie, a big pen. | PepsiCo's chief executive, signing (CH7 s39). Only beside the giant can, never speaking an invented line. |
| `SHARK` | A silhouette only: the skeleton filled with the dark navy of the night, no face, no traits, sitting. Five in a row, `shadow: true`. | The other investors. Never named, never lit, never a caricature of a real person. |

## (d) Props and overlays (17)

| Name | What it shows | Shots |
|---|---|---|
| `car` | A family car seen from the side, plain colours. `sign`: a card on the windscreen (SOLD). | CH1 s07 (car lot), CH7 s44 (garage) |
| `cards_fan` | A fan of plain credit cards (no bank names, no numbers), lying flat; `move` spreads them. | CH1 s07 |
| `bottles` | A row of empty glass bottles that travel along a line (`n`, `speed`). | CH1 s08, k04 |
| `vinegar_jar` | A big glass jar of cloudy amber liquid (no label), with cut fruit beside it and a soda siphon. | CH1 s05 |
| `briefcase` (floor prop) | A briefcase standing on the floor, apart from a hand; `move` slides it. | CH1 s02, CH2 s11 |
| `briefcase_tower` | Briefcases stacked into a tower that rises into the dark (`n`, `grow`). | CH7 s40, k30 |
| `wall_calendar` | A calendar page on a wall with a grid of days and one day circled in red (no month, no numbers needed). | CH1 s04 |
| `investor_chair` | A tall stage chair; `lit` and `dark` states, so the chairs can go dark one by one. | CH1 s02, CH2 s10, k05, CH8 s50 |
| `toys` | Five stuffed toys in a row (bear, rabbit, dog...). | CH2 s09 |
| `blanket` | A small folded baby blanket on a plastic chair. | CH2 s12 |
| `cheque` | A long cheque sliding on a table; `t` for the amount, or blank. | CH4 s22, CH7 k32 |
| `magnifier_big` | A magnifying glass bigger than a figure, hanging over the witness box. | CH6 s34 |
| `beakers` | Two beakers that pour together and give a puff of green smoke. | CH5 s28, k20 |
| `mirror_ball` | A turning mirror ball with moving spots. | CH5 k22 |
| `hearts` (overlay) | A heart counter climbing in a corner of a phone screen (a `counter` with a heart in front). | CH3 s19 |
| Hand props | `popcorn` (Benny, CH1 k02), `calculator` (Martha), `espresso` (Hal's tiny cup), `mop` (Benny, CH3 k12), `tape` (a tailor's measuring tape, CH2 k09), `clipboard` (Reggie, CH6 k24). `wallet` needs an `open: true` empty state (CH1 k04). | CH1-CH8 |
| `pricetag` option | The existing prop needs `flip` (face-down blank, flips to the text at a time) and `tear` (a strip tears off; `after` is the new text). Used when the tag is not on the `soda` itself. | CH1 s03, CH7 s42 |
