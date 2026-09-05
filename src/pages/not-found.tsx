import sceneImage from '@/assets/scene.png';
import { AmbientField } from '@/components/main/ambient-field';
import { SiteHeader } from '@/components/main/site-header';

export default function NotFound() {
  return (
    <main className="app-shell not-found-shell" id="top" aria-labelledby="not-found-title">
      <img alt="" aria-hidden="true" className="site-background" src={sceneImage} />
      <div aria-hidden="true" className="background-veil" />
      <AmbientField />
      <div aria-hidden="true" className="grain" />
      <div className="page-content">
        <SiteHeader favoriteCount={0} homePath={import.meta.env.BASE_URL} />
        <section className="not-found-page" aria-label="Page not found">
          <div className="not-found-copy">
            <p className="not-found-eyebrow">A wrong turn in the dark</p>
            <p aria-label="Error 404" className="not-found-number">404</p>
            <h1 className="not-found-title" id="not-found-title">This page wandered off.</h1>
            <p className="not-found-copy-text">
              The words you were looking for slipped past the window. Let’s light the room again and find our way back to something meant for you.
            </p>
            <nav aria-label="Not found page actions" className="not-found-actions">
              <a className="not-found-action" href="/">Return to the lantern</a>
              <a className="not-found-action secondary" href="/#library">Find a poem</a>
            </nav>
          </div>

          <div className="not-found-lantern-stage" aria-label="A glowing lantern marking the way home" role="img">
            <span className="not-found-orbit-caption">keep looking</span>
            <span aria-hidden="true" className="not-found-missing-dot" />
            <span aria-hidden="true" className="not-found-missing-dot small" />
            <div aria-hidden="true" className="not-found-lantern">
              <span className="not-found-lantern-cap" />
              <span className="not-found-lantern-flame" />
            </div>
            <p className="not-found-stage-note">Even the lost things leave a little light behind.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
