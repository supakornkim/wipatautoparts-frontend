export interface ExportedProduct {
  name: string;
  slug: string;
  sku: string;
  price: number;
  images: string[];
  videos: string[];
  description: string;
  category_slugs?: string[];
}