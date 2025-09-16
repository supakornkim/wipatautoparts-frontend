/* eslint-disable @typescript-eslint/no-unused-vars */

// application
import { IAddress } from '~/interfaces/address';
import { IAppLinkHref } from '~/components/shared/AppLink';
import { IBrand } from '~/interfaces/brand';
import { ICategory, IShopCategory } from '~/interfaces/category';
import { IOrder } from '~/interfaces/order';
import { IPost } from '~/interfaces/post';
import { IProduct } from '~/interfaces/product';

// ช่วยคำนวณ fullSlug จาก parent chain ถ้า object ยังไม่มี field fullSlug
function buildFullSlug(cat: IShopCategory): string {
  // @ts-ignore
  if ((cat as any).fullSlug) return (cat as any).fullSlug as string;
  const parts: string[] = [];
  let cur: IShopCategory | null = cat;
  while (cur) {
    parts.unshift(cur.slug);
    // @ts-ignore
    cur = (cur.parent as IShopCategory | null) || null;
  }
  return parts.join('/');
}



const url = {
    // common
    home: () => '/',
    category: (category: ICategory): IAppLinkHref => {
        if (category.type === 'shop') {
            return url.shopCategory(category);
        }

        return '/';
    },

    // shop pages
    shop: () => '/catalog',
    // helper: สร้าง fullSlug จาก parent chain ถ้า object ไม่มี fullSlug

    shopCategory: (category: IShopCategory): IAppLinkHref => {
        const full = buildFullSlug(category);                // ex. filters/cabin-filter/japanese-cars
        const wantProducts = category.layout === 'products'; // ถ้าอยากพาไป /products
        const path = `/catalog/${full}${wantProducts ? '/products' : ''}`;

        // เลือกอย่างใดอย่างหนึ่งตาม type ของ IAppLinkHref:
        // 1) ถ้า IAppLinkHref รองรับ string:
        // return path;

        // 2) ถ้าต้องคืน object:
        return path;
    },



    products: ({ filters }: { filters?: Record<string, string> } = {}): IAppLinkHref => {
        // ถ้าไม่มี query ก็คืน string ตรง ๆ ไปเลย
        if (!filters || Object.keys(filters).length === 0) return '/catalog/products';
        // ถ้ามี query ให้คืน object (ปกติของ Next)
        return {
        href: {
            pathname: '/catalog/products',
            query: { ...filters },
        },
        };
    },
    product: (product: IProduct): IAppLinkHref => ({
        href: `/products/[slug]?slug=${product.slug}`,
        as: `/products/${product.slug}`,
    }),
    brand: (brand: IBrand) => '/',
    cart: () => '/cart',
    checkout: () => '/cart/checkout',
    checkoutSuccess: (order: IOrder): IAppLinkHref => ({
        href: `/cart/checkout/[token]?token=${order.token}`,
        as: `/cart/checkout/${order.token}`,
    }),
    wishlist: () => '/wishlist',
    compare: () => '/compare',
    trackOrder: () => '/track-order',

    // blog pages
    blog: () => '/demo/blog/classic-right-sidebar',
    post: (post: IPost) => '/demo/blog/post-full-width',

    // auth pages
    signIn: () => '/account/login',
    signUp: () => '/',
    passwordRecovery: () => '/',

    // account pages
    accountDashboard: (): IAppLinkHref => '/account/dashboard',
    accountGarage: () => '/account/garage',
    accountProfile: () => '/account/profile',
    accountPassword: () => '/account/password',
    accountOrders: () => '/account/orders',
    accountOrderView: (order: Partial<IOrder>): IAppLinkHref => ({
        href: `/account/orders/[id]?id=${order.id}`,
        as: `/account/orders/${order.id}`,
    }),
    accountAddresses: () => '/account/addresses',
    accountAddressNew: (): IAppLinkHref => ({
        href: '/account/addresses/[id]?id=new',
        as: '/account/addresses/new',
    }),
    accountAddressEdit: (address: IAddress): IAppLinkHref => ({
        href: `/account/addresses/[id]?id=${address.id}`,
        as: `/account/addresses/${address.id}`,
    }),

    // site pages
    pageAboutUs: () => '/about-us',
    pageContactUs: () => '/contact-us',
    pageStoreLocation: () => '/',
    pageTerms: () => '/terms',
};

export default url;
