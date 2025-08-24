// application
import { ICategoryDef } from '~/fake-server/interfaces/category-def';
import { makeIdGenerator } from '~/fake-server/utils';
import {
    IBaseCategory,
    IBlogCategory,
    ICategory,
    IShopCategory,
} from '~/interfaces/category';

const getNextId = makeIdGenerator();

function makeShopCategory(def: ICategoryDef, parent: IShopCategory | null): IShopCategory {
    return {
        id: getNextId(),
        type: 'shop',
        name: def.name,
        slug: def.slug,
        image: def.image || null,
        items: def.items,
        parent,
        children: [],
        layout: def.layout ? def.layout : 'products',
        customFields: {},
    };
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

function makeCategories<T extends IBaseCategory>(
    makeFn: (def: ICategoryDef, parent: T | null) => T,
    defs: ICategoryDef[],
    parent: T | null = null,
): T[] {
    const categories: T[] = [];

    defs.forEach((def) => {
        const category: T = makeFn(def, parent);

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

const shopCategoriesDef: ICategoryDef[] = [
    {
        name: 'ไส้กรอง',
        slug: 'ไส้กรอง',
        image: '/images/categories/category-1.jpg',
        items: 131,
        children: [
            { 
                name: 'กรองน้ำมันเครื่อง', 
                slug: 'turn-signals',
                children: [
                    { name: 'กรองน้ำมันเครื่อง-รถญี่ปุ่น', slug: 'japan' },
                    { name: 'กรองน้ำมันเครื่อง-รถยุโรป', slug: 'europe' },
                    { name: 'กรองน้ำมันเครื่อง-รถมอเตอร์ไซค์', slug: 'motorcycle' },
                ],
            },
            { 
                name: 'กรองอากาศ', 
                slug: 'air-filter',
                children: [
                    { name: 'กรองอากาศ-รถญี่ปุ่น', slug: 'japan' },
                    { name: 'กรองอากาศ-รถยุโรป', slug: 'europe' },
                ],
            },
            { 
                name: 'กรองแอร์', 
                slug: 'cabin-filter',
                children: [
                    { name: 'รถญี่ปุ่น', slug: 'air-japan' },
                    { name: 'รถยุโรป', slug: 'europe' },
                    { name: 'รถมอเตอร์ไซค์', slug: 'motorcycle' },
                ],
            },
        ],
    },
    {
        name: 'ช่วงล่างและลูกปืน',
        slug: 'ช่วงล่างและลูกปืน',
        image: '/images/categories/category-1.jpg',
        items: 131,
        children: [
            { 
                name: 'โช้คอัพ', 
                slug: 'turn-signals',
                children: [
                    { name: 'โช้คอัพหน้า', slug: 'japan' },
                    { name: 'โช้คอัพหลัง', slug: 'europe' },
                ],
            },
            { 
                name: 'สปริงโช้ค', 
                slug: 'air-filter',
                children: [
                    { name: 'สปริงโช้คหน้า', slug: 'japan' },
                    { name: 'สปริงโช้คหลัง', slug: 'europe' },
                ],
            },
            { name: 'แร็คพวงมาลัย', slug: 'dashboards' },
            { name: 'เพลาขับ', slug: 'dashboards' },
            { name: 'แหนบรถยนต์', slug: 'dashboards' },
            { name: 'โตงแตง สาแหรก สะดือแหนบ', slug: 'dashboards' },
            { name: 'ลูกปืน', slug: 'dashboards' },
            { 
                name: 'ลูกหมาก', 
                slug: '33',
                children: [
                    { name: 'รถมอเตอร์ไซค์', slug: 'motorcycle' },
                    { name: 'ลูกหมากกันโคลงหน้า', slug: '1' },
                    { name: 'ลูกหมากกันโคลงหลัง', slug: '2' },
                    { name: 'ลูกหมากปีกนกล่าง', slug: '3' },
                    { name: 'ลูกหมากปีกนกบน', slug: '4' },
                    { name: 'ลูกหมากแร็ค​(ไม้ตีกลอง)', slug: '5' },
                    { name: 'ลูกหมากปีกคันชัก', slug: '6' },
                    { name: 'กล้องยา', slug: '7' },
                    { name: 'คันส่งต่างๆ', slug: '8' },
                ],
            },
            { 
                name: 'ปีกนก', 
                slug: '332',
                children: [
                    { name: 'ปีกนกบน', slug: '4' },
                    { name: 'ปีกนกล่าง', slug: '22' },
                    { name: 'สลักปีกนก', slug: '3' },
                ],
            },
            { 
                name: 'บุชและยางต่างๆ', 
                slug: '332',
                children: [
                    { name: 'บุชปีกนก', slug: '/catalog/products' },
                    { name: 'บุชหูแหนบ', slug: '/catalog/products' },
                    { name: 'บุชหูโช้ค', slug: '/catalog/products' },
                    { name: 'ยางกันโคลง', slug: '/catalog/products' },
                    { name: 'สกรูกันโคลง', slug: '/catalog/products' },
                    { name: 'ยางกันกระแทกโช้คอัพ', slug: '/catalog/products' },
                    { name: 'ยางกันฝุ่นโช้คอัพ', slug: '/catalog/products' },
                    { name: 'ยางรองสปริง', slug: '/catalog/products' },
                    { name: 'เบ้าโช้ค ลูกปืนเบ้าโช้ค', slug: '/catalog/products' },
                    { name: 'ยางกันฝุ่นแร็ค', slug: '/catalog/products' },
                    { name: 'ยางหุ้มเพลาขับ', slug: '/catalog/products' },
                    { name: 'ยางหิ้วเพลากลาง', slug: '/catalog/products' },
                ],
            },
        ],
    },
    {
        name: 'ระบบเบรก',
        slug: 'ระบบเบรก',
        image: '/images/categories/category-7.jpg',
        items: 179,
    },
    {
        name: 'ห้องเครื่องยนต์ เกียร์และคลัทช์',
        slug: 'ห้องเครื่องยนต์ เกียร์และคลัทช์',
        image: '/images/categories/category-7.jpg',
        items: 179,
    },
    {
        name: 'ของเหลว และสารหล่อลื่น',
        slug: 'ของเหลว และสารหล่อลื่น',
        image: '/images/categories/category-7.jpg',
        items: 179,
    },
    {
        name: 'อุปกรณ์ส่องสว่าง',
        slug: 'tires-wheels',
        image: '/images/categories/category-7.jpg',
        items: 179,
    },
    {
        name: 'ใบปัดน้ำฝน',
        slug: 'interior-parts',
        image: '/images/categories/category-7.jpg',
        items: 179,
    },
    {
        name: 'ผลิตภัณฑ์ดูแลรถยนต์',
        slug: 'engine-drivetrain',
        image: '/images/categories/category-7.jpg',
        items: 179,
    },
    {
        name: 'อุปกรณ์ติดรถอื่นๆและของแต่ง',
        slug: 'อุปกรณ์ติดรถอื่นๆและของแต่ง',
        image: '/images/categories/category-7.jpg',
        items: 179,
    },

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

export const shopCategoriesTree: IShopCategory[] = makeCategories(makeShopCategory, shopCategoriesDef);

export const shopCategoriesList: IShopCategory[] = flatTree(shopCategoriesTree);

export const blogCategoriesTree: IBlogCategory[] = makeCategories(makeBlogCategory, blogCategoriesDef);

export const blogCategoriesList: IBlogCategory[] = flatTree(blogCategoriesTree);
