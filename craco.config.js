const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@pv/types': path.resolve(__dirname, 'src/types'),
      '@pv/components': path.resolve(__dirname, 'src/components'),
      '@pv/containers': path.resolve(__dirname, 'src/containers'),
      '@pv/services': path.resolve(__dirname, 'src/services'),
      '@pv/utils': path.resolve(__dirname, 'src/utils'),
    },
  },
};
