import 'dotenv/config';
import path from 'node:path';
import {createFootballShort} from './run';

const arg = (name: string): string | undefined => {
  const index = process.argv.findIndex((value) => value === `--${name}` || value.startsWith(`--${name}=`));
  if (index === -1) {
    return undefined;
  }
  const current = process.argv[index];
  if (current.includes('=')) {
    return current.slice(current.indexOf('=') + 1);
  }
  return process.argv[index + 1];
};

const url = arg('url') ?? process.env.NEWS_URL;
if (!url) {
  console.error('Usage: npm run create-short -- --url "https://example.com/football-story"');
  process.exit(1);
}

const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
  console.error('OPENAI_API_KEY is required for script writing and Onyx TTS.');
  process.exit(1);
}

const result = await createFootballShort({
  url,
  openaiApiKey,
  serperApiKey: process.env.SERPER_API_KEY,
  scriptModel: process.env.OPENAI_SCRIPT_MODEL ?? 'gpt-4o-mini',
  ttsModel: process.env.OPENAI_TTS_MODEL ?? 'tts-1-hd',
  ttsVoice: process.env.OPENAI_TTS_VOICE ?? 'onyx',
  imageCount: Number(process.env.SERPER_IMAGE_COUNT ?? 8),
  skipRender: process.argv.includes('--skip-render'),
  outputFile: arg('out'),
  workspaceRoot: path.resolve(process.cwd()),
});

console.log(JSON.stringify({
  title: result.props.title,
  source: result.props.sourceName,
  images: result.props.images.length,
  captions: result.props.captions.length,
  output: result.outputFile,
  assets: result.assetDir,
}, null, 2));
