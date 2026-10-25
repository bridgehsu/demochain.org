const {PHASE_DEVELOPMENT_SERVER} = require('next/constants');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 静态导出模式：生成纯 HTML/CSS/JS，适合 CDN/静态托管，访问速度最快
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },
  trailingSlash: true,
};

module.exports = (phase) => ({
  ...nextConfig,
  // 开发缓存与静态构建隔离，避免构建时破坏正在运行的开发服务。
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next' : 'dist',
});
