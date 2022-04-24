---
title: babel笔记
date: 2021/10/23
tags: [babel]
categories: 
- 前端工程
series: 前端工程
---




## 基础知识

### astexplorer ast可视化编译网址
[astexplorer ast可视化编译网址](https://astexplorer.net/)

![](/image/babel/ast.png)

### parser的发展
![](/image/babel/parser.png)

### 顺序
preset 和 plugin 从形式上差不多，但是应用顺序不同。

babel 会按照如下顺序处理插件和 preset：

先应用 plugin，再应用 preset
plugin 从前到后，preset 从后到前
这个顺序是 babel 的规定。

### 名字

*以下 摘自 [Babel 插件通关秘籍 - Babel 插件和 preset](https://juejin.cn/book/6946117847848321055/section/6946582521672892456)：*

babel 对插件名字的格式有一定的要求，比如最好包含 babel-plugin，如果不包含的话也会自动补充。

babel plugin 名字的补全有这些规则：

如果是 ./ 开头的相对路径，不添加 babel plugin，比如 ./dir/plugin.js
如果是绝对路径，不添加 babel plugin，比如 /dir/plugin.js
如果是单独的名字 aa，会添加为 babel-plugin-aa，所以插件名字可以简写为 aa
如果是单独的名字 aa，但以 module 开头，则不添加 babel plugin，比如 module:aa
如果 @scope 开头，不包含 plugin，则会添加 babel-plugin，比如 @scope/mod 会变为 @scope/babel-plugin-mod
babel 自己的 @babel 开头的包，会自动添加 plugin，比如 @babel/aa 会变成 @babel/plugin-aa
（preset也是一样）

规则比较多，总结一下就是 babel 希望插件名字中能包含 babel plugin，这样写 plugin 的名字的时候就可以简化，然后 babel 自动去补充。所以我们写的 babel 插件最好是 babel-plugin-xx 和 @scope/babel-plugin-xx 这两种，就可以简单写为 xx 和 @scope/xx。

写 babel 内置的 plugin 和 preset 的时候也可以简化，比如 @babel/preset-env 可以直接写@babel/env，babel 会自动补充为 @babel/preset-env。

### 插件分类
babel 的 plugin，就 @babel/plugin-syntax-xxx, @babel/plugin-transform-xxx、@babel/plugin-proposal-xxx 3种。*语出 [Babel 插件通关秘籍 - Babel 的内置功能（上）](https://juejin.cn/book/6946117847848321055/section/6954550974698651680)*

### babel runtime
[参考 Babel 插件通关秘籍 - Babel 的内置功能（上）](https://juejin.cn/book/6946117847848321055/section/6954550974698651680)
>babel runtime 里面放运行时加载的模块，会被打包工具打包到产物中，下面放着各种需要在 runtime 使用的函数，包括三部分：regenerator、corejs、helper。
corejs 这就是新的 api 的 polyfill，分为 2 和 3 两个版本，3 才实现了实例方法的polyfill
regenerator 是 facebook 实现的 aync 的 runtime 库，babel 使用 regenerator-runtime来支持实现 async await 的支持。
helper 是 babel 做语法转换时用到的函数，比如 _typeof、_extends 等
babel 做语法转换和 api 的 polyfill，需要自己实现一部分 runtime 的函数，就是 helper 部分，有的也没有自己实现，用的第三方的，比如 regenerator 是用的 facebook 的。api 的 polyfill 也是用的 core-js 的，babel 对它们做了整合。

>babel runtime，这个包下的代码会被打包到产物中，运行时加载，包括 helper、regenerator、core-js 3部分。

### babel 是微内核架构
babel 是微内核架构，就是因为核心只实现了编译流程，具体的转换功能都是通过插件来实现的
详细参考 [手写 Babel： core篇](https://juejin.cn/book/6946117847848321055/section/6994379397591466017) 
[手写 Babel： 总结](https://juejin.cn/book/6946117847848321055/section/6995835006530617381)

### 技术箴言

我觉得任何一个技术只有学习到一定的程度才是有意义的，让它化为你思想的一部分，而不是只是使用。只是使用没啥竞争力。 语出 [Babel 插件通关秘籍](https://juejin.cn/book/6946117847848321055/section/6947682728250736676)

### babel 测试

```js
//"@babel/plugin-transform-runtime"
//"@babel/preset-env"
const { transformFileSync } = require('@babel/core');
const path = require('path');

const { code } = transformFileSync(path.join(__dirname, './souce.js'), {
    filename: 'a.js',
    plugins: [[
        '@babel/transform-runtime', {
            corejs: 3
        }
    ]],
    presets: [['@babel/env', {
        useBuiltIns:'usage',
        targets:{
            browsers:'Chrome 45'
        },
        corejs: 3
    }]]
});

console.log(code);
```

```js
// souce.js
new Array(5).fill('1243')
```

### sourcemap
[为了调试工作能够使用source map](https://developer.mozilla.org/zh-CN/docs/Tools/Debugger/How_to/Use_a_source_map)，你必须：
生产一个source map
加入一个注释在转换后的文件，它指向source map。注释的语法类似：
```
//# sourceMappingURL=http://example.com/path/to/your/sourcemap.map
```
这里有一个很好的[sourcemap 例子](https://github.com/YeWills/babel-plugin-exercize/blob/master/exercize-babel/test/html/test.html)

### @babel/preset-env
此预设解决两件事情：
- 引入插件；
- 引入 polyfill ;

注意的是，此预设会自动引入插件，但不会自动引入 polyfill，因此需要手动指定引入的polyfill,以及引入方式：
```js
{
    "presets": [["@babel/preset-env", { 
        "targets": "> 0.25%, not dead", // 根据此属性 判断引入哪些 插件
        "useBuiltIns": "usage",// 引入polyfill的方式
        "corejs": 3// polyfill的版本
    }]]
}
```
[更多参考](https://juejin.cn/book/6946117847848321055/section/6947175741821812768)

### @babel/preset-env 调试

```js
['@babel/env', {
            debug: true,
            useBuiltIns: 'usage',
            corejs: 3
        }]
```
debug 模式下，会打印所有的插件以及polyfill。


### 同时定义 @babel/transform-runtime 与 @babel/preset-env

#### profill以@babel/transform-runtime为准
同时定义 @babel/transform-runtime 与 @babel/preset-env，此时profill 以  @babel/transform-runtime 为准，
@babel/preset-env 因为是之后执行，因此会看runtime是否已有相关plugin加载，若加载，就不再生成runtime，测试：
```js
const { transformFileSync } = require('@babel/core');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const { code } = transformFileSync(path.join(__dirname, './souce.js'), {
    filename: 'a.js',
    plugins: [[
        '@babel/transform-runtime', {
            corejs: 3,
            proposals: true
        }
    ]],
    presets: [['@babel/env', {
        useBuiltIns:'usage',
        // debug :true,
        targets:{
            browsers:'Chrome 44'
        },
        corejs: 3
    }]]
});


fs.writeFileSync('./smap.js', code)

execSync('node ./smap.js', { cwd: process.cwd() });

```

#### 不会有重复引入的问题
参考上面所说的，@babel/transform-runtime 和 @babel/preset-env 都是对js代码的编译，
经过@babel/transform-runtime编译后，js中的es6已经被转换为 es5了，
然后将这个es5的代码传递给 @babel/preset-env 编译，
@babel/preset-env 检测不到 es6 ,当然就不会进行 runtime 的引入了，
所以不会有重复引入的问题

#### 一定要同时配置 @babel/transform-runtime 与 @babel/preset-env的core
以下说法待进一步验证：
为什么，babel7 还是有很多不规范的，目前应该是要都配置，[参考](https://juejin.cn/book/6946117847848321055/section/6947175741821812768)：
>但是一些 proposal 的插件需要单独引入，并且 @babel/plugin-transform-runtime也要单独引入。
>如果希望把一些公共的 helper、core-js、regenerator 等注入的 runtime 函数抽离出来，并且以模块化的方式引入，那么需要用 @babel/plugin-transform-runtime 这个包。

#### @babel/transform-runtime 解决了全局污染问题
preset-env 会在使用到新特性的地方注入 helper 到 AST 中，并且会引入用到的特性的 polyfill （corejs + regenerator），这样会导致两个问题：

重复注入 helper 的实现，导致代码冗余
polyfill 污染全局环境
解决这两个问题的思路就是抽离出来，然后作为模块引入，这样多个模块复用同一份代码就不会冗余了，而且 polyfill 是模块化引入的也不会污染全局环境。

这个逻辑是在 @babel/plugin-transform-runtime 包里实现的。它可以把直接注入全局的方式改成模块化引入。
[参考](https://juejin.cn/book/6946117847848321055/section/6947175741821812768)



### 转换器、解释器、v8引擎

[参考](https://juejin.cn/book/6946117847848321055/section/6951616852606844966)

babel 是转换器 高版本语言到高版本语言过程；
解释器 比如js，是对js语言 进行理解解释，并且执行的过程，一般用于js引擎；

v8引擎：
>v8 包括 4 部分，parser、ignation 解释器，JIT 编译器，还有 garbage collector（垃圾回收器）。
- parser 负责把源码 parse 成 AST。
- ignation 解释器负责把 AST 转成字节码，然后解释执行
- turbofan 可以把代码编译成机器码，直接执行
- gc 负责堆内存的垃圾回收

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a87438b18ad24893be5cd16ecc87d49d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)

其实最早期的 v8 是没有字节码的，就是直接解释执行 AST:
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e54a738f8f3422bbccece5b00903de7~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)


v8引擎中的解释器，我们可以简单认识是理解解释ast数据，并且最终执行的程序，可以由js或c++等等来写，目前是由c++写的。
解释js的过程中，要涉及到 作用域 scope 的类的创建，这非常有助于我们对闭包的理解，以及对函数作用域 执行上下文的机制理解。

比如js转移成ast后，如何可以生成scope作用域，ast中就会标记出来，然后遍历所有的节点，这样一个fuction的 scope 就知道了

函数的作用域scope的大致实现思路：
先遍历ast所有节点，找到所有的声明语句（其实就是变量）；
变量是否被引用；
排除function 内的声明语句(变量名)，因为是内部变量，不会被外部用到，要过滤掉；
这样得到的所有 声明语句(变量) 就是这个函数的作用域。

### 前端的世界是字符串
[参考](https://juejin.cn/book/6946117847848321055/section/6947682728250736676)

>前端的编译工具都是源码转源码，更直白点说都是字符串转字符串，只不过中间要理解代码需要 parse 成 AST，把对字符串的操作转为对 AST 的操作，而不是直接用正则修改字符串，这种转换其实各种工具都差不多，比如 eslint、terser、typescript、postcss、stylelint、swc 等等，小册中也实现了一下，大家应该能感受到。


### babel与ts编译天生不同
babel是单文件编译，不解析文件的import；
ts需要进行类型检测，需要检测import进来对象，跟webpack一样会有一个类似entry作用，
会进行多文件编译；
当然了你也可以设置ts编译单文件



### 自动国际化
通关秘籍中有关 自动国际化的例子可以看看。
如果看不懂如何运行，也可以参考 视频中启动方法：
https://live.juejin.cn/4354/4815025

https://juejin.cn/book/6946117847848321055/section/6951617082454704162

也可以参考 [formatjs](https://github.com/formatjs/formatjs) 或 [formatjs - intl-messageformat](https://github.com/formatjs/formatjs/tree/main/packages/intl-messageformat), 这是阿里低代码脚手架使用的国际化方案。


### chork commader

这里有一个 [commander + chokidar+glob 使用demo](),运行方式按照 仓库的readme来。
这个综合例子可以看看。关于watch chark commander 综合的例子。

主要代码：
```js
#!/usr/bin/env node
const commander = require('commander');
const { cosmiconfigSync } = require('cosmiconfig');
const glob = require('glob');
const fsPromises = require('fs').promises;
const path = require('path');

commander.option('--out-dir <outDir>', '输出目录');
commander.option('--watch', '监听文件变动');

if (process.argv.length <=2 ) {
    commander.outputHelp();
    process.exit(0);
}

commander.parse(process.argv);
const cliOpts = commander.opts();

if(!cliOpts.outDir) {
    console.error('没有指定输出目录');
    commander.outputHelp();
    process.exit(1);
}

if(cliOpts.watch) {
    const chokidar = require('chokidar');
    chokidar.watch(commander.args[0]).on('all', (event, path) => {
        console.log('检测到文件变动，编译：' + path);
        compile([path]);
    });
}

const filenames = glob.sync(commander.args[0]);
const options = {
    cliOptions:  {
        ...cliOpts,
        filenames
    }
}

function compile(fileNames) {
    fileNames.forEach(async filename => {
         await fsPromises.writeFile(distFilePath, generatedFile);
         await fsPromises.writeFile(distSourceMapPath, res.map);
     })
}

compile(options.cliOptions.filenames);

```

## 待研究

### 随笔
目前发现 现在用的两个框架 test_worsk test_xsd，都不能在ie浏览器下访问，非ie内核的都可以正常访问；
包括淘宝 首页 的某些链接， 比如 内衣 等等，用ie就不能打开，其他浏览器可以正常访问；

目前自己测试的几个项目 包含 webpack-demo 都不能在ie下正常访问，其他浏览器都可以正常访问；

### 观察到的现象一

#### create-react-app 创建的项目
在开发模式 npm start 的时候，无法通过ie访问，会报错，其他浏览器正常， 
通过 npm run build 打包出来的文件，使用http-server 启动服务器访问时，又可以在ie上访问了，
观察到的原因可能是 create-react-app 创建项目的 package.json 中有这个：
```json
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
```

#### webpack-demo
使用 该项目 `dev-此为完整版本要以此存档` 分支，
安装上面的配置试过了，开发和生产的情况下，在ie下不能访问，
可能没有配置正确。

待模仿测试。 todo

### 另外观察到的现象：

### 业务代码 只有 commonjs 代码
#### node 
可运行，(遇到低版本node时，需要注入 profill， --缺测试 todo)
#### 编译后 node
为什么 commonjs 的代码，如果业务用于 cli命令，
为什么需要对业务代码打包：
因为不想别人看到业务代码，需要混淆；
因为想兼容低版本的node环境；

待测试！ todo
```js
//giturl.js
const initPackageJson = async () => {
  console.log('init.....');
};

module.exports = initPackageJson;

```
```js
// index.js
const giturl = require('./common/giturl');
```

编译后 node运行编辑后的代码 会报错,
```
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [new CleanWebpackPlugin(['dist'])]
};



module.exports = {
  "presets": [
    ["@babel/preset-env", { 
      "targets": {
        "node":"10",
      },
      "useBuiltIns": "usage",// or "entry" or "false"
      "corejs": 3 // 引入 polyfill transform-runtime 比如 await api
  }],
  ],
  "plugins": [
   
  ],
};
```


把 giturl.js 中的 async 去掉就好了：
```js
//giturl.js  去掉 async
const initPackageJson =  () => {
  console.log('init.....');
};

module.exports = initPackageJson;

```
但去掉显然不能满足需求， 所以这块待测试 todo。
目前的解决方法是 不编译这块代码。
因为是cli命令，react项目也不会使用，不用担心webpack打包的问题，是纯node运行命令，最新的node 都集成了最新的es6.



## debug调试

[关于debug的一些原理](https://juejin.cn/book/6946117847848321055/section/6978397048307466252)

[用 VSCode 调试网页的 JS 代码有多香](https://juejin.cn/post/7010768454458277924)
[让你 nodejs 水平暴增的 debugger 技巧](https://juejin.cn/post/6981820158046109703)



