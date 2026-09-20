import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SongPasswordGate } from '@/components/songs/song-password-gate';

describe('SongPasswordGate', () => {
  it('renders an accessible monthsary question form', () => {
    const markup = renderToStaticMarkup(<SongPasswordGate onSubmit={() => undefined} />);

    expect(markup).toContain('data-testid="song-password-gate"');
    expect(markup).toContain('When is our monthsary?');
    expect(markup).toContain('type="password"');
    expect(markup).toMatch(/autoComplete="off"|autocomplete="off"/);
    expect(markup).toContain('for="monthsary-password"');
  });

  it('renders an inline error without exposing the configured password', () => {
    const markup = renderToStaticMarkup(
      <SongPasswordGate error="That answer is not quite right." onSubmit={() => undefined} />,
    );

    expect(markup).toContain('That answer is not quite right.');
    expect(markup).toContain('role="alert"');
    expect(markup).not.toContain('09-19');
  });
});
