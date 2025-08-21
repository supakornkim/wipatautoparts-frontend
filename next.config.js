/** @type {import('next').NextConfig} */
const nextConfig = {
  env: { basePath: process.env.BASE_PATH || '' },
  basePath: process.env.BASE_PATH || '',
  i18n: { locales: ['en', 'ru', 'ar'], defaultLocale: 'en' },

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
