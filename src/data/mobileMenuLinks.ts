// application
import { IMobileMenuLink } from '~/interfaces/mobile-menu-link';

const dataMobileMenuLinks: IMobileMenuLink[] = [
    { title: 'หน้าแรก', url: '/' },
    {
        title: 'หมวดหมู่สินค้า',
        url: '/demo/shop/shop-grid-4-sidebar',
        submenu: [
            {
                title: 'ไส้กรอง',
                url: '/demo/shop/category-columns-4-sidebar',
                submenu: [
                    {
                        title: 'กรองน้ำมันเครื่อง',
                        url: '/demo/shop/shop-grid-4-sidebar',
                        submenu: [
                            { title: 'รถญี่ปุ่น', url: '/catalog/products' },
                            { title: 'รถยุโรป', url: '/catalog/products' },
                            { title: 'รถมอเตอร์ไซค์', url: '/catalog/products' },
                        ],
                    },
                    {
                        title: 'กรองอากาศ',
                        url: '/demo/shop/shop-grid-4-sidebar',
                        submenu: [
                            { title: 'รถญี่ปุ่น', url: '/catalog/products' },
                            { title: 'รถยุโรป', url: '/catalog/products' },
                        ],
                    },
                    {
                        title: 'กรองแอร์',
                        url: '/demo/shop/shop-grid-4-sidebar',
                        submenu: [
                            { title: 'รถญี่ปุ่น', url: '/catalog/products' },
                            { title: 'รถยุโรป', url: '/catalog/products' },
                            { title: 'รถมอเตอร์ไซค์', url: '/catalog/products' },
                        ],
                    },
                    {
                        title: 'กรองน้ำมันเชื้อเพลิง',
                        url: '/demo/shop/shop-grid-4-sidebar',
                        submenu: [
                            { title: 'กรองเบนซิน', url: '/catalog/products' },
                            { title: 'กรองดีเซล (โซล่า)', url: '/catalog/products' },
                        ],
                    },
                    {
                        title: 'กรองน้ำมันเกียร์',
                        url: '/demo/shop/shop-grid-4-sidebar',
                        submenu: [
                            { title: 'รถญี่ปุ่น', url: '/catalog/products' },
                            { title: 'รถยุโรป', url: '/catalog/products' },
                        ],
                    },
                ],
            },
            {
                title: 'ช่วงล่างและลูกปืน',
                url: '/demo/shop/shop-grid-4-sidebar',
                submenu: [
                    {
                        title: 'โช้คอัพ',
                        url: '/catalog/products',
                        submenu: [
                            { title: 'โช้คอัพหน้า', url: '/catalog/products' },
                            { title: 'โช้คอัพหลัง', url: '/catalog/products' },
                        ],
                    },
                    {
                        title: 'สปริงโช้ค',
                        url: '/catalog/products',
                        submenu: [
                            { title: 'สปริงโช้คหน้า', url: '/catalog/products' },
                            { title: 'สปริงโช้คหลัง', url: '/catalog/products' },
                        ],
                    },
                    { title: 'แร็คพวงมาลัย', url: '/catalog/products' },
                    { title: 'เพลาขับ', url: '/catalog/products' },
                    { title: 'แหนบรถยนต์', url: '/catalog/products' },
                    { title: 'โตงแตง สาแหรก สะดือแหนบ', url: '/catalog/products' },
                    { title: 'ลูกปืน', url: '/catalog/products' },
                    {
                        title: 'ลูกหมาก',
                        url: '/catalog/products',
                        submenu: [
                            { title: 'ลูกหมากกันโคลงหน้า', url: '/catalog/products' },
                            { title: 'ลูกหมากกันโคลงหลัง', url: '/catalog/products' },
                            { title: 'ลูกหมากปีกนกล่าง', url: '/catalog/products' },
                            { title: 'ลูกหมากปีกนกบน', url: '/catalog/products' },
                            { title: 'ลูกหมากแร็ค​(ไม้ตีกลอง)', url: '/catalog/products' },
                            { title: 'ลูกหมากปีกคันชัก', url: '/catalog/products' },
                            { title: 'กล้องยา', url: '/catalog/products' },
                            { title: 'คันส่งต่างๆ', url: '/catalog/products' },
                        ],
                    },
                    {
                        title: 'ปีกนก',
                        url: '/catalog/products',
                        submenu: [
                            { title: 'ปีกนกบน', url: '/catalog/products' },
                            { title: 'ปีกนกล่าง', url: '/catalog/products' },
                            { title: 'สลักปีกนก', url: '/catalog/products' },
                        ],
                    },
                    {
                        title: 'บุชและยางต่างๆ',
                        url: '/catalog/products',
                        submenu: [
                            { title: 'บุชปีกนก', url: '/catalog/products' },
                            { title: 'บุชหูแหนบ', url: '/catalog/products' },
                            { title: 'บุชหูโช้ค', url: '/catalog/products' },
                            { title: 'ยางกันโคลง', url: '/catalog/products' },
                            { title: 'สกรูกันโคลง', url: '/catalog/products' },
                            { title: 'ยางกันกระแทกโช้คอัพ', url: '/catalog/products' },
                            { title: 'ยางกันฝุ่นโช้คอัพ', url: '/catalog/products' },
                            { title: 'ยางรองสปริง', url: '/catalog/products' },
                            { title: 'เบ้าโช้ค ลูกปืนเบ้าโช้ค', url: '/catalog/products' },
                            { title: 'ยางกันฝุ่นแร็ค', url: '/catalog/products' },
                            { title: 'ยางหุ้มเพลาขับ', url: '/catalog/products' },
                            { title: 'ยางหิ้วเพลากลาง', url: '/catalog/products' },
                        ],
                    },
                ],
            },
            { title: 'ระบบเบรก', url: '/catalog/products' },
            { title: 'ห้องเครื่องยนต์ เกียร์และคลัทช์', url: '/catalog/products' },
            { title: 'ของเหลว และสารหล่อลื่น', url: '/catalog/products' },
            { title: 'อุปกรณ์ส่องสว่าง', url: '/catalog/products' },
            { title: 'ใบปัดน้ำฝน', url: '/catalog/products' },
            { title: 'ผลิตภัณฑ์ดูแลรถยนต์', url: '/catalog/products' },
            { title: 'อุปกรณ์ติดรถอื่นๆและของแต่ง', url: '/catalog/products' },
        ],
    },
    { title: 'เกี่ยวกับเรา', url: '/about-us' },
    { title: 'ติดต่อเรา', url: '/contact-us' },
    { title: 'ติดตามคำสั่งซื้อ', url: '/track-order' },
    { title: 'บทความ', url: '/compare' },
    /*{
        title: 'Blog',
        url: '/demo/blog/classic-right-sidebar',
        submenu: [
            {
                title: 'Blog Classic',
                url: '/demo/blog/classic-right-sidebar',
                submenu: [
                    { title: 'Left Sidebar', url: '/demo/blog/classic-left-sidebar' },
                    { title: 'Right Sidebar', url: '/demo/blog/classic-right-sidebar' },
                ],
            },
            {
                title: 'Blog List',
                url: '/demo/blog/list-right-sidebar',
                submenu: [
                    { title: 'Left Sidebar', url: '/demo/blog/list-left-sidebar' },
                    { title: 'Right Sidebar', url: '/demo/blog/list-right-sidebar' },
                ],
            },
            {
                title: 'Blog Grid',
                url: '/demo/blog/grid-right-sidebar',
                submenu: [
                    { title: 'Left Sidebar', url: '/demo/blog/grid-left-sidebar' },
                    { title: 'Right Sidebar', url: '/demo/blog/grid-right-sidebar' },
                ],
            },
            {
                title: 'Post Page',
                url: '/demo/blog/post-full-width',
                submenu: [
                    { title: 'Full Width', url: '/demo/blog/post-full-width' },
                    { title: 'Left Sidebar', url: '/demo/blog/post-left-sidebar' },
                    { title: 'Right Sidebar', url: '/demo/blog/post-right-sidebar' },
                ],
            },
            { title: 'Post Without Image', url: '/demo/blog/post-without-image' },
        ],
    },*/
    
    /*{
        title: 'Account',
        url: '/account/dashboard',
        submenu: [
            { title: 'Login & Register', url: '/account/login' },
            { title: 'Dashboard', url: '/account/dashboard' },
            { title: 'Garage', url: '/account/garage' },
            { title: 'Edit Profile', url: '/account/profile' },
            { title: 'Order History', url: '/account/orders' },
            {
                title: 'Order Details',
                url: {
                    href: '/account/orders/[id]?id=1',
                    as: '/account/orders/1',
                },
            },
            { title: 'Address Book', url: '/account/addresses' },
            {
                title: 'Edit Address',
                url: {
                    href: '/account/addresses/[id]?id=new',
                    as: '/account/addresses/new',
                },
            },
            { title: 'Change Password', url: '/account/password' },
        ],
    },
    {
        title: 'Pages',
        url: '/about-us',
        submenu: [
            { title: 'About Us', url: '/about-us' },
            { title: 'Contact Us v1', url: '/demo/site/contact-us-v1' },
            { title: 'Contact Us v2', url: '/demo/site/contact-us-v2' },
            { title: '404', url: '/demo/site/not-found' },
            { title: 'Terms And Conditions', url: '/terms' },
            { title: 'FAQ', url: '/faq' },
            { title: 'Components', url: '/demo/site/components' },
            { title: 'Typography', url: '/demo/site/typography' },
        ],
    },*/
];

export default dataMobileMenuLinks;
