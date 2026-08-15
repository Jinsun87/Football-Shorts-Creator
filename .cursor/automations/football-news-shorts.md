# Cursor Automation: Football news shorts

Paste this into a new automation at [cursor.com/automations](https://cursor.com/automations).

## Trigger

Use a **webhook** (or Slack message) whose payload includes a football news URL:

```json
{
  "url": "https://www.example.com/sport/football/late-winner"
}
```

Connect this repository. Enable tools for reading the repo and running commands. Add secrets `OPENAI_API_KEY` and `SERPER_API_KEY` to the Cloud Agent environment.

## Prompt

```
You create vertical football news shorts from a news URL.

1. Read the trigger payload (webhook body, Slack message, or issue comment) and extract the football news article URL. If there is no URL, stop and say so.
2. From the repo root, copy .env.example to .env if needed, then run:
   npm install
   npm run create-short -- --url "<THE_URL>"
3. The pipeline must:
   - scrape the article title, body, and images from the news URL
   - write a 90-130 word spoken narrative
   - synthesize voiceover with OpenAI TTS using voice "onyx"
   - fetch extra images from Serper (https://google.serper.dev/images)
   - render a 1080x1920 Remotion composition named FootballShort
4. Do not commit generated files under public/shorts or out/.
5. Reply with the headline, script path, image count, and output MP4 path.
```
