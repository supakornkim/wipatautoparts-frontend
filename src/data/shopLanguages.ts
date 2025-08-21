// application
import { ILanguage } from '~/interfaces/language';

const dataShopLanguages: ILanguage[] = [
    {
        locale: 'th',
        code: 'th',
        name: 'Thai',
        icon: '/images/languages/language-1.png',
        direction: 'ltr',
    },
    {
        locale: 'en',
        code: 'en',
        name: 'English',
        icon: '/images/languages/language-1.png',
        direction: 'ltr',
    },
    /*{
        locale: 'ru',
        code: 'ru',
        name: 'Russian',
        icon: '/images/languages/language-2.png',
        direction: 'ltr',
    },
    {
        locale: 'ar',
        code: 'ar',
        name: 'RTL',
        icon: '/images/languages/language-3.png',
        direction: 'rtl',
    },*/
];

export const dataShopDefaultLocale = 'th';

export default dataShopLanguages;
