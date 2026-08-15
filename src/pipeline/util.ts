export function hostnameFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'unknown-source';
  }
}

export function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return slug || 'football-short';
}

export function uniqueUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const url of urls) {
    const key = url.split('?')[0];
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(url);
  }
  return result;
}

export function isLikelyArticleImage(url: string): boolean {
  const lower = url.toLowerCase();
  if (lower.startsWith('data:')) {
    return false;
  }
  if (/(logo|sprite|icon|pixel|1x1|favicon|avatar|emoji)/i.test(lower)) {
    return false;
  }
  return /\.(jpe?g|png|webp|avif)(\?|$)/i.test(lower) || lower.includes('image');
}
