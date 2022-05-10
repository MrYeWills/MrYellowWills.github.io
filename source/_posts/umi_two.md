---
title: umi系列(二)
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
    let ret = await command.fn({ args });
  }

```
### packages\preset-umi\src\commands\dev\dev.ts
此命令 在这里注册：
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
```js
// packages\bundler-webpack\src\server\server.ts
const compiler = webpack(configs);
```

### 过程概要

#### umi\bin\umi.js
#### umi\src\cli\cli.ts
#### umi\src\cli\dev.ts
#### umi\src\cli\fork.ts
#### umi\bin\forkedDev.js
#### umi\src\cli\forkedDev.ts
#### umi\src\service\service.ts
#### @umijs/core\service\service.ts
#### @umijs/preset-umi\commands\dev\dev.ts
#### @umijs/bundler-webpack\dev.ts
#### @umijs/bundler-webpack\server\server.ts


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

见附录


### 待研究

配置 .umirc 在哪里读取？



## 附录

### webpack.config

```js
const webpackconfig = [
  {
    mode: 'development',
    stats: 'none',
    devtool: 'cheap-module-source-map',
    target: ['web', 'es5'],
    experiments: {
      topLevelAwait: true,
      outputModule: false,
    },
    cache: {
      type: 'filesystem',
      version: '4.0.0-rc.15',
      buildDependencies: {
        config: ['D:\\git\\umi\\travel-um\\package.json', 'D:\\git\\umi\\travel-um\\.umirc.ts'],
      },
      cacheDirectory: 'D:\\git\\umi\\travel-um\\node_modules\\.cache\\bundler-webpack',
    },
    infrastructureLogging: {
      level: 'error',
    },
    output: {
      path: 'D:\\git\\umi\\travel-um\\dist',
      filename: '[name].js',
      chunkFilename: '[name].js',
      publicPath: '/',
      pathinfo: true,
    },
    resolve: {
      symlinks: true,
      alias: {
        umi: '@@/exports',
        react: 'D:\\git\\umi\\travel-um\\node_modules\\react',
        'react-dom': 'D:\\git\\umi\\travel-um\\node_modules\\react-dom',
        'react-router': 'D:\\git\\umi\\travel-um\\node_modules\\react-router',
        'react-router-dom': 'D:\\git\\umi\\travel-um\\node_modules\\react-router-dom',
        '@': 'D:/git/umi/travel-um/src',
        '@@': 'D:/git/umi/travel-um/src/.umi',
        'regenerator-runtime': 'D:\\git\\umi\\travel-um\\node_modules\\regenerator-runtime',
        '@umijs/utils/compiled/strip-ansi':
          'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\utils\\compiled\\strip-ansi\\index.js',
        'react-error-overlay': 'D:\\git\\umi\\travel-um\\node_modules\\react-error-overlay\\lib\\index.js',
      },
      extensions: ['.wasm', '.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
      modules: ['node_modules'],
      fallback: {
        assert: 'D:\\git\\umi\\travel-um\\node_modules\\assert\\assert.js',
        buffer: 'D:\\git\\umi\\travel-um\\node_modules\\buffer\\index.js',
        child_process: false,
        cluster: false,
        console: 'D:\\git\\umi\\travel-um\\node_modules\\console-browserify\\index.js',
        constants: 'D:\\git\\umi\\travel-um\\node_modules\\constants-browserify\\constants.json',
        crypto: 'D:\\git\\umi\\travel-um\\node_modules\\crypto-browserify\\index.js',
        dgram: false,
        dns: false,
        domain: 'D:\\git\\umi\\travel-um\\node_modules\\domain-browser\\source\\index.js',
        events: 'D:\\git\\umi\\travel-um\\node_modules\\events\\events.js',
        fs: false,
        http: false,
        https: false,
        module: false,
        net: false,
        os: 'D:\\git\\umi\\travel-um\\node_modules\\os-browserify\\browser.js',
        path: 'D:\\git\\umi\\travel-um\\node_modules\\path-browserify\\index.js',
        punycode: 'D:\\git\\umi\\travel-um\\node_modules\\punycode\\punycode.js',
        process: 'D:\\git\\umi\\travel-um\\node_modules\\process\\browser.js',
        querystring: 'D:\\git\\umi\\travel-um\\node_modules\\querystring-es3\\index.js',
        readline: false,
        repl: false,
        stream: 'D:\\git\\umi\\travel-um\\node_modules\\stream-browserify\\index.js',
        _stream_duplex: 'D:\\git\\umi\\travel-um\\node_modules\\readable-stream\\duplex.js',
        _stream_passthrough: 'D:\\git\\umi\\travel-um\\node_modules\\readable-stream\\passthrough.js',
        _stream_readable: 'D:\\git\\umi\\travel-um\\node_modules\\readable-stream\\readable.js',
        _stream_transform: 'D:\\git\\umi\\travel-um\\node_modules\\readable-stream\\transform.js',
        _stream_writable: 'D:\\git\\umi\\travel-um\\node_modules\\readable-stream\\writable.js',
        string_decoder: 'D:\\git\\umi\\travel-um\\node_modules\\string_decoder\\lib\\string_decoder.js',
        sys: 'D:\\git\\umi\\travel-um\\node_modules\\util\\util.js',
        timers: 'D:\\git\\umi\\travel-um\\node_modules\\timers-browserify\\main.js',
        tls: false,
        tty: 'D:\\git\\umi\\travel-um\\node_modules\\tty-browserify\\index.js',
        url: 'D:\\git\\umi\\travel-um\\node_modules\\url\\url.js',
        util: 'D:\\git\\umi\\travel-um\\node_modules\\util\\util.js',
        vm: 'D:\\git\\umi\\travel-um\\node_modules\\vm-browserify\\index.js',
        zlib: 'D:\\git\\umi\\travel-um\\node_modules\\browserify-zlib\\lib\\index.js',
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|mjs)$/,
          include: [['D:\\git\\umi\\travel-um']],
          exclude: [{}],
          use: [
            {
              loader:
                'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\bundler-webpack\\compiled\\babel-loader\\index.js',
              options: {
                sourceType: 'unambiguous',
                babelrc: false,
                cacheDirectory: false,
                targets: {
                  chrome: 80,
                },
                presets: [
                  [
                    'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\babel-preset-umi\\dist\\index.js',
                    {
                      presetEnv: {},
                      presetReact: {
                        runtime: 'automatic',
                      },
                      presetTypeScript: {},
                      pluginTransformRuntime: {},
                      pluginLockCoreJS: {},
                      pluginDynamicImportNode: false,
                      pluginAutoCSSModules: true,
                    },
                  ],
                  {
                    plugins: [
                      [
                        null,
                        {
                          cwd: 'D:\\git\\umi\\travel-um',
                          absTmpPath: 'D:/git/umi/travel-um/src/.umi',
                        },
                      ],
                    ],
                  },
                ],
                plugins: [
                  'D:\\git\\umi\\travel-um\\node_modules\\react-refresh\\babel.js',
                  [
                    null,
                    {
                      remoteName: 'mf',
                      alias: {
                        umi: '@@/exports',
                        react: 'D:\\git\\umi\\travel-um\\node_modules\\react',
                        'react-dom': 'D:\\git\\umi\\travel-um\\node_modules\\react-dom',
                        'react-router': 'D:\\git\\umi\\travel-um\\node_modules\\react-router',
                        'react-router-dom': 'D:\\git\\umi\\travel-um\\node_modules\\react-router-dom',
                        '@': 'D:/git/umi/travel-um/src',
                        '@@': 'D:/git/umi/travel-um/src/.umi',
                        'regenerator-runtime': 'D:\\git\\umi\\travel-um\\node_modules\\regenerator-runtime',
                        '@umijs/utils/compiled/strip-ansi':
                          'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\utils\\compiled\\strip-ansi\\index.js',
                        'react-error-overlay':
                          'D:\\git\\umi\\travel-um\\node_modules\\react-error-overlay\\lib\\index.js',
                      },
                      externals: [],
                    },
                  ],
                ],
              },
            },
          ],
        },
        {
          test: /\.(jsx|ts|tsx)$/,
          use: [
            {
              loader:
                'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\bundler-webpack\\compiled\\babel-loader\\index.js',
              options: {
                sourceType: 'unambiguous',
                babelrc: false,
                cacheDirectory: false,
                targets: {
                  chrome: 80,
                },
                presets: [
                  [
                    'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\babel-preset-umi\\dist\\index.js',
                    {
                      presetEnv: {},
                      presetReact: {
                        runtime: 'automatic',
                      },
                      presetTypeScript: {},
                      pluginTransformRuntime: {},
                      pluginLockCoreJS: {},
                      pluginDynamicImportNode: false,
                      pluginAutoCSSModules: true,
                    },
                  ],
                  {
                    plugins: [
                      [
                        null,
                        {
                          cwd: 'D:\\git\\umi\\travel-um',
                          absTmpPath: 'D:/git/umi/travel-um/src/.umi',
                        },
                      ],
                    ],
                  },
                ],
                plugins: [
                  'D:\\git\\umi\\travel-um\\node_modules\\react-refresh\\babel.js',
                  [
                    null,
                    {
                      remoteName: 'mf',
                      alias: {
                        umi: '@@/exports',
                        react: 'D:\\git\\umi\\travel-um\\node_modules\\react',
                        'react-dom': 'D:\\git\\umi\\travel-um\\node_modules\\react-dom',
                        'react-router': 'D:\\git\\umi\\travel-um\\node_modules\\react-router',
                        'react-router-dom': 'D:\\git\\umi\\travel-um\\node_modules\\react-router-dom',
                        '@': 'D:/git/umi/travel-um/src',
                        '@@': 'D:/git/umi/travel-um/src/.umi',
                        'regenerator-runtime': 'D:\\git\\umi\\travel-um\\node_modules\\regenerator-runtime',
                        '@umijs/utils/compiled/strip-ansi':
                          'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\utils\\compiled\\strip-ansi\\index.js',
                        'react-error-overlay':
                          'D:\\git\\umi\\travel-um\\node_modules\\react-error-overlay\\lib\\index.js',
                      },
                      externals: [],
                    },
                  ],
                ],
              },
            },
          ],
        },
        {
          test: /\.(js|mjs)$/,
          include: [[null]],
          use: [
            {
              loader:
                'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\bundler-webpack\\compiled\\babel-loader\\index.js',
              options: {
                sourceType: 'unambiguous',
                babelrc: false,
                cacheDirectory: false,
                targets: {
                  chrome: 80,
                },
                presets: [
                  [
                    'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\babel-preset-umi\\dist\\index.js',
                    {
                      presetEnv: {},
                      presetReact: {
                        runtime: 'automatic',
                      },
                      presetTypeScript: {},
                      pluginTransformRuntime: {},
                      pluginLockCoreJS: {},
                      pluginDynamicImportNode: false,
                      pluginAutoCSSModules: true,
                    },
                  ],
                  {
                    plugins: [
                      [
                        null,
                        {
                          cwd: 'D:\\git\\umi\\travel-um',
                          absTmpPath: 'D:/git/umi/travel-um/src/.umi',
                        },
                      ],
                    ],
                  },
                ],
                plugins: [
                  'D:\\git\\umi\\travel-um\\node_modules\\react-refresh\\babel.js',
                  [
                    null,
                    {
                      remoteName: 'mf',
                      alias: {
                        umi: '@@/exports',
                        react: 'D:\\git\\umi\\travel-um\\node_modules\\react',
                        'react-dom': 'D:\\git\\umi\\travel-um\\node_modules\\react-dom',
                        'react-router': 'D:\\git\\umi\\travel-um\\node_modules\\react-router',
                        'react-router-dom': 'D:\\git\\umi\\travel-um\\node_modules\\react-router-dom',
                        '@': 'D:/git/umi/travel-um/src',
                        '@@': 'D:/git/umi/travel-um/src/.umi',
                        'regenerator-runtime': 'D:\\git\\umi\\travel-um\\node_modules\\regenerator-runtime',
                        '@umijs/utils/compiled/strip-ansi':
                          'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\utils\\compiled\\strip-ansi\\index.js',
                        'react-error-overlay':
                          'D:\\git\\umi\\travel-um\\node_modules\\react-error-overlay\\lib\\index.js',
                      },
                      externals: [],
                    },
                  ],
                ],
              },
            },
          ],
        },
        {
          test: /\.(js|mjs)$/,
          include: [{}],
          exclude: [null],
        },
        {
          test: /\.css(\?.*)?$/,
          oneOf: [
            {x``
              resourceQuery: {},
              use: [
                {
                  loader:
                    'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\bundler-webpack\\compiled\\mini-css-extract-plugin\\loader.js',
                  options: {
                    publicPath: './',
                    emit: true,
                    esModule: true,
                  },
                },
                {
                  loader: 'D:\\git\\umi\\travel-um\\node_modules\\css-loader\\dist\\cjs.js',
                  options: {
                    importLoaders: 1,
                    esModule: true,
                    url: true,
                    import: true,
                    modules: {
                      localIdentName: '[local]___[hash:base64:5]',
                    },
                  },
                },
                {
                  loader:
                    'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\bundler-webpack\\compiled\\postcss-loader\\index.js',
                  options: {
                    postcssOptions: {
                      ident: 'postcss',
                      plugins: [
                        null,
                        {
                          postcssPlugin: 'postcss-preset-env',
                          plugins: [
                            {
                              postcssPlugin: 'postcss-media-minmax',
                              AtRule: {},
                            },
                            {
                              postcssPlugin: 'postcss-page-break',
                            },
                            {
                              postcssPlugin: 'postcss-font-variant',
                            },
                            {
                              postcssPlugin: 'autoprefixer',
                              options: {
                                overrideBrowserslist: ['chrome >= 80'],
                                flexbox: 'no-2009',
                              },
                              browsers: ['chrome >= 80'],
                            },
                            {
                              postcssPlugin: 'postcss-progressive-custom-properties',
                            },
                            {
                              postcssPlugin: 'postcss-preset-env',
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
              ],
            },
            {
              sideEffects: true,
              use: [
                {
                  loader:
                    'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\bundler-webpack\\compiled\\mini-css-extract-plugin\\loader.js',
                  options: {
                    publicPath: './',
                    emit: true,
                    esModule: true,
                  },
                },
                {
                  loader: 'D:\\git\\umi\\travel-um\\node_modules\\css-loader\\dist\\cjs.js',
                  options: {
                    importLoaders: 1,
                    esModule: true,
                    url: true,
                    import: true,
                  },
                },
                {
                  loader:
                    'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\bundler-webpack\\compiled\\postcss-loader\\index.js',
                  options: {
                    postcssOptions: {
                      ident: 'postcss',
                      plugins: [
                        null,
                        {
                          postcssPlugin: 'postcss-preset-env',
                          plugins: [
                            {
                              postcssPlugin: 'postcss-media-minmax',
                              AtRule: {},
                            },
                            {
                              postcssPlugin: 'postcss-page-break',
                            },
                            {
                              postcssPlugin: 'postcss-font-variant',
                            },
                            {
                              postcssPlugin: 'autoprefixer',
                              options: {
                                overrideBrowserslist: ['chrome >= 80'],
                                flexbox: 'no-2009',
                              },
                              browsers: ['chrome >= 80'],
                            },
                            {
                              postcssPlugin: 'postcss-progressive-custom-properties',
                            },
                            {
                              postcssPlugin: 'postcss-preset-env',
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          test: {},
          oneOf: [
            {
              resourceQuery: {},
              use: [
                {
                  loader:
                    'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\bundler-webpack\\compiled\\mini-css-extract-plugin\\loader.js',
                  options: {
                    publicPath: './',
                    emit: true,
                    esModule: true,
                  },
                },
                {
                  loader: 'D:\\git\\umi\\travel-um\\node_modules\\css-loader\\dist\\cjs.js',
                  options: {
                    importLoaders: 1,
                    esModule: true,
                    url: true,
                    import: true,
                    modules: {
                      localIdentName: '[local]___[hash:base64:5]',
                    },
                  },
                },
                {
                  loader:
                    'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\bundler-webpack\\compiled\\postcss-loader\\index.js',
                  options: {
                    postcssOptions: {
                      ident: 'postcss',
                      plugins: [
                        null,
                        {
                          postcssPlugin: 'postcss-preset-env',
                          plugins: [
                            {
                              postcssPlugin: 'postcss-media-minmax',
                              AtRule: {},
                            },
                            {
                              postcssPlugin: 'postcss-page-break',
                            },
                            {
                              postcssPlugin: 'postcss-font-variant',
                            },
                            {
                              postcssPlugin: 'autoprefixer',
                              options: {
                                overrideBrowserslist: ['chrome >= 80'],
                                flexbox: 'no-2009',
                              },
                              browsers: ['chrome >= 80'],
                            },
                            {
                              postcssPlugin: 'postcss-progressive-custom-properties',
                            },
                            {
                              postcssPlugin: 'postcss-preset-env',
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
                {
                  loader:
                    'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\bundler-webpack\\compiled\\less-loader\\index.js',
                  options: {
                    implementation:
                      'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\bundler-utils\\compiled\\less\\index.js',
                    lessOptions: {
                      javascriptEnabled: true,
                    },
                  },
                },
              ],
            },
            {
              sideEffects: true,
              use: [
                {
                  loader:
                    'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\bundler-webpack\\compiled\\mini-css-extract-plugin\\loader.js',
                  options: {
                    publicPath: './',
                    emit: true,
                    esModule: true,
                  },
                },
                {
                  loader: 'D:\\git\\umi\\travel-um\\node_modules\\css-loader\\dist\\cjs.js',
                  options: {
                    importLoaders: 1,
                    esModule: true,
                    url: true,
                    import: true,
                  },
                },
                {
                  loader:
                    'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\bundler-webpack\\compiled\\postcss-loader\\index.js',
                  options: {
                    postcssOptions: {
                      ident: 'postcss',
                      plugins: [
                        null,
                        {
                          postcssPlugin: 'postcss-preset-env',
                          plugins: [
                            {
                              postcssPlugin: 'postcss-media-minmax',
                              AtRule: {},
                            },
                            {
                              postcssPlugin: 'postcss-page-break',
                            },
                            {
                              postcssPlugin: 'postcss-font-variant',
                            },
                            {
                              postcssPlugin: 'autoprefixer',
                              options: {
                                overrideBrowserslist: ['chrome >= 80'],
                                flexbox: 'no-2009',
                              },
                              browsers: ['chrome >= 80'],
                            },
                            {
                              postcssPlugin: 'postcss-progressive-custom-properties',
                            },
                            {
                              postcssPlugin: 'postcss-preset-env',
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
                {
                  loader:
                    'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\bundler-webpack\\compiled\\less-loader\\index.js',
                  options: {
                    implementation:
                      'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\bundler-utils\\compiled\\less\\index.js',
                    lessOptions: {
                      javascriptEnabled: true,
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          test: {},
          oneOf: [
            {
              resourceQuery: {},
              use: [
                {
                  loader:
                    'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\bundler-webpack\\compiled\\mini-css-extract-plugin\\loader.js',
                  options: {
                    publicPath: './',
                    emit: true,
                    esModule: true,
                  },
                },
                {
                  loader: 'D:\\git\\umi\\travel-um\\node_modules\\css-loader\\dist\\cjs.js',
                  options: {
                    importLoaders: 1,
                    esModule: true,
                    url: true,
                    import: true,
                    modules: {
                      localIdentName: '[local]___[hash:base64:5]',
                    },
                  },
                },
                {
                  loader:
                    'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\bundler-webpack\\compiled\\postcss-loader\\index.js',
                  options: {
                    postcssOptions: {
                      ident: 'postcss',
                      plugins: [
                        null,
                        {
                          postcssPlugin: 'postcss-preset-env',
                          plugins: [
                            {
                              postcssPlugin: 'postcss-media-minmax',
                              AtRule: {},
                            },
                            {
                              postcssPlugin: 'postcss-page-break',
                            },
                            {
                              postcssPlugin: 'postcss-font-variant',
                            },
                            {
                              postcssPlugin: 'autoprefixer',
                              options: {
                                overrideBrowserslist: ['chrome >= 80'],
                                flexbox: 'no-2009',
                              },
                              browsers: ['chrome >= 80'],
                            },
                            {
                              postcssPlugin: 'postcss-progressive-custom-properties',
                            },
                            {
                              postcssPlugin: 'postcss-preset-env',
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
                {
                  loader:
                    'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\bundler-webpack\\compiled\\sass-loader\\index.js',
                },
              ],
            },
            {
              sideEffects: true,
              use: [
                {
                  loader:
                    'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\bundler-webpack\\compiled\\mini-css-extract-plugin\\loader.js',
                  options: {
                    publicPath: './',
                    emit: true,
                    esModule: true,
                  },
                },
                {
                  loader: 'D:\\git\\umi\\travel-um\\node_modules\\css-loader\\dist\\cjs.js',
                  options: {
                    importLoaders: 1,
                    esModule: true,
                    url: true,
                    import: true,
                  },
                },
                {
                  loader:
                    'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\bundler-webpack\\compiled\\postcss-loader\\index.js',
                  options: {
                    postcssOptions: {
                      ident: 'postcss',
                      plugins: [
                        null,
                        {
                          postcssPlugin: 'postcss-preset-env',
                          plugins: [
                            {
                              postcssPlugin: 'postcss-media-minmax',
                              AtRule: {},
                            },
                            {
                              postcssPlugin: 'postcss-page-break',
                            },
                            {
                              postcssPlugin: 'postcss-font-variant',
                            },
                            {
                              postcssPlugin: 'autoprefixer',
                              options: {
                                overrideBrowserslist: ['chrome >= 80'],
                                flexbox: 'no-2009',
                              },
                              browsers: ['chrome >= 80'],
                            },
                            {
                              postcssPlugin: 'postcss-progressive-custom-properties',
                            },
                            {
                              postcssPlugin: 'postcss-preset-env',
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
                {
                  loader:
                    'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\bundler-webpack\\compiled\\sass-loader\\index.js',
                },
              ],
            },
          ],
        },
        {
          oneOf: [
            {
              test: {},
              type: 'asset',
              mimetype: 'image/avif',
              parser: {
                dataUrlCondition: {
                  maxSize: 10000,
                },
              },
              generator: {
                filename: 'static/[name].[hash:8].[ext]',
              },
            },
            {
              test: {},
              type: 'asset',
              parser: {
                dataUrlCondition: {
                  maxSize: 10000,
                },
              },
              generator: {
                filename: 'static/[name].[hash:8].[ext]',
              },
            },
            {
              type: 'asset/resource',
              generator: {
                filename: 'static/[name].[hash:8].[ext]',
              },
              exclude: [{}, {}, {}, {}, {}],
            },
          ],
        },
        {
          test: {},
          use: [
            {
              loader: 'D:\\git\\umi\\travel-um\\node_modules\\@umijs\\bundler-webpack\\compiled\\svgo-loader\\index.js',
              options: {
                configFile: false,
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimize: false,
    },
    plugins: [
      {
        definitions: {
          Buffer: ['buffer', 'Buffer'],
          process: 'D:\\git\\umi\\travel-um\\node_modules\\process\\browser.js',
        },
      },
      {
        _sortedModulesCache: {},
        options: {
          filename: '[name].css',
          ignoreOrder: true,
          runtime: true,
          chunkFilename: '[name].chunk.css',
        },
        runtimeOptions: {
          linkType: 'text/css',
        },
      },
      {
        definitions: {
          'process.env': {
            NODE_ENV: '"development"',
          },
        },
      },
      {
        profile: false,
        modulesCount: 5000,
        dependenciesCount: 10000,
        showEntries: true,
        showModules: true,
        showDependencies: true,
        showActiveModules: true,
        options: {},
      },
      {
        options: {},
      },
      {
        options: {
          overlay: false,
          exclude: {},
          include: {},
        },
      },
      {},
      {
        _compiler: null,
        _watcher: null,
        _staticModules: {
          './mfsu-virtual-entry/umi.js':
            "await import('D:/git/umi/travel-um/node_modules/@umijs/bundler-webpack/client/client/client.js');\nawait import('D:/git/umi/travel-um/src/.umi/umi.ts');\nexport default 1;",
        },
      },
      {
        _options: {
          name: '__',
          remotes: {
            mf: 'mf@/mf-va_remoteEntry.js',
          },
        },
      },
      {
        opts: {},
      },
      {
        profile: false,
        modulesCount: 5000,
        dependenciesCount: 10000,
        showEntries: true,
        showModules: true,
        showDependencies: true,
        showActiveModules: false,
      },
    ],
    entry: {
      umi: './mfsu-virtual-entry/umi.js',
    },
  },
];

```




