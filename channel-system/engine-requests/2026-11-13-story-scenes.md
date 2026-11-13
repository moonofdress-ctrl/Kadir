# Engine requests, 13 Nov 2026: four story scenes for every episode

Approved by the user. Drawn in our flat cartoon style (STYLE_GUIDE), dark ground with one light, no neon, no lens effects. Each is a new shot type or set that any storyboard can use, documented in `studio/README.md` with a storyboard example, and timed only from the timeline (no requestAnimationFrame, timers, Date or randomness; the engine's seek must give the same frame every time).

Order of work: 1, 2, 3, 4.

1. **Evidence board** (`board_web` or similar): a dark corkboard; 3-8 nodes (a cast or guest face, a company logo-free badge with a name, a document card), each with a name strip; red string edges that draw themselves one at a time; options per node `cue`/`word` to light it up when the line names it; the camera eases to the active node and the others dim and soften. Use: who backed whom, who owns what (Poppi: founders - Rohan Oza - CAVU - PepsiCo).
2. **Timeline tunnel** (`timeline`): years on a road or rail receding into depth (2015 -> 2018 -> 2025); the camera glides from year to year on cues; past years dim and blur, the active year lights up with a short caption and an optional small prop or face. Use: a company's history in one shot.
3. **Rolling counter** (upgrade of the `counter` overlay, backwards compatible): digits roll vertically like a slot machine to the target; the colour turns green when it rises fast and red when it falls; each settled digit can trigger the engine's `tick` effect through `tools/cues.mjs` (respect MIN_SPACING; ticks must not push effects over lint A8, so at most one tick group per counter). Use: the episode's running number (FORMAT_BOOK, "One running number").
4. **Map flight** (`map_flight`): a simple dark map (US, world, or a region; shapes drawn in code from a small embedded outline, no tile servers, no network), a plane or dashed arc that draws from `from` to `to` (named cities with lat/lon), the camera follows the arc, a pulse ring and a city label at the end. Use: Dallas -> New York, Taiwan -> Santa Clara.

Done means: each type renders in the frame sheet without overlap or cut-off text, `npm run check` passes, the retention lint still passes on `channel-system/episodes/poppi-soda-billions`, and a short demo storyboard in `channel-system/episodes/demo-story-scenes/` shows all four (build with `--silent`; one frame sheet).
