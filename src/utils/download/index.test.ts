import { describe, expect, it } from 'vitest';
import { patternFileName } from '.';

describe('patternFileName', () => {
  it('names the shape, the format and the paper', () => {
    expect(patternFileName('truncated-cone', 'pdf', 'a4')).toBe(
      'truncated-cone-pattern-a4.pdf',
    );
    expect(patternFileName('box', 'svg')).toBe('box-pattern.svg');
  });
});
