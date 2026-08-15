import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {uniqueUrls} from './util';

const IMAGE_EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif',
};

export async function downloadImages(
  urls: string[],
  destDir: string,
  limit = 8,
): Promise<string[]> {
  await mkdir(destDir, {recursive: true});
  const saved: string[] = [];
  const candidates = uniqueUrls(urls);

  for (const url of candidates) {
    if (saved.length >= limit) {
      break;
    }
    try {
      const response = await fetch(url, {
        headers: {
          'user-agent':
            'Mozilla/5.0 (compatible; FootballShortsCreator/1.0)',
          accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        },
        redirect: 'follow',
      });
      if (!response.ok) {
        continue;
      }
      const contentType = response.headers.get('content-type') ?? '';
      const extension =
        IMAGE_EXTENSIONS[contentType.split(';')[0] ?? ''] ??
        (url.match(/\.(jpe?g|png|webp|avif)(\?|$)/i)?.[0]?.replace(/\?.*/, '') ||
          '.jpg');
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.byteLength < 8_000) {
        continue;
      }
      const filename = `image-${String(saved.length + 1).padStart(2, '0')}${extension}`;
      await writeFile(path.join(destDir, filename), bytes);
      saved.push(filename);
    } catch {
      continue;
    }
  }

  return saved;
}
