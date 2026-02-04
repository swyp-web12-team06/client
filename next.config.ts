import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // source: a pattern to match against incoming requests
        source: '/api/:path*',
        // destination: the URL to proxy the request to
        destination: '@backend/api/:path*',
      },
    ];
  },
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
