---
title: umi系列(附录) 文档插件
date: 2022/6/7
tags: umi
categories: 
- 前端工具
series: 基建
---


这里放一些参考文件或配置

## 文档项目的webpack配置

打印webpack 配置时，可用下面函数来解决test无法打印的问题,通过bk属性来复制test的值：
```js
function format() {
  configs[0].module.rules.map((t) => {
    if (t && t.test) {
      t.bk = t.test.toString();
    }
    if (t && t.oneOf) {
      t.oneOf.map((t) => {
        if (t && t.test) {
          t.bk = t.test.toString();
        }
      });
    }
  });
}

```
```js
// 下面的bk属性其实就是test，为了能打印出来才这样做的
var webpackconfig = {
  "rules": [{
    "test": {},
    "include": [
      ["D:\\git\\umi\\umi-next"]
    ],
    "exclude": [{}],
    "use": [{
      "loader": "D:\\git\\umi\\umi-next\\packages\\bundler-webpack\\compiled\\babel-loader\\index.js",
      "options": {
        "sourceType": "unambiguous",
        "babelrc": false,
        "cacheDirectory": false,
        "targets": {
          "chrome": 80
        },
        "presets": [
          ["D:\\git\\umi\\umi-next\\packages\\babel-preset-umi\\dist\\index.js", {
            "presetEnv": {},
            "presetReact": {
              "runtime": "automatic"
            },
            "presetTypeScript": {},
            "pluginTransformRuntime": {},
            "pluginLockCoreJS": {},
            "pluginDynamicImportNode": false,
            "pluginAutoCSSModules": true
          }], {
            "plugins": [
              [null, {
                "cwd": "D:\\git\\umi\\umi-next",
                "absTmpPath": "D:/git/umi/umi-next/.umi"
              }]
            ]
          }
        ],
        "plugins": ["D:\\git\\umi\\umi-next\\node_modules\\.pnpm\\react-refresh@0.12.0\\node_modules\\react-refresh\\babel.js"]
      }
    }],
    "bk": "/\\.(js|mjs)$/"
  }, {
    "test": {},
    "use": [{
      "loader": "D:\\git\\umi\\umi-next\\packages\\bundler-webpack\\compiled\\babel-loader\\index.js",
      "options": {
        "sourceType": "unambiguous",
        "babelrc": false,
        "cacheDirectory": false,
        "targets": {
          "chrome": 80
        },
        "presets": [
          ["D:\\git\\umi\\umi-next\\packages\\babel-preset-umi\\dist\\index.js", {
            "presetEnv": {},
            "presetReact": {
              "runtime": "automatic"
            },
            "presetTypeScript": {},
            "pluginTransformRuntime": {},
            "pluginLockCoreJS": {},
            "pluginDynamicImportNode": false,
            "pluginAutoCSSModules": true
          }], {
            "plugins": [
              [null, {
                "cwd": "D:\\git\\umi\\umi-next",
                "absTmpPath": "D:/git/umi/umi-next/.umi"
              }]
            ]
          }
        ],
        "plugins": ["D:\\git\\umi\\umi-next\\node_modules\\.pnpm\\react-refresh@0.12.0\\node_modules\\react-refresh\\babel.js"]
      }
    }],
    "bk": "/\\.(jsx|ts|tsx)$/"
  }, {
    "test": {},
    "include": [
      [null]
    ],
    "use": [{
      "loader": "D:\\git\\umi\\umi-next\\packages\\bundler-webpack\\compiled\\babel-loader\\index.js",
      "options": {
        "sourceType": "unambiguous",
        "babelrc": false,
        "cacheDirectory": false,
        "targets": {
          "chrome": 80
        },
        "presets": [
          ["D:\\git\\umi\\umi-next\\packages\\babel-preset-umi\\dist\\index.js", {
            "presetEnv": {},
            "presetReact": {
              "runtime": "automatic"
            },
            "presetTypeScript": {},
            "pluginTransformRuntime": {},
            "pluginLockCoreJS": {},
            "pluginDynamicImportNode": false,
            "pluginAutoCSSModules": true
          }], {
            "plugins": [
              [null, {
                "cwd": "D:\\git\\umi\\umi-next",
                "absTmpPath": "D:/git/umi/umi-next/.umi"
              }]
            ]
          }
        ],
        "plugins": ["D:\\git\\umi\\umi-next\\node_modules\\.pnpm\\react-refresh@0.12.0\\node_modules\\react-refresh\\babel.js"]
      }
    }],
    "bk": "/\\.(js|mjs)$/"
  }, {
    "test": {},
    "use": [{
      "loader": "D:\\git\\umi\\umi-next\\packages\\bundler-webpack\\compiled\\babel-loader\\index.js",
      "options": {
        "sourceType": "unambiguous",
        "babelrc": false,
        "cacheDirectory": false,
        "targets": {
          "chrome": 80
        },
        "presets": [
          ["D:\\git\\umi\\umi-next\\packages\\babel-preset-umi\\dist\\index.js", {
            "presetEnv": {},
            "presetReact": {
              "runtime": "automatic"
            },
            "presetTypeScript": {},
            "pluginTransformRuntime": {},
            "pluginLockCoreJS": {},
            "pluginDynamicImportNode": false,
            "pluginAutoCSSModules": true
          }], {
            "plugins": [
              [null, {
                "cwd": "D:\\git\\umi\\umi-next",
                "absTmpPath": "D:/git/umi/umi-next/.umi"
              }]
            ]
          }
        ],
        "plugins": ["D:\\git\\umi\\umi-next\\node_modules\\.pnpm\\react-refresh@0.12.0\\node_modules\\react-refresh\\babel.js"]
      }
    }],
    "bk": "/\\.mdx?$/"
  }, {
    "test": {},
    "include": [{}],
    "exclude": [null],
    "bk": "/\\.(js|mjs)$/"
  }, {
    "test": {},
    "use": [{
      "loader": "D:\\git\\umi\\umi-next\\packages\\plugin-docs\\dist\\loader.js"
    }],
    "bk": "/\\.mdx?$/"
  }, {
    "test": {},
    "oneOf": [{
      "resourceQuery": {},
      "use": [{
        "loader": "D:\\git\\umi\\umi-next\\packages\\bundler-webpack\\compiled\\mini-css-extract-plugin\\loader.js",
        "options": {
          "publicPath": "./",
          "emit": true,
          "esModule": true
        }
      }, {
        "loader": "D:\\git\\umi\\umi-next\\node_modules\\.pnpm\\css-loader@6.7.1_webpack@5.72.0\\node_modules\\css-loader\\dist\\cjs.js",
        "options": {
          "importLoaders": 1,
          "esModule": true,
          "url": true,
          "import": true,
          "modules": {
            "localIdentName": "[local]___[hash:base64:5]"
          }
        }
      }, {
        "loader": "D:\\git\\umi\\umi-next\\packages\\bundler-webpack\\compiled\\postcss-loader\\index.js",
        "options": {
          "postcssOptions": {
            "ident": "postcss",
            "plugins": [null, {
              "postcssPlugin": "postcss-preset-env",
              "plugins": [{
                "postcssPlugin": "postcss-media-minmax",
                "AtRule": {}
              }, {
                "postcssPlugin": "postcss-page-break"
              }, {
                "postcssPlugin": "postcss-font-variant"
              }, {
                "postcssPlugin": "autoprefixer",
                "options": {
                  "overrideBrowserslist": ["chrome >= 80"],
                  "flexbox": "no-2009"
                },
                "browsers": ["chrome >= 80"]
              }, {
                "postcssPlugin": "postcss-progressive-custom-properties"
              }, {
                "postcssPlugin": "postcss-preset-env"
              }]
            }]
          }
        }
      }]
    }, {
      "sideEffects": true,
      "use": [{
        "loader": "D:\\git\\umi\\umi-next\\packages\\bundler-webpack\\compiled\\mini-css-extract-plugin\\loader.js",
        "options": {
          "publicPath": "./",
          "emit": true,
          "esModule": true
        }
      }, {
        "loader": "D:\\git\\umi\\umi-next\\node_modules\\.pnpm\\css-loader@6.7.1_webpack@5.72.0\\node_modules\\css-loader\\dist\\cjs.js",
        "options": {
          "importLoaders": 1,
          "esModule": true,
          "url": true,
          "import": true
        }
      }, {
        "loader": "D:\\git\\umi\\umi-next\\packages\\bundler-webpack\\compiled\\postcss-loader\\index.js",
        "options": {
          "postcssOptions": {
            "ident": "postcss",
            "plugins": [null, {
              "postcssPlugin": "postcss-preset-env",
              "plugins": [{
                "postcssPlugin": "postcss-media-minmax",
                "AtRule": {}
              }, {
                "postcssPlugin": "postcss-page-break"
              }, {
                "postcssPlugin": "postcss-font-variant"
              }, {
                "postcssPlugin": "autoprefixer",
                "options": {
                  "overrideBrowserslist": ["chrome >= 80"],
                  "flexbox": "no-2009"
                },
                "browsers": ["chrome >= 80"]
              }, {
                "postcssPlugin": "postcss-progressive-custom-properties"
              }, {
                "postcssPlugin": "postcss-preset-env"
              }]
            }]
          }
        }
      }]
    }],
    "bk": "/\\.css(\\?.*)?$/"
  }, {
    "test": {},
    "oneOf": [{
      "resourceQuery": {},
      "use": [{
        "loader": "D:\\git\\umi\\umi-next\\packages\\bundler-webpack\\compiled\\mini-css-extract-plugin\\loader.js",
        "options": {
          "publicPath": "./",
          "emit": true,
          "esModule": true
        }
      }, {
        "loader": "D:\\git\\umi\\umi-next\\node_modules\\.pnpm\\css-loader@6.7.1_webpack@5.72.0\\node_modules\\css-loader\\dist\\cjs.js",
        "options": {
          "importLoaders": 1,
          "esModule": true,
          "url": true,
          "import": true,
          "modules": {
            "localIdentName": "[local]___[hash:base64:5]"
          }
        }
      }, {
        "loader": "D:\\git\\umi\\umi-next\\packages\\bundler-webpack\\compiled\\postcss-loader\\index.js",
        "options": {
          "postcssOptions": {
            "ident": "postcss",
            "plugins": [null, {
              "postcssPlugin": "postcss-preset-env",
              "plugins": [{
                "postcssPlugin": "postcss-media-minmax",
                "AtRule": {}
              }, {
                "postcssPlugin": "postcss-page-break"
              }, {
                "postcssPlugin": "postcss-font-variant"
              }, {
                "postcssPlugin": "autoprefixer",
                "options": {
                  "overrideBrowserslist": ["chrome >= 80"],
                  "flexbox": "no-2009"
                },
                "browsers": ["chrome >= 80"]
              }, {
                "postcssPlugin": "postcss-progressive-custom-properties"
              }, {
                "postcssPlugin": "postcss-preset-env"
              }]
            }]
          }
        }
      }, {
        "loader": "D:\\git\\umi\\umi-next\\packages\\bundler-webpack\\compiled\\less-loader\\index.js",
        "options": {
          "implementation": "D:\\git\\umi\\umi-next\\packages\\bundler-utils\\compiled\\less\\index.js",
          "lessOptions": {
            "javascriptEnabled": true
          }
        }
      }]
    }, {
      "sideEffects": true,
      "use": [{
        "loader": "D:\\git\\umi\\umi-next\\packages\\bundler-webpack\\compiled\\mini-css-extract-plugin\\loader.js",
        "options": {
          "publicPath": "./",
          "emit": true,
          "esModule": true
        }
      }, {
        "loader": "D:\\git\\umi\\umi-next\\node_modules\\.pnpm\\css-loader@6.7.1_webpack@5.72.0\\node_modules\\css-loader\\dist\\cjs.js",
        "options": {
          "importLoaders": 1,
          "esModule": true,
          "url": true,
          "import": true
        }
      }, {
        "loader": "D:\\git\\umi\\umi-next\\packages\\bundler-webpack\\compiled\\postcss-loader\\index.js",
        "options": {
          "postcssOptions": {
            "ident": "postcss",
            "plugins": [null, {
              "postcssPlugin": "postcss-preset-env",
              "plugins": [{
                "postcssPlugin": "postcss-media-minmax",
                "AtRule": {}
              }, {
                "postcssPlugin": "postcss-page-break"
              }, {
                "postcssPlugin": "postcss-font-variant"
              }, {
                "postcssPlugin": "autoprefixer",
                "options": {
                  "overrideBrowserslist": ["chrome >= 80"],
                  "flexbox": "no-2009"
                },
                "browsers": ["chrome >= 80"]
              }, {
                "postcssPlugin": "postcss-progressive-custom-properties"
              }, {
                "postcssPlugin": "postcss-preset-env"
              }]
            }]
          }
        }
      }, {
        "loader": "D:\\git\\umi\\umi-next\\packages\\bundler-webpack\\compiled\\less-loader\\index.js",
        "options": {
          "implementation": "D:\\git\\umi\\umi-next\\packages\\bundler-utils\\compiled\\less\\index.js",
          "lessOptions": {
            "javascriptEnabled": true
          }
        }
      }]
    }],
    "bk": "/\\.less(\\?.*)?$/"
  }, {
    "test": {},
    "oneOf": [{
      "resourceQuery": {},
      "use": [{
        "loader": "D:\\git\\umi\\umi-next\\packages\\bundler-webpack\\compiled\\mini-css-extract-plugin\\loader.js",
        "options": {
          "publicPath": "./",
          "emit": true,
          "esModule": true
        }
      }, {
        "loader": "D:\\git\\umi\\umi-next\\node_modules\\.pnpm\\css-loader@6.7.1_webpack@5.72.0\\node_modules\\css-loader\\dist\\cjs.js",
        "options": {
          "importLoaders": 1,
          "esModule": true,
          "url": true,
          "import": true,
          "modules": {
            "localIdentName": "[local]___[hash:base64:5]"
          }
        }
      }, {
        "loader": "D:\\git\\umi\\umi-next\\packages\\bundler-webpack\\compiled\\postcss-loader\\index.js",
        "options": {
          "postcssOptions": {
            "ident": "postcss",
            "plugins": [null, {
              "postcssPlugin": "postcss-preset-env",
              "plugins": [{
                "postcssPlugin": "postcss-media-minmax",
                "AtRule": {}
              }, {
                "postcssPlugin": "postcss-page-break"
              }, {
                "postcssPlugin": "postcss-font-variant"
              }, {
                "postcssPlugin": "autoprefixer",
                "options": {
                  "overrideBrowserslist": ["chrome >= 80"],
                  "flexbox": "no-2009"
                },
                "browsers": ["chrome >= 80"]
              }, {
                "postcssPlugin": "postcss-progressive-custom-properties"
              }, {
                "postcssPlugin": "postcss-preset-env"
              }]
            }]
          }
        }
      }, {
        "loader": "D:\\git\\umi\\umi-next\\packages\\bundler-webpack\\compiled\\sass-loader\\index.js"
      }]
    }, {
      "sideEffects": true,
      "use": [{
        "loader": "D:\\git\\umi\\umi-next\\packages\\bundler-webpack\\compiled\\mini-css-extract-plugin\\loader.js",
        "options": {
          "publicPath": "./",
          "emit": true,
          "esModule": true
        }
      }, {
        "loader": "D:\\git\\umi\\umi-next\\node_modules\\.pnpm\\css-loader@6.7.1_webpack@5.72.0\\node_modules\\css-loader\\dist\\cjs.js",
        "options": {
          "importLoaders": 1,
          "esModule": true,
          "url": true,
          "import": true
        }
      }, {
        "loader": "D:\\git\\umi\\umi-next\\packages\\bundler-webpack\\compiled\\postcss-loader\\index.js",
        "options": {
          "postcssOptions": {
            "ident": "postcss",
            "plugins": [null, {
              "postcssPlugin": "postcss-preset-env",
              "plugins": [{
                "postcssPlugin": "postcss-media-minmax",
                "AtRule": {}
              }, {
                "postcssPlugin": "postcss-page-break"
              }, {
                "postcssPlugin": "postcss-font-variant"
              }, {
                "postcssPlugin": "autoprefixer",
                "options": {
                  "overrideBrowserslist": ["chrome >= 80"],
                  "flexbox": "no-2009"
                },
                "browsers": ["chrome >= 80"]
              }, {
                "postcssPlugin": "postcss-progressive-custom-properties"
              }, {
                "postcssPlugin": "postcss-preset-env"
              }]
            }]
          }
        }
      }, {
        "loader": "D:\\git\\umi\\umi-next\\packages\\bundler-webpack\\compiled\\sass-loader\\index.js"
      }]
    }],
    "bk": "/\\.(sass|scss)(\\?.*)?$/"
  }, {
    "oneOf": [{
      "test": {},
      "type": "asset",
      "mimetype": "image/avif",
      "parser": {
        "dataUrlCondition": {
          "maxSize": 10000
        }
      },
      "generator": {
        "filename": "static/[name].[hash:8].[ext]"
      },
      "bk": "/\\.avif$/"
    }, {
      "test": {},
      "type": "asset",
      "parser": {
        "dataUrlCondition": {
          "maxSize": 10000
        }
      },
      "generator": {
        "filename": "static/[name].[hash:8].[ext]"
      },
      "bk": "/\\.(bmp|gif|jpg|jpeg|png)$/"
    }, {
      "type": "asset/resource",
      "generator": {
        "filename": "static/[name].[hash:8].[ext]"
      },
      "exclude": [{}, {}, {}, {}, {}, {}]
    }]
  }, {
    "test": {},
    "use": [{
      "loader": "D:\\git\\umi\\umi-next\\packages\\bundler-webpack\\compiled\\svgo-loader\\index.js",
      "options": {
        "configFile": false
      }
    }],
    "bk": "/\\.svg$/"
  }]
}
```