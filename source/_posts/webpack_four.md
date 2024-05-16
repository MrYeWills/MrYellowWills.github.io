---
title: webpack源码系列(四)：module调试
date: 2022/4/5
tags: [webpack, webpack源码系列]
categories: 
- webpack源码系列
---


## webpack阅读经验
### 阅读历程回顾
对于webpack源码阅读，
刚开始我从 手写一个webpack源码 的视频开始，收益还是挺大的；
后期看了一个webpack 5 调试视频 说明，收益也不错；
最后以打游击战的方式，解决 Babel options 加载的问题、 module rule exclude 问题，了解了webpack ，并以实战的方式初次阅读源码解决问题，效率低了点，但收获不错。
接着是毫无目标的，比如看一个js reloader 的过程，等等，这些效率是极差的，受益也很少；
接着自己再稍微看了下源码debug调试，收益和效率继续很差；
这其中几次想过放弃阅读webpack源码，
后面转换思想，
在网络上大量搜索相关教程与视频，
大量阅读各种视频教程和文档教程；
按照之前的经验，偏好于视频教程，
奈何视频教程中 关于源码调试的部分太少，而且效果不高，
在文档教程上，关于webpack源码解读的教程还蛮多，
遇到高质量的文档教程后，阅读完 对整个调试 大有裨益，
【因此觉得 遇到复杂的 源码解读这类的 学习，可能文档教程是一个不错的选择。
虽然文档教程没有视频教程生动直观，但是它以文字记录，你copy笔记进行查询等等 非常方便】
另外也遇到一个蛮不错的视频调试经验教程，收获也蛮大；

有了自己之前一些webpack 调试经验，以及大量的文档、视频教程阅读后。

再次调试 webpack 就轻车熟路了。

知道抓住重点，放掉之前非常在意的小点。

然后遇到详细的 文档教程，对着文档教程一点点调试，也是很有收获的。


### 关于webpack版本的选择
webpack5相比 4，代码有了很大的增加，核心文件中的代码 增加 有30-40% 之多，
而且增加了大量的注释或编译代码，淹没了核心流程代码；
读起来成本更大；
由于核心流程基本一致，故而选择webpack4。
先快速或更容易将自己引进 webpack 源码之门，
以后有需求 再考虑 webpack 5 的阅读。


### 如果再次 webpack 源码阅读我会这样做：
- 学习手写一个webpack
- 阅读 webpack 调试视频的经验；
- 然后以打游击战的方式，解决 Babel options 加载的问题、 module rule exclude 问题，了解了webpack ，并以实战的方式初次阅读源码解决问题，
以此熟悉webpack 大致过程；
- 阅读大量的 babel、loader、plugin 的使用教程或视频， 比如手写plugin、loader 等等，知道这些怎么用 对webpack概念更加熟悉；
- 再次阅读大量的 源码解读或调试经验视频 、文档， 这一步做到，就算不看webpack源码，也能对webpack源码做的事情了然于心，
这样的好处是，到最终自己阅读源码调试时，看到代码 就知道这个代码是用来做什么的，因为之前的视频和文档攻略。
- 跟着一个好的教程，比如这次我是跟着一个 文档教程，分模块进行阅读调试，
比如我先调试module，后调试chunk，然后分别做笔记

## 调试与前言

### 前言
本篇主要介绍 调试module的技巧与注意点或要点。
关于webpack源码中 module 部分的知识，请熟读文末的《参考文档或视频》。
### webpack版本
webpack 4.46.0

### 说明
本次调试 以单entry SingleEntryPlugin.js 展开。

要在一无所知的情况下调试 module 其实是比较困难的，只有对整个 业务逻辑比较清楚的情况下，
再去调试会比较轻松。

另外，在调试前，先打印出最终创建的[module的数据(对象)]() 以及 [stats 对象](),对此有大致了解。
有助于 了解 module；

### 调试技巧
调试的时候，在 `lib\Compilation.js` 和 `lib\Compiler.js` 中对各个钩子打断点的技巧

以及同时开两个 demo，一主一辅进行调试，
以 [webpack直接源码 demo]() 调试为主
以 [同样配置的 使用webpack的demo]() 为辅助，上面调试遇到问题时，在不中断上面调试的情况下，使用此demo断点测试猜想。


## module编译过程

```s
# lib\Compiler.js
this.hooks.make


#lib\Compilation.js
addEntry
_addModuleChain

#入口module编译
moduleFactory.create
this.addModule
buildModule
module.build


#lib\NormalModule.js
build
doBuild
runLoaders
createSource
this.parser.parse -回调

#module.build- 回调

#lib\Compilation.js
afterBuild - this.buildModule -回调
processModuleDependencies
addModuleDependencies
factory.create - 递归


# lib\Compilation.js
# 执行到这里 项目所有module生成结束
this.hooks.succeedEntry.call(entry, name, module);

# 最终回到 make的回调；
this.hooks.make - 回调
```

## 逻辑说明

```js
addEntry(context, entry, name, callback) {
	this._addModuleChain(
			context,
			entry,
			module => {
				this.entries.push(module);
			},
			(err, module) => {
        // 这个module为 entry module；
			
			}
		);
}
```

### 所有create共用一个factory
无论是入口的 `moduleFactory.create()` 还是 `factory.create`。

```js

_addModuleChain(context, dependency, onModule, callback) {

		const Dep = /** @type {DepConstructor} */ (dependency.constructor);

		const moduleFactory = this.dependencyFactories.get(Dep);

    moduleFactory.create()
}


addModuleDependencies(){
  const factory = item.factory;
					factory.create()
}
// addModuleDependencies factory 来自于 这里
	processModuleDependencies(module, callback) {
		const addDependency = dep => {
				const factory = this.dependencyFactories.get(dep.constructor);
    }
  }

```

其factory都来自于 下面：

```js
// lib\Compiler.js
	createNormalModuleFactory() {
		const normalModuleFactory = new NormalModuleFactory(
			this.options.context,
			this.resolverFactory,
			this.options.module || {}
		);
		return normalModuleFactory;
	}
```
```js
// lib\SingleEntryPlugin.js
		compiler.hooks.compilation.tap(
			"SingleEntryPlugin",
			(compilation, { normalModuleFactory }) => {
				compilation.dependencyFactories.set(
					SingleEntryDependency,
					normalModuleFactory
				);
			}
		);
```

为什么所有的factory 都至于一个， 或者说factory只初始化一次，然后被用于所有的 module 创建。
其实奥妙在于 lib\NormalModuleFactory.js 的 create 方法。
不同的module创建前，都执行了 create 方法，而且入参不一样，所以有了只用同一个factory的可能。
应该是 factory -》 NormalModuleFactory 将所有共有的逻辑抽象到一起。
比如:
```js
	this.hooks = {
			resolver: new SyncWaterfallHook(["resolver"]),
			factory: new SyncWaterfallHook(["factory"]),
			beforeResolve: new AsyncSeriesWaterfallHook(["data"]),
			afterResolve: new AsyncSeriesWaterfallHook(["data"]),
			createModule: new SyncBailHook(["data"]),
			module: new SyncWaterfallHook(["module", "data"]),
			createParser: new HookMap(() => new SyncBailHook(["parserOptions"])),
			parser: new HookMap(() => new SyncHook(["parser", "parserOptions"])),
			createGenerator: new HookMap(
				() => new SyncBailHook(["generatorOptions"])
			),
			generator: new HookMap(
				() => new SyncHook(["generator", "generatorOptions"])
			)
		};
```

### create module 的入参

#### moduleFactory.create
```js
		moduleFactory.create(
				{
					contextInfo: {
						issuer: "",
						compiler: this.compiler.name
					},
					context: context,
					dependencies: [dependency]
				},
				(err, module) => {
				}
			);
      // moduleFactory.create 第一个入参打印如下：
// {
//   contextInfo: {
//     // 这个是调用者的路径，也就是调用下面的dependencies request文件的文件
//     // entry 的调用者 为空
//     issuer: '',
//   },
//   context: 'D:\\workplace\\webpack\\webpack-official\\debug',
//   dependencies: [
//     {
//       module: null,
//       weak: false,
//       optional: false,
//       loc: {
//         name: 'main',
//       },
//       // 这个是要被编译的文件路径, 被用于创建 module 的文件 ，最关键的信息
// //可以理解为该文件创造的module
//       request: './src/index.js',
//       userRequest: './src/index.js',
//     },
//   ],
// };
```


#### factory.create

```js

		const factory = item.factory;
      factory.create(
        {
          contextInfo: {
            issuer: module.nameForCondition && module.nameForCondition(),
            compiler: this.compiler.name
          },
          resolveOptions: module.resolveOptions,
          context: module.context,
          dependencies: dependencies
        })
// factory.create 第一个入参打印如下：
// {
//   contextInfo: {
                   // // utils/mtest被 \\src\\index.js 调用
//     issuer: 'D:\\workplace\\webpack\\webpack-official\\debug\\src\\index.js',
//   },
//   resolveOptions: {},
//   context: 'D:\\workplace\\webpack\\webpack-official\\debug\\src',
//   dependencies: [
//     {
//       module: null,
//       weak: false,
//       optional: false,
//       loc: {
//         start: {
//           line: 4,
//           column: 4,
//         },
//         end: {
//           line: 4,
//           column: 28,
//         },
//       },
 // 这个是要被编译的文件路径, 被用于创建 module 的文件 ，最关键的信息
//       request: './utils/mtest',
//       userRequest: './utils/mtest',
//       range: [65, 80],
//     },
//   ],
// }
```

#### 如何看某个文件创造的module
参考上面


#### 待研究
被用于 factory.create 的dependencies 通过以上梳理 貌似只有一个元素，
后期可以尝试下如何出现多个元素。

还有resolve的过程；


### 哪里算结束
this.hooks.succeedEntry.call(entry, name, module);

webpack 解析module的过程：
以入口entry为入口，通过create解析成module；
解析完后，再看下此 module 是否有 import 或 require 即依赖 【processModuleDependencies】,
如果有 则遍历此依赖，
对每个依赖文件，进行 create 操作，解析成module 递归，
以上过程重复一次；


```js
addEntry(context, entry, name, callback) {
		this.hooks.addEntry.call(entry, name);

		this._addModuleChain(
			context,
			entry,
			module => {
				this.entries.push(module);
			},
			(err, module) => {
			
      // 全部module解析完后，会执行这里
      // 可以在这里 console.log(this.modules) 打印所有编译出来的 modules
				this.hooks.succeedEntry.call(entry, name, module);
				return callback(null, module);
			}
		);
	}
```
当然也可以在这里打印所有编译出来的modules：
```js
// Compilation.js 的 constructor 中
	Object.keys(this.hooks).forEach(hookName => {
			const hook = this.hooks[hookName];
			if (hook.tap) {
				hook.tap("show", () => {
					const hooktype = Object.getPrototypeOf(hook).constructor.name;
					console.log(
						`Compilation  ${hookName}   【类型：${hooktype} 入参：${hook._args}   `
					);
					// console.log(this.modules)
					if (hookName === "needAdditionalPass") {
            // needAdditionalPass 执行时，webpack 的编译完成
            // 可以在这里 console.log(this.modules) 打印所有编译出来的 modules
						console.log(this.modules);
					}
				});
			}
		});
```


## 如何确认module标识
入口文件会经历一次 `moduleFactory.create`；
之后的每个文件都会经历 一次 `factory.create`；
每个文件都会创建一个module；
无论时入口文件还是其依赖的文件，创建的module 全部保存在 `Compilation.js  this.modules` 上；

可以从这里看出是哪个文件的module
每个文件创建module之前，经历create，此文件信息在这里：
```js
{
          contextInfo: {
            issuer: module.nameForCondition && module.nameForCondition(),
            compiler: this.compiler.name
          },
          resolveOptions: module.resolveOptions,
          context: module.context,
		//   此文件信息在这里
		//   dependencies[0].request
          dependencies: dependencies
        }
```

创建好的module，[参考 - 关于module对象]() ,其文件标识在 resource 中。
```js
 resource: 'D:\\workplace\\webpack\\webpack-travel\\src\\index.js',
```
## 延申

### 限制一次操作的次数

 在创建module时,使用 lib\util\Semaphore.js 进行次数控制，超过100个时 等待处理完后再处理。
```js
// lib\Compilation.js
	const semaphore = this.semaphore;
				semaphore.acquire(() => {
					const factory = item.factory;
					factory.create(
```

## 参考

### 参考文档或视频
[webpack4 源码分析系列](https://blog.flqin.com/377.html)
[webpack5 源码分析](https://www.bilibili.com/video/av462922583?from=search&seid=14121423744670771391&spm_id_from=333.337.0.0)
[webpack4 如何调试和阅读webpack源码 视频](https://www.bilibili.com/video/BV1N5411j74S?p=14)
[webpack3 源码分析系列： 玩转webpack](https://cloud.tencent.com/developer/article/1006353)
[webpack3 源码分析系列： 玩转webpack](https://cloud.tencent.com/developer/article/1030740?from=article.detail.1006354)
[webpack3 源码分析系列： 玩转webpack 备用地址](https://lxzjj.github.io/2017/11/02/%E7%8E%A9%E8%BD%ACwebpack%EF%BC%88%E4%B8%80%EF%BC%89/)
[手摸手带你实现打包器 仅需 80 行代码理解 webpack 的核心](https://www.bilibili.com/video/BV1oL411V7BQ?spm_id_from=333.999.0.0)
[[万字总结] 一文吃透 Webpack 核心原理](https://xie.infoq.cn/article/ddca4caa394241447fa0aa3c0)

### 调试demo地址
[用于主调试的 webpack源码仓库： version-4.46.0-module](https://github.com/YeWills/webpack/tree/version-4.46.0-module)
[用于辅助的： webpack-4.46.0-module](https://github.com/YeWills/webpack-travel/tree/webpack-4.46.0-module)







