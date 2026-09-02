import { router } from '@inertiajs/core';

let initialized = false;

function initInertiaHistory() {
  if (initialized || typeof window === 'undefined') return;

  router.init({
    initialPage: {
      component: 'PoemLantern',
      props: { errors: {} },
      url: window.location.href,
      version: null,
      clearHistory: false,
      encryptHistory: false,
      deferredProps: {},
      mergeProps: [],
      prependProps: [],
      deepMergeProps: [],
      matchPropsOn: [],
      rescuedProps: [],
      flash: {},
      rememberedState: {},
      onceProps: {},
    },
    resolveComponent: async () => () => null,
    swapComponent: async () => undefined,
  });

  initialized = true;
}

export function navigateToAnchor(href: string) {
  if (typeof window === 'undefined') return;

  const nextUrl = new URL(href, window.location.href);
  if (nextUrl.pathname !== window.location.pathname) {
    window.location.assign(nextUrl.href);
    return;
  }

  initInertiaHistory();
  router.push({
    component: 'PoemLantern',
    props: {},
    url: nextUrl.href,
    clearHistory: false,
    encryptHistory: false,
    preserveScroll: true,
    preserveState: true,
  });
}