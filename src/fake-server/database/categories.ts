// src/fake-server/database/categories.ts

// application
import { ICategoryDef } from '~/fake-server/interfaces/category-def';
import { makeIdGenerator } from '~/fake-server/utils';
import {
    IBaseCategory,
    IBlogCategory,
    ICategory,
    IShopCategory,
} from '~/interfaces/category';

type WithFull = { fullSlug: string };

const getNextId = makeIdGenerator();

/** sanitize เฉพาะที่จำเป็น:
 * - ตัด / นำหน้า (ป้องกันชน route อื่นเวลาต่อ path)
 * - trim() ช่องว่าง
 */
function sanitizeSlug(raw: string): string {
    const s = (raw ?? '').toString().trim();
    return s.replace(/^\/+/, ''); // remove leading slashes
}

function makeShopCategory(
    def: ICategoryDef,
    parent: (IShopCategory & WithFull) | null
): IShopCategory & WithFull {
    const slug = sanitizeSlug(def.slug);
    const fullSlug = parent ? `${parent.fullSlug}/${slug}` : slug;

    return {
        id: getNextId(),
        type: 'shop',
        name: def.name,
        slug,
        image: def.image || null,
        items: def.items,
        parent,
        children: [],
        layout: def.layout ? def.layout : 'products',
        customFields: {},
        // เพิ่ม path เต็มของหมวด
        fullSlug,
    } as any;
}

function makeBlogCategory(def: ICategoryDef, parent: IBlogCategory | null): IBlogCategory {
    return {
        id: getNextId(),
        type: 'blog',
        name: def.name,
        slug: def.slug,
        image: def.image || null,
        items: def.items,
        parent,
        children: [],
        customFields: {},
    };
}

/** generic builder ของ tree
 * NOTE: ใช้ any เพื่อให้ง่าย ไม่ต้องแก้ interface อื่น ๆ
 */
function makeCategories<T extends IBaseCategory>(
    makeFn: (def: ICategoryDef, parent: any | null) => any,
    defs: ICategoryDef[],
    parent: any | null = null,
): any[] {
    const categories: any[] = [];

    defs.forEach((def) => {
        const category: any = makeFn(def, parent);

        if (def.children) {
            category.children = makeCategories(makeFn, def.children, category);
        }

        categories.push(category);
    });

    return categories;
}

function flatTree<T extends ICategory>(categories: T[]): T[] {
    let result: T[] = [];

    categories.forEach((category) => {
        result = [...result, category, ...flatTree(category.children as T[])];
    });

    return result;
}

// ------------------- หมวด (Data เดิมของคุณ) -------------------
const shopCategoriesDef: ICategoryDef[] = [
  {
    name: 'ไส้กรอง',
    slug: 'filters', // เดิม 'ไส้กรอง'
    image: '/images/categories/category-1.jpg',
    items: 131,
    children: [
      {
        name: 'กรองน้ำมันเครื่อง',
        slug: 'oil-filter',
        children: [
          { name: 'กรองน้ำมันเครื่อง-รถญี่ปุ่น', slug: 'japanese-cars' },
          { name: 'กรองน้ำมันเครื่อง-รถยุโรป', slug: 'european-cars' },
          { name: 'กรองน้ำมันเครื่อง-รถมอเตอร์ไซค์', slug: 'motorcycles' },
        ],
      },
      {
        name: 'กรองอากาศ',
        slug: 'air-filter',
        children: [
          { name: 'กรองอากาศ-รถญี่ปุ่น', slug: 'japanese-cars' },
          { name: 'กรองอากาศ-รถยุโรป', slug: 'european-cars' },
        ],
      },
      {
        name: 'กรองแอร์',
        slug: 'cabin-filter',
        children: [
          { name: 'กรองแอร์-รถญี่ปุ่น', slug: 'japanese-cars' },
          { name: 'กรองแอร์-รถยุโรป', slug: 'european-cars' },
          { name: 'กรองแอร์-รถมอเตอร์ไซค์', slug: 'motorcycles' },
        ],
      },
    ],
  },
  {
    name: 'ช่วงล่างและลูกปืน',
    slug: 'suspension-bearings', // เดิม 'ช่วงล่างและลูกปืน'
    image: '/images/categories/category-1.jpg',
    items: 131,
    children: [
      {
        name: 'โช้คอัพ',
        slug: 'shock-absorbers',
        children: [
          { name: 'โช้คอัพหน้า', slug: 'front' },
          { name: 'โช้คอัพหลัง', slug: 'rear' },
        ],
      },
      {
        name: 'สปริงโช้ค',
        slug: 'coil-springs',
        children: [
          { name: 'สปริงโช้คหน้า', slug: 'front' },
          { name: 'สปริงโช้คหลัง', slug: 'rear' },
        ],
      },
      { name: 'แร็คพวงมาลัย', slug: 'steering-rack' },
      { name: 'เพลาขับ', slug: 'drive-shaft' },
      { name: 'แหนบรถยนต์', slug: 'leaf-springs' },
      { name: 'โตงแตง สาแหรก สะดือแหนบ', slug: 'suspension-links' }, // เดิม 'dashboards' (ผิดหมวด)
      { name: 'ลูกปืน', slug: 'bearings' },
      {
        name: 'ลูกหมาก',
        slug: 'ball-joints', // เดิม '33'
        children: [
          { name: 'รถมอเตอร์ไซค์', slug: 'motorcycles' },
          { name: 'ลูกหมากกันโคลงหน้า', slug: 'front-stabilizer-links' },
          { name: 'ลูกหมากกันโคลงหลัง', slug: 'rear-stabilizer-links' },
          { name: 'ลูกหมากปีกนกล่าง', slug: 'lower-arm-ball-joint' },
          { name: 'ลูกหมากปีกนกบน', slug: 'upper-arm-ball-joint' },
          { name: 'ลูกหมากแร็ค​(ไม้ตีกลอง)', slug: 'tie-rod-ends' },
          { name: 'ลูกหมากปีกคันชัก', slug: 'drag-link' },
          { name: 'กล้องยา', slug: 'idler-arm' },
          { name: 'คันส่งต่างๆ', slug: 'linkages' },
        ],
      },
      {
        name: 'ปีกนก',
        slug: 'control-arms', // เดิม '332'
        children: [
          { name: 'ปีกนกบน', slug: 'upper' },   // เดิม '4'
          { name: 'ปีกนกล่าง', slug: 'lower' }, // เดิม '22'
          { name: 'สลักปีกนก', slug: 'control-arm-bolts' }, // เดิม '3'
        ],
      },
      {
        name: 'บุชและยางต่างๆ',
        slug: 'bushings-rubbers', // เดิม '332'
        children: [
          { name: 'บุชปีกนก', slug: 'control-arm-bushings' },
          { name: 'บุชหูแหนบ', slug: 'leaf-spring-bushings' },
          { name: 'บุชหูโช้ค', slug: 'shock-eye-bushings' },
          { name: 'ยางกันโคลง', slug: 'stabilizer-bushings' },
          { name: 'สกรูกันโคลง', slug: 'stabilizer-links' },
          { name: 'ยางกันกระแทกโช้คอัพ', slug: 'bump-stops' },
          { name: 'ยางกันฝุ่นโช้คอัพ', slug: 'shock-dust-covers' },
          { name: 'ยางรองสปริง', slug: 'spring-seats' },
          { name: 'เบ้าโช้ค ลูกปืนเบ้าโช้ค', slug: 'strut-mounts' },
          { name: 'ยางกันฝุ่นแร็ค', slug: 'rack-boots' },
          { name: 'ยางหุ้มเพลาขับ', slug: 'cv-boots' },
          { name: 'ยางหิ้วเพลากลาง', slug: 'center-bearing-supports' },
        ],
      },
    ],
  },
  { name: 'ระบบเบรก', slug: 'brake-system', image: '/images/categories/category-7.jpg', items: 179 },
  { name: 'ห้องเครื่องยนต์ เกียร์และคลัทช์', slug: 'engine-gearbox-clutch', image: '/images/categories/category-7.jpg', items: 179 },
  { name: 'ของเหลว และสารหล่อลื่น', slug: 'fluids-lubricants', image: '/images/categories/category-7.jpg', items: 179 },
  { name: 'อุปกรณ์ส่องสว่าง', slug: 'lighting', image: '/images/categories/category-7.jpg', items: 179 }, // เดิม 'tires-wheels'
  { name: 'ใบปัดน้ำฝน', slug: 'wiper-blades', image: '/images/categories/category-7.jpg', items: 179 },   // เดิม 'interior-parts'
  { name: 'ผลิตภัณฑ์ดูแลรถยนต์', slug: 'car-care', image: '/images/categories/category-7.jpg', items: 179 }, // เดิม 'engine-drivetrain'
  { name: 'อุปกรณ์ติดรถอื่นๆและของแต่ง', slug: 'accessories', image: '/images/categories/category-7.jpg', items: 179 },
];

const blogCategoriesDef: ICategoryDef[] = [
    {
        name: 'Latest News',
        slug: 'latest-news',
    },
    {
        name: 'Special Offers',
        slug: 'special-offers',
        children: [
            {
                name: 'Spring Sales',
                slug: 'spring-sales',
            },
            {
                name: 'Summer Sales',
                slug: 'summer-sales',
            },
            {
                name: 'Autumn Sales',
                slug: 'autumn-sales',
            },
            {
                name: 'Christmas Sales',
                slug: 'christmas-sales',
            },
            {
                name: 'Other Sales',
                slug: 'other-sales',
            },
        ],
    },
    {
        name: 'New Arrivals',
        slug: 'new-arrivals',
    },
    {
        name: 'Reviews',
        slug: 'reviews',
    },
    {
        name: 'Wheels & Tires',
        slug: 'wheels-tires',
    },
    {
        name: 'Engine & Drivetrain',
        slug: 'engine-drivetrain',
    },
    {
        name: 'Transmission',
        slug: 'transmission',
    },
    {
        name: 'Performance',
        slug: 'performance',
    },
];

// ---------- Build & Export ----------
export const shopCategoriesTree: (IShopCategory & WithFull)[] =
    makeCategories(makeShopCategory as any, shopCategoriesDef) as any;

export const shopCategoriesList: (IShopCategory & WithFull)[] =
    flatTree(shopCategoriesTree) as any;

export const blogCategoriesTree: IBlogCategory[] =
    makeCategories(makeBlogCategory, blogCategoriesDef);

export const blogCategoriesList: IBlogCategory[] =
    flatTree(blogCategoriesTree);

// ดัชนีสำหรับค้นหาด้วย fullSlug
export const shopCategoriesByFullSlug = new Map<string, IShopCategory & WithFull>(
    shopCategoriesList.map((c) => [c.fullSlug, c])
);
