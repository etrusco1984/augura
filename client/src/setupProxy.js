const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:3001", // your Express backend port
      changeOrigin: true,
      credentials: true,
    })
  );
};
