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
};

export default nextConfig;
