import {describe, expect, it} from 'vitest';
import {isLikelyArticleImage, slugify, uniqueUrls} from './util';

describe('pipeline helpers', () => {
  it('keeps unique image urls and drops tracking pixels', () => {
    expect(
      uniqueUrls([
        'https://cdn.example.com/a.jpg?w=800',
        'https://cdn.example.com/a.jpg?w=1200',
        'https://cdn.example.com/b.png',
      ]),
    ).toEqual([
      'https://cdn.example.com/a.jpg?w=800',
      'https://cdn.example.com/b.png',
    ]);
    expect(isLikelyArticleImage('https://cdn.example.com/logo-icon.png')).toBe(false);
    expect(isLikelyArticleImage('https://cdn.example.com/match-winner.jpg')).toBe(true);
    expect(slugify('United snatch late derby win!')).toBe('united-snatch-late-derby-win');
  });
});
