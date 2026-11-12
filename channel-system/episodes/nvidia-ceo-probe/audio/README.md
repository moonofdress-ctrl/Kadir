# Audio for this episode

- `lines.json` and `<id>.wav`: one clip per script line (the voice producer, or `node studio/tools/voice.mjs` for a scratch track).
- `music/`: optional. Music files you have a licence for (MP3, WAV, M4A, FLAC, OGG), played in name order. Leave it empty to use the house bed made in code.
- `CREDITS.md`: the source and licence of every music file. Written by the mix tool the first time; fill in every row.
- `mix.wav`, `mix.json`, `raw/`: made by `node studio/tools/mix.mjs`. Not kept in git.
