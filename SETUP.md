# Setting up a PC for the channel (Windows)

Once per computer. Then run `node studio/tools/doctor.mjs`: it prints OK or what is still missing.

## For the user (numbered steps, one action each)
1. Install **Git for Windows** from git-scm.com (all defaults).
2. Install **Node.js 22 LTS or newer** from nodejs.org (all defaults).
3. Install **FFmpeg**: open PowerShell and run `winget install Gyan.FFmpeg`, then close and reopen PowerShell.
4. Install **Google Chrome** or keep Microsoft Edge (the frame sheets use it).
5. Install the **Claude desktop app** and sign in with the same account.
6. In the Claude app, open the Code tab, choose "Clone a repository" and pick `moonofdress-ctrl/Kadir` (branch `main`).
7. In the Claude app's built-in browser, sign in to YouTube Studio once (the session reads the numbers there itself).
8. Optional, only on the PC that voices episodes: set the user variable `ELEVENLABS_API_KEY` (Windows Settings → System → About → Advanced system settings → Environment Variables → New). Never paste the key into the chat.

## For the session (it runs these itself)
- In `studio/`: `npm install --no-save playwright-core` (uses the installed Chrome or Edge; set `CHROME_PATH` if it is elsewhere).
- The scratch voice (Kokoro through `hyperframes tts`) needs Python 3.12 with `kokoro-onnx`; point `HYPERFRAMES_PYTHON` to its `python.exe` (home PC: `C:\Users\user\AppData\Local\Programs\Python\Python312\python.exe`). Only needed for scratch voicing; the published voice is ElevenLabs.
- The rival's six frames for the quality reference are not in git (the repository is public). Copy them from the backup folder (below) into `%USERPROFILE%\.kadir\quality_reference\` (`rival_1.jpg` … `rival_6.jpg`), then `node channel-system/brand/quality-reference.mjs`.

## What is not in git, and its copy (improvement N)
Not in git: each episode's `render/` (the MP4s), `audio/` voice clips, and the rival's frames. Worktree folders are deleted when sessions are cleaned up, so after every render the session copies, with the user's yes, to one backup folder (Google Drive folder **Cutout Billions backup**, or an external disk):
- `<slug>/<slug>.mp4`, the Shorts' MP4s, the thumbnails as uploaded, `audio/` (zipped);
- `quality_reference/rival_1..6.jpg` once.
The path of the copy is written in the episode's `brief.md` (line "Backup:"). A new PC downloads only what a task needs (a re-cut, a trailer), never everything.
