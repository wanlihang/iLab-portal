const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    publicPath: '',
    productionSourceMap: false,
    assetsDir: 'static',

    lintOnSave: false,
    configureWebpack: {
        plugins: [
            // 配置JS在线代码编辑器monaco-editor的辅助文件
            new MonacoWebpackPlugin(),
        ],
    },

    // devServer: {
    //     host: '0.0.0.0',
    //     port: 8001,
    //     open: true,
    //     proxy: {
    //         '/ilab': {
    //             target: 'http://127.0.0.1:9204',
    //             changeOrigin: true,
    //             pathRewrite: {
    //                 '^/ilab': ''
    //             }
    //         }
    //     }
    // },

}
