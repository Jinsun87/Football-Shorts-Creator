import {load} from 'cheerio';
import {hostnameFromUrl, isLikelyArticleImage, uniqueUrls} from './util';

export type ExtractedArticle = {
  url: string;
  title: string;
  sourceName: string;
  text: string;
  imageUrls: string[];
};

const resolveUrl = (value: string | undefined, base: string): string | null => {
  if (!value) {
    return null;
  }
  try {
    return new URL(value, base).toString();
  } catch {
    return null;
  }
};

export function extractArticle(html: string, url: string): ExtractedArticle {
  const $ = load(html);
  const title =
    $('meta[property="og:title"]').attr('content')?.trim() ||
    $('meta[name="twitter:title"]').attr('content')?.trim() ||
    $('h1').first().text().trim() ||
    $('title').text().trim() ||
    'Football news';

  const siteName =
    $('meta[property="og:site_name"]').attr('content')?.trim() ||
    hostnameFromUrl(url);

  const paragraphs = $('article p, main p, .article-body p, p')
    .toArray()
    .map((node) => $(node).text().replace(/\s+/g, ' ').trim())
    .filter((text) => text.length > 40);

  const text = paragraphs.slice(0, 18).join('\n\n');

  const metaImages = [
    $('meta[property="og:image"]').attr('content'),
    $('meta[name="twitter:image"]').attr('content'),
    $('link[rel="image_src"]').attr('href'),
  ];

  const bodyImages = $('article img, main img, figure img, img')
    .toArray()
    .map((node) => $(node).attr('src') || $(node).attr('data-src'))
    .slice(0, 20);

  const imageUrls = uniqueUrls(
    [...metaImages, ...bodyImages]
      .map((value) => resolveUrl(value, url))
      .filter((value): value is string => Boolean(value))
      .filter(isLikelyArticleImage),
  );

  return {
    url,
    title,
    sourceName: siteName,
    text: text || $('meta[name="description"]').attr('content')?.trim() || title,
    imageUrls,
  };
}

export async function fetchArticle(url: string): Promise<ExtractedArticle> {
  const response = await fetch(url, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (compatible; FootballShortsCreator/1.0; +https://github.com/Jinsun87/Football-Shorts-Creator)',
      accept: 'text/html,application/xhtml+xml',
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch news URL (${response.status}): ${url}`);
  }
  const html = await response.text();
  return extractArticle(html, url);
}
