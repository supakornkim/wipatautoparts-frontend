// src/fake-server/endpoints/categories.ts

// application
import {
  blogCategoriesTree,
  shopCategoriesList,
  shopCategoriesTree,
  // ⬇️ เพิ่ม import ดัชนีค้นหาด้วย fullSlug
  shopCategoriesByFullSlug,
} from '~/fake-server/database/categories';
import { clone, error } from '~/fake-server/utils';
import { IBaseCategory, IBlogCategory, IShopCategory } from '~/interfaces/category';
import { IGetBlogCategoriesOptions, IGetCategoriesOptions, IGetCategoryBySlugOptions } from '~/api/base';

export function prepareCategory<T extends IBaseCategory>(category: T, depth?: number): T {
  let children;
  if (depth && depth > 0) {
    children = (category.children || []).map((x) => prepareCategory(x as any, depth - 1));
  }

  let parent;
  // ใช้ any เล็กน้อยเพื่อหลีกเลี่ยง type recursion
  const c: any = category;
  if (c.parent) {
    parent = prepareCategory(c.parent);
  } else if (c.parent === null) {
    parent = null;
  }

  return JSON.parse(JSON.stringify({
    ...category,
    parent,
    children,
  }));
}

// ✅ ใหม่: ค้นหมวดด้วย fullSlug (รองรับหลายชั้น)
export function getCategoryByFullSlug(fullSlug: string, options?: IGetCategoryBySlugOptions): Promise<IShopCategory> {
  const optionsValue = options || {};
  const category = shopCategoriesByFullSlug.get(fullSlug);
  if (!category) return error('Page Not Found');
  return Promise.resolve(prepareCategory(category as any, optionsValue.depth));
}

// เดิม: ค้นด้วย slug เดี่ยว (ยังคงไว้เพื่อ compatibility)
export function getCategoryBySlug(slug: string, options?: IGetCategoryBySlugOptions): Promise<IShopCategory> {
  const optionsValue = options || {};
  const category = shopCategoriesList.find((x) => x.slug === slug);
  if (!category) {
    return error('Page Not Found');
  }
  return Promise.resolve(prepareCategory(category as any, optionsValue.depth));
}

export function getCategories(options?: IGetCategoriesOptions): Promise<IShopCategory[]> {
  let categories = shopCategoriesTree.slice(0) as any[];
  const depth = options?.depth || 0;
  const optionParent = options?.parent;
  const optionSlugs = options?.slugs;

  if (optionParent) {
    const parent = shopCategoriesList.find((x) => x.slug === optionParent.slug) as any;
    if (parent) {
      categories = parent.children || [];
    }
  } else if (optionSlugs) {
    categories = shopCategoriesList.filter((x) => optionSlugs.includes(x.slug));
  }

  categories = categories.map((x) => prepareCategory(x as any, depth));
  return Promise.resolve(clone(categories as any));
}

export function getBlogCategories(options: IGetBlogCategoriesOptions): Promise<IBlogCategory[]> {
  let categories = blogCategoriesTree.slice(0) as any[];
  const depth = options?.depth || 0;
  categories = categories.map((x) => prepareCategory(x as any, depth));
  return Promise.resolve(clone(categories as any));
}
