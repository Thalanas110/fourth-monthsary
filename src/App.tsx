import sceneImage from '@/assets/scene.png';
import { SiteHeader } from '@/components/site-header';

export const APP_NAME = 'Poem Lantern';

export default function App() {
  return (
    <main className="app-shell" id="top">
      <img className="site-background" src={sceneImage} alt="" aria-hidden="true" />
      <div className="background-veil" aria-hidden="true" />
      <div className="page-content">
        <SiteHeader favoriteCount={0} />
      </div>
    </main>
  );
}
