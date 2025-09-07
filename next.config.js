/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cf.shopee.co.th' },
      // เผื่อ domain อื่น ๆ ของ Shopee:
      { protocol: 'https', hostname: 'down-cvs.shopee.co.th' },
      { protocol: 'https', hostname: 'down-th.img.susercontent.com' }
    ],
  },
  env: { basePath: process.env.BASE_PATH || '' },
  basePath: process.env.BASE_PATH || '',
  i18n: { locales: ['th', 'en', 'ru', 'ar'], defaultLocale: 'th', localeDetection: false, },

  webpack(config) {
    // ตัด .svg ออกจาก file-loader เดิมของ Next
    const fileLoaderRule = config.module.rules.find(
      (rule) => rule.test && rule.test.test && rule.test.test('.svg')
    );
    if (fileLoaderRule) fileLoaderRule.exclude = /\.svg$/i;

    // เพิ่ม SVGR ให้ .svg กลายเป็น React component
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [{ loader: '@svgr/webpack', options: { svgo: true, titleProp: true } }],
    });

    return config;
  },
};

module.exports = nextConfig;
