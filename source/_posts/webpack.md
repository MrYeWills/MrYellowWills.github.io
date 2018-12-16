---
title: webpack笔记
date: {{ date }}
tags: nihaotag
categories: nihaocategories
series: webpack
---

## 老马教程笔记

### sourcemap的处理

#### css模块 sourcemap的处理
给一下loader加上sourceMap: true，就可以做到css的sourcemap调试。
```
{
        test: /\.(sc|c|sa)ss$/,
        use: [
          'style-loader', {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }, {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: (loader) => [require('autoprefixer')({browsers: ['> 0.15% in CN']})]
            }
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
```

#### js模块 sourcemap的处理
很简单，加一个这个配置即可：
```
  devtool: 'inline-source-map', // 开发阶段开启 sourcemap
```

### 给css加前缀  postcss-loader

[postcss-loader](https://www.webpackjs.com/loaders/postcss-loader/#options)有很多用处，其中之一就是给各个浏览器添加css3兼容样式。

安装 postcss-loader 和 autoprefixer。 使用方法：
```
{
        test: /\.(sc|c|sa)ss$/,
        use: [
          'style-loader', {
            loader: 'css-loader',
          }, {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',//这里一定要定义一个唯一的名字，一般喜欢定义为postcss，你也可以定义任意其他唯一名字
              //> 0.15% in CN 大致是指兼容什么范围内的浏览器，这样写就行，一定要设置，否则可能不加前缀，
              //且数值一定要设置合适，否则设置浏览器太新，也可能不会生成前缀
              plugins: (loader) => [require('autoprefixer')({browsers: ['> 0.15% in CN']})]
            }
          }, {
            loader: 'sass-loader',
          }
        ]
      }
```

### 抽离css样式文件

注意：1.webpack4开始使用mini-css-extract-plugin ，1-3版本可以用 extract-text-webpack-plugin。
     2.只有 mode: 'production' 插件才生效。
     3.开发阶段使用style-loader就行了
方法：
1.mode: 'production'
2.抽离只需将原先style-loader的对象换成mini-css-extract-plugin；
3.配置plugins；

配置代码如下：

```
 const MiniCssExtractPlugin = require('mini-css-extract-plugin');
 ...
 mode: 'production',
 ...
 {
         test: /\.(sc|c|sa)ss$/,
         use: [
           MiniCssExtractPlugin.loader, {
             loader: 'css-loader',
             options: {
               sourceMap: true
             }
           }, {
             loader: 'postcss-loader',
             options: {
               ident: 'postcss',
               sourceMap: true,
               plugins: (loader) => [require('autoprefixer')({browsers: ['> 0.15% in CN']})]
             }
           }, {
             loader: 'sass-loader',
             options: {
               sourceMap: true
             }
           }
         ]
       }
  ....
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name][hash].css', // 设置最终输出的文件名，这个name最终根据output.filename一致。
      chunkFilename: '[id][hash].css'
    })
  ],
```

以下是css未从html上抽离的原先配置：

```
{
        test: /\.(sc|c|sa)ss$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true
            }
          },{
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: (loader) => [require('autoprefixer')({browsers: ['> 0.15% in CN']})]
            }
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
```

### 压缩css
所谓压缩代码，就是把css压缩成紧凑的一行。
注意：1.webpack5内置压缩 ，4版本可以设置插件optimize-css-assets-webpack-plugin即可。
     2.只有 mode: 'production' 。
配置代码如下：
```
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
...
mode: 'production'
...
optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({}), // 压缩CSS插件
    ]
  }
```

### 解决css文件或者js文件名字哈希值变化的问题
html-webpack-plugin插件，可以把打包后的css或js文件引用直接注入到HTML模板中，这样就不用每次手动修改文件引用了。
因此，只要项目中使用了hash，就必须配套使用html-webpack-plugin。
另外如果要使用模板html，也必须配套使用html-webpack-plugin。
当然，你也可以不使用模板，就算有哈希值，你不怕麻烦，当然也可以不适用html-webpack-plugin,你自己手写html，然后将打包生成的js\css文件手动引用也是可以的。
配置如下：
```
const HtmlWebpackPlugin = require('html-webpack-plugin');

plugins: [
new HtmlWebpackPlugin({
  title: 'AICODER test', // 默认值：Webpack App
  filename: 'index.html', // 默认值： 'index.html'
  template: path.resolve(__dirname, 'src/main.html'),
  minify: {
    collapseWhitespace: true, // 折叠空白
    removeComments: true, // 是否移除注释
    removeAttributeQuotes: true // 移除属性的引号
  }
})
]
```

### 每次打包自动清除上一个dist目录
使用插件：clean-webpack-plugin，配置如下
```
const CleanWebpackPlugin = require('clean-webpack-plugin');
plugins: [
    new CleanWebpackPlugin(['dist'])
]
```

### 压缩图片
使用loader：image-webpack-loader，一定在url-loader之前执行image-webpack-loader。
image-webpack-loader可以让原来90kb的图片，变成70kb，而不怎么影响质量。
配置如下
```
{
        test: /\.(png|svg|jpg|gif|jpeg)$/,
        include: [path.resolve(__dirname, 'src/')],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }, {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: false
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              gifsicle: {
                interlaced: false
              },
              webp: {
                quality: 75
              }
            }
          }
        ]
      }
```

### file-loader 与 url-loader 异同
他们都是用来处理项目中图片的。
file-loader 有的功能，基本上url-loader都用；
而且url-loader还可以将图片进行base64压缩的功能（你可以不使用此功能）；
因此，项目中使用url-loader而不适用file-loader。
url-loader 配置如下：
```
{
        test: /\.(png|svg|jpg|gif|jpeg)$/,
        include: [path.resolve(__dirname, 'src/')],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000 //1kb以内的图片将被base64压缩
            }
          }
        ]
      }
```
url-loader将图片进行base64压缩后就是一串DataURL：
```
.box {
    background: url(data:image/png;base64,UklGRkYwAABXRUJQVlA4WAoAAAAQAAAA/QIA8AAAQUxQSMAcAAABb…KnjLJNbGNAMFRe2WQhUfMAAAA19AAAkbAAAAAAAAAAAAAAABrYAAAAAD0gAAAAAAAAAAAAAAAA);
}
```
现在基本上常用的浏览器和移动端都可很好兼容DataURL，所以可以放心使用。
base64压缩图片为一串DataURL的好处在于减少html页面的http请求。缺点在于会加大打包文件大小。
一般网页性能优化时：
对于小图片，会使用base64压缩，减少http请求；
对于大图片，还是使用http请求。

### 字体文件处理
字体文件处理同图片文件处理：
```
{
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    include: [path.resolve(__dirname, 'src/')],
    use: [
      {
        loader: 'file-loader'
      }
    ]
  }
```

### 代理proxy的几张图片
备用，以后再分析
![](/image/webpack/proxy1.jpg)
![](/image/webpack/proxy2.jpg)
![](/image/webpack/proxy3.jpg)

### 提高构建速度
#### babel-loader 的优化
##### 设置exclude
##### 启用缓存
总代码如下：
```
{
    test: /\.js$/,
    exclude: /(node_modules)/, // 加快编译速度，不包含node_modules文件夹内容
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true // 启用缓存，提高编译速度，生成和开发都要如此设置
      }
    }
  }
```

#### 生产下公共代码抽离 (待研究)
假如一个组件使用了lodash，另外一个组件页面也用到了loadash，这个就是公共代码，将公共代码抽离可提高性能。
安装好babel-plugin-transform-runtime 和 babel-runtime，然后修改..babelrc文件如下即可：
```
{
  "presets": ["env"],
  "plugins": [
    ["transform-runtime", {
      "helpers": true,
      "polyfill": true,
      "regenerator": true,
      "moduleName": "babel-runtime"
    }]
  ]
}
```

#### 使用花括号{}进行import
例如 使用lodash，推荐这种写法import { filter } from 'lodash';
用什么就花括号，取什么。

#### 精简resolve.extensions
精简resolve.extensions扩展名，查找速度更快。
```
resolve: {
    extensions: [".js", ".vue", ".json"] // 默认值: [".js",".json"]  模块名字可以省略的后缀名
  },
```
#### 设置外部依赖
将笨重的很多页面都用到的js通过externals设置成外部依赖。

### 外部扩展(externals)
 把一个模块做成外部依赖也就是用cdn的方式依赖，不会打包到 js文件中。
 例如lodash,jquery基本上每个页面都要用到，这个时候把它们放在index.html模板中，
 每个组件都可以通过externals定义的名称进行引用。
 从而可以减少打包后js的大小。
 配置如下：
 ```
 //index.html模板中
 <script
   src="https://code.jquery.com/jquery-3.1.0.js"
   integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
   crossorigin="anonymous">

   //webpack.config.js
    externals: {  // 把一个模块做成外部依赖，不会打包到 js文件中。
       jquery: 'jQuery',
     },

     //index.js使用jquery
     import $ from 'jquery'; //注意是小写
 ```

### webpack-bundle-analyzer统计分析
注意，这个是在开发环境下使用,配置如下：
```
 const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

 plugins: [
    new BundleAnalyzerPlugin(), // 打包模块报表
  ]
```
配置好后，执行npm start ，会自动在浏览器打开分析页面：
![](/image/webpack/analyzer.png)
由图看出，loadsh.js的体积最大，经过分析，可以将loadsh.js做成外部依赖，从而减少打包后js的体积。

## webpack 黑知识

### 合并两个webpack的js配置
使用webpack-merge即可，配置如下：
```
//webpack.common
module.exports = {}  //module.exports是node的语法，是commonjs标准
```

```
//webpack.dev.js
const merge = require('webpack-merge');
const common = require('./webpack.common');
let devConfig = {}
module.exports = merge(common, devConfig);
```

### --watch 与 热更新
在命令中加入 --watch，可以达到效果：当文件改动时，会自动编译，如下：
```
"scripts": {
    "watch": "npx webpack --watch --config webpack.dev.js",
  },
```
自动编译还是不够的，我们还想它能够编译后自动刷新页面，也就是热更新，最常见的是npm start：
```
"scripts": {
    "start": "npm webpack-dev-server --config webpack.dev.js",
  },
```
其中devServer.hot置为true，就可以达到热更新。

所以启动 webpack-dev-server，可以达到自动编译(--watch功能)和热更新功能。

### 自动编译与热更新三大条件
需要同时如下配置，才能进行自动编译与热更新：
```
 const webpack = require('webpack');

 devServer: {
    hot: true, // 启用 webpack 的模块热替换特性, 这个需要配合： webpack.HotModuleReplacementPlugin插件
  },

 plugins: [
   new webpack.NamedModulesPlugin(), // 更容易查看(patch)的依赖
   new webpack.HotModuleReplacementPlugin() // 替换插件
 ]
```

### webpack-dev-server黑知识
如下，将看到以下几点黑知识：
#### 为什么是 0.0.0.0；
当然，服务器也可以设置为127.0.0.1，这个随你，注意的是设置为0.0.0.0时，可能0.0.0.0:58080有问题，在浏览器上改为127即可正常访问。
#### npm start后自动打开浏览器；
#### 编译监听的防抖设置；
#### 忽略监控文件范围设置；
#### proxy的代理重写pathRewrite；
#### publicPath的黑知识；
![](/image/webpack/publicPath.jpg)

webpack-dev-server的配置devServer 完整代码及解释如下：
```
devServer: {
    clientLogLevel: 'warning', // 可能的值有 none, error, warning 或者 info（默认值)
    hot: true, // 启用 webpack 的模块热替换特性, 这个需要配合： webpack.HotModuleReplacementPlugin插件
    contentBase: path.join(__dirname, "dist"), // 告诉服务器从哪里提供内容， 默认情况下，将使用当前工作目录作为提供内容的目录
    compress: true, // 一切服务都启用gzip 压缩
    host: '0.0.0.0', // 指定使用一个 host。默认是 localhost。如果你希望服务器外部可访问 0.0.0.0
    port: 58080, // 端口
    open: true, // 是否打开浏览器
    overlay: { // 出现错误或者警告的时候，是否覆盖页面线上错误消息。
      warnings: true,
      errors: true
    },
    publicPath: '/', // 此路径下的打包文件可在浏览器中访问。（注意没有特殊要求，一定就设置为'/'）
    proxy: { // 设置代理
      "/api": { // 访问api开头的请求，会跳转到  下面的target配置
        target: "http://192.168.0.102:8080",
        pathRewrite: {
          "^/api": "/mockjsdata/5/api"
        }
        //以上配置的意思就是 /api/getuser     =>  http://192.168.0.102:8080//mockjsdata/5/api/getuser
      }
    },
    quiet: true, // necessary for FriendlyErrorsPlugin. 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。
    watchOptions: { // 监视文件相关的控制选项
      poll: true, // webpack 使用文件系统(file system)获取文件改动的通知。在某些情况下，不会正常工作。例如，当使用 Network File System (NFS) 时。Vagrant 也有很多问题。在这些情况下，请使用轮询. poll: true。当然 poll也可以设置成毫秒数，比如：  poll: 1000
      ignored: /node_modules/, // 忽略监控的文件夹，正则
      aggregateTimeout: 300 // 默认值，当第一个文件更改，会在重新构建前增加延迟，防抖的功能，如果你连续几次改的文件间隔小于300毫秒，会延迟编译
    }
  }
```

### 服务器默认读取index.html
入口HTML若不是index.html则需补全：
![](/image/webpack/index.jpg)

### resolve之默认扩展文件名
```
resolve: {
    alias: { // 配置别名
      '@': path.resolve(__dirname, 'src/')
    },
    extensions: [".js", ".vue", ".json"] // 默认值: [".js",".json"]  模块名字可以省略的后缀名
  },
```

### chunk值处理  chunk的处理

### 对象，数组，option，字符串的写法

### 图片处理路径：imge src， css url（绝对，相对）
