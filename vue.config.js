
const path = require('path')
function resolve(dir){
    return path.join(__dirname,dir)//path.join(__dirname)设置绝对路径
}
const TerserPlugin=require('terser-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production'
module.exports = {

    // 基本路径
    publicPath: '/',
    // publicPath: '/',
    lintOnSave: true,
    pages:{
        index:{
            entry:'examples/main.js',
            template:'public/index.html',
            filename:'index.html'
        }
    },
    // configureWebpack: config => {
    //     if (isProduction) {
    //         // 为生产环境修改配置...
    //         config.plugins.push(
    //             //生产环境自动删除console
    //             new TerserPlugin({
    //                 terserOptions: {
    //                     ecma: undefined,
    //                     warnings: false,
    //                     parse: {},
    //                     compress: {
    //                         drop_console: true,
    //                         drop_debugger: false,
    //                         pure_funcs: ['console.log'] // 移除console
    //                     }
    //                 },
    //                 sourceMap: false,
    //                 parallel: true,
    //             })
    //         )
    //     }
    // },
    chainWebpack:config=>{
        config.module.rule('js')
            .include.add(resolve('packages')).end()
            .use('babel')
            .loader('babel-loader')
            .tap(options=>{
                return options
            })
        // rules: [
        //     {
        //         // 单独打包出 css
        //         test: /\.scss$/,
        //         use: ['file-loader?name=lm-ui-element-style/[name].css']
        //     },
        //     {
        //         test: /\.scss$/,
        //         use: [
        //             {
        //                 loader: "sass-loader" // 将 Sass 编译成 CSS
        //             },
        //         ]
        //     },
        //
        // ]
        config.module.rule('scss')
            .include.add(resolve('packages')).end()
            .use('file-loader?name=lm-ui-element-style/[name].css')
            .loader('sass-loader')
            .tap(options=>{
                return options
            })
    },
    // // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    parallel: require('os').cpus().length > 1,
    pwa: {},
    // webpack-de
    devServer: {
        open: false,                                 //配置自动启动浏览器
        port: 8080,                                 // 端口号
        https: false,
        hotOnly: false,
        before: app => { }
     },
    // 第三方插件配置
    pluginOptions: {
        // ...
    },
}
