---
title: webpack源码系列(一)：开篇
date: 2022/3/23
tags: [webpack, webpack源码系列]
categories: 
- webpack源码系列
---

*往蹇来誉 田获三狐*

懂webpack配置不难，但webpack升级后，旧的经验很容易出问题，且webpack像一个黑箱，难以解决。
webpack配置学习三个月，升级之后又三个月，没完没了，没有尽头。
为此决定一改以往学习webpack配置的策略，
改为直接学习webpack调试经验以及了解其源码和原理，
以便出现问题或需求，可以直抵关键，一击必中。

## webpack源码学习策略

### 为什么要学源码
以前我鄙视看 react 或 webpack源码
现在改变了，react基本上不会出故障，出故障需要调试源码的情况出现非常少，而且react不像webpack有这个一大堆配置，
用起来十分简单，稳定，很少出现需要分析的故障，
权衡 学习react源码成本与受益，确实受益比不高，没有学react必要。

但webpack不同，它有繁多的配置，每一种配置 对应不同的产物。
而且每种配置都对应了几种配置方式，可能是字符串，可能是数组，还可能是对象，更甚着，还有带特殊符号的 字符串 配置方式，
比如 `!babel-loader filepath` 等等。
经常我们配置后，最后编译的结果与我们期待的差异很大，
遇到问题，webpack简直是一个黑箱 无法查起，
大大增加了开发的成本 和不便。

而且webpack编译问题，经常碰到。

考虑到学习成本和受益，还是可以尝试学习 webpack源码的。

### 概述
以问题点问切入方式；

先列出 webpack 一百问；

以问的方式，或者以解决日常问题点的方式 去看源码；
然后展开；
将此过程记录；

或者 对照 webpack 使用视频 去了解webpack的使用；
然后针对使用 去看源码；

目前的策略 就是游击战术；
以官网的api 使用方法为切入点，
看源码，
当webpack源码看得体系后，
再系统看看？

本次看webpack 源码的目的：
遇到问题知道怎么分析。
了解plugin写法；
了解loader写法；
了解tapable；
webpack 打包的主流程；
webpack 一切都是module 的理解；
大致看一遍官网，进行系统快速了解下；

列举下当前 自己最关心的几个webpack问题，解决后 开始学习babel， 接着umi学习。

然后学习 umi；

学东西不学源码，确实不好。

### 需要了解的一览

除了上面所说的，想了解的问题：
- 想要了解 webpack 自己的 require 或 import 的实现。 （这其实就是主流程）；
可以针对 一个简单的代码，编译后，看编译后的源码是怎样的。
这个可能通过这篇博客 来分析： https://segmentfault.com/a/1190000039957527
<!-- 里面有关于__webpack_require__ 的实现。 -->

### 学习历程

#### 2022-3-28以前
教程视频
https://www.bilibili.com/video/BV12L411t7Pr?spm_id_from=333.999.0.0

compiler 与 compilation 区别和联系
手写简易版本的打包器 (ast 抽象语法树， dom树)
loader(ast)
plugin
#### 2022-3-28

今晚要做的是，做笔记；
看视频做笔记；
然后将最近这几天的内容 整理笔记；
包括之前源码调试；
----和今天的parse；----

做完之后，收集一波webpack 资料
然后再制定一个三天计划。

webpack 源码学习资料确实太匮乏，无太多经验可借鉴
，只能边做边计划。
做完一个阶段，然后 计划下一个阶段

后期看下 loaderRunner 的实现？

要做的就是 对最近的webpack 做一轮复盘总结

#### 2022-3-29
一个js文件，是在哪里被 fs 读取的；

#### 2022-3-31
然后看视频 看手写一个打包器；
或者看手写一个plugin；
看手写也好，还是什么也好，
通过这些示例或者视频，你至少知道怎么用了，它们就是一个源码的 活生生的说明书，然后再去看源码是不是事半功倍！

#### 2022-4-1
今天找了一波资料，有视频 还有文档的；
先大量快刷一波 视频，优先看公开课的webpack源码视频，刷完后；
再刷 源码解读文档；
然后自己再试试 看webpack源码

是不是可以针对webpack 的各个目录 做个说明。

感觉webpack 前期的游击式打法也重要，对细节比较熟练了；
然后再找一个 视频或文档的教程，好的教程，会让你看源码事半功倍；
我这次是看的一个文档教程，也不错，挺好的
以后可以按这个策略来

#### 2022-4-2
摘录至https://github.com/lizuncong/mini-webpack
思考以下几个问题
webpack options默认值是什么时候设置的
webpack 插件初始化是什么时候设置的
chunk 和 module的关联是咋样的
webpack loader的执行时机
webpack plugin的执行时机
webpack是如何解析模块的，即当我们通过require('./test.js')引入一个模块后，webpack是如何查找对应的文件的
webpack如何解析模块依赖的
webpack如何构建模块
webpack模版代码如何生成

目前的想法是，webpack 5 的源码 将近是 webpack 4 的两倍，
webpack 5 核心代码之外加了太多花里胡哨的东西，关键的东西因此被隐藏很深，所以舍去 webpack 5 ，
先看webpack 4 ，以求入门webpack 源码，
后期再考虑 webpack 5 ，
一步步来。
因为原理是相通的

我觉得看webpack源码，要解决以下几个问题才算成功：
了解上面说的 chunk 与 module 的区别；
以及一些webpack 核心概念 比如一切都是chunk
或者看webpack 官网文档， 看官网的一些核心概念，自己是否理解了。

另外说一点感受，发现 涉及复杂源码的时候，
好视频是早期用来培养球感的；
深入的时候，需要文档教程；
到最后就是自己看源码；

#### 2022-4-6
明天看的思路
重点攻击 module 的生成(含递归)
这部分，目前是我已知的最难点，

为了保证 阅读源码顺利，
先把之前看的有关webpack 这部分的源码接口，重新读一遍，
并做下笔记，或者直接以 笔记的方式写到本博客中，
然后对整个过程了然于心的时候，
不看源码的情况下，已经非常熟练的时候，
就可以看源码了


#### 2022-4-7
昨天看完 module 模块；
现在看 chunk部分；

#### 2022-4-11
源码链路走完后，
暂时文档次之，
阅读 webpack 官方文档，
全部过一遍，并且将之前自认为难的地方，重点攻坚下，结合源码理解。

等全部好了后，再做一个详细的文档。

#### 2022-4-12
目前刚阅读完源码，
计划 找一个webpack视频教程跟着走一遍；
然后 把webapck官网文档全部看一遍；
跟着就搞下babel；
为了加快webpack核心目标-（学习webpack为我所用，为实际项目所用），
考虑到现实环境，
官网中一些项目遇到不多的，不太阻碍主流程的，以及可等待实际项目遇到后再研究的，
可略过不看，不过要在笔记中，以待研究做笔记记录。
目前的目标是，既要保证学习的质量，又要兼顾上述核心目标，即快、快效率。
要避免陷入 钻牛角尖的陷阱。

#### 2022-4-13
【从 昨天 4月12日 开始 看官网源码】
官网阅读策略：
阅读顺序如下：
概念
api
指南
配置
loader
plugin

先看官网吧，先把官网刷一遍，
然后再看视频。这样可能更加有感觉。
然后再 视频和官网 来回穿插看，
或者对官网进行扫盲，或者找几个重难点进行演练。


#### 2022-4-14
昨天因为其他事情，中断一天时间，没有看webpack；
目前先看webpack官网，再看视频教程 这一安排还是非常有效率的。
因为之前都是先看视频教程，再看或不看官网，
视频教程再系统，确实也比不上官网系统。

而且官网教程 都以文字的方式记录，
如果webpack知识丰富，或者看过源码后，再读官网，确实要轻松很多。
这个时候，【文档教程相比视频教程的优势来了】：
快速定位；
文档在任何场合都可以看；
停和开始非常便捷；
文档天生就是做好的笔记，二次笔记非常方便；
文档阅读速度快

所以建议 对某个知识点足够熟悉的时候，读文档或官网，比视频好。


【而且读webpack官网 阅读顺序非常重要】，我这次阅读顺序非常妙和好，
目前看了 概念、api、指南。
再次来过，顺序还是建议用上面的顺序

#### 2022-4-20
昨天中断一天没有看webpack官网，
到今天 webpack官网全部看完：
概念
api
指南
配置
loader
plugin
概念、api、指南、配置 细看了；
loader、plugin 扫了一眼，主要讲各个loader plugin的使用方法，看的价值不高，用的时候再看比较好，这两个只花了两个小时看完。

这一次的 webpack之旅：
webpack的学习时间 从 3月1日开始，
至今 4月12日，中间去掉几天，一共花了一个月 3天
这是看webpack 源码的时间，包含了大量的源码阅读的准备工作，比如充分了解 loader、plugin的使用，手写webpack源码。
从 4月12-20日，花了9天时间看官网，其中中断了两天时间，以及周末未看。

这次webpack 之旅 总耗时: 
1个月 3天 + 9天 = 合计 1月 12 天

虽然耗时很长，但是收获也是非常大的，而且将自己的前端眼界提高一个台阶，非常值得。

一路走来不易，为这一个半月喝一杯。

### 当前要做
2022-3-31
里面有关于__webpack_require__ 的实现；
找各种视频或源码资料；
然后制定下一次的计划，
利用这次清明节的时间，攻坚最难的源码，但在节前，
希望做好 “球感” 培养好，以及充分阅读各种资料视频。
## demo

目前两个demo库用于webpack学习
### webpack源码库

[webpack](https://github.com/YeWills/webpack/tree/version-debug-5.69.1)  fork自webpack官网，主要用于阅读webpack源码，或者直接用源码进行编译调试。
此库可以用于同步最新的webpack修改，并同时查看各个版本的webapck源码。

#### version-debug-5.69.1 分支
其中分支可以使用此库 [分支 version-debug-5.69.1 ](https://github.com/YeWills/webpack/tree/version-debug-5.69.1) 进行webpack源码调试
里面包含了如何改造webpack官库 用于直接编译调试的经验，

关于此分支的更多讲解，参考下面的 《参考 -  webpack5调试经验分享视频》

#### 参考
-  [webpack5调试经验分享视频](https://www.bilibili.com/video/av462922583?from=search&seid=14121423744670771391&spm_id_from=333.337.0.0)


### webpack调试库

[webpack调试库](https://github.com/YeWills/webpack-travel) ,此库展示webpack用于各种场景下调试练手。



## 三种webpack配置模式

- 1. compiler 模式；
- 2. webpack config 模式；
- 3. webpack-dev-server config 模式；

本质上 2 最终还是用 1 实现；
3 最终变成 2，最终依然还是基于 1 实现；
本质上 他们最终都是用 compiler模式实现


### webpack入口

- 执行npm run build  最终找到 bin/webpack.js
上述的文件里其实就是判断 webpack-cli 是否安装，如果安装了则执行 runCli 方法
在 runCli 方法里加载了 webpack-cli/bin/cli.js
在cli.js 当中核心就是判断 webpack 是否安装了，如果安装了 则执行 runCli
在runCli 里处理命令行参数 （依赖了commander），执行 new WebpackCli 的时候会去触发 action 回调；
this.program.action() ，而这个this.program = program(commander)
action的回调当中执行了 loadCommandByName-》makeCommand->runWebpack
runWebpack()的时候执行了 createCompiler()
在createCompiler 内部调用了 webpack 方法， 接收配置文件和回调，最终生成了一个compiler对象，而这个compiler对象会在上述的调用过程中被返回，它就是我们webpack 打包的第一个核心的有关“人员”
上面的 webpack 就是我们本地安装好的 webpack
如果想让webpack 打包，其实就是使用 webpack 函数来接收 config，然后调用 run 方法即可。
```js
const webpack = require('webpack');
const config = require('./webpack.config')

const compiler = webpack(config)


compiler.run((err, stats)=>{
    console.log(11)
})
```

### webpack-dev-server 调试 (待进一步整理)

本例以传统的webpack 配置模式进行, webpack-dev-server 启动。

webpack-dev-server 启动与 webpack 的区别


{% img url_for /image/webpack_one/entry.jpg %}

#### lib\webpack.js

```js
node_modules\webpack\lib\webpack.js

const webpack = (options, callback) => {

    compiler = new Compiler(options.context);
    compiler.options = options;
    new NodeEnvironmentPlugin({
        infrastructureLogging: options.infrastructureLogging
    }).apply(compiler);
    if (options.plugins && Array.isArray(options.plugins)) {
        for (const plugin of options.plugins) {

    //  这里加载插件
            if (typeof plugin === "function") {
                plugin.call(compiler, compiler);
            } else {
                plugin.apply(compiler);
            }
        }
    }
    compiler.hooks.environment.call();
    compiler.hooks.afterEnvironment.call();
    // 这里执行compiler的后续操作
    compiler.options = new WebpackOptionsApply().process(options, compiler);
```

#### webpack\lib\WebpackOptionsApply.js

```js
// 接上面 compiler.options = new WebpackOptionsApply().process(options, compiler);
// node_modules\webpack\lib\WebpackOptionsApply.js  process

new EntryOptionPlugin().apply(compiler);

// -----WebpackOptionsApply^process^compiler.hooks.entryOption.call -- start -------
// 后续讲 ，目前先讲解上面的 EntryOptionPlugin().apply(compiler);
compiler.hooks.entryOption.call(options.context, options.entry);
```

#### webpack\lib\EntryOptionPlugin.js

```js
// 接上面 new EntryOptionPlugin().apply(compiler);
// node_modules\webpack\lib\EntryOptionPlugin.js  process

new EntryOptionPlugin().apply(compiler);

apply(compiler) {
		compiler.hooks.entryOption.tap("EntryOptionPlugin", (context, entry) => {
			if (typeof entry === "string" || Array.isArray(entry)) {
				itemToPlugin(context, entry, "main").apply(compiler);
			} else if (typeof entry === "object") {
				for (const name of Object.keys(entry)) {
					itemToPlugin(context, entry[name], name).apply(compiler);
				}
			} else if (typeof entry === "function") {
				new DynamicEntryPlugin(context, entry).apply(compiler);
			}
			return true;
		});
	}

```

#### webpack\lib\SingleEntryPlugin.js
```js
itemToPlugin -》 SingleEntryPlugin
// =》js
// node_modules\webpack\lib\SingleEntryPlugin.js
	apply(compiler) {
		compiler.hooks.compilation.tap(
			"SingleEntryPlugin",
			(compilation, { normalModuleFactory }) => {
                // 通过 SingleEntryDependency 这个构造函数 set 唯一key value，获取对应value ，与下面对应
				compilation.dependencyFactories.set(
					SingleEntryDependency,
					normalModuleFactory
				);
			}
		);

		compiler.hooks.make.tapAsync(
			"SingleEntryPlugin",
			(compilation, callback) => {
				const { entry, name, context } = this;

                 // 后期可通过 dep.constructor 对应上面的key，获取 set 的value    
				const dep = SingleEntryPlugin.createDependency(entry, name);
				compilation.addEntry(context, dep, name, callback);
			}
		);
	}

	/**
	 * @param {string} entry entry request
	 * @param {string} name entry name
	 * @returns {SingleEntryDependency} the dependency
	 */
	static createDependency(entry, name) {
        // SingleEntryDependency new后的结果 dep ，后期可通过 dep.constructor 对应上面的key，获取 set 的value
		const dep = new SingleEntryDependency(entry);
		dep.loc = { name };
		return dep;
	}
```

```js
// -----WebpackOptionsApply^process^compiler.hooks.entryOption.call -- end -------
// 后续讲 ，目前先讲解上面的 EntryOptionPlugin().apply(compiler);
compiler.hooks.entryOption.call(options.context, options.entry);
// 其实就是触发上面的 compiler.hooks.entryOption.tap("EntryOptionPlugin", // node_modules\webpack\lib\EntryOptionPlugin.j
// 继续 tap 更多的 事件


//  这个是 LoaderPlugin 的处理？？？
new LoaderPlugin().apply(compiler);
```

`node_modules\webpack\lib\WebpackOptionsApply.js`
这个文件主要用于 订阅 各种事件，比如你设置了一个配置，
这个配置最终转换为一个plugin，
然后再plugin的apply中 tap 一个事件，
这个tap事件，可能是compiler或compiletion 的某个生命周期 或 等待后期被 call。

从这个角度讲， WebpackOptionsApply 应该是各种插件plugin 大集合 的位置。

同时在这里 触发了多个 事件(生命周期)
compiler.hooks.afterPlugins.call(compiler);
compiler.hooks.afterResolvers.call(compiler);





webpack-dev-server 通过 Server.js 触发 最终的webpack config？
 
例如 ` compiler.hooks.entryOption.call(config.context, config.entry);`执行

#### webpack-dev-middleware\index.js

```js
//  node_modules\webpack-dev-middleware\index.js

 compiler.watch

```
#### webpack\lib\Compiler.js
```js
node_modules\webpack\lib\Compiler.js
 	watch(watchOptions, handler) {
		if (this.running) return handler(new ConcurrentCompilationError());

		this.running = true;
		this.watchMode = true;
		this.fileTimestamps = new Map();
		this.contextTimestamps = new Map();
		this.removedFiles = new Set();
		return new Watching(this, watchOptions, handler);
	}

```
#### webpack\lib\Watching.js
```js
node_modules\webpack\lib\Watching.js
    	this.compiler.readRecords(err => {
			if (err) return this._done(err);

			this._go();
		});


```
#### webpack\lib\Compiler.js
```js
        node_modules\webpack\lib\Compiler.js

        	readRecords(callback) {
		if (!this.recordsInputPath) {
			this.records = {};
			return callback();
		}


上面的 this._go();
        this.compiler.hooks.watchRun.callAsync(this.compiler, err => {
			if (err) return this._done(err);
			const onCompiled = (err, compilation) => {
				if (err) return this._done(err);
				if (this.invalid) return this._done();

				if (this.compiler.hooks.shouldEmit.call(compilation) === false) {
					return this._done(null, compilation);
				}

				this.compiler.emitAssets(compilation, err => {
					if (err) return this._done(err);
					if (this.invalid) return this._done();
					this.compiler.emitRecords(err => {
						if (err) return this._done(err);

						if (compilation.hooks.needAdditionalPass.call()) {
							compilation.needAdditionalPass = true;

							const stats = new Stats(compilation);
							stats.startTime = this.startTime;
							stats.endTime = Date.now();
							this.compiler.hooks.done.callAsync(stats, err => {
								if (err) return this._done(err);

								this.compiler.hooks.additionalPass.callAsync(err => {
									if (err) return this._done(err);
									this.compiler.compile(onCompiled);
								});
							});
							return;
						}
						return this._done(null, compilation);
					});
				});
			};
            <!-- 回调中执行 -->
			this.compiler.compile(onCompiled);
		});





            node_modules\webpack\lib\Compiler.js
            compile(callback) {
		const params = this.newCompilationParams();
		this.hooks.beforeCompile.callAsync(params, err => {
			if (err) return callback(err);

			this.hooks.compile.call(params);

			const compilation = this.newCompilation(params);

			this.hooks.make.callAsync(compilation, err => {
				if (err) return callback(err);

				compilation.finish(err => {
					if (err) return callback(err);

					compilation.seal(err => {
						if (err) return callback(err);

						this.hooks.afterCompile.callAsync(compilation, err => {
							if (err) return callback(err);

							return callback(null, compilation);
						});
					});
				});
			});
		});
	}





node_modules\webpack\lib\Compiler.js
    	compile(callback) {
		const params = this.newCompilationParams();
		this.hooks.beforeCompile.callAsync(params, err => {
			if (err) return callback(err);

			this.hooks.compile.call(params);

			const compilation = this.newCompilation(params);

<!--  重要 这里开始编译 -->
			this.hooks.make.callAsync(compilation, err => {
				if (err) return callback(err);

				compilation.finish(err => {
					if (err) return callback(err);

					compilation.seal(err => {
						if (err) return callback(err);

						this.hooks.afterCompile.callAsync(compilation, err => {
							if (err) return callback(err);

							return callback(null, compilation);
						});
					});
				});
			});
		});
	}
```
#### webpack\lib\SingleEntryPlugin.js
```js

// this.hooks.make.callAsync 触发
node_modules\webpack\lib\SingleEntryPlugin.js
	compiler.hooks.make.tapAsync(
			"SingleEntryPlugin",
			(compilation, callback) => {
				const { entry, name, context } = this;

				const dep = SingleEntryPlugin.createDependency(entry, name);
				compilation.addEntry(context, dep, name, callback);
			}
		);
```
#### webpack\lib\Compilation.js
```js
node_modules\webpack\lib\Compilation.js
addEntry(context, entry, name, callback) {
		this.hooks.addEntry.call(entry, name);

		const slot = {
			name: name,
			// TODO webpack 5 remove `request`
			request: null,
			module: null
		};

		if (entry instanceof ModuleDependency) {
			slot.request = entry.request;
		}

		// TODO webpack 5: merge modules instead when multiple entry modules are supported
		const idx = this._preparedEntrypoints.findIndex(slot => slot.name === name);
		if (idx >= 0) {
			// Overwrite existing entrypoint
			this._preparedEntrypoints[idx] = slot;
		} else {
			this._preparedEntrypoints.push(slot);
		}
		this._addModuleChain(
			context,
			entry,
			module => {
				this.entries.push(module);
			},
			(err, module) => {
				if (err) {
					this.hooks.failedEntry.call(entry, name, err);
					return callback(err);
				}

				if (module) {
					slot.module = module;
				} else {
					const idx = this._preparedEntrypoints.indexOf(slot);
					if (idx >= 0) {
						this._preparedEntrypoints.splice(idx, 1);
					}
				}
				this.hooks.succeedEntry.call(entry, name, module);
				return callback(null, module);
			}
		);
	}

```
#### webpack\lib\NormalModule.js
```js

    最终 走到 
    node_modules\webpack\lib\NormalModule.js

    build(options, compilation, resolver, fs, callback) {

        return this.doBuild(options, compilation, resolver, fs, err => {

            	const result = this.parser.parse(
					this._ast || this._source.source(),
					{
						current: this,
						module: this,
						compilation: compilation,
						options: options
					},
					(err, result) => {
						if (err) {
							handleParseError(err);
						} else {
							handleParseResult(result);
						}
					}
				);
        }
    }

```
#### webpack\lib\NormalModuleFactory.js
```js
    在这个地方 设置 parser
    node_modules\webpack\lib\NormalModuleFactory.js
    	process.nextTick(() => {
								const type = settings.type;
								const resolveOptions = settings.resolve;
								callback(null, {
									context: context,
									request: loaders
										.map(loaderToIdent)
										.concat([resource])
										.join("!"),
									dependencies: data.dependencies,
									userRequest,
									rawRequest: request,
									loaders,
									resource,
									matchResource,
									resourceResolveData,
									settings,
									type,
									parser: this.getParser(type, settings.parser),
									generator: this.getGenerator(type, settings.generator),
									resolveOptions
								});
							});


```
#### webpack\lib\Compilation.js(递归 builder?)
```js
   node_modules\webpack\lib\Compilation.js

// <!-- 这个地方进行递归 builder -->
   rebuildModule(module, thisCallback) {
		let callbackList = this._rebuildingModules.get(module);
		if (callbackList) {
			callbackList.push(thisCallback);
			return;
		}
		this._rebuildingModules.set(module, (callbackList = [thisCallback]));

		const callback = err => {
			this._rebuildingModules.delete(module);
			for (const cb of callbackList) {
				cb(err);
			}
		};

		this.hooks.rebuildModule.call(module);
		const oldDependencies = module.dependencies.slice();
		const oldVariables = module.variables.slice();
		const oldBlocks = module.blocks.slice();
		module.unbuild();
		this.buildModule(module, false, module, null, err => {
			if (err) {
				this.hooks.finishRebuildingModule.call(module);
				return callback(err);
			}

			this.processModuleDependencies(module, err => {
				if (err) return callback(err);
				this.removeReasonsOfDependencyBlock(module, {
					dependencies: oldDependencies,
					variables: oldVariables,
					blocks: oldBlocks
				});
				this.hooks.finishRebuildingModule.call(module);
				callback();
			});
		});
	}

```
#### webpack\lib\NormalModule.js
```js

node_modules\webpack\lib\NormalModule.js
<!-- 所有的loader 都是在这里加载的 -->
在这里进行 js 的babel loader
runLoaders(
			{
				resource: this.resource,
				loaders: this.loaders,
				context: loaderContext,
				readResource: fs.readFile.bind(fs)
			},
			(err, result) => {
				if (result) {
					this.buildInfo.cacheable = result.cacheable;
					this.buildInfo.fileDependencies = new Set(result.fileDependencies);
					this.buildInfo.contextDependencies = new Set(
						result.contextDependencies
					);
				}
```

## 待研究

- commander 这个npm包的研究
- 后期要对babel 做更多了解。
- 有空学习下 yield


 ## parser
 ## You may need an appropriate loader 引发的问题
 ### 可能有两种原因：
 出现以上问题 可能有两种原因:
 - 确实没有处理js或css的loader
 不过如果未定义js的loader，webpack 自身的 parse也不会报问题， 当js报下面错的时候，
 大概率是由于 最新的es标准没有被解析，导致报错，而非loader问题，大概率是js的loader的配置问题。
 如下是由于 babel-loader 没有配置解析最新的 可选链 语法。
 ```js
 ERROR in ./src/srctest.js 3:5
Module parse failed: Unexpected token (3:5)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
| export default () => {
|   const dd = 1299;
>   dd?.u;
|   console.log('chengduzhaolei------------------');
| };
 @ ./src/index.js 7:0-27 16:0-2
 ```
 又比如：
 ```js
 ERROR in ./src/style.scss 1:11
Module parse failed: Unexpected token (1:11)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> body, html {
|   width: 100%;
|   height: 100%;
 @ ./src/index.js 9:0-22
 ```
- 第二种原因 就是上面说的 loader 的配置问题

### 被误解的报错来源
起初，我们看到这个报错，比如上面的的 ` ERROR in ./src/srctest.js 3:5` 的报错，
我们以为是 babel-loader 报出来的，
其实不然，其报错是 webpack 自身的解析器抛出。

#### webpack的parse js过程
所有的js会被 fs 解析成字符串;
webpack 将解析好的字符串 传递给 babel loader ；
babel loader 中利用 babel-core 里面的 babel-parse ，加上配置；
将字符串解析(es6+转es5)为 ast 或 字符串；
webpack 拿到上述 ast或字符串，利用自己的 webpack parse () 解析一遍这个ast或字符串；
```js
// node_modules\webpack\lib\Parser.js
const acorn = require("acorn");
const acornParser = acorn.Parser;
try {
			ast = acornParser.parse(code, parserOptions);
		} catch (e) {
			// js字符串 包含了高级语法 未被 babel loader 转为 es5，可能就会报错，
			error = e;
			threw = true;
		}

		if (threw && type === "auto") {
			parserOptions.sourceType = "script";
			parserOptions.allowReturnOutsideFunction = true;
			if (Array.isArray(parserOptions.onComment)) {
				parserOptions.onComment.length = 0;
			}
			try {
				ast = acornParser.parse(code, parserOptions);
				threw = false;
			} catch (e) {
				threw = true;
			}
		}
```
js字符串 包含了高级语法 未被 babel loader 转为 es5，可能就会报错，

所有的报错都会在这里被捕获：
```js
// node_modules\webpack\lib\ModuleParseError.js
constructor(module, source, err, loaders) {
		let message = "Module parse failed: " + err.message;
		let loc = undefined;
		if (loaders.length >= 1) {
			message += `\nFile was processed with these loaders:${loaders
				.map(loader => `\n * ${loader}`)
				.join("")}`;
			message +=
				"\nYou may need an additional loader to handle the result of these loaders.";
		} else {
			message +=
				"\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders";
		}
```

### babel-loader和webpack的parse

#### 二者区别与关系
babel-loader 使用的是 @babel/parser 
webpack 使用的是 acorn

二者的parse 一脉相承 以及扩展的关系。
[更多参考](https://zhuanlan.zhihu.com/p/358518402)

#### webpack会自己再次parse一次
我们以为 webpack的parse是外部loader实现的，其实不然，
loader会自己parse一次，让后将parse后的字符串返回给 webpack，
由上面的《webpack的parse js过程》可知，
webpack 拿到这个字符串后，会再次解析一次，
这感觉解析重复了，不过好处是 webpack会检验解析的结果，如果不符合 js规范，就提前报错，
真正做到了js运行前 就把错误跑出来。


### js的世界是字符串
JavaScript 语言自身只有字符串数据类型，没有二进制数据类型。
但在处理像TCP流或文件流时，必须使用到二进制数据。因此在 Node.js中，定义了一个 Buffer 类，该类用来创建一个专门存放二进制数据的缓存区。
js 都是通过 fs 读写 字符串 然后通过 evel 或 new function  或 ast 语法树，编译成 js文件
[参考](https://www.runoob.com/nodejs/nodejs-buffer.html)


## exclude 的调用分析

### 原理分析
webpack 编译js时，执行 exclude 的判断时机和逻辑 **不在loader上**，
而是在 `webpack\lib\RuleSet.js`上，
webpack为每个文件 生成一个编译对象时，通过上面的 RuleSet.js 进行判断exclude, 设置此文件所有需要的loader，
如果满足了exclude，编译对象将不会有此loader，
没有此loader参与文件编译，那么该文件的编译，就根本不会去到loader里面。
```js
{
	test: /\.js$/,
	exclude: /src.{0,3}srctest/,
	use: {
		loader: 'babel-loader?cacheDirectory=true',
		// ...
	},
}
```

### RuleSet.js的执行分析

其原理
```js
// node_modules\webpack\lib\RuleSet.js
static normalizeCondition(condition) {
		if (!condition) throw new Error("Expected condition but got falsy value");
		if (typeof condition === "string") {
			return str => str.indexOf(condition) === 0;
		}
		if (typeof condition === "function") {
			return condition;
		}
		if (condition instanceof RegExp) {
			// 这里 合成 exclude 的判断函数  condition 为 /src.{0,3}srctest/
			return condition.test.bind(condition);
		}
		if (Array.isArray(condition)) {
			const items = condition.map(c => RuleSet.normalizeCondition(c));
			return orMatcher(items);
		}


const andMatcher = items => {
	return str => {
		for (let i = 0; i < items.length; i++) {
			// /src.{0,3}srctest/.test('')
			if (!items[i](str)) return false;
		}
		return true;
	};
};

```

node_modules\webpack\lib\RuleSet.js的执行：
```js
_run(data, rule, result) {
		// test conditions
		if (rule.resource && !data.resource) return false;
		if (rule.realResource && !data.realResource) return false;
		if (rule.resourceQuery && !data.resourceQuery) return false;
		if (rule.compiler && !data.compiler) return false;
		if (rule.issuer && !data.issuer) return false;
		// rule.resource(data.resource) 调用上面的 // /src.{0,3}srctest/.test('') if (!items[i](str)) return false;
		// return false 后 此loader 将不会被加入到 文件的loader上
		if (rule.resource && !rule.resource(data.resource)) return false;
```

### 调用过程

流程如下：
#### webpack\lib\Compilation.js
```js
// node_modules\webpack\lib\Compilation.js
this.semaphore.acquire(() => {
	// 这里create
			moduleFactory.create(
				{
					contextInfo: {
						issuer: "",
						compiler: this.compiler.name
					},
					context: context,
					dependencies: [dependency]
				},

```
#### webpack\lib\NormalModuleFactory.js
```js
// node_modules\webpack\lib\NormalModuleFactory.js
create(data, callback) {
	// 执行这个方法
		this.hooks.beforeResolve.callAsync(
			{
				contextInfo,
				resolveOptions,
				context,
				request,
				dependencies
			},
			(err, result) => {
				// 执行这里
				const factory = this.hooks.factory.call(null);
				factory(result, (err, module) => {
					callback(null, module);
				});
			}
		);
	}

// node_modules\webpack\lib\NormalModuleFactory.js
create(data, callback) {
	// 执行这个方法
		this.hooks.beforeResolve.callAsync(
			{
				contextInfo,
				resolveOptions,
				context,
				request,
				dependencies
			},
			(err, result) => {
				// 执行这里
				const factory = this.hooks.factory.call(null);
				factory(result, (err, module) => {
					callback(null, module);
				});
			}
		);
	}

// 同样这个js文件
	this.hooks.factory.tap("NormalModuleFactory", () => (result, callback) => {

		// 执行这里
			let resolver = this.hooks.resolver.call(null);

			// Ignored
			if (!resolver) return callback();

			resolver(result, (err, data) => {
				this.hooks.afterResolve.callAsync(data, (err, result) => {
					// ...
					return callback(null, createdModule);
				});
			});
		});

// 同样在这个页面
	this.hooks.resolver.tap("NormalModuleFactory", () => (data, callback) => {
			const contextInfo = data.contextInfo;
			const context = data.context;
			const request = data.request;

// ....

			asyncLib.parallel(
				[
				// ...
				],
				(err, results) => {
					if (err) return callback(err);
				
// ...
// 重点， exclude 的逻辑 是在这里处理的 ，这部分逻辑放到 《RuleSet.js的执行分析》
					const result = this.ruleSet.exec({
						resource: resourcePath,
						realResource:
							matchResource !== undefined
								? resource.replace(/\?.*/, "")
								: resourcePath,
						resourceQuery,
						issuer: contextInfo.issuer,
						compiler: contextInfo.compiler
					});
					const useLoaders = [];
					for (const r of result) {
						if (r.type === "use") {
							// ...
								// 这里
								useLoaders.push(r.value);
							}
						}
					}
					asyncLib.parallel(
						[
						// ...
							this.resolveRequestArray.bind(
								this,
								contextInfo,
								this.context,
								useLoaders,
								loaderResolver
							),
						// ...
						],
						(err, results) => {
							
						    loaders = results[0].concat(loaders, results[1], results[2]);
							
							process.nextTick(() => {
								const type = settings.type;
								const resolveOptions = settings.resolve;
								callback(null, {
									context: context,
									// ...
									// 这里的loader 这里如果没有loader，说明后期这个文件处理的时候，就不会被loader处理
									loaders,
									resource,
									matchResource,
									resourceResolveData,
									settings,
									type,
									parser: this.getParser(type, settings.parser),
									// 。。。
								});
							});
						}
					);
				}
			);
		});

```

### 小结
exclude 其实就是 loader 一个配置的一个侧面。
webpack的设计思想 应该是所有的 loader不处理webpack的配置逻辑；
因为这个配置逻辑属于webpack的业务逻辑；
babel-loader 本身只处理 纯粹的功能逻辑；
所以所有与配置相关的处理应该是 生成的一个js编译对象:
```js
// node_modules\webpack\lib\NormalModuleFactory.js
	process.nextTick(() => {
								const type = settings.type;
								const resolveOptions = settings.resolve;
								callback(null, {
									context: context,
									request: loaders
										.map(loaderToIdent)
										.concat([resource])
										.join("!"),
									dependencies: data.dependencies,
									userRequest,
									rawRequest: request,
									loaders,
									resource,
									matchResource,
									resourceResolveData,
									settings,
									type,
									parser: this.getParser(type, settings.parser),
									generator: this.getGenerator(type, settings.generator),
									resolveOptions
								});
							});
```

exclude 只是一个点，以此类推，
以后配置相关的东西，只需要debug webpack的代码，而不用去debug loader 或 plugin 代码。
## 两种设置babel配置的区别
### 两种方式的差异
babel的配置有两种方式：
方式一 就是 babelrc
方式二 就是 option模式， 在 webpack.config.js 上：
```js
  {
        test: /\.js$/,
        use: {
          loader: 'babel-loader?cacheDirectory=true',
		//   配置在这里
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  corejs: 3,
                },
              ],
              '@babel/preset-react',
            ],
          },
        },
      },
```
**这两种配置方式 在 webpack 4 的版本上具有差异：**
如果是 babelrc 的方式， 那么需要编译 node_modules 的包时， 无法结合 babelrc 的配置进行编译。
非 node_modules 目录的，也就是业务目录下的，不存在这个问题， webpack options 或 babelrc 两种方式都可 没有区别。

目前此问题 存在与 webpack 4， webpack 5 貌似不存在此问题。

### 读取Babel option的过程
以下 皆以 webpack 4.6.3 为版本
#### webpack\lib\NormalModule.js
```js
// node_modules\webpack\lib\NormalModule.js
	doBuild(options, compilation, resolver, fs, callback) {
		const loaderContext = this.createLoaderContext(
			resolver,
			options,
			compilation,
			fs
		);
    // 这里
		runLoaders(
			{
				resource: this.resource,
				loaders: this.loaders,
				context: loaderContext,
				readResource: fs.readFile.bind(fs)
			},
			(err, result) => {

			})
	}
```

#### loader-runner\lib\LoaderRunner.js
```js
exports.runLoaders = function runLoaders(options, callback) {

// 经过系列动作 跑到babel-loader\lib\index.js
}

```
#### babel-loader\lib\index.js
```js
// node_modules\babel-loader\lib\index.js
    const {
		// node_modules\@babel\core\lib\config\partial.js  的loadPartialConfig
      loadPartialConfigAsync = babel.loadPartialConfig
    } = babel;
    const config = yield loadPartialConfigAsync(injectCaller(programmaticOptions, this.target));

```

#### @babel\core\lib\config\partial.js
```js
// node_modules\@babel\core\lib\config\partial.js
  
const loadPartialConfig = _gensync()(function* (opts) {
 
  const result = yield* loadPrivatePartialConfig(opts);
  if (!result) return null;
  const {
    options,
    babelrc,
    ignore,
    config,
    fileHandling,
    files
  } = result;

 
  return new PartialConfig(options, babelrc ? babelrc.filepath : undefined, ignore ? ignore.filepath : undefined, config ? config.filepath : undefined, fileHandling, files);
});


// node_modules\@babel\core\lib\config\partial.js
  
function* loadPrivatePartialConfig(inputOpts) {
//   ....
// _configChain.buildRootChain 是 node_modules\@babel\core\lib\config\config-chain.js
  const configChain = yield* (0, _configChain.buildRootChain)(args, context);
  if (!configChain) return null;
  const merged = {
    assumptions: {}
  };
  configChain.options.forEach(opts => {
    (0, _util.mergeOptions)(merged, opts);
  });
  const options = Object.assign({}, merged, {
	//   ...
    plugins: configChain.plugins.map(descriptor => (0, _item.createItemFromDescriptor)(descriptor)),
    presets: configChain.presets.map(descriptor => (0, _item.createItemFromDescriptor)(descriptor))
  });
  return {
    options,
    context,
    fileHandling: configChain.fileHandling,
    ignore: configChain.ignore,
    babelrc: configChain.babelrc,
    config: configChain.config,
    files: configChain.files
  };
}
```

#### @babel\core\lib\config\config-chain.js
```js
// node_modules\@babel\core\lib\config\config-chain.js
function* buildRootChain(opts, context) {
	// ...
  if ((babelrc === true || babelrc === undefined) && typeof context.filename === "string") {
 // ...
// 这一步决定了 babelrc 文件对 此要编译的js 文件 起作用 ，这是关键一步
    if (pkgData && babelrcLoadEnabled(context, pkgData, babelrcRoots, babelrcRootsDirectory)) {
    
	// ...
    }
  }


  const chain = mergeChain(mergeChain(mergeChain(emptyChain(), configFileChain), fileChain), programmaticChain);
  return {
    plugins: isIgnored ? [] : dedupDescriptors(chain.plugins),
    presets: isIgnored ? [] : dedupDescriptors(chain.presets),
//   ...
    babelrc: babelrcFile || undefined,
  };
}


function babelrcLoadEnabled(context, pkgData, babelrcRoots, babelrcRootsDirectory) {

  if (babelrcRoots === undefined) {
	// pkgData.directories ：  ['D:\workplace\tstnpm\webpack-4.6\src', 'D:\workplace\tstnpm\webpack-4.6']
	// absoluteRoot ：  'D:\workplace\tstnpm\webpack-4.6'
	// 结果是true 所以业务代码是可以的

	// 如果是 node_modules:
	// pkgData.directories ：  ['D:\workplace\tstnpm\webpack-4.6\node_modules\hz-npm-test\lib', 'D:\workplace\tstnpm\webpack-4.6\node_modules\hz-npm-test']
	// absoluteRoot ：  'D:\workplace\tstnpm\webpack-4.6'
	// 结果是false
    return pkgData.directories.indexOf(absoluteRoot) !== -1;
  }

}
```

### 小结
由 《exclude 的调用分析  -  小结》 可知，所有的webpack 配置 是 webpack 自己处理的；
而 babel 的两种配置方式（webpack option 和 babelrc） , 除了下面的 关键字 option 对象是webpack的公共行为，
至于 webpack option 与 babelrc 的优先级 以及 node_modules  与 src/ 业务代码目录下 文件的babel 编译options 如何结合，
则不是webpack的事情，全部交给 babel自己处理 ，主要集中在 @babel\core 自身完成。
```js

// @babel\core\lib\config\partial.js //partial 顾名思义 就是 优先的配置的意思
// @babel\core\lib\config\config-chain.js 
```
这两个都是典型的例子 ：
《exclude 的调用分析》 用于分析 webpack 自身的options 行为；
《两种设置babel配置的区别》 用于分析 loader 自身的options 处理行为；








 
