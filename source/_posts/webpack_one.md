---
title: webpack攀登之旅(往)
date: 2022/3/23
tags: webpack
categories: 
- 前端工具
series: 前端
---

*往蹇来誉 田获三狐*

懂webpack配置不难，但webpack升级后，旧的经验很容易出问题，且webpack像一个黑箱，难以解决。
webpack配置学习三个月，升级之后又三个月，没完没了，没有镜头。
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
里面有关于__webpack_require__ 的实现。

### 学习历程

#### 2022-3-28

今晚要做的是，做笔记；
看视频做笔记；
然后将最近这几天的内容 整理笔记；
包括之前源码调试；
和今天的parse；

做完之后，收集一波webpack 资料
然后再制定一个三天计划。

webpack 源码学习资料确实太匮乏，无太多经验可借鉴
，只能边做边计划。
做完一个阶段，然后 计划下一个阶段

后期看下 loaderRunner 的实现？


## demo

### 官方 webpack github demo
可以使用此 [demo 分支 version-debug-5.69.1 ](https://github.com/YeWills/webpack/tree/version-debug-5.69.1) 进行webpack源码调试，此demo是fork webpack官方github的。
里面有 [webpack5 的视频](https://www.bilibili.com/video/av462922583?from=search&seid=14121423744670771391&spm_id_from=333.337.0.0)调试经验分享。

目前用 /d/workplace/qiqiaonpm/webpack-4.6 demo 来测试一些问题，比如 babelrc nodem module 不编译的问题； html 编译出问题 md5 编译出问题；

后期基于 之前写的webpack-demo 新创建一个 webpack 调试demo；也可以直接基于 官网的 github demo 调试；
留一个公司的webpack-demo以做区别；



<!-- 测试以 D:\workplace\xxxxnpm\webpack-4.6 -->
<!-- webpack 有一个源码启动的 D:\git\webpack-->


## webpack源码调试

### 概述

webpack 命令
bin/webpack.cmd
webpack.js

### 教程
https://www.bilibili.com/video/BV12L411t7Pr?spm_id_from=333.999.0.0

compiler 与 compilation 区别和联系
手写简易版本的打包器 (ast 抽象语法树， dom树)
loader(ast)
plugin

#### webpack入口

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

## 一个js的加载过程

本例以传统的webpack 配置模式进行。

传统模式 
启动入口
fs 读写
ast 生成
loader 加载 [exclude 的规则]
babel 加载 babelrc 时机
编译出来的文件

node_modules\webpack-dev-server\bin\webpack-dev-server.js

compiler = webpack(config);

![](/image/webpack_one/entry.jpg)

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


```js
// 接上面 compiler.options = new WebpackOptionsApply().process(options, compiler);
// node_modules\webpack\lib\WebpackOptionsApply.js  process

new EntryOptionPlugin().apply(compiler);

// -----WebpackOptionsApply^process^compiler.hooks.entryOption.call -- start -------
// 后续讲 ，目前先讲解上面的 EntryOptionPlugin().apply(compiler);
compiler.hooks.entryOption.call(options.context, options.entry);
```

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



<!-- node_modules\webpack\lib\WebpackOptionsApply.js -->
这个文件主要用于 订阅 各种事件，比如你设置了一个配置，
这个配置最终转换为一个plugin，
然后再plugin的apply中 tap 一个事件，
这个tap事件，可能是compiler或compiletion 的某个生命周期 或 等待后期被 call。

从这个角度讲， WebpackOptionsApply 应该是各种插件plugin 大集合 的位置。

同时在这里 触发了多个 事件(生命周期)
compiler.hooks.afterPlugins.call(compiler);
compiler.hooks.afterResolvers.call(compiler);



疑问 
	compiler.options = new WebpackOptionsApply().process(options, compiler);
    之后 如何触发 系列 监听事件的


如果是 webpack-server 触发 就通过 Server.js
 
 中的 compiler.hooks.entryOption.call(config.context, config.entry);
 执行

 node_modules\webpack-dev-middleware\index.js

 compiler.watch


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


node_modules\webpack\lib\Watching.js
    	this.compiler.readRecords(err => {
			if (err) return this._done(err);

			this._go();
		});



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


this.hooks.make.callAsync 触发
node_modules\webpack\lib\SingleEntryPlugin.js
	compiler.hooks.make.tapAsync(
			"SingleEntryPlugin",
			(compilation, callback) => {
				const { entry, name, context } = this;

				const dep = SingleEntryPlugin.createDependency(entry, name);
				compilation.addEntry(context, dep, name, callback);
			}
		);

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



   node_modules\webpack\lib\Compilation.js

<!-- 这个地方进行递归 builder -->
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



https://www.runoob.com/nodejs/nodejs-buffer.html

JavaScript 语言自身只有字符串数据类型，没有二进制数据类型。

但在处理像TCP流或文件流时，必须使用到二进制数据。因此在 Node.js中，定义了一个 Buffer 类，该类用来创建一个专门存放二进制数据的缓存区。

js 都是通过 fs 读写 字符串 然后通过 evel 或 new function  或 ast 语法树，编译成 js文件



明天重点围绕

看他们的loader是如何匹配的，比如那个正则表达式；


node_modules\webpack\lib\NormalModule.js
在这里进行 js 的babel loader
babel 的babelrc 文件是如何读取的？
哪些文件会被 loader 的rule 匹配 ？
parser 是怎么设置的？
fs 读写成 字符串 是在哪里设置的？
runLoaders(

感觉重点就这么几个文件

先以问题点 去看源码

先 大致原理 从视频了解下；
然后以小问题点 去看源码；
最后再精看一下。


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


runloader
## 待研究
commander 这个npm包的研究





等下 研究下 loader 的 exclude 怎么来的；
然后看视频 看手写一个打包器；
或者看手写一个plugin；

看手写也好，还是什么也好，
你至少知道怎么用了，并且就是一个源码的 活生生的说明书；

然后再结合源码 排错。

这次的目的不是自己手写webpack 源码

抑或全部了解 webpack ，

而是先了解webpack 使用，逐步了解webpack 的细节；

后期要对babel 做更多了解。


全程做好笔记

包括刚才的视频


const { getContext, runLoaders } = require("loader-runner");

loader-runner


babel-loader

exclude


首先在 node_modules\webpack\lib\RuleSet.js  if (rule.test || rule.include || rule.exclude) {  得到信息



明天 弄清楚 

ERROR in ./src/srctest.js 3:5
Module parse failed: Unexpected token (3:5)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
| export default () => {
|   const dd = 1299;
>   dd?.u;
|   console.log('chengduzhaolei------------------');
| };
 @ ./src/index.js 7:0-27 15:0-2

 这个标红是为什么？


 有空学习下 yield


 ## parser

 webpack 与 babel-loader 各有一套 解析器。
 
 
