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

``` bash
$ hexo server
```

More info: [Server](https://hexo.io/docs/server.html)

#### js sourcemap的处理

``` bash
$ hexo server
```

More info: [Server](https://hexo.io/docs/server.html)

## webpack 黑知识

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

``` bash
$ hexo server
```

