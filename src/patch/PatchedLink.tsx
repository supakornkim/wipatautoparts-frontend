// src/patch/PatchedLink.tsx
import React from 'react';
// นำเข้า "Link ของ Next ตัวจริง" จาก internal path เพื่อเลี่ยง alias วน
// (อย่าใช้ 'next/link' ที่นี่ ไม่งั้นจะชี้กลับมาหาไฟล์นี้เอง)
import NextLink from 'next/dist/client/link';
import type { UrlObject } from 'url';

// ชนิดขั้นต่ำสุดที่เราต้องใช้ (ลดการพึ่งพา type จาก 'next/link' เพื่อไม่เจอ alias)
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

function segmentsFrom(obj?: UrlObject | string): string[] | null {
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
  // href เป็น string
  if (typeof href === 'string') {
    if (isCatchAll(href)) {
      if (typeof as === 'string' && as.startsWith('/catalog/')) return as;
      return '/catalog';
    }
    return href;
  }

  // href เป็น UrlObject
  const pathname = href.pathname as string | undefined;
  if (isCatchAll(pathname)) {
    const seg = segmentsFrom(href);
    if (seg) return toCatalogPath(seg);
    if (typeof as === 'string' && as.startsWith('/catalog/')) return as;
    if (as && typeof as === 'object' && typeof as.pathname === 'string') return as.pathname as string;
    return '/catalog';
  }

  return href;
}

export default function PatchedLink(props: MinimalLinkProps) {
  const { href, as, children, ...rest } = props;
  const safeHref = normalizeHref(href, as);
  const safeAs =
    typeof as === 'string' && isCatchAll(as)
      ? '/catalog'
      : as;

  // ส่งต่อให้ Link ของ Next ตัวจริง
  // @ts-ignore
  return <NextLink href={safeHref} as={safeAs} {...rest}>{children}</NextLink>;
}
