import App from '@/App';
import PoemPage from '@/components/poems/poem-page';
import { poems } from '@/data/poems';
import { getPoemId, isHomePath, isSongsPath } from '@/lib/routes';
import NotFound from '@/pages/not-found';
import SongsPage from '@/pages/songs-page';

export interface PageRouterProps {
  basePath?: string;
  pathname: string;
}

export function PageRouter({ basePath = '/', pathname }: PageRouterProps) {
  if (isSongsPath(pathname, basePath)) return <SongsPage basePath={basePath} />;

  const poemId = getPoemId(pathname, basePath);
  if (poemId) {
    const poem = poems.find((item) => item.id === poemId);
    return poem ? <PoemPage basePath={basePath} poem={poem} /> : <NotFound />;
  }

  return isHomePath(pathname, basePath) ? <App /> : <NotFound />;
}
