// src/patch/patchRouter.ts
import Router from 'next/router';
import type { UrlObject } from 'url';

function isCatchAllPath(p?: string) {
  return p === '/catalog/[...segments]' || p === '/catalog/[[...segments]]';
}
function segmentsFrom(u: any): string[] | null {
  if (!u) return null;
  const q = (u as UrlObject)?.query as any;
  const seg = q?.segments;
  if (Array.isArray(seg)) return seg;
  if (typeof seg === 'string') return [seg];
  return null;
}
function toCatalogPath(segs: string[] | null) {
  return segs && segs.length ? `/catalog/${segs.join('/')}` : '/catalog';
}
function normalizeUrl(url: string | UrlObject, as?: string | UrlObject) {
  // url เป็นสตริง
  if (typeof url === 'string') {
    if (isCatchAllPath(url)) {
      if (typeof as === 'string' && as.startsWith('/catalog/')) return as;
      if (as && typeof as === 'object' && typeof as.pathname === 'string') return as.pathname as string;
      return '/catalog';
    }
    return url;
  }
  // url เป็น object
  const pathname = url.pathname as string | undefined;
  if (isCatchAllPath(pathname)) {
    const seg = segmentsFrom(url);
    if (seg) return toCatalogPath(seg);
    if (typeof as === 'string' && as.startsWith('/catalog/')) return as;
    if (as && typeof as === 'object' && typeof as.pathname === 'string') return (as as UrlObject).pathname as string;
    return '/catalog';
  }
  return url;
}

(['push', 'replace', 'prefetch'] as const).forEach((m) => {
  const orig = (Router as any)[m].bind(Router);
  (Router as any)[m] = (url: string | UrlObject, as?: string | UrlObject, opts?: any) => {
    const safeUrl = normalizeUrl(url, as);
    const safeAs =
      typeof as === 'string' && isCatchAllPath(as)
        ? '/catalog'
        : (as && typeof as === 'object' && isCatchAllPath((as as UrlObject).pathname as string))
          ? '/catalog'
          : as;
    return orig(safeUrl as any, safeAs as any, opts);
  };
});
