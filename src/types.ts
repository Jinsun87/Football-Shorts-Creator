export type Caption = {
  text: string;
  startMs: number;
  endMs: number;
};

export type ShortProps = {
  title: string;
  sourceName: string;
  sourceUrl: string;
  narrationSrc: string;
  images: string[];
  captions: Caption[];
};

export const SAMPLE_SHORT_PROPS: ShortProps = {
  title: 'Last-gasp winner stuns the league',
  sourceName: 'Sample Match Report',
  sourceUrl: 'https://example.com/football-news',
  narrationSrc: 'sample/narration.mp3',
  images: [
    'sample/pitch.svg',
    'sample/crowd.svg',
    'sample/spotlight.svg',
  ],
  captions: [
    {text: 'Stoppage time.', startMs: 0, endMs: 1800},
    {text: 'One ball into the box.', startMs: 1800, endMs: 4000},
    {text: 'The striker meets it.', startMs: 4000, endMs: 6200},
    {text: 'Net bulges. Stadium erupts.', startMs: 6200, endMs: 9000},
    {text: 'A title race rewritten in seconds.', startMs: 9000, endMs: 12000},
  ],
};
