---
title: monorepo笔记
date: 2022/07/27
tags: [monorepo, lerna]
categories: 
- 前端工具
series: monorepo
---



## lerna笔记

### 学习体会
昨天开始把 lerna官网，全英文的刷了遍，加在一起，不超过8小时，
但解决了很多疑问，
这次本打算，先刷一波相关的视频，然后再看文档，再看官网的，
索性直接刷官网了，
因为之前有使用lerna的基础，从头刷官网，整体刷一遍，感觉收获非常大，已经不需要再刷其他教程，可以直接上手使用learn了。
原本打算至少要花三天或更多时间，最后只用了一天半就搞定。
结合之前 label、webpack、eslint、umi、verdaccio 等经验，确实，学东西，直接去官网刷，可以作为第一选择，
如果之前没有相关经验，那么官网也会有快速示例让你体验，都是由浅及深，
而且官网讲究连续性，只有从头读完，反而理解起来更加容易，如果只看某一部分，很可能看不懂。

### 基础知识


#### 关于^prod 的解释

```js
{
  "namedInputs": {
    "default": ["{projectRoot}/**/*"],
    "prod": ["!{projectRoot}/**/*.spec.tsx"]
  },
  "targetDefaults": {
    "build": {
      "inputs": ["prod", "^prod"]
    },
    "test": {
      "inputs": ["default", "^prod", "{workspaceRoot}/jest.config.ts"]
    }
  }
}
```

>[参考官网](https://lerna.js.org/docs/features/cache-tasks)
With this configuration, the build script will only consider the non-test files of remixapp, header and footer. The test script will consider all the source files for the project under test and only non-test files of its dependencies. The test script will also consider the jest config file at the root of the workspace.

其实就是 ^其实是用来约束 pkg中的 dependencies pkg 的。


#### `--`的两种用法
#### 与lerna exec一起使用

```s
$ lerna exec --scope my-component -- ls -la
```
这个 -- ls -la 中的 -- 是什么意思？

目前知道上面这句话 应该就是 过滤 my-component ，然后执行命令bash命令 ls -la 
[参考](https://github.com/lerna/lerna/tree/main/commands/exec#readme)


#### 与lerna run 一起使用
```s
lerna run --scope my-component test
```
这里有 -- 的解释，其实就是，如果要传条件，就用这个； 
与上面的  lerna exec --scope my-component -- ls -la 中的 -- ，可能意义不一样，
也可能一样

>[参考](https://github.com/lerna/lerna/tree/main/commands/run#readme)
Run an npm script in each package that contains that script. A double-dash (--) is necessary to pass dashed arguments to the script execution.


## yarn笔记

### node_modules 结构设计
参考这个
[平铺的结构不是 node_modules 的唯一实现方式](https://pnpm.io/zh/blog/2020/05/27/flat-node-modules-is-not-the-only-way)

yarn node_modules 情况如下：
项目依赖 a，b， b依赖 a，c
```
项目
  -a
  -b
    -a
    -c
```
如果项目依赖的a与b依赖的a的版本号一样，
node_modules 结构为：
```
项目node_modules
      -a
      -c
      -b
        -a deduped
```
c会被提到根目录的node module。
deduped就是下面常见的类似：
```
│ ├─┬ @babel/plugin-proposal-dynamic-import@7.18.6
│ │ ├── @babel/core@7.18.6 deduped
│ │ ├── @babel/helper-plugin-utils@7.18.6 deduped
│ │ └── @babel/plugin-syntax-dynamic-import@7.8.3 deduped
```
如果项目依赖的a与b依赖的a的版本号不一样，
node_modules 结构为：
```
项目node_modules
      -a
      -c
      -b
        -node_modules
           -a
```
根目录下的ddd下的a是一个版本，然后b的node_modules下的a又是一个版本。


### 为什么能覆盖npm版本
首先要清楚  "eslint-config-airbnb-base": "14.1.0"
其package.json 为：
{
  "name": "eslint-config-airbnb-base",
  "version": "14.1.0",
  "dependencies": {
    "confusing-browser-globals": "^1.0.9",
    "object.assign": "^4.1.0",
    "object.entries": "^1.1.1"
  }
}


示例 
{
  "name": "npmd",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "eslint-config-airbnb-base": "14.1.0"
  }
}

此时

-node_modules
  - eslint-config-airbnb-base
  - object.assign@4.1.0

增加 object.assign后

{
  "name": "npmd",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "eslint-config-airbnb-base": "14.1.0",
    "object.assign": "^3.0.1"
  }
}

此时

-node_modules
  - eslint-config-airbnb-base
      -node_modules
          - object.assign@4.1.0
  - object.assign@3.0.1


当把 版本改为  "object.assign": "4.0.0"

{
  "name": "npmd",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "eslint-config-airbnb-base": "14.1.0",
    "object.assign": "4.0.0"
  }
}

此时

-node_modules
  - eslint-config-airbnb-base
      -node_modules
          - object.assign@4.1.0
  - object.assign@4.0.0


从上述可看到其实无法做到 覆盖npm包的目的。

更多参考
[创建非扁平化的 node_modules 文件夹](https://pnpm.io/zh/motivation)
[平铺的结构不是 node_modules 的唯一实现方式](https://pnpm.io/zh/blog/2020/05/27/flat-node-modules-is-not-the-only-way)
[lerna Hoisting](https://lerna.js.org/docs/concepts/hoisting)


## pnpm


pnpm.neverBuiltDependencies
https://pnpm.io/zh/package_json#pnpmneverbuiltdependencies
>该字段允许忽略特定依赖项的构建。 安装期间不会执行所列包的 “preinstall”、“install” 和 “postinstall” 脚本。

有空去看看npm install 时，要执行的 install文件；以及那边的文档；



这三个 pnpm yarn npm lerna 看完后，做一个总结，区别分析；
 


如何判断 文件是硬链接 还是软链接；

```s
# 正常文件，因为链接数是1，只有连接数为2或以上，才说明此文件被多个文件名指向；
localhost:pnpmd xhkj$ ls -li package.json 
8593468697 -rw-r--r--  1 xhkj  staff  275  7 28 23:54 package.json

# 软链接，首先 权限是lrwxr-xr-x ，以l开头，说明是软链接，跟着后面的文件地址指向 也说明了是软链接
localhost:pnpmd xhkj$ ls -li node_modules/express
8593461616 lrwxr-xr-x  1 xhkj  staff  41  7 28 23:10 node_modules/express -> .pnpm/express@4.18.1/node_modules/express


# 硬链接，因为链接数为2，且权限为 -rw-r--r-- ，没有l开头
localhost:pnpmd xhkj$ ls -li node_modules/express/Readme.md 
8593460636 -rw-r--r--  2 xhkj  staff  5404  7 31 00:34 node_modules/express/Readme.md

```

还有一个技巧，macOs下，对两个硬链接的文件，右键显示简介，只会出现一个简介弹框；
对软链接的文件夹和源文件，右键显示简介，会出现预期的两个简介弹框，软链接会显示 替身 ；

[参考](https://juejin.cn/post/7064113153776287751#heading-2)
[参考](https://juejin.cn/post/7013612655680159758)




## 注意
弄清楚 npm 发布的 beta  next latest 等；
反正有自己的私库，可以测试下；



https://docs.npmjs.com/about-packages-and-modules
d) A <name>@<version> that is published on the registry with (c).
e) A <name>@<tag> that points to (d).
version 与 tag 的区别

可以用 umi 测试：




3-3-x: 3.3.14
canary: 4.0.0-canary.20220729.2
latest-3: 3.5.31
latest: 4.0.9
next-3: 3.5.29-alpha.0
next: 4.0.0-rc.24

还有一些关键字 beta alpha 分别代表什么含义；
从上述umi上看， latest 应该是默认的稳定版本，npm install 的时候默认安装 latest 版本；
next 是最新的版本，除非 npm install 时指定 next，否则不下载；
beta alpha canary  stable, beta, dev, canary 呢？

[摘自官网](https://docs.npmjs.com/cli/v8/commands/npm-dist-tag)
>Tags can be used to provide an alias instead of version numbers.

For example, a project might choose to have multiple streams of development and use a different tag for each stream, e.g., stable, beta, dev, canary.

By default, the latest tag is used by npm to identify the current version of a package, and npm install <pkg> (without any @<version> or @<tag> specifier) installs the latest tag. Typically, projects only use the latest tag for stable release versions, and use other tags for unstable versions such as prereleases.

The next tag is used by some projects to identify the upcoming version.

Other than latest, no tag has any special significance to npm itself.

由上可知，latest 用于代表当前稳定版本，next 表示即将要发布的版本。
除了 latest 版本会默认被npm install下载外，其他任何tag，对npm没有任何意义，


会分别列出 所有 tag
参考 https://docs.npmjs.com/cli/v8/commands/npm-dist-tag

npm view umi time 查看 所有的 版本
{
  created: '2022-01-26T21:25:32.564Z',
  modified: '2022-07-29T07:05:17.251Z',
  '4.0.0-rc.1': '2022-01-29T03:15:28.085Z',
  '4.0.0-beta.12': '2021-12-09T07:59:31.668Z',
  '4.0.0-beta.1': '2021-10-29T09:59:56.288Z',
  '3.5.20': '2021-09-28T05:56:13.559Z',
  '3.5.19': '2021-09-17T05:10:35.079Z',
 
  '3.5.0-beta.20': '2021-06-29T02:23:50.731Z',
  '3.5.0-beta.1': '2021-06-03T09:14:30.703Z',
 
  '3.4.3-beta.1': '2021-03-15T09:08:24.537Z',
  '3.4.2': '2021-03-12T06:37:42.876Z',
  '3.4.1': '2021-03-11T10:19:50.798Z',
  '3.4.0': '2021-03-09T09:02:18.408Z',
  '3.4.0-beta.7': '2021-03-09T08:17:02.456Z',
  '3.3.9': '2021-02-23T10:23:22.806Z',
  '3.4.0-beta.1': '2021-02-23T08:11:12.394Z',
 
  '3.2.10': '2020-07-15T10:15:47.316Z',
  '3.3.0-alpha.0': '2020-07-14T08:33:13.251Z',
  '3.2.9': '2020-07-08T03:58:00.384Z',
  '3.2.0-beta.12': '2020-05-18T05:33:53.154Z',
  '3.2.0-beta.6': '2020-05-13T03:59:35.454Z',
  '3.1.4': '2020-05-09T03:29:44.477Z',
  '3.2.0-beta.5': '2020-05-07T15:27:13.349Z',
  '3.2.0-beta.4': '2020-05-07T09:54:44.560Z',
  '3.1.3': '2020-05-06T05:45:06.667Z',
  '3.2.0-beta.1': '2020-04-25T09:22:14.301Z',
  '3.1.2': '2020-04-25T09:12:16.226Z',
 
  '3.0.0-beta.38': '2020-03-01T14:59:28.935Z',
  '3.0.0-beta.1': '2020-02-03T06:38:53.334Z',
  
  '1.0.0-rc.23': '2018-02-25T00:35:41.351Z',
 
  '1.0.0-rc.1': '2018-01-30T12:36:20.134Z',
  '1.0.0-beta.37': '2018-01-19T05:54:08.278Z',
 
  '1.0.0-beta.2': '2017-12-01T09:49:41.747Z',
  '0.6.0': '2014-08-19T03:16:48.038Z',
  '4.0.0-beta.18': '2022-01-26T09:38:27.912Z',
  '4.0.0-rc.2': '2022-02-20T14:45:09.819Z',
  '4.0.0-rc.3': '2022-02-24T09:03:27.809Z',
  '3.5.21': '2022-02-25T06:40:41.715Z',
  '4.0.0-rc.4': '2022-03-03T07:55:29.821Z',
  '4.0.0-rc.5': '2022-03-04T03:46:44.095Z',
  '4.0.0-rc.6': '2022-03-10T08:14:44.124Z',
  '4.0.0-canary.20220316.1': '2022-03-16T08:41:08.595Z',
 
}



### tag相关的发布与调试 cli
[参考](https://docs.npmjs.com/cli/v8/commands/npm-dist-tag)
npm dist-tag ls @xnbz/olg 查看当前所有tag
npm view @xnbz/olg time
npm publish --tag beta 可以直接发布为tag
npm dist-tag add @xnbz/olg@0.0.5 beta  只能给已有的打tag

### 打tag不会改变版本名，是为了改变install版本
这里需要弄清楚的是， 
给发布的版本号，打tag，并不会改变npm包的版本号，而只是让该版本
是否被npm install 默认安装。
这是给版本号 打tag的非常重要的功能。

任何不打tag 就npm publish 的版本，将会被当作latest tag，将会被 npm install 默认下载下来。

### tag版本要手动设置好
tag版本要自己手动在package.json 中设置好，
然后执行 `npm publish --tag beta`
可以考虑的版本号：

4.0.0-canary.20220729.2
4.0.0-canary.20220316.1
3.5.29-alpha.0 用于 next 意义的版本名
4.0.0-beta.1   用于 测试 意义的版本名
4.0.0-beta.2
4.0.0-rc.1  用于 next 意义的版本名
4.0.0-rc.2


### 关于npm登陆、token、publish 关系
我们可以通过下面登陆，
 profile.loginCouch(accountNo, pwd, {
            registry: `http://127.0.0.1:${process.env.VERDACCIO_PORT ?? process.env.PORT}`
          })

这个登陆profile.loginCouch其实就是将账号密码，发送给npm启动的服务器，生成一串token（_authToken），

我们将这串tokken,按照下面格式写入 用户目录下的 /Users/js/.npmrc

//registry.npmjs.org/:_authToken=npm_B7wxxxxjTq3UuAAxxxxxxxxxxxxxxxxxxxx

此token相当于浏览器中的cookie，以后浏览器每次登陆校验这个cookie，
在终端的话，这个token就放到磁盘中，每次 npm publish、npm tag 等等，都是发请求，
在npm cli源码中，都会去获取 .npmrc 的 token，去校验登陆状态和用户信息；
如果用户信息登陆校验通过，
那么就可以执行 npm publish、npm tag 等等。


通过直接执行 npm login 命令，
登录完成后，
执行 npm config list 命令
就会看到 在 /Users/js/.npmrc 目录下，就会多出一条上述的token

//registry.npmjs.org/:_authToken=npm_B7wxxxxjTq3UuAAxxxxxxxxxxxxxxxxxxxx

说明了 npm login 命令也是可以自动生成一条 token的，
>[参考官网](https://docs.npmjs.com/about-access-tokens)
The npm CLI automatically generates an access token for you when you run npm login.

关于这条token的作用也说了：
>[参考官网](https://docs.npmjs.com/about-access-tokens)
An access token is a hexadecimal string that you can use to authenticate, and which gives you the right to install and/or publish your modules.


#### 经典的浏览器端与终端 session方式的差异
npm 终端登陆的方式，是一个经典的终端登陆方案；
浏览器的session存储于cookie中；
终端的session存储于磁盘中；

#### 所有的cli其实都是ajax请求
通过查看npm cli 源码，以及npm profile 源码可知，
所有的npm cli 命令很多都是发送请求。

#### 参考
[npm官网-About access tokens](https://docs.npmjs.com/about-access-tokens)
[npm/cli 源码](https://github.com/npm/cli)
[npm-profile](https://github.com/npm/npm-profile#login)





### monorepo的npm包查看github仓库的小技巧
[详细查看](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#repository)
```js
// monorepo的npm包 的 package.json ,那么其仓库在 下面的url上，目录层级在 directory上
{
  "repository": {
    "type": "git",
    "url": "https://github.com/facebook/react.git",
    "directory": "packages/react-dom"
  }
}
```







