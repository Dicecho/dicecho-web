const { createProxyMiddleware } = require('http-proxy-middleware');

const target = process.env.PROXY || '127.0.0.1:8080'
const avatarTarget = process.env.AVATAR_PROXY || '127.0.0.1:8080'


module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target,
      changeOrigin: true,
    })
  );
  app.use(
    '/avatars',
    createProxyMiddleware({
      target: avatarTarget,
      changeOrigin: true,
    })
  );
};
