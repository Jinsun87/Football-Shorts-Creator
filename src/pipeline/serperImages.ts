import {uniqueUrls} from './util';

export type SerperImage = {
  title?: string;
  imageUrl?: string;
};

export async function searchSerperImages(
  queries: string[],
  apiKey: string,
  count = 8,
): Promise<string[]> {
  const collected: string[] = [];

  for (const query of queries) {
    const response = await fetch('https://google.serper.dev/images', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: query,
        num: Math.min(10, Math.max(4, count)),
        gl: 'us',
        hl: 'en',
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Serper image search failed (${response.status}): ${body}`);
    }

    const payload = (await response.json()) as {images?: SerperImage[]};
    for (const image of payload.images ?? []) {
      if (image.imageUrl) {
        collected.push(image.imageUrl);
      }
    }
  }

  return uniqueUrls(collected).slice(0, count);
}
