export function normalizeBasePath(basePath: string) {
  const withLeadingSlash = basePath.startsWith('/') ? basePath : `/${basePath}`;
  const withoutTrailingSlash = withLeadingSlash.replace(/\/+$/, '');

  return withoutTrailingSlash || '/';
}

export function getHomePath(basePath = '/') {
  const normalizedBasePath = normalizeBasePath(basePath);

  return normalizedBasePath === '/' ? '/' : `${normalizedBasePath}/`;
}

export function getLibraryPath(basePath = '/') {
  return `${getHomePath(basePath)}#library`;
}

export function getPoemPath(id: string, basePath = '/') {
  return `${getHomePath(basePath)}poems/${encodeURIComponent(id)}`;
}

export function getPoemId(pathname: string, basePath = '/') {
  const homePath = getHomePath(basePath);
  if (!pathname.startsWith(homePath)) return null;

  const relativePath = pathname.slice(homePath.length);
  const match = relativePath.match(/^poems\/([^/]+)\/?$/);
  if (!match) return null;

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

export function isHomePath(pathname: string, basePath = '/') {
  const normalizedBasePath = normalizeBasePath(basePath);
  const homePaths = normalizedBasePath === '/'
    ? ['/', '/index.html']
    : [normalizedBasePath, `${normalizedBasePath}/`, `${normalizedBasePath}/index.html`];

  return homePaths.includes(pathname);
}
