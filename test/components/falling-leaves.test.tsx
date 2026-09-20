import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FALLING_LEAF_COUNT, FallingLeaves } from '@/components/main/falling-leaves';

describe('FallingLeaves', () => {
  it('renders the decorative leaf layer contract with a deterministic leaf set', () => {
    const markup = renderToStaticMarkup(<FallingLeaves />);

    const leafLayers = [...markup.matchAll(/<div class="hero-leaf-layer" aria-hidden="true">([\s\S]*?)<\/div>/g)];
    const leafLayerContents = leafLayers[0]?.[1] ?? '';
    const leafSpans = leafLayerContents.match(/<span class="hero-leaf"[^>]*><\/span>/g) ?? [];

    expect(leafLayers).toHaveLength(1);
    expect(leafSpans).toHaveLength(FALLING_LEAF_COUNT);
    expect(leafSpans).toHaveLength(30);
  });
});