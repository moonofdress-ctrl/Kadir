# Thumbnail concepts

Three pairs, three reasons to click (FORMAT_BOOK 15). A is the scene of the first shot; B and C are moments from the first 30 seconds. Each is a moment frozen while something happens.

| Pair | Reason to click | Shot id and time | Band (white subject + red figure, 0-5 words, not the title) | Character and emotion | What is happening |
|---|---|---|---|---|---|
| A (first frame) | Consequence: a huge loss happened to a giant | c1s01, 0:00-0:03 | white `NVIDIA` + red `-$430B` (two-day fall only, confirmed in brief.md; not the after-hours move) | The NVIDIA chip on top of the tent pole, `panic`, gloves up | Dusk; a smaller striped big top set low (pole tip at mid-frame, so the band clears the chip) with one centre pole, the chip clings to the tip while tiny savers below (Benny with a red phone, Martha with a bill) look up. Counter rolling to -$430B in the top right. |
| B | Contrast: two things that should not be true together | c1s01b, 0:04-0:08 | white `SAME SALES` + red `-9.5%` (the two-day fall, said in CH5) | The NVIDIA chip, `confused`, shrug, holding a tag SAME | A chip warehouse: crates marked CHIPS still riding out, a sign CHIP SALES: NO DROP REPORTED (lowered to clear the band), the chip shrugging at the camera as the crates roll past. |
| C | Open question: who sits here? (the picture asks; the band only says what the script says) | c9s54, 12:45 (12:39-12:45; outside the first 30 s, because the chair is drawn as a single frame only here; the 0:24 chair is one panel of the three-panel c1s05) | white `ONE` + red `EMPTY CHAIR` (the script's own words: "One empty chair." in the opening, and "Investors have now seen the empty chair" in CH9; no successor claim) | The NVIDIA chip beside the chair, `scared`, looking up at it | One office chair, spotlit, nameplate NEXT on the backrest, nobody in it; the card AS OF WED 11 NOV, NIGHT: NOBODY NAMED sits under the band. |

Commands:

```bash
node studio/tools/stills.mjs thumb channel-system/episodes/nvidia-ceo-probe --white "NVIDIA" --red "-\$430B" --t 1.5 --out channel-system/episodes/nvidia-ceo-probe/images/thumbnail_a.png
node studio/tools/stills.mjs thumb channel-system/episodes/nvidia-ceo-probe --white "SAME SALES" --red "-9.5%" --t 6.5 --out channel-system/episodes/nvidia-ceo-probe/images/thumbnail_b.png
node studio/tools/stills.mjs thumb channel-system/episodes/nvidia-ceo-probe --white "ONE" --red "EMPTY CHAIR" --t 765 --out channel-system/episodes/nvidia-ceo-probe/images/thumbnail_c.png
```

Pair titles to test against each picture (the analyst picks the final wording): A "Why Is Nvidia Down Over Its CEO?"; B and C may reuse it, since each band adds a different missing word.

## Painted thumbnails (12 Nov 2026, evening)

The user found thumbnail A too weak beside other channels: a wide shot with small figures. Two painted versions of the same first-shot scene, one large face each, generated with FLUX and banded with `stills.mjs thumb --image`: `images/thumbnail_chip.png` (the chip in panic on the cracking pole; art in `art_chip.png`) and `images/thumbnail_benny.png` (Benny with the red phone, the chip on the snapping pole behind; art in `art_benny.png`). Band unchanged: NVIDIA -$430B. Both show only what the video's first shot shows; no real person. Checked by the user before upload.
