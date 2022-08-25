---
title: yarn官网笔记
date: 2022/8/8
tags: yarn
categories: 
- 前端工具
series: 前端工具
---

## 黑知识

### yarn试验
```json
{
  "name": "yarndemo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "ajv": "~6.10.1"
  }
}
```
运行命令 yarn ，
结果 node_module 下安装的是 ajv 6.10.2 ， 这在yarn@2.x 与 1.x 版本下都是一样的表现

当然也可以用eslint来测试：
 "dependencies": {
    "eslint": "xxxx"
  }

#### 调试
可运行 yarn info 看package.json中实际依赖的版本，跟最终安装的版本；
可运行 yarn why ajv 看ajv被哪些包依赖；
当然了 依然可以用 npm list --all 看所有的版本依赖关系

#### yarn并不会锁版本
通过以上可知 当有[ ~ ^ ](https://docs.npmjs.com/cli/v8/commands/npm-update#caret-dependencies)时，yarn不一定会锁版本。
这与我们日常调试的有出入，可以以后再测试场景。


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

### 关于 PnP
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

### 关闭 PnP
Defines what linker should be used for installing Node packages (useful to enable the node-modules plugin), one of: pnp, pnpm and node-modules.

nodeLinker: "pnp"

定义 .yarnrc.yml ：
```yml
nodeLinker: node-modules
```
















































