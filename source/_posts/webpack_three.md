---
title: webpack再出发(来)
date: 2022/4/5
tags: webpack
categories: 
- 前端工具
series: 前端
---


## 基础知识

### compiler 钩子

```js
// node_modules\webpack\lib\Compiler.js
	Object.keys(this.hooks).forEach((hookName)=>{
			const hook = this.hooks[hookName];
			if(hook.tap){
				hook.tap('show',()=>{
					const hooktype = Object.getPrototypeOf(hook).constructor.name;
					console.log(`comiler ${hookName} ${hooktype} ${hook._args} `)
				})
			}
		})
```

environment      【入参： Hook     设置node环境变量 
afterEnvironment      【入参： Hook    设置环境变量完成
entryOption      【入参： Hook context,entry   解析入口文件
afterPlugins      【入参： Hook compiler   挂载插件结束， webpack.config.js上会挂载很多的插件
afterResolvers      【入参： Hook compiler  在路径解析器初始化后触发， 核心作用是给路径，然后生成绝对路径
initialize      【入参： Hook  
beforeRun      【入参： Hook compiler 
run      【入参： Hook compiler 开始编译
infrastructureLog      【入参： Hook origin,type,args  
infrastructureLog      【入参： Hook origin,type,args  
readRecords      【入参： Hook
normalModuleFactory      【入参： Hook normalModuleFactory  创建普通模块工厂 正常的文件；
contextModuleFactory      【入参： Hook contextModuleFactory  创建上下文模块工程 比如 通过cdn引入的全局变量 jquery 等等；
beforeCompile      【入参： Hook params  
compile      【入参： Hook params  编译
thisCompilation      【入参： Hook compilation,params  开始启动编译
compilation      【入参： Hook compilation,params 创建一个 compilation
make      【入参： Hook compilation  最核心代码，是从入口文件开始编译


finishMake      【入参： Hook compilation 
afterCompile      【入参： Hook compilation  编译完成
shouldEmit      【入参： Hook compilation  询问是否要生成文件
emit      【入参： Hook compilation 生成文件
afterEmit      【入参： Hook compilation 生成完成
emitRecords      【入参： Hook
done      【入参： Hook stats 整个编译完成
shutdown      【入参： Hook

afterDone      【入参： Hook stats
infrastructureLog      【入参： Hook origin,type,args


### 调试技巧
用上面《compiler 钩子》的代码，断点，每次进入生命周期的时候，通过调用栈的回滚 查看如何进入生命周期的


### compilation 钩子


addEntry   【类型：SyncHook 入参：entry,name     添加入口
buildModule   【类型：SyncHook 入参：module   编译入口模块
normalModuleLoader   【类型：SyncHook 入参：loaderContext,module     拿到正常模块加载器
succeedModule   【类型：SyncHook 入参：module    成功加载模块
succeedEntry   【类型：SyncHook 入参：entry,name,module   入口解析成功
finishModules   【类型：AsyncSeriesHook 入参：modules   完成模块编译
seal   【类型：SyncHook 入参：   封包
optimizeDependenciesBasic   【类型：SyncBailHook 入参：modules   优化依赖项
optimizeDependencies   【类型：SyncBailHook 入参：modules   
optimizeDependenciesAdvanced   【类型：SyncBailHook 入参：modules   
afterOptimizeDependencies   【类型：SyncHook 入参：modules   


beforeChunks   【类型：SyncHook 入参：    生成chunk
afterChunks   【类型：SyncHook 入参：chunks   完成生成chunk
optimize   【类型：SyncHook 入参：   
optimizeModulesBasic   【类型：SyncBailHook 入参：modules   优化模块
optimizeModules   【类型：SyncBailHook 入参：modules   
optimizeModulesAdvanced   【类型：SyncBailHook 入参：modules   
afterOptimizeModules   【类型：SyncHook 入参：modules   
optimizeChunksBasic   【类型：SyncBailHook 入参：chunks,chunkGroups   优化chunk
optimizeChunks   【类型：SyncBailHook 入参：chunks,chunkGroups   
optimizeChunksAdvanced   【类型：SyncBailHook 入参：chunks,chunkGroups   
afterOptimizeChunks   【类型：SyncHook 入参：chunks,chunkGroups   
optimizeTree   【类型：AsyncSeriesHook 入参：chunks,modules   
afterOptimizeTree   【类型：SyncHook 入参：chunks,modules   
optimizeChunkModulesBasic   【类型：SyncBailHook 入参：chunks,modules   优化chunk module
optimizeChunkModules   【类型：SyncBailHook 入参：chunks,modules   
optimizeChunkModulesAdvanced   【类型：SyncBailHook 入参：chunks,modules   
afterOptimizeChunkModules   【类型：SyncHook 入参：chunks,modules   
shouldRecord   【类型：SyncBailHook 入参：   是否要记录
reviveModules   【类型：SyncHook 入参：modules,records   
optimizeModuleOrder   【类型：SyncHook 入参：modules   优化模块的顺序
advancedOptimizeModuleOrder   【类型：SyncHook 入参：modules   
beforeModuleIds   【类型：SyncHook 入参：modules   处理moduleIds
moduleIds   【类型：SyncHook 入参：modules   
optimizeModuleIds   【类型：SyncHook 入参：modules   
afterOptimizeModuleIds   【类型：SyncHook 入参：modules   
reviveChunks   【类型：SyncHook 入参：chunks,records   
optimizeChunkOrder   【类型：SyncHook 入参：chunks   优化chunk 顺序
beforeChunkIds   【类型：SyncHook 入参：chunks   
optimizeChunkIds   【类型：SyncHook 入参：chunks   
afterOptimizeChunkIds   【类型：SyncHook 入参：chunks   
recordModules   【类型：SyncHook 入参：modules,records   记录模块
recordChunks   【类型：SyncHook 入参：chunks,records   记录chunk
beforeHash   【类型：SyncHook 入参：   生成hash前
chunkHash   【类型：SyncHook 入参：chunk,chunkHash     生成chunkhash
contentHash   【类型：SyncHook 入参：chunk   
afterHash   【类型：SyncHook 入参：   
recordHash   【类型：SyncHook 入参：records   把hash值记录到stats文件里
beforeModuleAssets   【类型：SyncHook 入参：   生成模块之前资源
shouldGenerateChunkAssets   【类型：SyncBailHook 入参：    是否要生成模块资源
beforeChunkAssets   【类型：SyncHook 入参：   生成代码块资源之前
chunkAsset   【类型：SyncHook 入参：chunk,filename   
additionalChunkAssets   【类型：SyncHook 入参：chunks   
record   【类型：SyncHook 入参：compilation,records   
additionalAssets   【类型：AsyncSeriesHook 入参：   
optimizeChunkAssets   【类型：AsyncSeriesHook 入参：chunks   
afterOptimizeChunkAssets   【类型：SyncHook 入参：chunks   
optimizeAssets   【类型：AsyncSeriesHook 入参：assets   
afterOptimizeAssets   【类型：SyncHook 入参：assets   
needAdditionalSeal   【类型：SyncBailHook 入参：   
afterSeal   【类型：AsyncSeriesHook 入参：   
needAdditionalPass   【类型：SyncBailHook 入参：   



### 关于stats对象

#### 概述

关于 stats 对象 更多知识 参考 《webpack再出发(田)：chunk及之后的调试  -- 生成Stats 对象》

在webpack的回调函数中会得到 stats 对象；
这个对象实际来自于 `Compilation.getStats()` ，返回的是主要含有modules\chunks\assets三个属性值的对象；
stats对象本质上来自于 `lib/Stats.js` 的类实例；

- modules 记录了所有解析后的模块；
- chunks 记录了所有chunk；
- assets 记录了所有要生成的文件；

   
```s
# 必须要基于以下版本，否则报错
# "webpack": "4.46.0",
# "webpack-cli": "^3.2.0",
# 生成资源文件
npx webpack --profile  --json > stats.json

```
```js
{
  "errors": [],  //编译中的错误
  "warnings": [],
  "version": "4.46.0", //编译时webpack版本号
  "hash": "a83d304015df9ab38759", //本次编译hash
  "time": 363, //总共花费的时间 单位是ms
  "builtAt": 1649145924132, //构建时间
  "publicPath": "",
  "outputPath": "D:\\workplace\\webpack\\webpack-travel\\dist",
  "assetsByChunkName": { //产出资源的代码块的名字
    "main": "main.bundle.js"
  },
  "assets": [ //产出的资源
    {
      "name": "main.bundle.js",  //生成的文件名
      "size": 3925, //预估的生成文件大小
      "chunks": [  //这个文件里包含的代码块
        "main"
      ],
      "chunkNames": [
        "main"
      ],
      "info": {},
      "emitted": true
    }
  ],
  "filteredAssets": 0, //过滤资源
  "entrypoints": { //入口点
    "main": {
      "chunks": [
        "main"
      ],
      "assets": [
        "main.bundle.js"
      ],
      "children": {},
      "childAssets": {}
    }
  },
  "namedChunkGroups": {
    "main": {
      "chunks": [
        "main"
      ],
      "assets": [
        "main.bundle.js"
      ],
      "children": {},
      "childAssets": {}
    }
  },
  "chunks": [ //代码块
    {
      "id": "main",
      "rendered": true,
      "initial": true,
      "entry": true,
      "size": 65,
      "names": [
        "main"
      ],
      "files": [
        "main.bundle.js"
      ],
      "hash": "012e07b641f6c138314f", //chunkHash
      "siblings": [],
      "parents": [],
      "children": [],
      "childrenByOrder": {},
      "modules": [
        {
          "id": "./src/index.js", //模块id moduleId
        //   模块的绝对路径
          "identifier": "D:\\workplace\\webpack\\webpack-travel\\node_modules\\babel-loader\\lib\\index.js!D:\\workplace\\webpack\\webpack-travel\\src\\index.js",
          "name": "./src/index.js",
          "index": 0,
          "index2": 0,
          "size": 65,
          "cacheable": true,
          "built": true, //是否经过loader编译 (存疑， 经过试验，未经loader的js 编译后，此built也为true)
          "optional": false,
          "prefetched": false, //是否要预取，编译好后，告诉浏览器 有空的时候 加载资源
          "chunks": [
            "main"
          ],
          "issuer": null,  //谁用的，谁调用该文件的；
          "issuerId": null,
          "issuerName": null,
          "issuerPath": null,
          "profile": {
            "factory": 19,  //工厂创建模块的时间
            "building": 323  loader编译的时间
          },
          "failed": false,
          "errors": 0,
          "warnings": 0,
          "assets": [],
          "reasons": [  //表示本模块被添加的原因
            {
              "moduleId": null,  //被引用的module的moduleId
              "moduleIdentifier": null,
              "module": null,
              "moduleName": null,
              "type": "single entry",  //引用的方式：entry的方式引入，其他的有import
              "userRequest": "./src/index.js",
              "loc": "main"  //引入位置的具体信息，其他信息有行数
            }
          ],
          "providedExports": null,
          "optimizationBailout": [],
          "depth": 0,
          "source": "console.log('--------009883njoddsrg543ghjsdg112111111111111111');"
        }
      ],
      "filteredModules": 0,
      "origins": [
        {
          "module": "",
          "moduleIdentifier": "",
          "moduleName": "",
          "loc": "main",
          "request": "./src/index.js",
          "reasons": []
        }
      ]
    }
  ],
  "modules": [
    {
      "id": "./src/index.js",
      "identifier": "D:\\workplace\\webpack\\webpack-travel\\node_modules\\babel-loader\\lib\\index.js!D:\\workplace\\webpack\\webpack-travel\\src\\index.js",
      "name": "./src/index.js",
      "index": 0,
      "index2": 0,
      "size": 65,
      "cacheable": true,
      "built": true,
      "optional": false,
      "prefetched": false,
      "chunks": [
        "main"
      ],
      "issuer": null,
      "issuerId": null,
      "issuerName": null,
      "issuerPath": null,
      "profile": {
        "factory": 19,
        "building": 323
      },
      "failed": false,
      "errors": 0,
      "warnings": 0,
      "assets": [],
      "reasons": [
        {
          "moduleId": null,
          "moduleIdentifier": null,
          "module": null,
          "moduleName": null,
          "type": "single entry",
          "userRequest": "./src/index.js",
          "loc": "main"
        }
      ],
      "providedExports": null,
      "optimizationBailout": [],
      "depth": 0,
      "source": "console.log('--------009883njoddsrg543ghjsdg112111111111111111');"
    }
  ],
  "filteredModules": 0,
  "logging": {
    "webpack.buildChunkGraph.visitModules": {
      "entries": [],
      "filteredEntries": 2,
      "debug": false
    }
  },
  "children": []
}

```

### 关于module对象

```js
{
  // dependencies 说明参考 
      dependencies: [
        [HarmonyCompatibilityDependency], //对应模板 `HarmonyExportDependencyTemplate` 会在源码里最前面添加如：`__webpack_require__.r(__webpack_exports__);` 的代码，用于定义 exports:__esModule
        [HarmonyInitDependency],
        [ConstDependency],
        [HarmonyImportSideEffectDependency],
        [ConstDependency],
        [HarmonyImportSideEffectDependency],
        [HarmonyImportSpecifierDependency],
        [HarmonyImportSpecifierDependency]
      ],
      blocks: [],
      variables: [],
      type: 'javascript/auto',
      context: 'D:\\workplace\\webpack\\webpack-travel\\src',
      debugId: 1000,
      hash: '27a8caa7dfc3e630b3401c5bf4817949',
      renderedHash: '27a8caa7dfc3e630b340',
      resolveOptions: {},
      factoryMeta: {},
      warnings: [],
      errors: [],
      buildMeta: { exportsType: 'namespace', providedExports: [] },
      buildInfo: {
        cacheable: true,
        fileDependencies: [Set],
        contextDependencies: Set(0) {},
        assets: undefined,
        assetsInfo: undefined,
        strict: true,
        exportsArgument: '__webpack_exports__',
        temporaryProvidedExports: false
      },
      reasons: [ [ModuleReason] ],
      _chunks: SortableSet(1) [Set] {
        [Chunk],
        _sortFn: [Function: sortById],
        _lastActiveSortFn: null,
        _cache: undefined,
        _cacheOrderIndependent: undefined
      },
      id: './src/index.js',
      index: 0,
      index2: 2,
      depth: 0,
      issuer: null,
      profile: undefined,
      prefetched: false,
      built: true,
      used: null,
      usedExports: null,
      optimizationBailout: [],
      _rewriteChunkInReasons: undefined,
      useSourceMap: false,
      _source: OriginalSource {
        _value: "import srctFn from './srctest';\n" +
          "import srcpage from './page/srcpage';\n" +
          "srctFn('ffffffffffffd');\n" +
          "srcpage('ffffffffffffd');\n" +
          "console.log('--index-page------009883njoddsrg543ghjsdg112111111111111111');",
        _name: 'D:\\workplace\\webpack\\webpack-travel\\node_modules\\babel-loader\\lib\\index.js??ref--4!D:\\workplace\\webpack\\webpack-travel\\src\\index.js'
      },
      request: 'D:\\workplace\\webpack\\webpack-travel\\node_modules\\babel-loader\\lib\\index.js??ref--4!D:\\workplace\\webpack\\webpack-travel\\src\\index.js',
      userRequest: 'D:\\workplace\\webpack\\webpack-travel\\src\\index.js',
      rawRequest: './src/index.js',
      binary: false,
      parser: Parser {
        _pluginCompat: [SyncBailHook],
        hooks: [Object],
        options: {},
        sourceType: 'auto',
        scope: undefined,
        state: undefined,
        comments: undefined
      },
      generator: JavascriptGenerator {},
      resource: 'D:\\workplace\\webpack\\webpack-travel\\src\\index.js',
      matchResource: undefined,
      loaders: [ [Object] ],
      error: null,
      _sourceSize: null,
      _buildHash: '6e3735e813c76c2709c7d0f4f123937d',
      buildTimestamp: 1649210983865,
      _cachedSources: Map(1) { 'javascript' => [Object] },
      lineToLine: false,
      _lastSuccessfulBuildMeta: { exportsType: 'namespace', providedExports: [] },
      _ast: null
    }
```

####  dependencies
 dependencies 说明 [参考](https://blog.flqin.com/378.html) 

## 关于chunk

### 生成chunk的情况
- 每个入口文件是天然的chunk，入口文件及其依赖模块生成一个chunk；
- 如果说某个模块里有动态引入语句import语句，就会由import单独生成一个新的代码块，这个代码块里放置这个动态引入的模块以及这个动态引入的模块依赖的模块。
- splitchunks，实现同步的代码分割。把多个代码里共同的模块提供成一个单独的代码块。还可以把某些模块，比如说node_modules里的模块单独提出来成立一个代码块。

![](/image/webpack_one/chunk.jpg)

[这个视频讲的更清楚-《任务14：14.如何调试和阅读webpack源码》-在最后几分钟内有讲到](https://www.bilibili.com/video/BV1N5411j74S?p=14)
[这个视频讲的更清楚-《任务15：15.webpack自定义loader》-在开始的几分钟内有讲到](https://www.bilibili.com/video/BV1N5411j74S?p=15)

## webpack 主流程

### 流程一

![](/image/webpack_one/m1.jpg)
![](/image/webpack_one/m2.jpg)
![](/image/webpack_one/m3.png)
![](/image/webpack_one/m4.jpg)

### 流程二

下图也是 [webpack的一段主流程图](https://lxzjj.github.io/2017/11/02/%E7%8E%A9%E8%BD%ACwebpack%EF%BC%88%E4%B8%80%EF%BC%89/)，版本为 webpack 3.6.0

![](/image/webpack_one/main1.svg)

- 图中虚线表示存在循环流程
- 上面展示的只是 webpack 构建的一部分，比如与 Module 相关的对象只画出了 NormalModuleFactory，与 Template 相关的对象也只画出了 MainTemplate等。原因在于上面的流程图已经足以说明主要的构建步骤，另外有没画出来的对象和任务点跟上述的类似，比如 ContextModuleFactory 跟 NormalModuleFactory 是十分相似的对象，也有相似的任务点。有兴趣的同学可以自行拓展探索流程图。


## module阅读

### Compilation实例的modules属性 
所有解析完成后的module，最后都被保存在 modules上。

>它们将存储在 Compilation 实例的 modules 属性中，并触发任务点 finish-modules [参考](https://lxzjj.github.io/2017/11/02/%E7%8E%A9%E8%BD%ACwebpack%EF%BC%88%E4%B8%80%EF%BC%89/)

#### 源码调试
明天是否可以直接先打印以下 modules 属性，看整个 modules 是一个什么对象，有什么内容，
这样已知结果了，那么就可以大致猜测到之前各个过程做了什么。

### 两个factory.create的执行顺序
先执行 _addModuleChain 的 moduleFactory.create
后执行 addModuleDependencies 的 factory.create

factory.create 其实就是的重复：
>NormalModuleFactory.create -> resolve流程 -> 初始化module -> module build -> afterBuild -> processModuleDependencies ...


## 参考

### 参考文档或视频
[这个视频讲的更清楚-《任务14：14.如何调试和阅读webpack源码》-在最后几分钟内有讲到](https://www.bilibili.com/video/BV1N5411j74S?p=14)
[这个视频讲的更清楚-《任务15：15.webpack自定义loader》-在开始的几分钟内有讲到](https://www.bilibili.com/video/BV1N5411j74S?p=15)


