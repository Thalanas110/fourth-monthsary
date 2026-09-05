import { createRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/errors/error-boundary';

import './theme.scss';
import './index.css';

createRoot(document.getElementById('root')!, {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(
  <ErrorBoundary resetKey={window.location.pathname}>
    <App />
  </ErrorBoundary>,
);
