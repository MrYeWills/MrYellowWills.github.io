---
title: webpack笔记
date: {{ date }}
tags: webpack
categories: 
- 前端工具
series: 前端
---

## webpack常用知识

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

#### 要不要配置index.html
有时候容易误解，webpack会自动生成index.html，这是不对的。
入口文件index.html必须要自己手动配置例如：
```
//index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
</script>
  <title>Document</title>
</head>
<body>
  <div id="app"></div>
  <script src="./index.js"></script>
</body>
</html>
```
其实webpack只是一个js打包器，会把index.html用到的js全部打包成一个js，就是上面的index.js。
只是我们可以通过webpack的插件html-webpack-plugin，写一个index.html模板，不用手动输入index.js的引用，且不用每次手动将index.html拷贝到build目录。
将上面的index.html，改成模板，其实就是就是去掉这句：
```
 <script src="./index.js"></script> 
```
改成的index.html如下：
```
//index.html模板
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
</script>
  <title>Document</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```
所以在项目中，你必须写一个index.html，或者一个index.html模板。
看这个章节加深 项目中index.html 的理解：《webpack常用知识 ---解决css文件或者js文件名字哈希值变化的问题》

#### output.publicPath output.path exports.context devServer.publicPath
- exports.context 与 output.path 
 exports.context 是提供一个全局的根目录，为配置提供方便,你也可不配置；如果配置此目录下面的output.path 基于此目录。
```
  context: path.resolve(__dirname, 'src'),
  output: {
    path: 'version1.0.0',
    publicPath: '/',
    filename: 'assets/[name].[hash:8].js',
  },
```
相当于
```
  output: {
    path: path.resolve(__dirname, 'version1.0.0/version1.0.0'),
    publicPath: '/',
    filename: 'assets/[name].[hash:8].js',
  },
```

- output.publicPath 
 output.publicPath是给index.html文件内所以link或js引用，在原编辑结果下，在最左侧统一加一个目录，通常也可不配置。
如：
不加output.publicPath
```
  context: path.resolve(__dirname, 'src'),
  output: {
    path: 'version1.0.0',
    filename: 'assets/[name].[hash:8].js',
  },
```
编译出来的index.html为：
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>React App Pro</title>
    <link rel="preload" href="assets/css/1.db782111.css"  as="style">
    <link rel="preload" href="assets/css/style.db782111.css"  as="style">
    <link rel="preload" href="assets/vendors.db782111.js" as="script">
    <link rel="preload" href="assets/client.db782111.js" as="script">
</head>
  <body>
    <div id="app"></div>
  <script type="text/javascript" src="assets/vendors.db782111.js"></script>
  <script type="text/javascript" src="assets/client.db782111.js"></script>
  </body>
</html>
```
加了output.publicPath
```
  context: path.resolve(__dirname, 'src'),
  output: {
    path: 'version1.0.0',
    publicPath: '/',
    filename: 'assets/[name].[hash:8].js',
  },
```
编译出来的index.html每个引用路径前都加了一个'/'
```
<link rel="preload" href="/assets/css/1.2e0f42df.css"  as="style">
<link rel="preload" href="/assets/css/style.2e0f42df.css"  as="style">
<link rel="preload" href="/assets/vendors.2e0f42df.js" as="script">
<link rel="preload" href="/assets/client.2e0f42df.js" as="script">
<script type="text/javascript" src="/assets/vendors.2e0f42df.js"></script>
<script type="text/javascript" src="/assets/client.2e0f42df.js"></script>
```

- devServer.publicPath
这么没什么说的，默认配置为 '/'，大多时候我们不会去改，使用默认配置。

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
如果配置了  postcss-loader，如果你还使用了happypack,就必须要 在根目录 (通常是webpack.comfig.js同级目录)配置 postcss.config.js。详细请看下面章节 《构建与性能优化--happypack》

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

### 分离 库与业务代码

#### 配置方法一
配置如下：
```
 output: {
    filename: '[name].[hash].js', //定义库代码以外的代码打包成的js appIndex.54c949dd739536531ad5.js
    chunkFilename: '[name].chunk.js',//定义库代码打包成的js customChunkNameQQ.chunk.js
    path: path.resolve(__dirname, 'dist') //打包后输出的路径
  },
 optimization: {
    splitChunks: {
            cacheGroups: {
              commons: {
                 chunks: 'initial',
                 test: path.resolve(__dirname,'node_modules'),//匹配到的文件都将被一起打包成库js
                 enforce: true,
                 name: 'customChunkNameQQ',//定义打包后[name]值
              }
            }
    }
  },
```
库与业务代码分离 使用的是splitChunks配置，其实它是一个插件，被整合到webpack4了。
这个插件的思路是，利用test匹配文件，只要匹配到的就打包成库js，剩下没有被匹配到的，就被打包成业务js；
所以如果test匹配不到任何文件，将不会有库js生成，所有的js资源都会被剩下，都被打包到业务js中。

以下就是一个例子，只有业务js生成：
```
 entry: {
    appIndex:'./src/index.js'
  },
  optimization: {
    splitChunks: {
            cacheGroups: {
              commons: {
                 chunks: 'initial',
                 test: path.resolve(__dirname,'node_modules11'),//因为项目没有node_modules11目录,将只会有一个业务js生成
                 enforce: true,
                 name: 'customChunkNameQQ',
              }
            }
    }
 ```
 **webpack打包的原则就是这样，如果没有插件,所有的js将被webpack系统打包成一个js，如果有插件做代码分离，插件匹配的部分将被插件打包成js，剩下的将被webpack系统打包成一个js，如果插件没有匹配到任何js，,所有的js将被webpack系统打包成一个js**

还有其他几种定义方法：

#### 显示配置方法(推荐)
注意下面这个示例配置有一点点问题
```
//将'lodash','axios'两个库的代码合并打包成一个名字为customChunkNameQQ 的 js，文件；
//剩下所有js包含其他依赖库和业务js将被合并打包成另个一个js。
 entry: {
    appIndex:'./src/index.js',
    lodashAndAxios:['lodash','axios'],//显示定义需要将这些依赖库打成一个js
  },
  optimization: {
    splitChunks: {
            cacheGroups: {
              commons: {
                 chunks: 'initial',
                 test: 'lodashAndAxios', //一定要匹配entry对象内，key值，lodashAndAxios就是entry中的key值
                 enforce: true,
                 name: 'customChunkNameQQ',
              }
            }
    }
  },
```
上面配置有些问题，打包后，会生成三个js：
![](/image/webpack/verder2.png)
所以修改以上配置，将cacheGroups.commons.name与cacheGroups.commons.test统一定义成entry中的lodashAndAxios这样生成的文件就正常了：
```
<!-- 正确配置方法 -->
 entry: {
    appIndex:'./src/index.js',
    lodashAndAxios:['lodash','axios'],//显示定义需要将这些依赖库打成一个js
  },
  optimization: {
    splitChunks: {
            cacheGroups: {
              commons: {
                 chunks: 'initial',
                 test: 'lodashAndAxios', //一定要匹配entry对象内，key值，lodashAndAxios就是entry中的key值
                 enforce: true,
                 name: 'lodashAndAxios',
              }
            }
    }
  },
```
打包结果为：
![](/image/webpack/verder2.png)
#### 直接用test匹配方法
上面的方法也可以写成如下，效果一样：
```
//将'lodash','axios'两个库的代码合并打包成一个名字为customChunkNameQQ 的 js，文件；
//剩下所有js包含其他依赖库和业务js将被合并打包成另个一个js。
 entry: {
    appIndex:'./src/index.js',
  },
  optimization: {
    splitChunks: {
            cacheGroups: {
              commons: {
                 chunks: 'initial',
                 test: /lodash|axios/,  //直接使用test去匹配
                 enforce: true,
                 name: 'customChunkNameQQ',
              }
            }
    }
  },
```

### entry多种配置形式
入口可以使用 entry 字段来进行配置，webpack 支持配置多个入口来进行构建：
```
module.exports = {
  entry: './src/index.js'
}

// 上述配置等同于
module.exports = {
  entry: {
    main: './src/index.js'
  }
}

// 或者配置多个入口
module.exports = {
  entry: {
    foo: './src/page-foo.js',
    bar: './src/page-bar.js',
    // ...
  }
}

// 使用数组来对多个文件进行打包
module.exports = {
  entry: {
    main: [
      './src/foo.js',
      './src/bar.js'
    ]
  }
}
```
最后的例子，可以理解为多个文件作为一个入口，webpack 会解析两个文件的依赖后进行打包。

还有一种形式，就是使用库与业务代码分离optimization.splitChunks时：
```
//将'lodash','axios'两个库的代码合并打包成一个名字为customChunkNameQQ 的 js，文件；
//剩下所有js包含其他依赖库和业务js将被合并打包成另个一个js。
 entry: {
    appIndex:'./src/index.js',
    lodashAndAxios:['lodash','axios'],//显示定义需要将这些依赖库打成一个js
  },
  output: {
  filename: '[name].[hash].js',//库js剩下的，也就是所谓的业务js
  chunkFilename: '[name].chunk.js', //打包出来的库js
  path: path.resolve(__dirname, 'dist')
},
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
           chunks: 'initial',
           test: 'lodashAndAxios',
           enforce: true,
           name: 'lodashAndAxios',
        }
      }
    }
  }
```
**entry 值可以是字符串，可以是对象；当entry为对象时，对象元素的key，value；value可以是字符串，也可以是数组。**

### 生产与开发环境差异配置
前面提及的使用环境变量的方式可以让我们在不同的构建环境中完成不同的构建需求，这里列举一下常见的 webpack 构建差异配置：

- 生产环境可能需要分离 CSS 成单独的文件，以便多个页面共享同一个 CSS 文件
- 生产环境需要压缩 HTML/CSS/JS 代码
- 生产环境需要压缩图片
- 开发环境需要生成 sourcemap 文件
- 开发环境需要打印 debug 信息
- 开发环境需要 live reload 或者 hot reload 的功能

### 核心概念
- Entry: 入口。
- Module: 模块。在webpack里，一切皆模块，一个模块对应一个文件，webpack会从配置的entry开始递归找出所有依赖的模块。
- Chunk: 代码块。一个Chunk由多个模块组合而成，用于代码合并和分割。
- loader: 模块转换器。
- Plugin: 扩展插件。
- Output: 输出结果。
webpack 在启动后会从Entry里配置的Moule开始，递归解析Entry依赖的所有module，每找到一个module，就会根据配置的loader去找出对应的转换规则，对module进行转换后，再解析出当前module依赖的module。这些模块会以entry为单位进行分组，一个entry及其所有依赖的module被分到一个组也就是一个chunk，最后webpack会将所有chunk转换成文件输出。
**在webpack中chunk概念很重要，也很不好理解，也容易被忽视，其实webpack目的是一个打包工具，然而将整个包打成几个代码块，都是由chunk控制，所以理解chunk对理解webpack，至关重要。**

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
publicPath 的优先级高于 contentBase。contentBase 用于配置提供额外静态文件内容的目录，之前提到的 publicPath 是配置构建好的结果以什么样的路径去访问，而 contentBase 是配置额外的静态文件内容的访问路径，即那些不经过 webpack 构建，但是需要在 webpack-dev-server 中提供访问的静态资源（如部分图片等）
你不懂contentBase publicPath为什么，没关系，先这样用着。
更多配置说明可参考掘金小册的第六章节。

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

    publicPath: '/', // 此路径下的打包文件可在浏览器中访问。（注意若无特殊要求，一定设置为'/',默认配置为 '/                   //'，大多时候我们不会去改，使用默认配置。）

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
### [name]\[id]\[hash]\[chunkhash]
#### [name]
所有的name，默认为entry中定义的，如果entry的值为字符串，则默认为main。
如：
下面代码是entry为字符串时，[name] 为默认的main
```
entry: './src/index.js',

  splitChunks: {
            cacheGroups: {
              commons: {
                 chunks: 'initial',
                 test: path.resolve(__dirname,'node_modules'),
                 enforce: true,
              }
            }
          }

 output: {
    filename: '[name].[hash].js',//main.24673fe716edfcec07a9.js
    chunkFilename: '[name].chunk.js', //commons~main.chunk.js 这里多了一个commons，是因为splitChunks的commons配置的，默认加commons
    path: path.resolve(__dirname, 'dist')
  },
 new HtmlWebpackPlugin({
      title: 'AICODER 全栈线下实习', // 默认值：Webpack App
      filename: 'indexMyApp.html', // 默认值： 'index.html'
      template: path.resolve(__dirname, 'src/tempHtml.html'),
      minify: {
        collapseWhitespace: true,
        removeComments: true, // 是否移除注释
        removeAttributeQuotes: true // 移除属性的引号
      }
    }),
  new MiniCssExtractPlugin({
      filename: '[name][hash].css', // main24673fe716edfcec07a9.css
      chunkFilename: '[id][hash].css'
    })
```
下面代码是entry为对象时，[name] 为entry的key值，下面的例子，[name]就是appIndex：
```
entry: {
  appIndex:'./src/index.js'
},

  splitChunks: {
            cacheGroups: {
              commons: {
                 chunks: 'initial',
                 test: path.resolve(__dirname,'node_modules'),
                 enforce: true,
              }
            }
          }

 output: {
    filename: '[name].[hash].js',//appIndex.90feeea169ea4a86288d.js
    chunkFilename: '[name].chunk.js', //commons~appIndex.chunk.js
    path: path.resolve(__dirname, 'dist')
  },
 new HtmlWebpackPlugin({
      title: 'AICODER 全栈线下实习', // 默认值：Webpack App
      filename: 'indexMyApp.html', // 默认值： 'index.html'
      template: path.resolve(__dirname, 'src/tempHtml.html'),
      minify: {
        collapseWhitespace: true,
        removeComments: true, // 是否移除注释
        removeAttributeQuotes: true // 移除属性的引号
      }
    }),
  new MiniCssExtractPlugin({
      filename: '[name][hash].css', // appIndex90feeea169ea4a86288d.css
      chunkFilename: '[id][hash].css'
    })
```

可在插件中自定义对应模块的[name]，例如定义splitChunks模块下name: 'custom_chunkName'，他会覆盖entry中定义的name，由此splitChunks插件生成的文件将[name]值为custom_chunkName:

```

entry: {
  appIndex:'./src/index.js'
},

  splitChunks: {
            cacheGroups: {
              commons: {
                 chunks: 'initial',
                 test: path.resolve(__dirname,'node_modules'),
                 enforce: true,
                 name: 'custom_chunkName'
              }
            }
          }

 output: {
    filename: '[name].[hash].js',//appIndex.c81ab09b0bd828f71845.js
    chunkFilename: '[name].chunk.js', //customChunkNameQQ.chunk.js
    path: path.resolve(__dirname, 'dist')
  },
  new MiniCssExtractPlugin({
      filename: '[name][hash].css', // appIndexc81ab09b0bd828f71845.css
      chunkFilename: '[id][hash].css'
    })

//其他跟上面代码一样，只列与上不同的代码：
```
当然你也可以直接通过filename定义splitChunks模块下输出文件的名字，这个优先级最高：

```
entry: {
  appIndex:'./src/index.js'
},
  splitChunks: {
            cacheGroups: {
              commons: {
                 chunks: 'initial',
                 test: path.resolve(__dirname,'node_modules'),
                 enforce: true,
                 name: 'customChunkNameQQ',
                 filename: 'chunckNiceName.js',
              }
            }
          }

 output: {
    filename: '[name].[hash].js',//appIndex.c81ab09b0bd828f71845.js
    chunkFilename: '[name].chunk.js', //chunckNiceName.js
    path: path.resolve(__dirname, 'dist')
  },
  new MiniCssExtractPlugin({
      filename: '[name][hash].css', // appIndexc81ab09b0bd828f71845.css
      chunkFilename: '[id][hash].css'
    })
//其他跟上面代码一样，只列与上不同的代码：
```
关于[name]小结：
如果entry为字符串，name值默认为main；
如果entry以对象形式，name值为对象的key值；
各个插件(如css、js处理插件)可自定义本插件生成的js的文件名，或自定name值覆盖entry中定义的name值。

#### [id]
这个最简单，[id]其实就是数字1,2,3,4.....；
```
output: {
    filename: '[name].[hash].js',
    chunkFilename: '[id].chunk.js',
    path: path.resolve(__dirname, 'dist')
  },
```
#### [hash]
这就是一个hash码，值得注意的是，每次build的hash值都是相同的，也就是打包完成后，js\css文件名的hash值都是相同的。
hash一个典型特征是，只有有一个文件改变，那么重新打包后hash值将变化，所以使用hash输出文件名的都将变化，
所以业务js，必须使用hash，而不能使用chunkhash。

#### [chunkhash]及 [chunkhash]与[hash]的异同
依赖库的源码，我们一般单独打包成一个库js，这个js必须使用chunkhash，
chunkhash的原则是只要chunkhash对应的模块文件不变，就算其他文件有变化了，重新打包了，改变的是hash值，chunkhash值保持不变。
**需特别注意的是，在一般情况下，修改文件和增加文件，webpack编译生成chunkhash的策略是不同的，上面所说的只适合修改文件的情况，如果增加文件或删除文件，就算库文件不变，还是会产生不同的chunkhash，原因在与webpack会根据总体文件，为每个文件设置一个index进行编译，增加或删除文件都会改变整体的index，从而导致chunkhash改变，为了防止这一情况，可配置webpack.HashedModuleIdsPlugin**
关于chunkhash的规则，更多请看章节3.12:《构建与性能优化 之 webpack.HashedModuleIdsPlugin》
对于 chunkhash与HashedModuleIdsPlugin 看参看 [这里](https://www.cnblogs.com/zhishaofei/p/8590627.html)
**所以为了利用http缓存，对于依赖源码库js，必须使用chunkhash，业务js必须使用hash，否则将失去库与业务代码分离的意义**

### 关于chunkFilename
chunkFilename是用来配置无入口的chunk输出的名字的。
1.代码如下，进行打包；
```
entry: {
    appIndex:'./src/index.js',
  },
  mode: 'production',
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
           chunks: 'initial',
           test: path.resolve(__dirname,'node_modules'),
           enforce: true,
        }
      }
    }
  }
```
打包后生成：
![](/image/webpack/chunkfilename1.png)
因为splitChunks.cacheGroups.commons没有定义name，所以输出文件，默认加 commons~....js;

2.与1其他配置不变，加上name，再打包：
```
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          ...
           name: 'lodashAndAxios'
        }
      }
    }
  }
```
打包后生成，我们发现，这个分离出来的代码块，用的是output.filename的配置：
![](/image/webpack/chunkfilename2.png)

3.与2其他配置不变，加上chunkfilename，再打包：
```
output: {
    ...
    chunkFilename: '[name]._chunk_[chunkhash].js',
  },
```
打包后生成，我们发现，这个分离出来的代码块，用的是output.chunkFilename的配置：
![](/image/webpack/chunkfilename3.png)

这单独分离的代码，在entry中没有入口，只通过splitChunks.cacheGroups.test进行匹配，所以chunkFilename 是用来配置没有入口的名称的，
如果不配置chunkFilename，将会根据filename输出。不配置splitChunks.cacheGroups.name，会给输出文件名默认加commons~

### chunk的名称
chunk的名称和entry的配置有关；
- 如果entry是一个string或array，只会生成一个chunk，这是的chunk的名称就是main；
- 如果entry是一个Object，就可能会出现多个chunk,这时chunk的名称是Object键值对中健的名称。

### 从代码分离看chunk与minChunks
```
  entry: {
    a: './path/to/my/entry/file.js',
    b: './path/to/my/entry/app.js',
  }
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          <!-- 如果不指定chunks，将会从现有的所有chunk中提取公共代码 -->
           chunks: ['a','b'],//a、b是entry中的两个chunk，从a，b中抽取公共的代码，最终会形成一个名字为appCommon的js，和a.js和b.js
           name: 'appCommon'
        }
      }
    }
  }
```
还有一个参数是minChunks，例如：
```
minChunks = 2;
chunks = ['a','b','c','d','e']
```
只要在abcde模块中任意两个模块出现了公共代码的，都被提取。
minChunks主要应对，很可能abcde没有一个公共代码，在所有模块中都有的情况。

### dev模式禁chunkhash
在dev模式下，只能用hash，不能使用chunkhash，否则报错。

### 模块解析规则与resolve
#### 解析相对路径
- 查找相对当前模块的路径下是否有对应文件或文件夹
- 是文件则直接加载
- 是文件夹则继续查找文件夹下的 package.json 文件
- 有 package.json 文件则按照文件中 main 字段的文件名来查找文件
- 无 package.json 或者无 main 字段则查找 index.js 文件
#### 解析模块名
查找当前文件目录下，父级目录及以上目录下的 node_modules 文件夹，看是否有对应名称的模块
#### 解析绝对路径（不建议使用）
直接查找对应路径的文件

在 webpack 配置中，和模块路径解析相关的配置都在 resolve 字段下。
#### resolve 常用配置：
module.exports = {
   resolve: {
      alias: { // 配置别名
         utils: path.resolve(__dirname, 'src/utils'), // 模糊匹配，意味着只要模块路径中携带utils 就可以被替换掉
         component$: path.resolve(__dirname, 'src/component') // 只会匹配 import 'component'， 这是精确匹配方法。
      },
      modules: [
        path.resolve(__dirname, 'node_modules'), // 指定当前目录下的 node_modules 优先查找
        'node_modules', // 如果有一些类库是放在一些奇怪的地方的，你可以添加自定义的路径或者目录
      ],
      mainFiles: ['index'], //当目录下没有 package.json 文件时，我们说会默认使用目录下的 index.js 这个文件,就是这个字段配置的。// 你可以添加其他默认使用的文件名
      extensions: [".js", ".vue", ".json"] // 默认值: [".js",".json"]  模块名字可以省略的后缀名
  },
}

###  loader的规则条件配置

大多数情况下，配置 loader 的匹配条件时，只要使用 test 字段就好了，很多时候都只需要匹配文件后缀名来决定使用什么 loader，但也不排除在某些特殊场景下，我们需要配置比较复杂的匹配条件。webpack 的规则提供了多种配置形式：

- { test: ... } 匹配特定条件
- { include: ... } 匹配特定路径
- { exclude: ... } 排除特定路径
- { and: [...] }必须匹配数组中所有条件
- { or: [...] } 匹配数组中任意一个条件
- { not: [...] } 排除匹配数组中所有条件
上述的所谓条件的值可以是：

- 字符串：必须以提供的字符串开始，所以是字符串的话，这里我们需要提供绝对路径
- 正则表达式：调用正则的 test 方法来判断匹配
- 函数：(path) => boolean，返回 true 表示匹配
- 数组：至少包含一个条件的数组
- 对象：匹配所有属性值的条件



### 关于output
单个入口是配置方法：
```
const config = {
  entry: {
    main: './path/to/my/entry/file.js'
  }
};
const config = {
  output: {
    filename: 'bundle.js',
    path: '/home/proj/public/assets'
  }
};
```
多个入口时配置方法：
```
{
  entry: {
    app: './src/app.js',
    search: './src/search.js'
  },
  output: {
    filename: '[name].js',//多个时，用占位符[name]的方式定义
    path: __dirname + '/dist'
  }
}
```
### css\js是怎么嵌入html
无论output出来一个或多个js，html-webpack-plugin都会将js、css嵌入到html内：
```
const HtmlWebpackPlugin = require('html-webpack-plugin');
new HtmlWebpackPlugin({
      title: 'AICODER 全栈线下实习', // 默认值：Webpack App
      filename: 'indexMyApp.html', // 默认值： 'index.html'
      template: path.resolve(__dirname, 'src/tempHtml.html'),
      minify: {
        collapseWhitespace: true,
        removeComments: true, // 是否移除注释
        removeAttributeQuotes: true // 移除属性的引号
      }
    }),
```

### 模板index.html的ejs写法与html-webpack-plugin配合
模板文件index.html可以写ejs，ejs语法允许写js，然后每行用<%= %>包起来即可:
![](/image/webpack/tpl1.png)
![](/image/webpack/tpl2.png)
![](/image/webpack/tpl3.png)
![](/image/webpack/tpl4.png)
![](/image/webpack/tpl5.png)

注意：1.当有需求把一个js放在html 的header上，一个在body上时，可以定义模板script引用，此时必须设置inject为fasle，表示不适用插件默认嵌入。
2.上面ejs模板上一定要写成htmlWebpackPlugin，否则undefined，目前不知道为什么写成HtmlWebpackPlugin就可以关联到插件html-webpack-plugin

### 多页面html的配置打包
要生成多个html，就需要在webpack.config.js中多配置几次new  html-webpack-plugin
![](/image/webpack/mutilPage1.png)
![](/image/webpack/mutilPage2.png)
![](/image/webpack/mutilPage3.png)
![](/image/webpack/mutilPage4.png)
![](/image/webpack/mutilPage5.png)

### autoprefixer 配置 (postcss-loader)
```
要生成多个html，就需要在webpack.config.js中多配置几次new  html-webpack-plugin
{
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    sourceMap: true,
    //根据中国使用浏览器情况统计，兼容使用率大于百分之0.15的所有浏览器
    plugins: (loader) => [require('autoprefixer')({browsers: ['> 0.15% in CN']})]
  }
}
```
```
browsers: ['> 5% in US'] //根据美国使用浏览器情况统计，兼容使用率大于百分之5的所有浏览器
browsers: ['last 5 versions'] //兼容所有浏览器最新的五个版本
```
[点击查看更多](https://github.com/browserslist/browserslist#best-practices)

### html内img图片引用路径
在html或ejs模板文件，此时如果写绝对路径引用图片是没问题的，如果要使用相对路径，就必须使用require，
这是index.html文件：
```
  <div class=img>
      <img src="${ require('./assets/img/WechatIMG92.jpeg') }"  alt="标志" />
 </div>
```
这是ejs模板文件：
![](/image/webpack/htmltpl.png)
不过在项目中，所以类型的，对图片的引用，使用绝对路径都没问题，只有使用相对路径才会有以上问题。
不过在css中，引用图片，使用相对路径和绝对路径都没问题。

### 给图片指定生成目录
```
{
        test: /\.(png|svg|jpg|gif|jpeg)$/,
        include: [path.resolve(__dirname, 'src/')],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              //name既可以定义文件名字，也可以定义css生成路径，占位符[ext]是扩展externals的简写指图片扩展名
              name: 'image/[name]_image.[ext]'
            }
          }
        ]
      }
```

### 带ejs的入口index.html模板文件示例
对ejs的一点解释
1. <%  %> 不输出显示到浏览器上的写法，专门用来运算js；
2. <%=  %> 加了一个=后，输出显示到浏览器上的写法；
完整示例看 看[github 仓库中的 ejsHtml 分支 demo ](https://github.com/YeWills/webpack-code/tree/ejsHtml)，对应的tag发布版本为ejsHtmlV1.0

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <script
  src="https://code.jquery.com/jquery-3.1.0.js"
  integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
  crossorigin="anonymous">
</script>
 <% for (var key of htmlWebpackPlugin.files.css) { %>
  <link href="<%= key %>" rel="stylesheet">
 <% } %>
</head>
<body>
  <div id="dmo">我是模板文件自带的内容1</div>
  <div class="box">
    <% for (var key in htmlWebpackPlugin.files) { %>
        <%= key %> : <%= JSON.stringify(htmlWebpackPlugin.files.css) %>
    <% } %>
  </div>
  <div class=img>
      <img src="${ require('./assets/img/WechatIMG92.jpeg') }"  alt="标志" />
 </div>
  <script
  src="<%= htmlWebpackPlugin.files.chunks.appIndex.entry %>"></script>
  <script
  src="<%= htmlWebpackPlugin.files.chunks.lodashAndAxios.entry %>"></script>

</body>
</html>
```

### 两个横杠命令
webpack --devtool source-map;
发现凡是带两个--的命令，都是配置 webpack 的配置项。

## 构建与性能优化

构建与性能优化很多思路受益于kangshen，膜拜下大神。

### 升级到最新的webpack稳定版本
这无疑是性能显著提升的
### babel-loader 的优化
把 loader 应用的文件范围缩小,也就是说，配置loader的include来限定查询范围
```
rules: [ 
  {
    test: /\.jsx?/,
    include: [ 
      path.resolve(__dirname, 'src'), 
      // 限定只在 src 目录下的 js/jsx 文件需要经 babel-loader 处理
      // 通常我们需要 loader 处理的文件都是存放在 src 目录
    ],
    use: 'babel-loader',
  },
  // ...
],
```
#### 设置exclude
```
resolve: {
  modules: [
    path.resolve(__dirname, 'node_modules'), // 使用绝对路径指定 node_modules，不做过多查询
  ],

  // 删除不必要的后缀自动补全，少了文件后缀的自动匹配，即减少了文件路径查询的工作
  // 其他文件可以在编码时指定后缀，如 import('./index.scss')
  extensions: [".js"], 

  // 避免新增默认文件，编码时使用详细的文件路径，代码会更容易解读，也有益于提高构建速度
  mainFiles: ['index'],
},
```
#### 启用缓存
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

### 生产下库与业务js分离
对于单页面应用 生产下库与业务js分离，可以利用浏览器http请求缓存机制，提高下一次访问速度。
对于多页面应用 生产下库与业务js分离，可以利用浏览器http请求缓存机制，提高访问下一页的速度。

更多详细库与业务js分离配置方法 请看 1.13章节 《webpack常用知识--分离 库与业务代码》

更多信息，看[demo示例](https://github.com/YeWills/webpack-code/tree/master)

```
optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
           chunks: 'initial',
           test: 'lodashAndAxios',
           enforce: true,
           name: 'lodashAndAxios',//对应覆盖entry.chunkFilename中的name占位符[name]
        }
      }
    }
  }
```
optimization.splitChunks.cacheGroups.chunks也可以是函数，例如：

```
optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
           chunks: 'all',
           test: /\.(sc|c|sa)ss$/,
           enforce: true,
           name: 'styles',//对应覆盖entry.chunkFilename中的name占位符[name]
        },
        commons: {
           chunks: (chunk) => {
             return chunk.name !== 'styles';//避开上面定义的styles chunk
           },
           test: 'lodashAndAxios',
           enforce: true,
           name: 'lodashAndAxios',//对应覆盖entry.chunkFilename中的name占位符[name]
        }
      }
    }
  }
```

### 使用花括号{}进行import
例如 使用lodash，推荐这种写法import { filter } from 'lodash';
用什么就花括号，取什么。

### 依赖包和业务js分离
一般依赖包如loadsh，jq这些很少改变，而一般只改变业务js，分开打包后，依赖包js文件名，每次发布版本都是一样的，
浏览器的http请求缓存机制，浏览器不会重复请求，直接拿浏览器缓存的依赖包js即可，可提高性能，减少流量。每次发布版本，
只需要请求业务js。

### 设置外部依赖
将笨重的很多页面都用到的js通过externals设置成外部依赖。

### 利用浏览器http缓解机制
利用浏览器http缓解机制，库与js代码分离，可以提高速度，减少流量。(这个应该属于 项目性能优化范畴)

### autodll-webpack-plugin
该插件能够快速打包，能把第三方依赖的文件能提前进行预编译打包到一个文件里面去。提高了构建速度。因为很多第三方插件我们并不需要改动它，所以我们想这些第三方库在我们每次编译的时候不要再次构建它就好,可以非常明显提高rebuild速度
该插件有两个作用：
1、可以明显提高rebuild的速度；
2、可以调试库源码；

更多信息，看[demo示例](https://github.com/YeWills/webpack-code/tree/master)

```
const AutoDllPlugin = require('autodll-webpack-plugin');
 new AutoDllPlugin({
      filename: '[name]_chunk.js',
      // 如果需要调试库源码，将inherit设置为true，是调试源码的尖刀利器，不过会影响rebuild速度
      inherit: false,//当为false时，速度更快；当为true时，可以打开webpack没有压缩过的源码sourcemap调试
      inject: true,
      debug: true,
      entry: {
        appVendor: [
          'axios',
          'lodash'
        ]
      }
    }),
```

### happypack
webpack 只能一个loader处理完后处理下一个loader，这样，速度就慢，为了同时进行多线程loader，同时处理多个loader，可以使用happypack；
配置happypack可以明显提高构建速度。
- 其他的都好配置，就postcss-loader 比较特殊，必须要另外新建 postcss.config.js 否则报错；
- happypack 重写原来loader配置时，基本上就是复制，不改变，只有postcss可能稍微改动下

更多信息，看[demo示例](https://github.com/YeWills/webpack-code/tree/master)

```
const HappyPack = require('happypack');
 module: {
    rules: [
      {
        test: /\.(sc|c|sa)ss$/,
        loader: 'happypack/loader?id=handerStyle'
      }
    ]
  },

 new HappyPack({
      id:'handerStyle',
      loaders:[
        'style-loader', 
        {
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        },
        'postcss-loader', 
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true
          }
        }
      ]
    })

```
```
//postcss.config.js
module.exports = {
  ident: 'postcss',
  sourceMap: true,
  plugins: {
    'autoprefixer': {
      browsers: ['> 0.15% in CN']
    }
  }
}

```
### webpack-parallel-uglify-plugin
生产环境配置。
happypack是多线程操作loader进行多线程转译文件；与此相似，webpack-parallel-uglify-plugin是多线程进行压缩js，提高生产环境下的打包速度。
更多信息，看[demo示例](https://github.com/YeWills/webpack-code/tree/master)
```
module.exports = {
  plugins: [
    // 使用 ParallelUglifyPlugin 并行压缩输出JS代码
    new ParallelUglifyPlugin({
      // 传递给 UglifyJS的参数如下：
      uglifyJS: {
        output: {
          /*
           是否输出可读性较强的代码，即会保留空格和制表符，默认为输出，为了达到更好的压缩效果，
           可以设置为false
          */
          beautify: false,
          /*
           是否保留代码中的注释，默认为保留，为了达到更好的压缩效果，可以设置为false
          */
          comments: false
        },
        compress: {
          /*
           是否在UglifyJS删除没有用到的代码时输出警告信息，默认为输出，可以设置为false关闭这些作用
           不大的警告
          */
          warnings: false,

          /*
           是否删除代码中所有的console语句，默认为不删除，开启后，会删除所有的console语句
          */
          drop_console: true,

          /*
           是否内嵌虽然已经定义了，但是只用到一次的变量，比如将 var x = 1; y = x, 转换成 y = 5, 默认为不
           转换，为了达到更好的压缩效果，可以设置为false
          */
          collapse_vars: true,

          /*
           是否提取出现了多次但是没有定义成变量去引用的静态值，比如将 x = 'xxx'; y = 'xxx'  转换成
           var a = 'xxxx'; x = a; y = a; 默认为不转换，为了达到更好的压缩效果，可以设置为false
          */
          reduce_vars: true
        }
      }
    }),
  ]
}

```

### ContextReplacementPlugin
配置ContextReplacementPlugin，是优化配置，下面章节《其他常用插件》有讲

### webpack.HashedModuleIdsPlugin
打包中chunkhash的规则：
当没有删除或增加文件，如果对于chunk的代码没有变化，chunkhash值不会变，可以起到浏览器缓存的作用；
但当有删除或增加文件是，如果对应chunk的代码没有变化，打包是，chunkhash还是会变，这不是我们想要的结果，我们只希望对应chunk代码如果没变化，
无论其他代码文件删除或增加，chunkhash都不变。
（为什么会变，webpack自带打包策略是给每个文件配置了一个数字index，无论增加或删除一个文件，都会打乱整个 index，导致chunkhash变化，
HashedModuleIdsPlugin，改变策略为，根据文件路径配置，所以达到了稳定chunkhash）
为了达到以上效果，请配置HashedModuleIdsPlugin插件：
new webpack.HashedModuleIdsPlugin({
  hashDigestLength：20
})

该插件会根据模块的相对路径生成一个四位数的hash作为模块id, 建议用于生产环境。
用 HashedModuleIdsPlugin 可以轻松地实现 chunkhash 的稳定化，可以实现持久化缓存。
建议生产配置使用，如果使用到了chunkhash，则最好配置HashedModuleIdsPlugin。
更多请看章节2.7.4:《webpack 黑知识 之 [name][id][hash][chunkhash][name]》
或看官网
对于 chunkhash与HashedModuleIdsPlugin 看参看 [这里](https://www.cnblogs.com/zhishaofei/p/8590627.html)

```
  plugins: [
    new webpack.HashedModuleIdsPlugin({
      hashDigestLength: 20
    })
  ]
```

### webpack.NormalModuleReplacementPlugin
webpack.NormalModuleReplacementPlugin(a,b)编译时，第一个参数通常是正则，第一个参数正则匹配到文件后，会将此文件替换为第二个参数，从而达到生产或开发时，编译不同文件的目的，比如生产和开发时编译不同的路由文件。
所以配置时，在webpack.config.plugins中，位于最前面，保证webpack执行编译时，首先启用此插件替换文件。
注意的是，此插件的第一个参数一般都设置为正则。
```
plugins:[
  new webpack.NormalModuleReplacementPlugin(
    /some\/path\/config\.development\.js/,
    './config.production.js'
  ),
]

```

### webpack.optimize.OccurrenceOrderPlugin
OccurrenceOrderPlugin插件：根据出现次数为每一个模块或者chunk设置id,经常使用的模块则会获取到较短的id(和前缀树类似)，这可以使id可预测并有效减少文件大小，建议使用在生产环境中～
[参考](https://www.cnblogs.com/xuepei/p/7992423.html)
有些说是可以优化排序输出
```
plugins:[
  new webpack.optimize.OccurrenceOrderPlugin(),
]

```

### webpack.optimize.AggressiveMergingPlugin
AggressiveMergingPlugin用于合并块。
AggressiveMergingPlugin用于解决如路由分配不合理，会打包出很多很小的文件，每个文件或许只有几k，却多了很多网络请求，得不偿失。
用法很简单：
```
plugins:[
  new webpack.optimize.AggressiveMergingPlugin(),
]

```

### react-loadable 懒加载优化生产模式构建速度以及页面访问速度
这条优化经验受kangshen启发，表示对大神的膜拜，具体思路是：
利用react-loadable懒加载，将生产模式下的路由配合react-loadable懒加载，显示哪个路由页面，就编译加载某个路由页面，这样既提高webpack编译速度，又提高页面访问速度。
将路由进行懒加载有一个弊端是只能看到你打开页面的报错，没有打开的页面报错你无法看到。

react-loadable 是2017年5月左右才出现，到如今，GitHub上已经有一万多颗star，是可以比拟react-redux的插件，非常棒，项目中如果有用到懒加载，用这个框架非常好react-loadable

### 减少不必要的plugin

##  常用插件
### ContextReplacementPlugin
当项目用到moment时，务必使用此插件，可减少打包体积，以下代码为例，匹配moment/locale路径，只加载编译此路径下的/zh-cn|zh-hk|en/的文件。
new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn|zh-hk|en/)

### webpack.NormalModuleReplacementPlugin
用法请看章节《构建与性能优化》

### webpack.DefinePlugin
此插件定义值时，都需加JSON.stringify。
```
plugins: [
    new webpack.DefinePlugin({
      'process.env.ASSET_PATH': JSON.stringify("5fa3b9"),
      'process.env.FLAG': JSON.stringify(true)
    })
  ]
```

### ProvidePlugin
配置全局变量，自动加载模块，不必到处import或require：
例如设置$为全局变量，指向jq。
new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery'
})

### webpack.optimize.OccurrenceOrderPlugin
用法请看章节《构建与性能优化》

### happypack
用法请看章节《构建与性能优化》

### AutoDllPlugin
用法请看章节《构建与性能优化》

### webpack-parallel-uglify-plugin
用法请看章节《构建与性能优化》

### webpack.HashedModuleIdsPlugin
用法请看章节《构建与性能优化》

### webpack.optimize.AggressiveMergingPlugin
用法请看章节《构建与性能优化》


##  webpack 版本变化
### css分离插件
webpack4.x弃用了extract-text-webpack-plugin，使用mini-css-extract-plugin代替，来做css从html中分离单独成一个css文件。
```
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
 module: {
    rules: [
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
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name][hash].css', // 设置最终输出的文件名
      chunkFilename: '[id][hash].css'
    })
  ],

```

### webpack注意事项
- 不要在生产环境下使用inline模式的source map，因为这会使js文件变得很大，而且会泄露源码。
- 尽量写全名称，扩展名也写上 const common = require('./webpack.common.js');不要写成require('./webpack.common')，不利于编译查询。
- 线上发布，或CDN优化配置，大部分与合理配置publicpath有关。


## 参考和学习资料
[老马全栈VIP2_02_webpack4配置入门到进阶](https://ke.qq.com/course/321174)
[webpack深入与实战](https://www.imooc.com/learn/802)
[Vue+Webpack打造todo应用](https://www.imooc.com/learn/935)
掘金小册-使用webpack定制前端开发环境
吴浩麟-深入浅出webpack
[webpack 插件官网](https://www.webpackjs.com/plugins/hashed-module-ids-plugin/)
[webpack学习系列](https://segmentfault.com/a/1190000007479892)
[WebPack 终极配置说明](https://www.mmxiaowu.com/article/58482332d4352863efb55465)
[原创webpack demo 主要应用分支](https://github.com/YeWills/webpack-code/tree/master)
[原创webpack demo 模板ejs语法分支](https://github.com/YeWills/webpack-code/tree/ejsHtml)
[原创webpack demo 自定义merge config分支](https://github.com/YeWills/webpack-code/tree/webpack_custom_merge_demo)