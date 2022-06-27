const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

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

    lintOnSave: false,
    configureWebpack: {
        plugins: [
            // 配置JS在线代码编辑器monaco-editor的辅助文件
            new MonacoWebpackPlugin(),
        ],
    },
}
