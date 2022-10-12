---
title: yarn官网笔记
date: 2022/8/8
tags: yarn
categories: 
- 前端工程
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


### .yarnrc.yml中的${NAME} 
${NAME}  ${NAME-fallback} ${NAME:-fallback}  是取环境变量的值， fallback是默认值。 
>[参考](https://yarnpkg.com/configuration/yarnrc)
Environment variables can be accessed from setting definitions by using the ${NAME} syntax when defining the values. 


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


## 好用的cli

yarn config  查看所有配置
yarn info 查看包的相关信息，不带参数，可以查看项目依赖
yarn why  比如 yarn why lodash  ： Display the reason why a package is needed.


## 重点的配置

### 重点配置
nmHoistingLimits  默认为 none ，也就是默认yarn install 的时候，使用 hoisted 模式。

packageExtensions  可用于解决第三方依赖依赖了错误的依赖的解决方案：[参考 packageExtensions](https://yarnpkg.com/configuration/yarnrc#packageExtensions)
注意的是，packageExtensions 与 resolutions 有点类似，注意二者区别使用
Note: This field is made to add dependencies; if you need to rewrite existing ones, prefer the resolutions field.


### 配置名 取名有讲究，
众所周知，package.json 是node的专利，而npm是node的默认包管理器，
而 yarn的配置，是同时可以通过 pakcage.json 和 yarn.yml 设置的，
pakcage.json中的配置，对应到 yarn.yml 中的名字就是，比如：
package.json中 publishConfig.registry 就是 yarn.yml 中的 npmPublishRegistry，
在yarn.yml中多了一个npm，少了一个config。















## npm 与 yarn 的区别
以 https://github.com/YeWills/react-redux-hooks-demo/tree/router-test 为例子， router-test 分支，
 **安装前，删除 yarn.lock 或 package.json.lock**
使用npm 安装：
npm 8.1.2
node v16.13.2
报错 
```s
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR! 
npm ERR! While resolving: reduxhooks@0.1.0
npm ERR! Found: react-redux@7.2.8
npm ERR! node_modules/react-redux
npm ERR!   react-redux@"^7.2.0" from the root project
npm ERR! 
npm ERR! Could not resolve dependency:
npm ERR! peer react-redux@"^4.4.8 || ^5.0.7" from connected-react-router@4.5.0
npm ERR! node_modules/connected-react-router
npm ERR!   connected-react-router@"^4.3.0" from the root project
npm ERR! 
npm ERR! Fix the upstream dependency conflict, or retry
npm ERR! this command with --force, or --legacy-peer-deps
npm ERR! to accept an incorrect (and potentially broken) dependency resolution.
npm ERR! 
npm ERR! See /Users/js/.npm/eresolve-report.txt for a full report.

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/js/.npm/_logs/2022-08-26T06_07_37_610Z-debug.log
```
原因是 react-redux peer依赖与顶层依赖 版本冲突，
上面已经提示了解决方案，要么就是修改第三方依赖，要么就是忽略版本冲突，npm install --force 或者 npm install --legacy-peer-deps安装。
本项目使用 npm install --force 时会报 npm ERR! gyp ERR! cwd  node-sass 的错，
使用 npm install --legacy-peer-deps 就可以正常安装完毕，不报上面的 node-sass。


使用yarn安装
yarn 1.22.19
node v16.13.2
使用yarn 的话，会忽略这种冲突，直接安装成功。
感觉这是 yarn 的缺陷，至少应该提示这种冲突的。
所以这个yarn 类似 npm install --force 或 npm install --legacy-peer-deps 。
除此之外，用 yarn 安装还不会报 npm ERR! gyp ERR! cwd  node-sass 的错误。 

yarn 好比 git 的merge，容错性比较好。
npm好比 git 的 rebase，将错误暴露出来。













































