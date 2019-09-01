const config = require("./src/api/serve_or_build");  // proxy 配置接口

module.exports = {
    //生产环境是否生成map文件
    productionSourceMap: false,
    runtimeCompiler: true,

    publicPath: "./", // 配置基本url
    devServer: {
        //disableHostCheck: true,
        open: true, //运行打开浏览器
        inline: true, //开启页面自动刷新
        proxy:{
            [config.PROXYSAPI[0].module_name] : {//代理api
                target: config.PROXYSAPI[0].module_url,//服务器api地址
                changeOrigin: true,//是否跨域
                //ws: true, // proxy websockets
                pathRewrite: {
                    [`^${config.PROXYSAPI[0].module_name}`]: '/' // 设置过滤关键字api ，
                }
            }
        }
    },

    /* px 转换 rem 配置*/
    css: {
        loaderOptions: {
            css: {},
            postcss: {
                // 这是rem适配的配置  注意： remUnit在这里要根据lib-flexible的规则来配制，如果您的设计稿是750px的，用75就刚刚好。
                plugins: [
                    require('postcss-px2rem')({
                        remUnit: 37.5
                    })
                ]
            }
        }
    },
};
