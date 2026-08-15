import OpenAI from 'openai';
import {z} from 'zod';

const ScriptSchema = z.object({
  headline: z.string().min(4).max(80),
  script: z.string().min(40),
  imageQueries: z.array(z.string().min(3)).min(1).max(4),
});

export type GeneratedScript = z.infer<typeof ScriptSchema>;

export async function writeNarrationScript(input: {
  apiKey: string;
  model: string;
  title: string;
  sourceName: string;
  articleText: string;
}): Promise<GeneratedScript> {
  const client = new OpenAI({apiKey: input.apiKey});
  const completion = await client.chat.completions.create({
    model: input.model,
    response_format: {type: 'json_object'},
    temperature: 0.6,
    messages: [
      {
        role: 'system',
        content:
          'You write vertical football news shorts. Return JSON with keys headline, script, imageQueries. The script is spoken narration: 90-130 words, present tense, punchy, no hashtags, no markdown, no emoji. Headline is max 8 words. imageQueries are 2 Google image searches that will find relevant match/player/club photos.',
      },
      {
        role: 'user',
        content: JSON.stringify({
          title: input.title,
          source: input.sourceName,
          article: input.articleText.slice(0, 6000),
        }),
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error('OpenAI returned an empty narration script.');
  }
  return ScriptSchema.parse(JSON.parse(raw));
}

export async function synthesizeOnyxVoice(input: {
  apiKey: string;
  model: string;
  voice: string;
  script: string;
}): Promise<Buffer> {
  const client = new OpenAI({apiKey: input.apiKey});
  const speech = await client.audio.speech.create({
    model: input.model,
    voice: input.voice as 'onyx',
    input: input.script,
    response_format: 'mp3',
    speed: 1.05,
  });
  return Buffer.from(await speech.arrayBuffer());
}
