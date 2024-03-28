---
title: babel笔记(一)
date: 2021/10/23
tags: [babel]
categories: 
- babel
---




## 基础知识

### astexplorer ast可视化编译网址
[astexplorer ast可视化编译网址](https://astexplorer.net/)

{% img url_for /image/babel/ast.png %}

### parser的发展
{% img url_for /image/babel/parser.png %}

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

#### 需要同时设置 useBuiltIns 与 corejs

参考《不讲规矩的babel包的依赖》

### @babel/preset-env 调试

```js
['@babel/env', {
            debug: true,
            useBuiltIns: 'usage',
            corejs: 3
        }]
```
debug 模式下，会打印所有的插件以及polyfill。

会打印 
@babel/preset-env: `DEBUG` option
- Using targets 如 browserslist
- Using plugins

corejs3: `DEBUG` option
- Using targets

regenerator: `DEBUG` option
- Using targets

以及每个文件的
The corejs3 polyfill
the regenerator polyfill
信息

非常之好用。

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

这里有一个 [commander + chokidar+glob 使用demo](https://github.com/YeWills/babel-plugin-exercize/tree/cli-modify/exercize-babel),运行方式按照 仓库的readme来。
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

### @babel/preset-env 的 useBuiltIns: "entry"

#### 概述
```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "edge": "17",
        },
        "useBuiltIns": "entry"
      }
    ]
  ]
}
```

[这样配置时，需要你在 比如单页面app项目，比如webpack的entry文件中](https://www.babeljs.cn/docs/usage#polyfill)，
引入profill：
```js
// 其实就是 import "core-js";
 import "core-js/stable";
 import "regenerator-runtime/runtime";
```

如果配置 `"useBuiltIns": "usage"`;
需要指定corejs，因为这个依赖 corejs ，因此要额外 npm install core-js@^3.0.0 :
```js
 {
            "targets": {
              "edge": "17",
              "firefox": "60",
              "chrome": "67",
              "safari": "11.1"
            },
            "useBuiltIns": "usage",
            // 需要指定 corejs 版本
            "corejs": "3"
          }
```
此时不需要自己在额外添加代码，babel 编译时会自动引入。

目前还没有找到官网直接说明 要额外 npm install core-js@^3.0.0 ，后期再到官网看看，感觉如果没有直接说明，
然后去到 @babel/preset-env 包看，也没有依赖 core-js ，这样会不会看起来设计有所欠缺。
待考证。

#### entry与usage的区别
 "useBuiltIns": "entry", 时，需要在entry页面 import "core-js";
 此时会全局引入 profill，而且全量引入，你会看到entry页面有非常多个全量的require profill引入；
 除entry页面外，其他页面不再引入，共用entry页面 profill，因此entry页面的引入时全局性的，也具有污染性的弊端。


### profill

使用profill，主要是指在 @babel/preset-env 使用，以下步骤缺一不可：
- 指定需要哪些profill，通过targets配置分析而来；
- 指定profill使用方式；
- 指定profill版本(即corejs)版本；

除此之外，要单独 `npm install core-js@^3.0.0`, 感觉这是 babel设计的不足，
至少要在 @babel/preset-env 指定依赖 core-js。
```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "edge": "17",
        },
        "useBuiltIns": "entry",
        "corejs": "3"
      }
    ]
  ]
}
```

## 黑知识

### babel是给工具而非浏览器使用

#### 官网相关说明
[参考 ](https://www.babeljs.cn/docs/babel-standalone#when-not-to-use-babelstandalone)
>If you're using Babel in production, you should normally not use @babel/standalone. Instead, you should use a build system running on Node.js, such as Webpack, Rollup, or Parcel, to transpile your JS ahead of time.


#### babel输出为commonjs
babel是给工具 比如webapck vite rollup 等等使用，
并非直接面对浏览器，
所以babel编译出来的代码，是commonjs，
这无法给浏览器直接使用。
这有点大大出乎一直以来的认识。
因为babel编译出来代码为 commonjs，天生适合node环境。

#### commonjs与传统js异同
另外一方面，commonjs的风格是模块化，
因此commonjs与浏览器直接使用的方式其实没有很大区别，
二者主要区别是 import、export、require、module，
以及模块化方式编译带来的 作用域相互独立的好处。

#### webpack结合babel给浏览器使用
所以babel编译出来的 commonjs风格代码，要想转换为浏览器所用，
只需配合webpack 等，
将每个文件代码的 头部 import require，底部export module 进行编译即可。

一份最终编译的代码，其内容由 webpack编译esmodule模块化部分，主体内容部分由babel编译。

了解这个很重要，很多编译的奇怪问题都源于此分析，但可惜的是，如何不看webpack源码，很难理解这层意思。


#### webpack定义target转换箭头函数
webpack默认编译上面说的【 webpack编译esmodule模块化部分】为箭头函数，
如果要兼容ie，那么必须要结合browserslist，webpack默认读取项目下的 browserslist 配置，然后将箭头函数转换为function，
这些都是 webpack target 的配置，[参考官网](https://webpack.js.org/configuration/target/#browserslist)
```js
// package.json
 "browserslist": [
    "last 1 version",
    "> 1%",
    "IE 10"
  ]
```

#### webpack-dev-server 与 IE 兼容问题
高版本的 webpack-dev-server 使用了比较高的api (可能是用于ws协议的url api)，不兼容ie，
因此使用此server时，不能运行于ie，编译后的代码 用http-server 可以；

用webpack-dev-server启动后，在ie浏览，会看到报错，然后看报错的源代码为:
```js
 eval("ddddddjjjjjjjdd/ webpack-dev-server/xxxUrl.js")
```
定位到是 webpack-dev-server 问题。

因此这里也提供了一种 eval 定位问题的思路。
就是 eval 写入的代码，在ie浏览器上 比如上面的代码，在控制台的source中，可能会被分离成 js字符串后面独立的 js文件 `xxxUrl.js`

比如create-react-app 创建的项目
在开发模式 npm start 的时候，无法通过ie访问，会报错，其他浏览器正常， 
通过 npm run build 打包出来的文件，使用http-server 启动服务器访问时，又可以在ie上访问了，

原因参考《webpack-dev-server 与 IE 兼容问题》

目前以上问题可能在高版本的 webpack-dev-server 存在，低版本可能不存在，是因为高版本server用了比较高的 js api，
这部分 js api，没有经过编译为低版本，ie不支持。



#### demo
[babel-webpack/babel-test](https://github.com/YeWills/babel-plugin-exercize/tree/babel-webpack/babel-test)


### webpack-dev-server 与 IE 兼容问题

参考上面《babel是给工具而非浏览器使用 - webpack-dev-server 与 IE 兼容问题》

### eval 调试经验
使用eval的场景一般是 经过编译工具编译之后的源码，使用eval将字符串转化为 js 执行。
eval 调试经验 对调试编译后的代码，或者线上代码有一定启发意义。
参考上面《babel是给工具而非浏览器使用 - webpack-dev-server 与 IE 兼容问题》



### 不讲规矩的babel包的依赖

在eslint中，你要使用一个 eslint preset 包，
可以npm install 安装此包，然后安装其 peerDependencies 类似包，
那么此 eslint preset包就能正常运行。

但在babel中，没有此规矩，

比如你 @babel/preset-env , 你如果配置了 corejs, 
你必须 安装 core-js,
一个参数的配置就要安装一个工具包，并且在 package.json 中没有表明，
这完全只能从官网里面看，
比如其 useBuiltIns 配置中说明，如果定义此配置为`"usage" | "entry"` 那么就需要安装 core-js；
而且建议同时定义 corejs 的版本号；
我想了一圈，为什么要通过corejs 定义版本号，
最后只能猜测：大概是通过配置文件 写明 corejs版本号，让人们在初始化项目时，去安装指定的 core-js 版本吧：

[官网](https://www.babeljs.cn/docs/babel-preset-env#usebuiltins)
>When either the usage or entry options are used, @babel/preset-env will add direct references to core-js modules as bare imports (or requires). This means core-js will be resolved relative to the file itself and needs to be accessible.


这一点在这里也体现了[@babel/plugin-transform-runtime - corejs](https://www.babeljs.cn/docs/babel-plugin-transform-runtime#corejs)


### babel打包项目与打包library的区别

[参考babel-plugin-transform-runtime#why](https://www.babeljs.cn/docs/babel-plugin-transform-runtime#why)
> it becomes a problem if your code is a library which you intend to publish for others to use or if you can't exactly control the environment in which your code will run.


### 吐槽

同样是配置化，babel与eslint，
就可读性而言 eslint要比babel高，
无论是从 babel包设计上 eslint可能要更好点，还是配置的可读性；
虽然二者理解起来确实需都要比较深的 基建知识。

另外 babel 裹脚布一样的插件和预设的简洁别名写法，简直劝退了很多初学或进阶babel学习者，
非常不友好，直接使用全名不香么。
简洁不是王道，可读性才是。

## demo 以及资料

[commander + chokidar+glob 使用demo](https://github.com/YeWills/babel-plugin-exercize/tree/cli-modify/exercize-babel)
[包含webpack结合babel以及babel单独编译的例子 - babel-webpack/babel-test](https://github.com/YeWills/babel-plugin-exercize/tree/babel-webpack/babel-test)


有空可以看[掘金 - 原理篇：编译 ts 代码用 tsc 还是 babel？](https://juejin.cn/book/7047524421182947366/section/7048282320230416395)



## 待研究

以下可以在遇到问题或感兴趣时研究，因为不影响babel主流程理解，自己在看官网时没有细究的

### debug调试技巧

[关于debug的一些原理 -工具介绍：VSCode Debugger 的使用](https://juejin.cn/book/6946117847848321055/section/6978397048307466252)

[用 VSCode 调试网页的 JS 代码有多香](https://juejin.cn/post/7010768454458277924)
[让你 nodejs 水平暴增的 debugger 技巧](https://juejin.cn/post/6981820158046109703)




### 几个容易混淆的概念：
@babel/polyfill
@babel/runtime
@babel/plugin-transform-runtime
regenerator 是 facebook 实现的 aync 的 runtime 库，babel 使用 regenerator-runtime 来支持实现 async await 的支持。

```s
├─┬ @babel/preset-env@7.16.11
│ ├─┬ @babel/plugin-transform-regenerator@7.16.7
│ │ ├── @babel/core@7.17.9 deduped
│ │ └─┬ regenerator-transform@0.14.5
│ │   └─┬ @babel/runtime@7.17.8
│ │     └── regenerator-runtime@0.13.9

因此 @babel/preset-env 默认安装 @babel/runtime 以及 regenerator-runtime；
而 @babel/runtime 又写了helper，
因此 @babel/preset-env 默认安装了 helper 和 regenerator-runtime,
但是要额外安装 core-js

regenerator-runtime
```


#### @babel/polyfill 被弃用


#### @babel/preset-env 要npm install core-js

[参考这里](https://www.babeljs.cn/docs/babel-preset-env#usebuiltins)



### babel 如何配置支持 proposals；
shippedProposals
babel 的prosupose 标准 如何支持配置，待研究；
[参考这里](https://www.babeljs.cn/docs/babel-preset-env#shippedproposals)




## 其他

### 看官网经验
一条经验： 看官网一定要全部一起看，
不能只看一篇，
往往官网具有系统性，
比如webpack 这一特点非常突出；

官网的文档有点循序渐进，
如果不从头开始，一步步来看，
会难以理解，
所以建议官网要系统看，一点一点的过。

### 学习过程笔记


#### 之前的学习策略
大概知道babel；
知道如何单独使用babel；
学会babel官网；这个估计要四五天；
学会如何利用babel的官网工具，以及babel用代码工具；
以及分析babel实际解析出来的源码。

看之前的笔记；
然后看神说有光的 babel 视频；



然后 掘金教程干一遍；
接着开干官网；
不懂，
再回头看 之前找的教程；


-----


思考，babel 如何在没有webpack 的entry 机制下，解析一个库， 结合 work源码中 如何用babel解析的实战一起看。
因为babel没有entry，只能一个文件一个文件地解析 babel，这样它的 runtime 如何配置，为每个文件都配置一个 runtime吗，
这样不是浪费吗。
所以策略是先看 之前的笔记，神光的 视频，掘金教程。
然后上面的实战；
然后就是官网
不懂，
再回头看 之前找的教程；


2022-4-21
掘金 babel 看完了，
也可以看 这篇课程： 其中这一节是免费的[掘金 - 原理篇：编译 ts 代码用 tsc 还是 babel？](https://juejin.cn/book/7047524421182947366/section/7048282320230416395)
看完这节，看其他章节是否有免费的可以薅一薅


#### 时间过程
4.21 - 4.24 小册 3.5天
4.24 - 4.27 官网 3.5天

合计 7天时间

#### 再来过

以上学习策略其实浪费了一些时间花在找教程上，其实不值得，
再次来过，
直接掘金babel教程看一遍；
官网看一遍；
基本上就好了。

当然了 多找找教程也可以，增加一下视野挺好。
