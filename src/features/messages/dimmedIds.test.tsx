/**
 * NO id anywhere in the UI may be dimmed by an opacity modifier.
 *
 * Franco reported only the message numbers, but commit 7613ded ("Show IDs on
 * journals/messages") applied the same `text-text-tertiary/50` to both — a 2.08:1
 * contrast ratio, below WCAG's 3.0 floor for even large text. Fixing only the
 * reported one leaves the identical bug a single grep away, which is how a fix comes
 * to be incomplete in a way that presents as finished.
 *
 * This is a source assertion rather than a render test deliberately: it catches the
 * NEXT id someone adds with a dimmed class, in a feature that does not exist yet.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const sources = walk('src').filter(
  (f) => (f.endsWith('.tsx') || f.endsWith('.ts')) && !f.includes('.test.')
);

describe('no dimmed identifiers', () => {
  it('CONTROL: the scan actually reads source files', () => {
    // Without this, an empty file list would make the assertion below pass by
    // scanning nothing — a clean run indistinguishable from a blind one.
    expect(sources.length).toBeGreaterThan(10);
    expect(sources.some((f) => f.includes('MessageCard'))).toBe(true);
  });

  it('CONTROL: the matcher detects a planted dimmed id', () => {
    const planted = '<div className="text-xs text-text-tertiary/50">#{thing.id}</div>';
    expect(/text-text-\w+\/\d{1,2}\b/.test(planted)).toBe(true);
  });

  it('renders no id with a reduced-opacity text colour', () => {
    const offenders: string[] = [];
    for (const file of sources) {
      const lines = readFileSync(file, 'utf8').split('\n');
      lines.forEach((line, i) => {
        if (line.trimStart().startsWith('*') || line.trimStart().startsWith('//')) return;
        if (!/text-text-\w+\/\d{1,2}\b/.test(line)) return;
        // Only flag it when the element is rendering an id.
        const near = lines.slice(i, i + 3).join(' ');
        if (/#\{[^}]*\bid\b[^}]*\}/.test(near)) {
          offenders.push(`${file}:${i + 1}`);
        }
      });
    }
    expect(offenders, `dimmed ids found: ${offenders.join(', ')}`).toEqual([]);
  });
});
