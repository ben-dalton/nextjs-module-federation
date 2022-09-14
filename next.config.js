/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
};

const NextFederationPlugin = require('@module-federation/nextjs-mf/lib/NextFederationPlugin');

module.exports = (phase, { defaultConfig, isServer }) => {
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
      config.module.rules = [...config.module.rules];

      config.plugins = config.plugins || [];
      config.plugins.push(
        new NextFederationPlugin({
          name: 'nextRemote',
          remotes: {
            // remote: 'remote@http://localhost:3001/remoteEntry.js',
            // next2: 'next2@http://localhost:3000/_next/static/chunks/remoteEntry.js',
          },
          filename: 'static/chunks/remoteEntry.js',
          exposes: {
            './button': './src/components/Button.js',
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
  };
};
