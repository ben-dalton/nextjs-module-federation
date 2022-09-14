/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

const NextFederationPlugin = require('@module-federation/nextjs-mf/lib/NextFederationPlugin');

module.exports = (phase, { defaultConfig, isServer }) => {
  // const serverRuntimeConfig = nextConfig.getServerProperties();
  // const publicRuntimeConfig = nextConfig.getPublicProperties();

  return {
    webpack: (config) => {
      if (!isServer) {
        // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
        config.resolve.fallback = {
          fs: false,
          net: false,
          tls: false,
          http: false,
          https: false,
          crypto: false,
          os: false,
          querystring: false,
        };
      }
      config.module.rules = [
        ...config.module.rules,
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: 'graphql-tag/loader',
        },
      ];

      config.plugins = config.plugins || [];
      config.plugins.push(
        new NextFederationPlugin({
          name: 'next2',
          // remotes: {
          //   remote: "remote@http://localhost:3001/remoteEntry.js",
          // },
          filename: 'static/chunks/remoteEntry.js',
          exposes: {
            './button': './components/Button.js',
            // './checkout': './pages/checkout',
            // './pages-map': './pages-map.js',
          },
          // name: 'remote',
          // library: { type: 'var', name: 'remote' },
          // filename: 'remote.js',
          // exposes: {
          //   './Button': './src/components/Common/BadgeCountButton',
          // },
          // shared: {
          //   react: {
          //     singleton: true,
          //     version: '0',
          //     requiredVersion: false,
          //   },
          //   'react-dom': {
          //     requiredVersion: false,
          //     singleton: true,
          //     version: '0',
          //   },
          // },
        }),
      );
      return config;
    },
    // ignore linting until we settle on configuration and clean up errors
    eslint: { ignoreDuringBuilds: true },

    // basePath: publicRuntimeConfig.app.basePath,

    // These config are available on server only
    // DO NOT access directly in code.
    // Use  ```import { serveConfig } from '@rs-app/lib/config/appConfig';``` instead
    // serverRuntimeConfig: serverRuntimeConfig,

    // These config are available on both server and client
    // DO NOT access this directly in code.
    // Use  ```import { publicConfig } from '@rs-app/lib/config/appConfig';``` instead
    // publicRuntimeConfig: publicRuntimeConfig,

    // rewrites: async () => {
    //   return (true || !process.env.NODE_ENV === 'production')
    //     ? [
    //       {
    //         source: '/next-api/graphql',
    //         destination: 'https://dev.roofstock.com/next-api/graphql',
    //       },
    //     ]
    //     : [];
    // }
  };
};
