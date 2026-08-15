# Football Shorts Creator

Turn a football news URL into a 9:16 short: article photos plus Serper images, an Onyx voiceover, and a Remotion edit with on-screen narrative.

## What it does

1. Fetches the article and pulls `og:image` / in-page photos.
2. Writes a ~30–45s spoken script with OpenAI.
3. Synthesizes narration with OpenAI TTS voice **onyx**.
4. Searches extra stills through the Serper Images API (`https://google.serper.dev/images`).
5. Renders `FootballShort` in Remotion (1080×1920) with Ken Burns stills, headline, and caption lower-thirds.

## Setup

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | yes | Script + Onyx TTS |
| `SERPER_API_KEY` | recommended | Extra Google images (2,500 free trial queries at [serper.dev](https://serper.dev)) |

```bash
npm install
npm run studio
```

Studio opens the sample composition. Generate a real short with:

```bash
npm run create-short -- --url "https://www.example.com/football/late-winner"
```

Skip the encode while debugging assets:

```bash
npm run create-short -- --url "https://www.example.com/football/late-winner" --skip-render
```

Output:

- `public/shorts/<id>/` — narration, stills, `props.json`, `script.txt`
- `out/<id>.mp4` — final vertical video

## Claude Code (local, no GitHub)

Open Claude Code in this folder. Put keys in `.env`. Then either:

- `/create-short https://www.example.com/football/late-winner`
- paste a news URL
- paste the prompt in [`prompts/claude-code-local.md`](prompts/claude-code-local.md)

How to share that prompt: [`.cursor/automations/football-news-shorts.md`](.cursor/automations/football-news-shorts.md)

## Stack

- Remotion composition `FootballShort` (`src/compositions/FootballShort.tsx`)
- Pipeline CLI (`src/pipeline/cli.ts`)
- OpenAI `tts-1-hd` + voice `onyx` (override with `OPENAI_TTS_MODEL` / `OPENAI_TTS_VOICE`)
