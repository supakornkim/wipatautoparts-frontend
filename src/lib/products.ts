import { ExportedProduct } from './types';

export async function getProducts(): Promise<ExportedProduct[]> {
  // import JSON จาก repo (bundle มากับ build)
  const list = (await import('@/data/products.json')).default as ExportedProduct[];
  return list;
}

export async function getProduct(slug: string) {
  const list = await getProducts();
  return list.find(p => p.slug === slug);
}

export async function getCategories() {
  const list = await getProducts();
  const set = new Set(list.flatMap(p => p.category_slugs ?? []));
  return Array.from(set).sort();
}
