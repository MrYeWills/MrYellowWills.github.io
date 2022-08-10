---
title: yarn官网笔记
date: 2022/8/8
tags: yarn
categories: 
- 前端工具
series: 前端工具
---

## 黑知识

### build:foo 与 $INIT_CWD
带冒号的script 的name，可以用于 workplace。
[参考](https://yarnpkg.com/getting-started/qa#how-to-share-scripts-between-workspaces)
>Little-known Yarn feature: any script with a colon in its name (build:foo) can be called from any workspace. Another little-known feature: $INIT_CWD will always point to the directory running the script.
```
{
  "dependencies": {
    "typescript": "^3.8.0"
  },
  "scripts": {
    "g:tsc": "cd $INIT_CWD && tsc"
  }
}
```

### yarn的install与缓存机制
[参考 官网](https://yarnpkg.com/features/offline-cache)
yarn install 时，会先将包从远程地址下载到yarn的全局位置进行缓存，
然后再从全局位置拷贝或者进行软链接到项目的node module下，

yarn install 再次安装时，先去上述的全局缓存位置找是否以前下载过，而不是从远程请求，因为有这个特性，因此在断网的情况下，
如果再次安装以前的包，也能安装成功。  这就让yarn具有了离线安装功能。

这一点与 yarn install 的过程相似：
>[再来看看安装依赖时发生了什么，现阶段 yarn install 操作会执行以下 4 个步骤：](http://loveky.github.io/2019/02/11/yarn-pnp/)
- 将依赖包的版本区间解析为某个具体的版本号
- 下载对应版本依赖的 tar 包到本地离线镜像
- 将依赖从离线镜像解压到本地缓存
- 将依赖从缓存拷贝到当前目录的 node_modules 目录

## yarn 2.x 新概念

yarn 2.x 印象比较突出的就是pnp概念，不过pnp不太好用，理由有：
- 首先它不会显式展示 node module，原来传统的debug调试手段无法调试npm包了，
- 另外一个所见即所得，它把你的npm包都隐藏起来或放到其他位置或压缩成zip了，应该是压缩成zip了。改成zip包后，都无法查看安装了哪些包，以及包内容的查看。
>压缩成zip的目的，：
yarn认为未压缩的node module 其占用的空间非常大，让整个项目占用内存大，因此都改成zip了，这样项目就占用空间非常小。

>[详细参考 - 【Zero-Installs】-- Is it different from just checking-in the node_modules folder?](https://yarnpkg.com/features/zero-installs#is-it-different-from-just-checking-in-the-node_modules-folder)Yes, very much. To give you an idea, a node_modules folder of 135k uncompressed files (for a total of 1.2GB) gives a Yarn cache of 2k binary archives (for a total of 139MB).

Zero-Installs 基于 pnp 。

- pnp是一种yarn主张的标准，其根本目的是为了解决下载项目快的问题，诚然，快很重要，但有边际效用，当快到一定程度后，再快给你开发带来的体验有限，
反倒是 开发调试 等等 这些对开发体验非常重要。
当前主流包管理pnpm npm 都基于缓存，都很好的实现了快安装的体验。这里面比较突出的是pnpm，既实现了优于npm的快安装，又兼顾了开发调试手段，非常棒。









































