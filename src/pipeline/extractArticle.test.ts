import {describe, expect, it} from 'vitest';
import {extractArticle} from './extractArticle';

const html = `
<!doctype html>
<html>
  <head>
    <title>Ignore this</title>
    <meta property="og:title" content="United snatch late derby win" />
    <meta property="og:site_name" content="MatchDay" />
    <meta property="og:image" content="https://cdn.example.com/photos/winner.jpg" />
    <meta name="twitter:image" content="/photos/crowd.png" />
  </head>
  <body>
    <article>
      <h1>United snatch late derby win</h1>
      <img src="/logo.svg" alt="logo" />
      <img src="https://cdn.example.com/photos/striker.webp" />
      <p>In the 94th minute, the visiting striker rose above the defence and headed home a dramatic winner that sent the away end into delirium.</p>
      <p>The goal changes the title picture and leaves the hosts searching for answers after a match they dominated for long stretches.</p>
    </article>
  </body>
</html>
`;

describe('extractArticle', () => {
  it('reads title, copy, and article photos from a football news page', () => {
    const article = extractArticle(html, 'https://www.matchday.example/news/derby');

    expect(article.title).toBe('United snatch late derby win');
    expect(article.sourceName).toBe('MatchDay');
    expect(article.text).toContain('94th minute');
    expect(article.imageUrls).toEqual([
      'https://cdn.example.com/photos/winner.jpg',
      'https://www.matchday.example/photos/crowd.png',
      'https://cdn.example.com/photos/striker.webp',
    ]);
  });
});
