import {describe, expect, it} from 'vitest';
import {captionsFromScript} from './captions';

describe('captionsFromScript', () => {
  it('splits narration into timed lower-thirds that cover the full voiceover', () => {
    const script =
      'Stoppage time drama as the striker heads home a late winner and the title race flips.';
    const captions = captionsFromScript(script, 10_000, 4);

    expect(captions.length).toBeGreaterThan(1);
    expect(captions[0]?.startMs).toBe(0);
    expect(captions.at(-1)?.endMs).toBe(10_000);
    expect(captions.map((caption) => caption.text).join(' ')).toBe(script);
    for (let index = 1; index < captions.length; index += 1) {
      expect(captions[index]?.startMs).toBe(captions[index - 1]?.endMs);
    }
  });
});
