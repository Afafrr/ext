import assert from 'node:assert/strict';
import test from 'node:test';
import { readPageDescription } from '../lib/page-description.ts';

test('page description prefers standard metadata, falls back to Open Graph and guards navigation', () => {
  const url = 'https://example.test/page';
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const originalLocation = Object.getOwnPropertyDescriptor(globalThis, 'location');
  try {
    for (const [primary, openGraph, expected] of [
      [' Standard description ', 'Open Graph', 'Standard description'],
      ['', ' Open Graph ', 'Open Graph'],
      ['   ', 'Open Graph', 'Open Graph'],
      [undefined, 'Open Graph', 'Open Graph'],
      [undefined, undefined, undefined],
      ['', '   ', undefined],
      ['a'.repeat(3000), undefined, 'a'.repeat(2000)],
    ]) {
      Object.defineProperty(globalThis, 'location', { configurable: true, value: { href: url } });
      Object.defineProperty(globalThis, 'document', { configurable: true, value: {
        querySelector(selector: string) {
          const content = selector.includes('og:description') ? openGraph : primary;
          return content === undefined ? null : { getAttribute: () => content };
        },
      } });
      assert.equal(readPageDescription(url), expected);
      assert.equal(readPageDescription('https://example.test/other'), undefined);
    }
  } finally {
    if (originalDocument) Object.defineProperty(globalThis, 'document', originalDocument);
    else Reflect.deleteProperty(globalThis, 'document');
    if (originalLocation) Object.defineProperty(globalThis, 'location', originalLocation);
    else Reflect.deleteProperty(globalThis, 'location');
  }
});
