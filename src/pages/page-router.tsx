import App from '@/App';
import PoemPage from '@/components/poems/poem-page';
import { poems } from '@/data/poems';
import { songs } from '@/data/songs';
import SongPage from '@/pages/song-page';
import { getPoemId, getSongId, isHomePath, isSongsIndexPath, isSongsPath } from '@/lib/routes';
import NotFound from '@/pages/not-found';
import SongsPage from '@/pages/songs-page';

export interface PageRouterProps {
  basePath?: string;
  pathname: string;
}

export function PageRouter({ basePath = '/', pathname }: PageRouterProps) {
  if (isSongsPath(pathname, basePath)) {
    if (isSongsIndexPath(pathname, basePath)) return <SongsPage basePath={basePath} />;

    const songId = getSongId(pathname, basePath);
    return <SongPage basePath={basePath} song={songs.find((item) => item.id === songId)} />;
  }

  const poemId = getPoemId(pathname, basePath);
  if (poemId) {
    const poem = poems.find((item) => item.id === poemId);
    return poem ? <PoemPage basePath={basePath} poem={poem} /> : <NotFound />;
  }

  return isHomePath(pathname, basePath) ? <App /> : <NotFound />;
}
