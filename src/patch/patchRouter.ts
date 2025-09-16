// src/patch/patchRouter.ts
import Router from 'next/router';
import type { UrlObject } from 'url';

type AnyUrl = string | UrlObject;

if (typeof window !== 'undefined') {
  const isCatchAllPath = (p?: string) =>
    p === '/catalog/[...segments]' || p === '/catalog/[[...segments]]';

  const segmentsFrom = (u?: AnyUrl): string[] | null => {
    if (!u || typeof u === 'string') return null;
    const q = (u as any)?.query as any;        // ⬅️ cast ก่อนค่อยอ่าน
    const seg = q?.segments as unknown;
    if (Array.isArray(seg)) return seg as string[];
    if (typeof seg === 'string') return [seg];
    return null;
    // ปล่อยกรณีอื่นให้เป็น null
  };

  const toCatalogPath = (segs: string[] | null) =>
    segs && segs.length ? `/catalog/${segs.join('/')}` : '/catalog';

  const normalizeUrl = (url: AnyUrl, as?: AnyUrl): AnyUrl => {
    if (typeof url === 'string') {
      if (isCatchAllPath(url)) {
        if (typeof as === 'string' && as.startsWith('/catalog/')) return as;
        if (as && typeof as === 'object' && typeof (as as UrlObject).pathname === 'string') {
          return (as as UrlObject).pathname as string;
        }
        return '/catalog';
      }
      return url;
    }
    const pathname = (url as UrlObject).pathname as string | undefined;
    if (isCatchAllPath(pathname)) {
      const segs = segmentsFrom(url);
      if (segs) return toCatalogPath(segs);
      if (typeof as === 'string' && as.startsWith('/catalog/')) return as;
      if (as && typeof as === 'object' && typeof (as as UrlObject).pathname === 'string') {
        return (as as UrlObject).pathname as string;
      }
      return '/catalog';
    }
    return url;
  };

  (['push', 'replace', 'prefetch'] as const).forEach((m) => {
    const orig = (Router as any)[m].bind(Router);
    (Router as any)[m] = (url: AnyUrl, as?: AnyUrl, opts?: any) => {
      const safeUrl = normalizeUrl(url, as);

      let safeAs: AnyUrl | undefined = as;
      if (typeof safeAs === 'string' && isCatchAllPath(safeAs)) {
        safeAs = '/catalog';
      } else if (
        safeAs &&
        typeof safeAs === 'object' &&
        isCatchAllPath((safeAs as UrlObject).pathname as string)
      ) {
        safeAs = '/catalog';
      }

      return orig(safeUrl as any, safeAs as any, opts);
    };
  });
}
