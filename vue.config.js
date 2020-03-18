module.exports = {
  devServer: {
    host: 'localhost',
    port: 8080,
    proxy: {
      '/': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      }
    }
  }
}