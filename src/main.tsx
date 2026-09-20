import { createRoot } from 'react-dom/client';

import { ErrorBoundary } from '@/components/errors/error-boundary';
import { SplashScreen } from '@/components/main/splash-screen';
import { PageRouter } from '@/pages/page-router';

import './theme.scss';
import './index.css';

createRoot(document.getElementById('root')!, {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(
  <ErrorBoundary resetKey={window.location.pathname}>
    <SplashScreen />
    <PageRouter basePath={import.meta.env.BASE_URL} pathname={window.location.pathname} />
  </ErrorBoundary>,
);
