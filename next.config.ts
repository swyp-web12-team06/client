import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
              replaceAttrValues: {
                '#000': 'currentColor',
                '#000000': 'currentColor',
                black: 'currentColor',
                '#fff': 'currentColor',
                '#ffffff': 'currentColor',
                white: 'currentColor',
              },
            },
          },
        ],
        as: '*.js',
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image.redot.store',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '437886cb285cde343d4b756b0d406a85.r2.cloudflarestorage.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
