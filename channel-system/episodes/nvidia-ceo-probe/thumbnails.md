# Thumbnail concepts

Three pairs, three reasons to click (FORMAT_BOOK 15). A is the scene of the first shot; B and C are moments from the first 30 seconds. Each is a moment frozen while something happens.

| Pair | Reason to click | Shot id and time | Band (white subject + red figure, 0-5 words, not the title) | Character and emotion | What is happening |
|---|---|---|---|---|---|
| A (first frame) | Consequence: a huge loss happened to a giant | c1s01, 0:00-0:03 | white `NVIDIA` + red `-$430B` (two-day fall only, confirmed in brief.md; not the after-hours move) | The NVIDIA chip on top of the tent pole, `panic`, gloves up | Dusk; the striped big top with one centre pole sways, the chip clings to the tip while tiny savers below (Benny with a red phone, Martha with a bill) look up. Counter rolling to -$430B in the top right. |
| B | Contrast: two things that should not be true together | c1s01b, 0:04-0:08 | white `SAME SALES` + red `-9.5%` (the two-day fall, said in CH5) | The NVIDIA chip, `confused`, shrug, holding a tag SAME | A chip warehouse: crates marked CHIPS still riding out, a sign CHIPS SOLD: NOT ONE LESS, the chip shrugging at the camera as the crates roll past. |
| C | Open question | c1s05 panel 2, 0:26-0:28 | white `NEXT BOSS:` + red `NOBODY` | No figure: the empty chair is the character; for the thumbnail add the chip peeking round it, `scared` | One office chair, spotlit, nameplate NEXT on the backrest, sign EMPTY above. Render once `chair` exists (build-requests.md); until then this pair needs the drawn chair. |

Commands (after the scene builder adds `tent` and `chair`):

```bash
node studio/tools/stills.mjs thumb channel-system/episodes/nvidia-ceo-probe --white "NVIDIA" --red "-\$430B" --t 1.5 --out channel-system/episodes/nvidia-ceo-probe/thumbnail_a.png
node studio/tools/stills.mjs thumb channel-system/episodes/nvidia-ceo-probe --white "SAME SALES" --red "-9.5%" --t 6.5 --out channel-system/episodes/nvidia-ceo-probe/thumbnail_b.png
node studio/tools/stills.mjs thumb channel-system/episodes/nvidia-ceo-probe --white "NEXT BOSS:" --red "NOBODY" --t 27 --out channel-system/episodes/nvidia-ceo-probe/thumbnail_c.png
```

Pair titles to test against each picture (the analyst picks the final wording): A "Why Is Nvidia Down Over Its CEO?"; B and C may reuse it, since each band adds a different missing word.
