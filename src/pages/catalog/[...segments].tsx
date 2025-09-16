// src/pages/catalog/[...segments].tsx
import React from 'react';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import ShopPageCategory from '~/components/shop/ShopPageCategory';
import ShopPageShop from '~/components/shop/ShopPageShop';
import SitePageNotFound from '~/components/site/SitePageNotFound';
import { IShopCategory } from '~/interfaces/category';
import { shopApi } from '~/api';
import getShopPageData from '~/store/shop/shopHelpers';
import { wrapper } from '~/store/store';

type Props = {
  mode: 'products' | 'category';
  fullSlug?: string;                 // มีเมื่อ mode = 'category'
  category?: IShopCategory | null;   // มีเมื่อ mode = 'category'
};

export const getServerSideProps: GetServerSideProps<Props> =
  wrapper.getServerSideProps((store) => async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<Props>> => {
    const segments = (context.params?.segments ?? []) as string[];
    const isProducts = segments[segments.length - 1] === 'products';

    if (isProducts) {
      const categoryPath = segments.slice(0, -1).join('/');
      (context.query as any).categoryPath = categoryPath; // ให้ shopHelpers ใช้ path เต็ม
      await getShopPageData(store, context);
      return { props: { mode: 'products' } };
    }

    const fullSlug = segments.join('/'); // ไฟล์นี้มั่นใจว่ามีอย่างน้อย 1 segment
    const category = await shopApi.getCategoryByFullSlug(fullSlug, { depth: 2 }).catch(() => null);

    return { props: { mode: 'category', fullSlug, category } };
  });

export default function Page(props: Props) {
  if (props.mode === 'products') {
    return (
      <ShopPageShop
        layout="grid"
        gridLayout="grid-4-sidebar"
        sidebarPosition="start"
      />
    );
  }

  if (!props.category) return <SitePageNotFound />;

  return (
    <ShopPageCategory
      layout="columns-4-sidebar"
      category={props.category}
      subcategories={[]}  // ถ้าต้องการ subcats ที่ root ให้ทำที่ /catalog/index.tsx
    />
  );
}
