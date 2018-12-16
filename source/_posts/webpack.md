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
url-loader将图片进行base64压缩后





## webpack 黑知识

### name 处理

### hash值处理

### chunk值处理  chunk的处理

### 对象，数组，option，字符串的写法

### 图片处理路径：imge src， css url（绝对，相对）
