import { useEffect, useState } from 'react';

export const TOAST_DURATION_MS = 2200;

export function useToastMessage(durationMs = TOAST_DURATION_MS) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(''), durationMs);
    return () => window.clearTimeout(timeout);
  }, [durationMs, message]);

  return { message, show: setMessage };
}
