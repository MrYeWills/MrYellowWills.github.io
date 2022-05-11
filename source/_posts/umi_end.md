---
title: umi系列(end)
date: 2022/5/11
tags: umi
categories: 
- 前端工具
series: 前端
---



*源码 umi 版本为 version-4.0.0-rc.15*



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




