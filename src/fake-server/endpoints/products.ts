// application
import { AbstractFilterBuilder } from '~/fake-server/filters/abstract-filter-builder';
import { CategoryFilterBuilder } from '~/fake-server/filters/category-filter-builder';
import { CheckFilterBuilder } from '~/fake-server/filters/check-filter-builder';
import { ColorFilterBuilder } from '~/fake-server/filters/color-filter-builder';
import { getNextReviewId, reviews } from '~/fake-server/database/reviews';
import { IProductsList, IProduct } from '~/interfaces/product';
import { IReview } from '~/interfaces/review';
import { prepareCategory } from '~/fake-server/endpoints/categories';
//import { products as dbProducts } from '~/fake-server/database/products';
import { RadioFilterBuilder } from '~/fake-server/filters/radio-filter-builder';
import { RangeFilterBuilder } from '~/fake-server/filters/range-filter-builder';
import { RatingFilterBuilder } from '~/fake-server/filters/rating-filter-builder';
import { shopCategoriesList } from '~/fake-server/database/categories';
import { VehicleFilterBuilder } from '~/fake-server/filters/vehicle-filter-builder';
import {
    clone,
    delayResponse,
    error,
    makeCursorBasedNavigation,
    makePageBasedNavigation,
} from '~/fake-server/utils';
import {
    IFilterValues,
    IListOptions,
    INavigation,
    IReviewsList,
} from '~/interfaces/list';
import {
    IAddProductReviewData,
    IGetSearchSuggestionsOptions,
    IGetSearchSuggestionsResult,
} from '~/api/base';

// ใช้ JSON ที่ export มาจาก Odoo
import exportedProducts from '~/data/products.json';
import type { IShopCategory } from '~/interfaces/category';

// ----- ชนิดข้อมูลฝั่ง export -----
type ExportedProduct = {
  name: string;
  slug: string;
  sku: string;
  price: number;
  images: string[];
  videos?: string[];
  description: string;       // เป็น HTML <p>...</p> แล้ว
  category_slugs?: string[];
};

// สร้าง id แบบคงที่จาก slug (number) ให้ระบบเดิมใช้ทำ cursor/page ได้
function hashToInt(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h) || 1;
}

// แปลง ExportedProduct -> IProduct ให้เข้ากับ UI/ฟิลเตอร์เดิม
// แปลง ExportedProduct -> IProduct ให้เข้ากับ UI/ฟิลเตอร์เดิม
const dbProducts: IProduct[] = (exportedProducts as ExportedProduct[]).map((p) => {
  // 1) หา category จาก shopCategoriesList (ตอนนี้เป็นชนิด IShopCategory & { fullSlug: string })
  const foundCats = (p.category_slugs ?? [])
    .map((slug) => shopCategoriesList.find((x) => x.slug === slug))
    .filter((x): x is NonNullable<typeof x> => !!x) as (IShopCategory & { fullSlug: string })[];

  // 2) แปลงให้เป็น IShopCategory “ปกติ” ด้วย prepareCategory (ตัด field เสริมออก)
  const categories: IShopCategory[] = foundCats.map((c) => prepareCategory(c));

  return {
    id: hashToInt(p.slug),
    name: p.name,
    excerpt: '',
    description: p.description,   // ฝั่ง Odoo แปลงเป็น <p> เรียบร้อย
    slug: p.slug,
    sku: p.sku,
    partNumber: '',
    stock: 'in-stock',
    price: p.price,
    compareAtPrice: null,
    images: p.images,
    badges: [],                   // ยังไม่ได้ใช้ → ว่างไว้
    rating: 0,
    reviews: 0,
    availability: 'in-stock',
    compatibility: 'all',
    brand: { slug: 'misc', name: 'Misc', image: '', country: 'TH' },
    type: { slug: 'default', name: 'Default', attributeGroups: [] },
    attributes: [],
    options: [],
    tags: [],
    categories,
    customFields: {},
  };
});



function getProducts(shift: number, categorySlug: string | null = null): IProduct[] {
    let shiftValue = shift;

    switch (categorySlug) {
    case 'tires-wheels':
    case 'power-tools': shiftValue += 5; break;
    case 'interior-parts':
    case 'hand-tools': shiftValue += 10; break;
    case 'engine-drivetrain':
    case 'plumbing': shiftValue += 15; break;
    default:
    }

    return [...dbProducts.slice(shiftValue), ...dbProducts.slice(0, shiftValue)];
}

export function getProductsList(
    options: IListOptions = {},
    filterValues: IFilterValues = {},
): Promise<IProductsList> {
    const filters: AbstractFilterBuilder[] = [
        new CategoryFilterBuilder('category', 'Categories'),
        new VehicleFilterBuilder('vehicle', 'Vehicle'),
        new RangeFilterBuilder('price', 'Price'),
        new CheckFilterBuilder('brand', 'Brand'),
        new RadioFilterBuilder('discount', 'With Discount'),
        new RatingFilterBuilder('rating', 'Rating'),
        new ColorFilterBuilder('color', 'Color'),
    ];

    let products = dbProducts.slice(0);

    filters.forEach((filter) => filter.makeItems(products, filterValues[filter.slug]));

    // Calculate items count for filter values.
    filters.forEach((filter) => filter.calc(filters));

    // Apply filters to products list.
    products = products.filter((product) => filters.reduce<boolean>((mr, filter) => mr && filter.test(product), true));

    const sort = options?.sort || 'default';

    // Sort items array.
    products = products.sort((a, b) => {
        if (['name_asc', 'name_desc'].includes(sort)) {
            if (a.name === b.name) {
                return 0;
            }

            return (a.name > b.name ? 1 : -1) * (sort === 'name_asc' ? 1 : -1);
        }

        return 0;
    });

    // General
    const limit = options?.limit || 16;
    let result: [IProduct[], INavigation];

    if (filterValues.category === 'interior-parts') {
        // Cursor based navigation
        result = makeCursorBasedNavigation(
            products,
            limit,
            options?.after,
            options?.before,
            (product) => product.id.toString(),
        );
    } else {
        // Page based navigation
        result = makePageBasedNavigation(products, limit, options?.page || 1);
    }

    const [items, navigation] = result;

    return delayResponse(Promise.resolve({
        items,
        sort,
        navigation,
        filters: filters.map((x) => x.build()),
    }), 350);
}

export function getProductBySlug(slug: string): Promise<IProduct> {
    const product = dbProducts.find((x) => x.slug === slug);

    if (!product) {
        return error('Page Not Found');
    }

    return Promise.resolve(clone(product));
}

export function getProductReviews(productId: number, options?: IListOptions): Promise<IReviewsList> {
    let items = reviews.slice(0);

    items.sort((a, b) => {
        if (a.date > b.date) {
            return -1;
        }
        if (a.date < b.date) {
            return 1;
        }

        return 0;
    });

    const limit = options?.limit || 8;
    const sort = options?.sort || 'default';

    // Cursor based navigation
    // const [chunk, navigation] = makeCursorBasedNavigation(
    //     items,
    //     limit,
    //     options?.after,
    //     options?.before,
    //     (review) => review.id.toString(),
    // );
    // Page based navigation
    const [chunk, navigation] = makePageBasedNavigation(items, limit, options?.page || 1);

    items = chunk;

    return Promise.resolve({
        items,
        sort,
        navigation,
    });
}

export function addProductReview(productId: number, data: IAddProductReviewData): Promise<IReview> {
    const review: IReview = {
        id: getNextReviewId(),
        date: (new Date()).toISOString().substr(0, 10),
        author: data.author,
        avatar: '/images/avatars/avatar-2.jpg',
        rating: data.rating,
        content: data.content,
    };

    reviews.push(review);

    return delayResponse(Promise.resolve(review));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getProductAnalogs(productId: number): Promise<IProduct[]> {
    const slugs: string[] = [
        'sunset-brake-kit',
        'specter-brake-kit',
        'brake-kit',
    ];
    const analogs: IProduct[] = dbProducts.filter((x) => slugs.includes(x.slug));

    return Promise.resolve(clone(analogs));
}

export function getRelatedProducts(productId: number, limit: number): Promise<IProduct[]> {
    return Promise.resolve(clone(dbProducts.slice(0, limit)));
}

export function getFeaturedProducts(categorySlug: string | null, limit: number): Promise<IProduct[]> {
    return delayResponse(Promise.resolve(clone(getProducts(0, categorySlug).slice(0, limit))), 1000);
}

export function getPopularProducts(categorySlug: string | null, limit: number): Promise<IProduct[]> {
    return delayResponse(Promise.resolve(clone(getProducts(6, categorySlug).slice(0, limit))), 1000);
}

export function getTopRatedProducts(categorySlug: string | null, limit: number): Promise<IProduct[]> {
    return delayResponse(Promise.resolve(clone(getProducts(12, categorySlug).slice(0, limit))), 1000);
}

export function getSpecialOffers(limit: number): Promise<IProduct[]> {
    return delayResponse(Promise.resolve(clone(getProducts(8).slice(0, limit))), 1000);
}

export function getLatestProducts(limit: number): Promise<IProduct[]> {
    return Promise.resolve(clone(dbProducts.slice(0, limit)));
}

export function getSearchSuggestions(
    query: string,
    options?: IGetSearchSuggestionsOptions,
): Promise<IGetSearchSuggestionsResult> {
    const queryVal = query.toLowerCase();
    const optionsVal = {
        limitProducts: 4,
        limitCategories: 4,
        ...options,
    };

    const resultProducts = dbProducts.filter((x) => x.name.toLowerCase().includes(queryVal));
    const resultCategories = shopCategoriesList.filter((x) => x.name.toLowerCase().includes(queryVal));

    return Promise.resolve({
        products: resultProducts.slice(0, optionsVal.limitProducts),
        categories: resultCategories.slice(0, optionsVal.limitCategories).map((x) => prepareCategory(x)),
    });
}
