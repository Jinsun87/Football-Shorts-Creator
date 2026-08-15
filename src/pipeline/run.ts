import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {captionsFromScript} from './captions';
import {downloadImages} from './downloadImages';
import {fetchArticle} from './extractArticle';
import {synthesizeOnyxVoice, writeNarrationScript} from './openai';
import {searchSerperImages} from './serperImages';
import type {ShortProps} from '../types';
import {slugify, uniqueUrls} from './util';

export type PipelineConfig = {
  url: string;
  openaiApiKey: string;
  serperApiKey?: string;
  scriptModel: string;
  ttsModel: string;
  ttsVoice: string;
  imageCount: number;
  skipRender: boolean;
  outputFile?: string;
  workspaceRoot: string;
};

const audioDurationMs = async (filePath: string): Promise<number> =>
  new Promise((resolve, reject) => {
    const proc = spawn('ffprobe', [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      filePath,
    ]);
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (chunk) => {
      stdout += String(chunk);
    });
    proc.stderr.on('data', (chunk) => {
      stderr += String(chunk);
    });
    proc.on('close', (code) => {
      const seconds = Number.parseFloat(stdout.trim());
      if (code === 0 && Number.isFinite(seconds)) {
        resolve(Math.round(seconds * 1000));
        return;
      }
      reject(new Error(stderr || 'Could not read narration duration with ffprobe.'));
    });
  });

const renderShort = async (
  propsPath: string,
  outputFile: string,
  workspaceRoot: string,
) =>
  new Promise<void>((resolve, reject) => {
    const browser =
      process.env.REMOTION_BROWSER ??
      (existsSync('/usr/local/bin/google-chrome')
        ? '/usr/local/bin/google-chrome'
        : existsSync('/usr/bin/google-chrome')
          ? '/usr/bin/google-chrome'
          : undefined);
    const proc = spawn(
      'npx',
      [
        'remotion',
        'render',
        'FootballShort',
        outputFile,
        `--props=${propsPath}`,
      ],
      {
        cwd: workspaceRoot,
        env: {
          ...process.env,
          ...(browser ? {REMOTION_BROWSER: browser} : {}),
        },
        stdio: 'inherit',
      },
    );
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`Remotion render failed with exit code ${code}`));
    });
  });

export async function createFootballShort(config: PipelineConfig): Promise<{
  props: ShortProps;
  outputFile: string | null;
  assetDir: string;
}> {
  const article = await fetchArticle(config.url);
  const generated = await writeNarrationScript({
    apiKey: config.openaiApiKey,
    model: config.scriptModel,
    title: article.title,
    sourceName: article.sourceName,
    articleText: article.text,
  });

  const serperUrls = config.serperApiKey
    ? await searchSerperImages(
        generated.imageQueries,
        config.serperApiKey,
        config.imageCount,
      )
    : [];

  const slug = `${Date.now()}-${slugify(generated.headline)}`;
  const publicRel = path.posix.join('shorts', slug);
  const assetDir = path.join(config.workspaceRoot, 'public', 'shorts', slug);
  await mkdir(assetDir, {recursive: true});

  const imageFiles = await downloadImages(
    uniqueUrls([...article.imageUrls, ...serperUrls]),
    assetDir,
    config.imageCount,
  );
  if (imageFiles.length === 0) {
    throw new Error('No usable images were downloaded from the article or Serper.');
  }

  const narrationBuffer = await synthesizeOnyxVoice({
    apiKey: config.openaiApiKey,
    model: config.ttsModel,
    voice: config.ttsVoice,
    script: generated.script,
  });
  const narrationPath = path.join(assetDir, 'narration.mp3');
  await writeFile(narrationPath, narrationBuffer);
  const durationMs = await audioDurationMs(narrationPath);

  const props: ShortProps = {
    title: generated.headline,
    sourceName: article.sourceName,
    sourceUrl: article.url,
    narrationSrc: path.posix.join(publicRel, 'narration.mp3'),
    images: imageFiles.map((file) => path.posix.join(publicRel, file)),
    captions: captionsFromScript(generated.script, durationMs),
  };

  await writeFile(path.join(assetDir, 'props.json'), JSON.stringify(props, null, 2));
  await writeFile(
    path.join(assetDir, 'script.txt'),
    `${generated.headline}\n\n${generated.script}\n`,
  );

  const outputFile =
    config.outputFile ??
    path.join(config.workspaceRoot, 'out', `${slug}.mp4`);
  if (!config.skipRender) {
    await mkdir(path.dirname(outputFile), {recursive: true});
    await renderShort(path.join(assetDir, 'props.json'), outputFile, config.workspaceRoot);
  }

  return {
    props,
    outputFile: config.skipRender ? null : outputFile,
    assetDir,
  };
}
