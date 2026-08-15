# Football Shorts Creator — local Claude Code

This repo turns a football news URL into a 9:16 Remotion short with OpenAI TTS voice **onyx** and Serper stills.

## Default job

When the user pastes a news URL (or `/create-short <url>`), run the local pipeline. Do not use GitHub, PRs, Actions, webhooks, or remotes.

```bash
npm run create-short -- --url "<URL>"
```

Editor is Remotion composition `FootballShort`. Voice is `onyx`. Do not rebuild the pipeline unless it is broken.

## Local setup

- Keys live in gitignored `.env` (`OPENAI_API_KEY`, `SERPER_API_KEY`). Copy from `.env.example` if missing; never print keys.
- Node 22. If `node_modules` is missing: `npm install`.
- Preview: `npm run studio`. Sample-only assets are `public/sample/`.

## Do not

- Commit `.env`, `public/shorts/`, or `out/*.mp4`
- Push, open PRs, or call `gh`
- Swap Remotion for FFmpeg/MoviePy/After Effects
- Invent match facts that are not in the article
