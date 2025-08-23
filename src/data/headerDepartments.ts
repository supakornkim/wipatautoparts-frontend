// application
import { IDepartmentsLink } from '~/interfaces/departments-link';

const dataHeaderDepartments: IDepartmentsLink[] = [
    {
        title: 'ไส้กรอง',
        url: '/catalog/products',
        submenu: {
            type: 'megamenu',
            size: 'xl',
            image: '/images/departments/departments-2.jpg',
            columns: [
                {
                    size: '1of5',
                    links: [
                        {
                            title: 'กรองน้ำมันเครื่อง',
                            url: '/catalog/products',
                            links: [
                                { title: 'รถญี่ปุ่น', url: '/catalog/products' },
                                { title: 'รถยุโรป', url: '/catalog/products' },
                                { title: 'รถมอเตอร์ไซค์', url: '/catalog/products' },
                            ],
                        },
                        {
                            title: 'กรองอากาศ',
                            url: '/catalog/products',
                            links: [
                                { title: 'รถญี่ปุ่น', url: '/catalog/products' },
                                { title: 'รถยุโรป', url: '/catalog/products' },
                            ],
                        },
                    ],
                },
                {
                    size: '1of5',
                    links: [
                        {
                            title: 'กรองแอร์',
                            url: '/catalog/products',
                            links: [
                                { title: 'รถญี่ปุ่น', url: '/catalog/products' },
                                { title: 'รถยุโรป', url: '/catalog/products' },
                                { title: 'รถมอเตอร์ไซค์', url: '/catalog/products' },
                            ],
                        },
                        {
                            title: 'กรองน้ำมันเชื้อเพลิง',
                            url: '/catalog/products',
                            links: [
                                { title: 'กรองเบนซิน', url: '/catalog/products' },
                                { title: 'กรองดีเซล (โซล่า)', url: '/catalog/products' },
                            ],
                        },
                    ],
                },
                {
                    size: '1of5',
                    links: [
                        {
                            title: 'กรองน้ำมันเกียร์',
                            url: '/catalog/products',
                            links: [
                                { title: 'รถญี่ปุ่น', url: '/catalog/products' },
                                { title: 'รถยุโรป', url: '/catalog/products' },
                            ],
                        },
                    ],
                },
            ],
        },
    },
    {
        title: 'ช่วงล่างและลูกปืน',
        url: '/catalog/products',
        submenu: {
            type: 'megamenu',
            size: 'xl',
            image: '/images/departments/departments-2.jpg',
            columns: [
                {
                    size: '1of5',
                    links: [
                        {
                            title: 'โช้คอัพ',
                            url: '/catalog/products',
                            links: [
                                { title: 'โช้คอัพหน้า', url: '/catalog/products' },
                                { title: 'โช้คอัพหลัง', url: '/catalog/products' },
                            ],
                        },
                        {
                            title: 'สปริงโช้ค',
                            url: '/catalog/products',
                            links: [
                                { title: 'สปริงโช้คหน้า', url: '/catalog/products' },
                                { title: 'สปริงโช้คหลัง', url: '/catalog/products' },
                            ],
                        },
                        { title: 'แร็คพวงมาลัย', url: '/catalog/products' },
                        { title: 'เพลาขับ', url: '/catalog/products' },
                        { title: 'แหนบรถยนต์', url: '/catalog/products' },
                        { title: 'โตงแตง สาแหรก สะดือแหนบ', url: '/catalog/products' },
                        { title: 'ลูกปืน', url: '/catalog/products' },
                    ],
                },
                {
                    size: '1of5',
                    links: [
                        {
                            title: 'ลูกหมาก',
                            url: '/catalog/products',
                            links: [
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
                            links: [
                                { title: 'ปีกนกบน', url: '/catalog/products' },
                                { title: 'ปีกนกล่าง', url: '/catalog/products' },
                                { title: 'สลักปีกนก', url: '/catalog/products' },
                            ],
                        },
                    ],
                },
                {
                    size: '1of5',
                    links: [
                        {
                            title: 'บุชและยางต่างๆ',
                            url: '/catalog/products',
                            links: [
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
            ],
        },
    },
    { title: 'ระบบเบรก', url: '/catalog/products' },
    { title: 'ห้องเครื่องยนต์ เกียร์และคลัทช์', url: '/catalog/products' },
    { title: 'ของเหลว และสารหล่อลื่น', url: '/catalog/products' },
    { title: 'อุปกรณ์ส่องสว่าง', url: '/catalog/products' },
    { title: 'ใบปัดน้ำฝน', url: '/catalog/products' },
    { title: 'ผลิตภัณฑ์ดูแลรถยนต์', url: '/catalog/products' },
    { title: 'อุปกรณ์ติดรถอื่นๆและของแต่ง', url: '/catalog/products' },
];

export default dataHeaderDepartments;
