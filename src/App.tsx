import sceneImage from '@/assets/scene.png';

export const APP_NAME = 'Poem Lantern';

export default function App() {
  return (
    <main className="app-shell" id="top">
      <img className="site-background" src={sceneImage} alt="" aria-hidden="true" />
      <div className="background-veil" aria-hidden="true" />
      <div className="page-content" />
    </main>
  );
}
