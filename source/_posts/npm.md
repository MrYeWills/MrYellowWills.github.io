---
title: npm包开发
date: {{ date }}
tags: npm
categories: 
- 前端工具
series: 前端工具
---

## npm包集中管理项目

### 概述与地址
[项目地址](https://github.com/YeWills/npmtest)
如果发布的npm包比较多，能集中管理这些包，是一种很好的提效方式。
为此，本项目使用 lerna 来集中管理发布，让lerna集中做包 version 等的管理，并集中发布到npm。
使用umi团队的 father (father-build) 来将packages包内的 src 编译到 lib（father默认将src编译到lib），
以便发布时使用编译后的es5代码。

### lerna npm发布利器
#### 集中发布管理
如上分析，lerna可以用于集中对包做version等管理。并集中发布。
lerna功能比较多，它会比对各个包，如果包没有变化，不改变包版本，如果有变化，会智能叠加小版本号。
#### 集中安装包依赖
`lerna bootstrap`可以用于集中安装packages下的包的依赖。
#### 其他
可网上查阅lerna。

### father编译es5 (father-build)
参考《概述与地址》讲解

### package.json
```json
{
  "private": false,//工程是私有或公有，若发布，默认设置false
  "scripts": {
    "bootstrap": "lerna bootstrap",//给package下的包，安装依赖
    "build": "father-build",// yarn build -w  src 编译到 lib，father默认将src编译到lib
    "changelog": "lerna-changelog",
    "clean": "lerna clean -y",
    "lint": "eslint --ext .js packages",
    "precommit": "lint-staged",
    "prettier": "prettier --write '**/*.{js,jsx,tsx,ts,less,md,json}'",
    "dpublish": "lerna publish"//集中管理发布包，包含name version ，发布前，将根目录下git push
  },
  "lint-staged": {
    "**/*.{js,jsx,tsx,ts,less,json}": [
      "prettier --write",
      "git add"
    ]
  },
  "devDependencies": {
    "father-build": "^1.13.1",
    "husky": "1.2.0",
    "lerna": "3.6.0",
  },
  "dependencies": {}
}
```
### lerna.json
`lerna bootstrap`可以用于集中安装packages下的包的依赖。使用npm或yarn安装时，
请定义好`"npmClient": "npm"`
```json
{
  "packages": ["packages/*"],
  "command": {
    "version": {
      "exact": true
    }
  },
  "npmClient": "npm",//使用yarn 或 npm 命令安装
  "version": "independent"
}
```
### husky 提交前验证
见项目源码。
### 包发布前，必须提交项目代码
执行 `yarn dpublish`前，必须根目录下，提交项目所有代码，否则出错。
### 发布时注意 npm 源的控制；
发布时，将包发布到npm指定到源，就可以在对应的源上进行npm install。

### 实时编译 -w
```
 "build": "father-build",// yarn build -w  src 编译到 lib，father默认将src编译到lib
```
### 使用
```
yarn build -w //开启代码实时监听编译，当packages内的包的src文件有变化时，实时编译到对应的lib文件内。
git add .
git commit -m "版本修改"
git push
yarn dpublish //代码编译，并提交后，将包发布到npm服务器上
```


## 调试技巧
### npm link
#### 概述
npm包未发布到线上时，需要本地调试，为解决npm包开发项目，与实际使用的业务项目不在同一个目录下的问题。
在npm包所在的目录下：
```
//比如 packages/yewBtn根目录下
npm link
```
npm在电脑本地内，将形成一个本地映射，在实际开发目录下：
```
npm link packageName
```
本地项目下将可以使用此包，且包的开发文件内，如果有改动，实际业务项目内将会获取到。
#### 只需要执行一次npm link
在包目录下，只需要执行一次npm link，在业务代码中就可以拿到最新源码

#### 通过node module包看是否最新
想知道node module包引用的是否为npm link最新代码，直接取node module包看就行。

#### 以目录地址为标识
在源码上执行 npm link 后，npm 将会建立以这个源码目录为标志的软链接，只要目录地址不变，
只需要最初执行一次npm link，以后业务代码中都可以用到最新。

#### 与lerna一起使用的技巧
一般业务代码中只能使用编译后es5版本的代码，开启 lerna --watch 后，只要源码有改变，就实时编译，业务代码中npm link到的代码就最新。






## npm包开发
### 概述
npm的开发主要是日常包开发，调试，发布，三个内容。
更多，可参考[如何在npm上发布自己的包](https://www.jianshu.com/p/f33a919443ed)

### package.json
相关信息查阅网上，这里挑几个重点。
#### files
选择要发布到npm服务器上的files
```json
 "files": [
    "cli.js",
    "index.js",
    "lib"
  ],
 
```
#### bin
如果设置此属性，意味着安装此包后，可执行如下`create-umi`命令，就会执行右侧cli.js。
bin的实现，大多使用`Yeoman`完成。
可参考 create-umi 包中bin开发处理。
```json
 "bin": {
    "create-umi": "cli.js"
  },
```
#### dependencies与devDependencies区别技巧
devDependencies通常用于开发时，如eslint，或者启动命令的包 如 cross-env 等等。
还有一个最直观的：
凡事在项目业务或组件代码中，明确做来import依赖的，说明是生产必须包 dependencies ，
其他没有被import的，基本上是 devDependencies

### 以create-umi为示例
create-umi是npm包开发的一个典范，可以参照其源码进行开发。

### Yeoman写bin
umi的bin，市面上很多bin的编写都使用了`Yeoman`。
参考《package.json  -  bin》

## 创建一个npm工程
### 目录结构
![](/image/npm/menu.png)

### 
