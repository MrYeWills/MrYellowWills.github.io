---
title: npm包开发
date: 2020/5/1
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




## vikingship打包、调试、使用 

### vikingship 开发编译
vikingship 用的是 creat-react-app，开发编译阶段使用 creat-react-app 自带的编译方式，即webpack。
这一点与 vikingship 的生产编译不同，生产编译使用 tsc 编译。

### vikingship 生产编译

#### 过程分析
vikingship 用的是 creat-react-app， 生产编译不依赖webpack,基于tsc自带的编译创建 `tsconfig.build.json`进行编译。
相关说明在 另外一篇博客《再读 typescript 笔记》

通过 ts 编译 编译出 js文件；

css文件需要使用 node-sass 编译
```s
node-sass ./src/styles/index.scss ./dist/index.css
```

#### package.json 配置
以下这三行一定要加上，不然生产编译出来的文件，外界import的时候，无法读取
```json
{
  "main": "dist/index.js", 
  //module 用于tree shaking 优化 ， 
  //此外module定义了库的入口文件，就是被项目 import的时候，指向的源码js入口, 其优先级高于上面的main，
  //当没有定义module的时候，入口文件以上面的main定义的为准
  "module": "dist/index.js", 
  "types": "dist/index.d.ts",
  //files 定义非常关键
  //files代表那些文件要上传到npm服务器上，如果你什么都不写，npm会参照 .gitignore 的内容进行上传
  //一些特定文件，无论是否在files内声明，都会被上传到npm服务器中，如 package.json ,README.md 等等
  "files": [ 
    "dist" 
  ],
}

```

#### 关键的files
参考上面源码中的解说。

### 使用此库

其他应用使用这个库的时候， 需要全局引用 css， 也就是上面的 `./src/styles/index.scss`, 然后再import 上一步打包出来的 js文件即可.

这种使用方式与 ant-design 、 fusion 是一样的：
先全局引用 css文件，
然后import 库；

### 开发调试

#### 使用sortybook 或 dumi 进行开发
这样的好处是，storybook 或 dumi 实时启动了 demo，以便调试

#### npm link
项目引入此库时：
先在此库中执行 npm run build  生成js文件
然后执行 `node-sass ./src/styles/index.scss ./dist/index.css` 生成css文件

因为 npm link 引用的下面指定的文件
```
"main": "dist/index.js",
```

### react版本不一致导致的问题
#### npm link
调试时，npm link vikingship ，但发现vikingship使用的react 与 项目使用的react版本不一致，
会导致报错hook问题，或项目崩溃，
这一点，在react官网有提及。
有两种解决方式：
- 临时方式， 在vikingship库开发目录下， npm link 某项目下的react：
![](/image/npm/link.png)
- 终极方式(推荐)：使用 peerDependencies

```js
  "peerDependencies": {
    "react": ">=16.8.0",
    "react-dom": ">=16.8.0"
  },
  "devDependencies": {
    "react": "^16.12.0",
    "react-dom": "^16.12.0",
  }
```

### 相关问题


#### 为什么打包能单独打包css

因为此库的scss文件有一个总入口：
`src\styles\index.scss:`
```css
// config
@import "variables";
//layout
@import "reboot";

//mixin
@import "mixin";
// animation
@import "animation";
// button
@import "../components/Button/style";
// menu
@import "../components/Menu/style";
// icon
@import "../components/Icon/style";
//input
@import "../components/Input/style";
//auto-complete
@import "../components/AutoComplete/style";
//upload
@import "../components/Upload/style";
//progress
@import "../components/Progress/style";
```

#### 为什么打包要分成 css 和 js 两个步骤
tsc只能打包ts、js文件，无法打包css

#### 能否使用webpack 生产打包
可以，因为打包最终一般只生产一个 css 和 一个 js 文件。
只要webpack 能打包成一个 css 或 js 即可。


### 延申

#### 奇妙的 npm script 中的 pre 关键字
这里的 prepublishOnly 与 prepublish 是一样的，
在命令行中，如果执行 npm run publish, 
npm script 就会寻找 是否定义了 pre + publish = prepublish 命令，如果有定义，先执行，
```
 "scripts": {
    "prepublishOnly": "npm run test:nowatch && npm run lint && npm run build"
  },
```

#### prepublishOnly 与 prepublish 区别

prepublish 会在npm install 和 npm run publish 时都会运行，有一定的bug；
prepublishOnly 只会在 npm run publish 时才运行；

#### devDependencies 与 dependencies
当库被第三方使用的时候，安装依赖的时候，dependencies 内的包都将被下载到依赖， devDependencies 不会被下载过去，因此 定义好 二者 对于使用此库的人非常友好。
下面依赖应该都放到 devDependencies 中：
```json
"devDependencies": {
    "@types/classnames": "^2.2.9",
    "@types/react": "^16.9.13",
    "@types/react-dom": "16.9.4",
    "node-sass": "^4.14.1",
    "react-scripts": "3.2.0",
    "typescript": "3.7.2"
  }
```


#### peerDependencies 与 devDependencies
peerDependencies 是npm的配置，
peerDependencies 告诉npm，被定义在这里的包，将不会被下载，直接使用现有的 node_module 下载好的，如果 node_module 中版本低于配置的，就给与warning提醒：
![](/image/npm/warn.png)

peerDependencies 通常用于 发布以后，被项目使用的时候，项目中使用的react版本 与 库中使用的 react版本不一致导致的问题。

解决完发布后的问题， 那么库在本地开发阶段也要 使用 react， 此时可以将 react 放到 devDependencies 中，
因为npm 的策略， 第三方库被引用时，安装依赖的时候，只下载 dependencies 依赖，不下载 devDependencies 依赖， 这样就不会有冲突了：

```
  "peerDependencies": {
    "react": ">=16.8.0",
    "react-dom": ">=16.8.0"
  },
   "devDependencies": {
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
  }
```

### 发布和commit前检查配置

#### 过程如下
```json
 "scripts": {
   //ext扩展名 eslint检查js,ts,tsx 后缀的文件， 检查范围时 src 目录下，
   // 当 warning数量 大于5时，终止检查和程序继续执行，
    "lint": "eslint --ext js,ts,tsx src --max-warnings 5",
    "test": "react-scripts test", //执行单元测试
    //CI 是 create-react-app 的关键字环境变量，定义为true的时候，允许npm run publish时 执行单元测试
    "test:nowatch": "cross-env CI=true react-scripts test", 
    "build": "npm run clean && npm run build-ts && npm run build-css",
    "build-ts": "tsc -p tsconfig.build.json",
    "build-css": "node-sass ./src/styles/index.scss ./dist/index.css",
    "prepublishOnly": "npm run test:nowatch && npm run lint && npm run build"
  },
  //husky 用于 commit前检查，git commit前，执行单元测试 和 eslint
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:nowatch && npm run lint"
    }
  },
```
#### husky 用于 commit前检查
参考上面代码

### travis 实现持续集成

#### CI 与 CD
- CI 持续集成
频繁的将代码集成到主干 master
快速发现错误
防止分支大幅偏离主干

以便 项目的快速迭代

- CD 持续交付 持续部署
频繁的将软件的新版本，交付给质量团队或者用户；
代码通过评审以后，自动部署到生产环境；

持续集成的意义：
组件库 发布一个版本 涉及过程： git push 、 单元测试、 npm publish、 build 文档静态文件、上传服务器-生成新的文档站点。
如果没有持续集成，你要先等 publish build 完成 才能进入下一步， 下一步完成 才能进入下一步，浪费时间。
这就是 CI 存在的意义。

#### https://docs.travis-ci.com/user/tutorial
注意2018年后，travis更新为 `travis-ci.com` [网站](https://docs.travis-ci.com/user/tutorial)。


#### github page 的 travis.yml 示例

```yml
# .travis.yml
language: node_js  #使用node js
node_js:
  - "stable"  #使用node 稳定版本
cache:
  directories:
  - node_modules   #缓存
env:
  - CI=true   #设置环境变量，因为本项目用到了单元测试，要开启为true
script:    #如果不设置script， travis默认执行 npm run test
  - npm run build-storybook
deploy: #这是发布到github page 上的固定配置
  provider: pages #这是发布到github page 上的固定配置
  skip_cleanup: true
  github_token: $github_token #此名字要与 travis中自己设置的github_token名字一样
  local_dir: storybook-static  #告诉travis要上传哪个文件夹,此文件一般是build后的文档站点源码，比如 hexo的 public
  on:
    branch: blog_code  #监听哪个分支，分支有提交时，触发sh脚本， 待考证，有些写成 master 分支了
  
```

上面的deploy local_dir 对应的是 下面npm script 生成的文件：
```json
"scripts": {
    "build-storybook": "build-storybook -s public",
  },

```


#### 设置github_token

![](/image/npm/token0.jpg)
![](/image/npm/token1.png)
![](/image/npm/token2.png)
```yml
deploy: 
  github_token: $github_token 此名字要与 travis中自己设置的github_token名字一样
```

#### yarn.lock 与 package-lock.json

当这两个文件同时存在时，travis.yml 会使用yarn.lock,
如果只有 package-lock.json 一个文件时， travis才会使用此文件安装依赖。


#### 疑点

travis 结合 GitHub pages 貌似有一套它们沟通好的钩子函数， 以上整个流程，我们都没有看到 GitHub page 要求的两个要求：
- 必须是github 下唯一的 个人名字命令的 仓库；
- 静态文档文件必须在 master分支；

### 库源码与使用库源码

[库源码](https://github.com/YeWills/react-ts-ant-npm.git)
[使用库的测试项目源码](https://github.com/YeWills/react-ts-npm-test.git)


## 其他

### 使用已有的npm账号发布

#### 步骤
[npm官网](https://www.npmjs.com/package/yewill-test-lint)登录进去，可查看自己的账号：
![](/image/npm/acc.jpg)

在npm包项目根目录控制台执行：
npm login
ybdt1201
密码
邮箱填上面图片的邮箱

好了后，

直接执行 npm publish 即可发布。
非常简单。

####  a 400 error bad request - email already registered

执行npm login时报错 ` email already registered`，一般是把 上面的 账号 写成了 上面图片中的 name了，或者登录密码错了，
就会导致这个错误。

