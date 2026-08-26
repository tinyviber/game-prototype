export type Route =
  | { readonly name: 'home' }
  | { readonly name: 'game' }
  | { readonly name: 'settings'; readonly from: 'home' | 'game' };

export function readRoute(location: Pick<Location, 'pathname' | 'search'> = window.location): Route {
  const pathname = normalizePath(location.pathname);
  if (pathname === '/game') return { name: 'game' };
  if (pathname === '/settings') {
    const from = new URLSearchParams(location.search).get('from');
    return { name: 'settings', from: from === 'game' ? 'game' : 'home' };
  }
  return { name: 'home' };
}

export function navigate(path: string, replace = false): void {
  if (replace) window.history.replaceState({}, '', path);
  else window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname;
}
