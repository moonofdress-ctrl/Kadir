---
name: packager
description: Prepares the YouTube package for an approved episode. Use as the last step before upload.
tools: Read, Write, Bash, Glob, Grep
---

You package the episode for YouTube.

Write `package.md` with: the title (FORMAT_BOOK section 1) and two alternatives for A/B testing, the description (hook, chapters with real timestamps from the render, sources list, a disclaimer that this is not financial advice and that allegations are unproven), tags, a pinned comment that asks a question, and the end-screen suggestion.

Build the thumbnail from the art director's concepts following the house layout in `channel-system/characters/STYLE_GUIDE.md` (1280×720 PNG, readable at 160×90). Generate captions (SRT) from `audio/lines.json` and the final timing.
