module.exports = {
    publicPath: '',
    productionSourceMap: false,
    assetsDir: 'static',
    devServer: {
        proxy: {
            '/api': {
                target: 'http://192.168.3.8:8000',
                changeOrigin: true,
                ws: true
            },
            '/addons': {
                target: 'http://192.168.3.8:8000',
                changeOrigin: true,
                ws: true
            }
        }
    },
}