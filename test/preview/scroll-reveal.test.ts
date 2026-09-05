import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const previewPath = new URL('../../preview/falling-leaves.html', import.meta.url);

describe('preview scroll reveal', () => {
  it('reveals each library card when it enters the viewport', () => {
    const html = readFileSync(previewPath, 'utf8');

    expect(html).toContain('.poem-card[data-reveal]');
    expect(html).toContain('.poem-card[data-reveal].is-visible');
    expect(html).toContain('new IntersectionObserver');
    expect(html).toContain("card.classList.add('is-visible')");
  });

  it('keeps cards immediately visible when reduced motion is preferred', () => {
    const html = readFileSync(previewPath, 'utf8');

    expect(html).toContain('@media (prefers-reduced-motion: reduce)');
    expect(html).toContain('.poem-card[data-reveal] { opacity: 1; transform: none; transition: none; }');
  });
});
