// src/patch/patchRouter.ts
import Router from 'next/router';
import type { UrlObject } from 'url';

if (typeof window !== 'undefined') {
  const isCatchAll = (p?: string) => p === '/catalog/[...segments]' || p === '/catalog/[[...segments]]';
  const segsFrom = (u: any): string[] | null => {
    const seg = (u as UrlObject)?.query?.segments;
    if (Array.isArray(seg)) return seg;
    if (typeof seg === 'string') return [seg];
    return null;
  };
  const toCatalogPath = (segs: string[] | null) => (segs && segs.length ? `/catalog/${segs.join('/')}` : '/catalog');

  const normalize = (url: string | UrlObject, as?: string | UrlObject) => {
    if (typeof url === 'string') {
      if (isCatchAll(url)) {
        if (typeof as === 'string' && as.startsWith('/catalog/')) return as;
        if (as && typeof as === 'object' && typeof (as as UrlObject).pathname === 'string') return (as as UrlObject).pathname as string;
        return '/catalog';
      }
      return url;
    }
    const pathname = url.pathname as string | undefined;
    if (isCatchAll(pathname)) {
      const seg = segsFrom(url);
      if (seg) return toCatalogPath(seg);
      if (typeof as === 'string' && as.startsWith('/catalog/')) return as;
      if (as && typeof as === 'object' && typeof (as as UrlObject).pathname === 'string') return (as as UrlObject).pathname as string;
      return '/catalog';
    }
    return url;
  };

  (['push', 'replace', 'prefetch'] as const).forEach((m) => {
    const orig = (Router as any)[m].bind(Router);
    (Router as any)[m] = (url: string | UrlObject, as?: string | UrlObject, opts?: any) => {
      const safeUrl = normalize(url, as);
      const safeAs =
        typeof as === 'string' && isCatchAll(as)
          ? '/catalog'
          : (as && typeof as === 'object' && isCatchAll((as as UrlObject).pathname as string))
            ? '/catalog'
            : as;
      return orig(safeUrl as any, safeAs as any, opts);
    };
  });
}
