import App from '@/App';
import PoemPage from '@/components/poems/poem-page';
import { poems } from '@/data/poems';
import { getPoemId, isHomePath } from '@/lib/routes';
import NotFound from '@/pages/not-found';

export interface PageRouterProps {
  basePath?: string;
  pathname: string;
}

export function PageRouter({ basePath = '/', pathname }: PageRouterProps) {
  const poemId = getPoemId(pathname, basePath);
  if (poemId) {
    const poem = poems.find((item) => item.id === poemId);
    return poem ? <PoemPage basePath={basePath} poem={poem} /> : <NotFound />;
  }

  return isHomePath(pathname, basePath) ? <App /> : <NotFound />;
}
