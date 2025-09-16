// react
import React, { PropsWithChildren } from 'react';
// third-party
import Link, { LinkProps } from 'next/link';
import { ParsedUrlQuery, ParsedUrlQueryInput } from 'querystring';
import {
    format as formatUrl,
    parse as parseUrl,
    Url,
    UrlObject,
} from 'url';
// application
import { baseUrl } from '~/services/utils';

export type IAppLinkHref = string | LinkProps;

type INormalizedUrlObject = Omit<UrlObject, 'query'> & {
    query: ParsedUrlQueryInput;
};

type INormalizedLinkProps = Omit<LinkProps, 'href' | 'as'> & {
    href: INormalizedUrlObject;
    as: INormalizedUrlObject;
};

export function normalizeHref(href: string | UrlObject): INormalizedUrlObject {
  const result = {
    ...(parseUrl(typeof href === 'string' ? href : formatUrl(href), true)),
  } as (Partial<Url> & { query: ParsedUrlQuery });

  delete result.host;
  delete result.href;
  delete result.path;
  delete result.search;

  result.query = result.query || {};

  return result as INormalizedUrlObject;
}

// ⬇️ เพิ่ม helper นี้
function concreteCatalogIfCatchAll(obj: INormalizedUrlObject): INormalizedUrlObject {
  const p = obj.pathname || '';
  if (p === '/catalog/[...segments]' || p === '/catalog/[[...segments]]') {
    const seg: unknown = (obj.query as any)?.segments;
    const arr = Array.isArray(seg) ? seg
              : typeof seg === 'string' ? [seg]
              : [];
    const path = arr.length ? `/catalog/${arr.join('/')}` : '/catalog';
    return normalizeHref(path);
  }
  return obj;
}

export function normalizeLinkHref(data: IAppLinkHref): INormalizedLinkProps {
  const result = typeof data === 'string' ? { href: data } : data;

  // เดิม: แปลงเป็น UrlObject ปกติ
  const hrefObj = normalizeHref(result.href);
  const asObj   = normalizeHref(result.as || result.href);

  // ⬇️ ใหม่: บังคับให้ catch-all กลายเป็น path จริงเสมอ
  const safeHref = concreteCatalogIfCatchAll(hrefObj);
  const safeAs   = concreteCatalogIfCatchAll(asObj);

  return {
    ...(result as any),
    href: safeHref,
    as: safeAs,
  };
}

type AnchorProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

interface Props extends PropsWithChildren<AnchorProps> {
    href?: IAppLinkHref;
    anchor?: boolean;
}

function AppLink(props: Props) {
    const {
        href: hrefProp,
        children,
        anchor = false,
        ...anchorProps
    } = props;
    console.log(props);
    const href = hrefProp || '/';
    const data = normalizeLinkHref(href || '');
    const isExternal = !!data.href.hostname;
    const hasPath = !!data.href.pathname;
    const onlyHash = formatUrl(data.href).startsWith('#');

    if (isExternal || anchor || onlyHash) {
        let anchorHref;

        if (!isExternal && hasPath) {
            anchorHref = baseUrl(formatUrl(data.href));
        } else {
            anchorHref = formatUrl(data.href);
        }

        return <a href={anchorHref} {...anchorProps}>{children}</a>;
    }
    console.log(data);
    console.log(anchorProps);
    
    return (
        <Link {...data}>
            <a {...anchorProps}>{children}</a>
        </Link>
    );
}

export default AppLink;
