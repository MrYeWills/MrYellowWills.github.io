---
title: umi系列(二)：基础知识，如umi dev过程分析
date: 2022/5/6
tags: umi
categories: 
- 前端工具
series: 前端
---



*源码 umi 版本为 version-4.0.0-rc.15*


## 基础知识

### 预编译 与 father
father 内置了 预编译；


### 如何集成 preset-umi

```js
// packages\umi\src\service\service.ts

// 这里的 super 实际上是
super({
      ...opts,
      env: process.env.NODE_ENV,
      cwd,
      defaultConfigFiles: DEFAULT_CONFIG_FILES,
      frameworkName: FRAMEWORK_NAME,
      presets: [require.resolve('@umijs/preset-umi'), ...(opts?.presets || [])],
      plugins: [
        existsSync(join(cwd, 'plugin.ts')) && join(cwd, 'plugin.ts'),
        existsSync(join(cwd, 'plugin.js')) && join(cwd, 'plugin.js'),
      ].filter(Boolean),
    });

```



### 如何集成 bundler-webpack 

```js
// packages\preset-umi\src\commands\dev\dev.ts
const bundlerWebpack=
  lazyImportFromCurrentPkg('@umijs/bundler-webpack');
  
  
if (enableVite) {
	await bundlerVite.dev(opts);
  } else {
	await bundlerWebpack.dev(opts);
  }
```

这里的 bundlerWebpack.dev 其实就是
```js
// packages\bundler-webpack\src\dev.ts
import webpack from '../compiled/webpack';

  mfsu = new MFSU({
      implementor: webpack as any,

    });
```

如上可知，配置了 `@umijs/preset-umi` 进行打包，那么就会只用 webpack 5 进行打包；

### 如何集成 webpack 5

参考以上


### 如何 webpack 5项目结合 MFSU

```js
//examples\mfsu-independent\webpack.config.js
const mfsu = new MFSU({
  implementor: webpack,
  buildDepWithESBuild: true,
});

```


### webpack-5-chain 如何结合 webpack 5
```js
// packages\bundler-webpack\src\config\config.ts
import Config from '../../compiled/webpack-5-chain';
// 其实就是 @umijs/bundler-webpack/compiled/webpack-5-chain

  const config = new Config();
  
```

### babel配置如何集成
```js
// packages\bundler-webpack\src\dev.ts
// getConfig 为 packages\bundler-webpack\src\config\config.ts
  const webpackConfig = await getConfig({
    cwd: opts.cwd,
    rootDir: opts.rootDir,
    env: Env.development,
    entry: opts.entry,
    userConfig: opts.config,
    babelPreset: opts.babelPreset,
    extraBabelPlugins: [
      ...(opts.beforeBabelPlugins || []),
      ...(mfsu?.getBabelPlugins() || []),
      ...(opts.extraBabelPlugins || []),
    ],
    extraBabelPresets: [
      ...(opts.beforeBabelPresets || []),
      ...(opts.extraBabelPresets || []),
    ],
    extraBabelIncludes: opts.config.extraBabelIncludes,
    extraEsbuildLoaderHandler: mfsu?.getEsbuildLoaderHandler() || [],
    chainWebpack: opts.chainWebpack,
    modifyWebpackConfig: opts.modifyWebpackConfig,
    hmr: true,
    analyze: process.env.ANALYZE,
    cache: opts.cache,
  });
```

```js
// packages\bundler-webpack\src\config\config.ts
// getConfig 函数中包含 addJavaScriptRules ，
// 此函数为 packages\bundler-webpack\src\config\javaScriptRules.ts：
  // rules
  await addJavaScriptRules(applyOpts);
```


```js
// packages\bundler-webpack\src\config\javaScriptRules.ts
// addJavaScriptRules:
 rule
        .use('babel-loader')
        .loader(require.resolve('../../compiled/babel-loader'))
        .options({
          // Tell babel to guess the type, instead assuming all files are modules
          // https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
          sourceType: 'unambiguous',
          babelrc: false,
          cacheDirectory: false,
          targets: userConfig.targets,
          presets: [
            opts.babelPreset || [
              require.resolve('@umijs/babel-preset-umi'),
              ...
          ],
          plugins: [
            ...
          ]
        });
```

### .umirc 配置的读取和使用

#### 概述
```js
// packages\core\src\service\service.ts
async run(opts: { name: string; args?: any }) {
 
    const configManager = new Config({
      cwd: this.cwd,
      env: this.env,
      // defaultConfigFiles这个值终将被设置到 this.mainConfigFile 中
      // this.opts.defaultConfigFiles 
      defaultConfigFiles: this.opts.defaultConfigFiles,
      specifiedEnv: process.env[`${prefix}_ENV`.toUpperCase()],
    });

// 这里读取 .umirc 的配置
    this.userConfig = configManager.getUserConfig().config;
    }

```
```js
// configManager.getUserConfig 出自：
// packages\core\src\config\config.ts
 getUserConfig() {
    const configFiles = Config.getConfigFiles({
      // this.mainConfigFile 就是 .umirc 文件
      mainConfigFile: this.mainConfigFile,
      env: this.opts.env,
      specifiedEnv: this.opts.specifiedEnv,
    });
    return Config.getUserConfig({
      configFiles: getAbsFiles({
        files: configFiles,
        cwd: this.opts.cwd,
      }),
    });
  }

```

#### 关于 this.opts.defaultConfigFiles
```js

// packages\umi\src\service\service.ts
// 上面的 this.opts.defaultConfigFiles 来源于 这个ts的：
import { DEFAULT_CONFIG_FILES } from '../constants';

  constructor(opts?: any) {
    process.env.UMI_DIR = dirname(require.resolve('../../package'));
    const cwd = getCwd();
    super({
      ...
      defaultConfigFiles: DEFAULT_CONFIG_FILES,
      ...
    });
  }
```
```js
// packages\umi\src\constants.ts
export const DEFAULT_CONFIG_FILES = [
  '.umirc.ts',
  '.umirc.js',
  'config/config.ts',
  'config/config.js',
];
```

### 如何生成.umi

#### packages\preset-umi\src\commands\dev\dev.ts
```js
// packages\preset-umi\src\commands\dev\dev.ts
 async fn() {
      // generate files
      async function generate(opts: { isFirstTime?: boolean; files?: any }) {
        await api.applyPlugins({
          key: 'onGenerateFiles',
          args: {
            files: opts.files || null,
            isFirstTime: opts.isFirstTime,
          },
        });
      }
      await generate({
        isFirstTime: true,
      });
   

      // watch plugin change
      const pluginFiles: string[] = [
        join(api.cwd, 'plugin.ts'),
        join(api.cwd, 'plugin.js'),
      ];
      pluginFiles.forEach((filePath: string) => {
        watch({
          path: filePath,
          addToUnWatches: true,
          onChange() {
            logger.event(`${basename(filePath)} changed, restart server...`);
            api.restartServer();
          },
        });
      });

   
      if (enableVite) {
        await bundlerVite.dev(opts);
      } else {
        await bundlerWebpack.dev(opts);
      }
    },
```

#### preset-umi\src\features\tmpFiles\tmpFiles.ts
```js
// packages\preset-umi\src\features\tmpFiles\tmpFiles.ts
api.onGenerateFiles(async (opts) => {
  ....
   // 例如生成 history.ts
    api.writeTmpFile({
      noPluginDir: true,
      path: 'core/history.ts',
      tplPath: join(TEMPLATES_DIR, 'history.tpl'),
      context: {
        rendererPath,
      },
    });
  });

   api.register({
    key: 'onGenerateFiles',
    fn: async () => {
      ...
      api.writeTmpFile({
        noPluginDir: true,
        path: 'exports.ts',
        content: exports.join('\n'),
      });
    },
    stage: Infinity,
  });
```


#### tpl
各种tpl模板位置如： `packages\preset-umi\templates\history.tpl`

#### 关键的`commands\dev\dev.ts`

从这个例子看出，整个项目的初始化，以及各种文件生成 等等 事情，都可以在 `packages\preset-umi\src\commands\dev\dev.ts` 找到答案。




## umi dev 过程源码分析

### 过程概述
```js
packages\umi\bin\umi.js
packages\umi\src\cli\cli.ts
packages\umi\src\cli\dev.ts
packages\umi\src\cli\fork.ts
packages\umi\bin\forkedDev.js
// 在这里引入下面的service.ts
packages\umi\src\cli\forkedDev.ts
// 在这里引入下面的service.ts
packages\umi\src\service\service.ts

// 核心
packages\core\src\service\service.ts
packages\preset-umi\src\commands\dev\dev.ts
packages\bundler-webpack\src\dev.ts
packages\bundler-webpack\src\server\server.ts
```


下面介绍详细过程：

### 准备过程
```js
packages\umi\bin\umi.js
packages\umi\src\cli\cli.ts
packages\umi\src\cli\dev.ts
packages\umi\src\cli\fork.ts
packages\umi\bin\forkedDev.js
```

### packages\umi\src\cli\forkedDev.ts
在这里引入下面的service.ts
```js
// packages\umi\src\cli\forkedDev.ts

//'../service/service' 就是  packages\umi\src\service\service.ts
import { Service } from '../service/service';

  const service = new Service();
    await service.run2({
      name: DEV_COMMAND,
      args,
    });

```

### packages\umi\src\service\service.ts


```js
//packages\umi\src\service\service.ts

//这个 import { Service as CoreService } from '@umijs/core'; 
//其实就是 packages\core\src\service\service.ts ，这是核心
import { Service as CoreService } from '@umijs/core';
   super({
      ...opts,
      env: process.env.NODE_ENV,
      cwd,
      defaultConfigFiles: DEFAULT_CONFIG_FILES,
      frameworkName: FRAMEWORK_NAME,
      presets: [require.resolve('@umijs/preset-umi'), ...(opts?.presets || [])],
      plugins: [
        existsSync(join(cwd, 'plugin.ts')) && join(cwd, 'plugin.ts'),
        existsSync(join(cwd, 'plugin.js')) && join(cwd, 'plugin.js'),
      ].filter(Boolean),
    });
	
  
```

如上 在这个js上，除了在构造函数上初始化 umi/core 的service外，还在其 run2 方法中调用 了core 的run 方法：


```js
//packages\umi\src\service\service.ts

 async run2(opts: { name: string; args?: any }) {
 
    return await this.run({ ...opts, name });
  }

```

到此，所有的工作都转给 核心  @umijs/core 的 service 类来处理了。

### （核心@umijs/core） packages\core\src\service\service.ts 

在 `packages\core\src\service\service.ts`中执行 run 方法，方法内部执行 注册的 dev 命令
```js
  packages\core\src\service\service.ts
  async run(opts: { name: string; args?: any }) {
    // 这里的 command 包含了 dev 命令
    let ret = await command.fn({ args });
  }

```
### packages\preset-umi\src\commands\dev\dev.ts
此 dev命令 在这里注册：
```js
  // packages\preset-umi\src\commands\dev\dev.ts
  const bundlerWebpack = lazyImportFromCurrentPkg('@umijs/bundler-webpack');
  api.registerCommand({
    name: 'dev',
    description: 'dev server for development',
    details: `
  umi dev

  # dev with specified port
  PORT=8888 umi dev
  `,
    async fn() {
      if (enableVite) {
        await bundlerVite.dev(opts);
      } else {
        // 执行这里
        await bundlerWebpack.dev(opts);
      }
    },
  });
```

### packages\bundler-webpack\src\dev.ts
因此执行来到 `bundlerWebpack.dev(opts)`,此方法定义在 `packages\bundler-webpack\src\dev.ts`
dev 会执行 createServer 方法，

### packages\bundler-webpack\src\server\server.ts
createServer 的逻辑在 `packages\bundler-webpack\src\server\server.ts`
createServer 主要做 webpack 编译 以及 然后通过 express 创建 dev server，
这里可以打印相关的 webpack 配置等等。
```js
// packages\bundler-webpack\src\server\server.ts
const compiler = webpack(configs);
```
至此整个 umi dev 的流程走完了。


### 要点对象
#### Service

```js
Service {
  appData: {},
  args: { _: [], '$0': '' },
  commands: {},
  generators: {},
  config: {},
  configSchemas: {},
  configDefaults: {},
  configOnChanges: {},
  hooks: {},
  name: '',
  paths: {},
  plugins: {},
  keyToPluginMap: {},
  pluginMethods: {},
  skipPluginIds: Set(0) {},
  stage: 0,
  userConfig: {},
  configManager: null,
  pkg: {},
  pkgPath: '',
  cwd: 'D:\\git\\umi\\travel-um',
  env: 'development',
  opts: {
    env: 'development',
    cwd: 'D:\\git\\umi\\travel-um',
    defaultConfigFiles: [
      '.umirc.ts',
      '.umirc.js',
      'config/config.ts',
      'config/config.js'
    ],
    frameworkName: 'umi',
    presets: [
      'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\preset-umi\\dist\\index.js'
    ],
    plugins: []
  }
}
```
#### webpack.config

见《umi系列(end) -- webpack.config》








