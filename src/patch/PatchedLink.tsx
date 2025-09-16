// src/patch/PatchedLink.tsx
import React from 'react';
// ใช้ internal path เพื่อหลบ alias ตัวเอง
import NextLink from 'next/dist/client/link';
import type { UrlObject } from 'url';

type MinimalLinkProps = {
  href: string | UrlObject;
  as?: string | UrlObject;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  prefetch?: boolean;
  locale?: string | false;
  legacyBehavior?: boolean;
  onMouseEnter?: React.MouseEventHandler;
  onTouchStart?: React.TouchEventHandler;
  onClick?: React.MouseEventHandler;
  children: React.ReactNode;
};

function isCatchAll(path?: string) {
  return path === '/catalog/[...segments]' || path === '/catalog/[[...segments]]';
}

function segsFrom(obj?: UrlObject | string): string[] | null {
  if (!obj || typeof obj === 'string') return null;
  // @ts-ignore
  const seg = obj.query?.segments as unknown;
  if (Array.isArray(seg)) return seg;
  if (typeof seg === 'string') return [seg];
  return null;
}

function toCatalogPath(segs: string[] | null) {
  return segs && segs.length ? `/catalog/${segs.join('/')}` : '/catalog';
}

function normalizeHref(href: MinimalLinkProps['href'], as?: MinimalLinkProps['as']) {
  if (typeof href === 'string') {
    if (isCatchAll(href)) {
      if (typeof as === 'string' && as.startsWith('/catalog/')) return as;
      return '/catalog';
    }
    return href;
  }
  const pathname = href.pathname as string | undefined;
  if (isCatchAll(pathname)) {
    const seg = segsFrom(href);
    if (seg) return toCatalogPath(seg);
    if (typeof as === 'string' && as.startsWith('/catalog/')) return as;
    if (as && typeof as === 'object' && typeof as.pathname === 'string') return as.pathname as string;
    return '/catalog';
  }
  return href;
}

function isCatchAll(p?: string) {
  return p === '/catalog/[...segments]' || p === '/catalog/[[...segments]]';
}

export default function PatchedLink(props: MinimalLinkProps) {
  const { href, as, children, ...rest } = props;
  const safeHref = normalizeHref(href, as);
  const safeAs =
    typeof as === 'string' && isCatchAll(as)
      ? '/catalog'
      : as;
  // @ts-ignore

  if (isCatchAll(hPath) || isCatchAll(aPath)) {
      // eslint-disable-next-line no-console
      console.warn('[PatchedLink] catch-all link', { href, as, stack: new Error().stack });
    }
  
  return <NextLink href={safeHref} as={safeAs} {...rest}>{children}</NextLink>;
}
