export default {
  output: 'static',
  build: { format: 'file', assets: '_astro' },
  server: { host: '0.0.0.0', port: 4331 },
  devToolbar: {
    enabled: false,
  },
};
