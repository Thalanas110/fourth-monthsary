import App from '@/App';
import NotFound from '@/pages/not-found';

export interface PageRouterProps {
  basePath?: string;
  pathname: string;
}

function normalizeBasePath(basePath: string) {
  const withLeadingSlash = basePath.startsWith('/') ? basePath : `/${basePath}`;
  const withoutTrailingSlash = withLeadingSlash.replace(/\/+$/, '');

  return withoutTrailingSlash || '/';
}

function isHomePath(pathname: string, basePath: string) {
  const normalizedBasePath = normalizeBasePath(basePath);
  const homePaths = normalizedBasePath === '/'
    ? ['/', '/index.html']
    : [normalizedBasePath, `${normalizedBasePath}/`, `${normalizedBasePath}/index.html`];

  return homePaths.includes(pathname);
}

export function PageRouter({ basePath = '/', pathname }: PageRouterProps) {
  return isHomePath(pathname, basePath) ? <App /> : <NotFound />;
}
