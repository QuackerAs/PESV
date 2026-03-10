const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // proxy only calls that start with /api to the backend server
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8081',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api',
      },
    })
  );
};