# Channel identity

## Name
**Cutout Billions** (handle `@CutoutBillions`)
- "Cutout" is how the videos look: figures and places cut from paper. It also says what we do: cut the story out of the noise.
- "Billions" says big-money stories at a glance.
- Chosen by the user on 2026-11-11. The handle had no page on YouTube that day; confirm it in YouTube Studio when creating the channel.

Names we dropped, and why: Sketchy Markets (two channels called Sketch Markets and Sketching Markets already exist), Benny's Billions (many channels use the name), Penny Panels (searches return wall and quilt panels), Cutout Capital (the handle is taken, and "Capital" reads like an investment firm).

## Tagline
"Big money news, cut out and explained."

## Channel description
```
When a market crashes, a company implodes or a lawsuit lands, we cut the story out of the noise and explain what happened and what it means for your money, in cartoons.

Business news explained: billion-dollar deals, CEO scandals, stock market crashes, startups and lawsuits. New episodes every Monday and Thursday.

Every number is sourced in the description. Nothing here is financial advice.
```

## Visual identity
- Colours: mustard #E8A317 (Benny), ink navy #1B1D36, paper #F6F1E4, alarm red #E0262B, money green #1FA85B.
- Fonts: Anton (headlines, thumbnails), Inter Tight (subtitles, labels). Both OFL.
- Avatar: Benny's shocked face on a paper disc (`avatar.png`, 800×800).
- Banner: the name on an ink band inside YouTube's 1546×423 safe area, banknotes around it (`banner.png`, 2560×1440).
- The hidden piggy bank in the videos is called Penny.

Both pictures are drawn by the rig. Redraw them after a change to the cast: `node studio/tools/stills.mjs brand`.

## Channel set-up (approved 14 Nov 2026; once, then per episode)
Every change in Studio needs the user's yes each time; a session can prepare it in the built-in browser.
- **Playlists** per series: "Billion-Dollar Deals", "CEO Stories", "Crashes and Scandals". Each episode goes into one (the packager names it).
- **End screens**: every episode points to our best-matching episode plus Subscribe; when a new episode lands, the closest older one is re-pointed to it.
- **Channel trailer** for non-subscribers: a 45-60 s cut from the strongest episode's first 30 s and one skit (built like a Short with `build.mjs --short`).
- **Channel description** above, with the words people search; the channel keywords in Studio: finance news, business explained, stock market, cartoon explainer.
