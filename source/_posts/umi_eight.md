---
title: umi系列(八)：文档插件
date: 2022/5/24
tags: umi
categories: 
- umi系列
---


umi的源码根目录下，执行pnpm doc:dev 就可以启动文档；
umi的文档其实就是一个典型的umi项目；
而文档的生成的核心逻辑都是基于umi的文档插件 plugin-docs 实现的。

分析umi的文档系统，可以了解惊叹于如何使用react来写一个文档系统；
因为本质上是一个典型的umi项目，因此又可以了解到umi的整个核心原理或流程。


## 待研究

参考 《api.register api.registerMethod》

参考 《pnpm doc:deps》



## 文档的使用和开发

### usage
从umi官网仓库中，git clone 下umi全量源码，进行以下步骤，即可运行起 文档了。

#### pnpm install

**umi源码 根目录下执行** 
```s
pnpm install
```
此命令一次做了以下事情：
- 给根目录安装node module
- 给所有的 packages、 example 下的包或项目 进行 node module 的安装。

为什么会能一次做这么多事情：
目前不知道与什么有关，大概率是 pnpm-workspace.yaml 原因吧：
```yaml
packages:
  - 'packages/*'
  - 'examples/*'
  - 'scripts'
```

又因为umi项目是基于 pnpm + workspace:* 模式，例如：

```js
     "@umijs/bundler-esbuild": "workspace:*",
    "@umijs/bundler-utils": "workspace:*",
    "@umijs/bundler-vite": "workspace:*",
    "@umijs/bundler-webpack": "workspace:*",
    "@umijs/plugin-docs": "workspace:*",
    "@umijs/plugins": "workspace:*",
    "@umijs/server": "workspace:*",
    "@umijs/utils": "workspace:*",
    "umi": "workspace:*",
    "umi-scripts": "workspace:*",
```

经过pnpm install后，上述被安装好的 workspace 包，在node module中都是一个软连接：
```s
$ ls -l 'D:\git\umi\umi-next-copy1\node_modules\@umijs\bundler-esbuild'
lrwxrwxrwx 1 YeWills 197121 51  5月 26 08:38 'D:\git\umi\umi-next-copy1\node_modules\@umijs\bundler-esbuild' -> /d/git/umi/umi-next-copy1/packages/bundler-esbuild//
```

但由于 每个packages下的umi包 此时还没有经过build编译，没有生成 dist 目录；
因此此时上述被安装到 node module 上的 workspace的包是无法起作用的：
```s
YeWills@LAPTOP-Q29GGHVL MINGW64 /d/git/umi/umi-next-copy1 (version-4.0.0-rc.15)
$ cd 'D:\git\umi\umi-next-copy1\node_modules\@umijs\bundler-esbuild'                                              

YeWills@LAPTOP-Q29GGHVL MINGW64 /d/git/umi/umi-next-copy1/node_modules/@umijs/bundler-esbuild (version-4.0.0-rc.15)
$ ls
# 如下，我们未看到dist目录， 因此此包将不起作用，需要进一步生成 dist目录
bin/  node_modules/  package.json  README.md  src/  tsconfig.json

$ cat package.json
{
  "name": "@umijs/bundler-esbuild",
  "version": "4.0.0-rc.15",
  # 包的主文件入口 基于dist
  "main": "dist/index.js",
 ...
}
```

没有dist目录， 因此此包将不起作用，需要进一步生成 dist目录，
根目录下执行 `pnpm doc:deps`可生成 dist目录。

#### pnpm doc:deps

根目录的npm script:
```js
  "doc:deps": "pnpm doc:deps-ts && pnpm doc:deps-extra",
  "doc:deps-ts": "umi-scripts turbo --cmd build --filter @umijs/plugin-docs...",
  "doc:deps-extra": "umi-scripts turbo --cmd build:extra --filter @umijs/plugin-docs...",
```

此命令按理说应该是 因为使用到了 `--filter` 过滤，按理说只会安装 @umijs/plugin-docs ，
todo
但不知为何，会给项目下所有的 packages 下面的包都进行build，然后所有packages下的包都会生成dist，具体情况如下所示。
从下面的代码执行过程可以看出，
执行 doc:deps-ts 时一共对 16 packages 进行了编译；
执行 doc:deps-extra 时，由于packages只有plugin-docs有这个编译命令，因此只对这一个包进行了编译；
这也解释了一部分 turbo 执行的逻辑。

```s
$ pnpm doc:deps

> @ doc:deps D:\git\umi\umi-next-copy1
> pnpm doc:deps-ts && pnpm doc:deps-extra


> @ doc:deps-ts D:\git\umi\umi-next-copy1
> umi-scripts turbo --cmd build --filter @umijs/plugin-docs...

umi-scripts: turbo

• Packages in scope: @umijs/ast, @umijs/babel-preset-umi, @umijs/bundler-esbuild, @umijs/bundler-utils, @umijs/bundler-vite, @umijs/bundler-webpack, @umijs/core, @umijs/lint, @umijs/mfsu, @umijs/plugin-docs, @umijs/preset-umi, @umijs/renderer-react, @umijs/server, @umijs/test, @umijs/utils, 
umi
• Running build in 16 packages
@umijs/renderer-react:build: cache miss, executing 8bbc9794c10d5654
@umijs/test:build: cache miss, executing f4f2e5a95f6c8906
@umijs/utils:build: cache miss, executing 685277c07b7d9a93
@umijs/renderer-react:build: 
@umijs/renderer-react:build: > @umijs/renderer-react@4.0.0-rc.15 build D:\git\umi\umi-next-copy1\packages\renderer-react
@umijs/renderer-react:build: > pnpm tsc
@umijs/renderer-react:build: 
@umijs/utils:build: 
@umijs/utils:build: > @umijs/utils@4.0.0-rc.15 build D:\git\umi\umi-next-copy1\packages\utils
@umijs/utils:build: > pnpm tsc
@umijs/utils:build: 
@umijs/test:build: 
@umijs/test:build: > @umijs/test@4.0.0-rc.15 build D:\git\umi\umi-next-copy1\packages\testing
@umijs/test:build: > pnpm tsc
@umijs/test:build: 
@umijs/bundler-utils:build: cache miss, executing a03bbd3c10f7438d
@umijs/bundler-utils:build: 
@umijs/bundler-utils:build: > @umijs/bundler-utils@4.0.0-rc.15 build D:\git\umi\umi-next-copy1\packages\bundler-utils
@umijs/bundler-utils:build: > pnpm tsc
@umijs/bundler-utils:build: 
@umijs/core:build: cache miss, executing 2fea1b6c74f0df7f
@umijs/babel-preset-umi:build: cache miss, executing 72246494b29e02ee
@umijs/ast:build: cache miss, executing 83630f0fd5ed5587
@umijs/bundler-esbuild:build: cache miss, executing 4952ec85342441fb
@umijs/bundler-vite:build: cache miss, executing 088404db49de01c6
@umijs/server:build: cache miss, executing ea44a612de420714
@umijs/core:build:
@umijs/core:build: > @umijs/core@4.0.0-rc.15 build D:\git\umi\umi-next-copy1\packages\core
@umijs/core:build: > pnpm tsc
@umijs/core:build:
@umijs/ast:build:
@umijs/ast:build: > @umijs/ast@4.0.0-rc.15 build D:\git\umi\umi-next-copy1\packages\ast
@umijs/ast:build: > pnpm tsc
@umijs/ast:build:
@umijs/server:build:
@umijs/server:build: > @umijs/server@4.0.0-rc.15 build D:\git\umi\umi-next-copy1\packages\server
@umijs/server:build: > pnpm tsc
@umijs/server:build:
@umijs/bundler-vite:build:
@umijs/bundler-vite:build: > @umijs/bundler-vite@4.0.0-rc.15 build D:\git\umi\umi-next-copy1\packages\bundler-vite
@umijs/bundler-vite:build: > pnpm tsc
@umijs/bundler-vite:build:
@umijs/bundler-esbuild:build:
@umijs/bundler-esbuild:build: > @umijs/bundler-esbuild@4.0.0-rc.15 build D:\git\umi\umi-next-copy1\packages\bundler-esbuild
@umijs/bundler-esbuild:build: > pnpm tsc
@umijs/bundler-esbuild:build:
@umijs/babel-preset-umi:build:
@umijs/babel-preset-umi:build: > @umijs/babel-preset-umi@4.0.0-rc.15 build D:\git\umi\umi-next-copy1\packages\babel-preset-umi
@umijs/babel-preset-umi:build: > pnpm tsc
@umijs/babel-preset-umi:build:
@umijs/mfsu:build: cache miss, executing 4edbbadbb0695dc7
@umijs/mfsu:build:
@umijs/mfsu:build: > @umijs/mfsu@4.0.0-rc.15 build D:\git\umi\umi-next-copy1\packages\mfsu
@umijs/mfsu:build: > pnpm tsc
@umijs/mfsu:build:
@umijs/lint:build: cache miss, executing 4d2df7c9507e1184
@umijs/lint:build:
@umijs/lint:build: > @umijs/lint@4.0.0-rc.15 build D:\git\umi\umi-next-copy1\packages\lint
@umijs/lint:build: > pnpm tsc
@umijs/lint:build:
@umijs/bundler-webpack:build: cache miss, executing ff91d9b176202baf
@umijs/bundler-webpack:build:
@umijs/bundler-webpack:build: > @umijs/bundler-webpack@4.0.0-rc.15 build D:\git\umi\umi-next-copy1\packages\bundler-webpack
@umijs/bundler-webpack:build: > pnpm tsc
@umijs/bundler-webpack:build:
@umijs/preset-umi:build: cache miss, executing c37c2011de483338
@umijs/preset-umi:build: 
@umijs/preset-umi:build: > @umijs/preset-umi@4.0.0-rc.15 build D:\git\umi\umi-next-copy1\packages\preset-umi
@umijs/preset-umi:build: > pnpm tsc
@umijs/preset-umi:build: 
umi:build: cache miss, executing d07cfc390339fe45
umi:build: 
umi:build: > umi@4.0.0-rc.15 build D:\git\umi\umi-next-copy1\packages\umi
umi:build: > pnpm tsc
umi:build: 
@umijs/plugin-docs:build: cache miss, executing 1c2304af44c683ae
@umijs/plugin-docs:build: 
@umijs/plugin-docs:build: > @umijs/plugin-docs@4.0.0-rc.15 build D:\git\umi\umi-next-copy1\packages\plugin-docs
@umijs/plugin-docs:build: > pnpm tsc
@umijs/plugin-docs:build: 

 Tasks:    16 successful, 16 total
Cached:    0 cached, 16 total
  Time:    1m20.301s


> @ doc:deps-extra D:\git\umi\umi-next-copy1
> umi-scripts turbo --cmd build:extra --filter @umijs/plugin-docs...

umi-scripts: turbo

• Packages in scope: @umijs/ast, @umijs/babel-preset-umi, @umijs/bundler-esbuild, @umijs/bundler-utils, @umijs/bundler-vite, @umijs/bundler-webpack, @umijs/core, @umijs/lint, @umijs/mfsu, @umijs/plugin-docs, @umijs/preset-umi, @umijs/renderer-react, @umijs/server, @umijs/test, @umijs/utils, 
umi
• Running build:extra in 16 packages
@umijs/plugin-docs:build:extra: cache miss, executing b81726ded3e43ac6
@umijs/plugin-docs:build:extra: 
@umijs/plugin-docs:build:extra: > @umijs/plugin-docs@4.0.0-rc.15 build:extra D:\git\umi\umi-next-copy1\packages\plugin-docs
@umijs/plugin-docs:build:extra: > pnpm build:css && pnpm build:deps
@umijs/plugin-docs:build:extra: 
@umijs/plugin-docs:build:extra: 
@umijs/plugin-docs:build:extra: > @umijs/plugin-docs@4.0.0-rc.15 build:css D:\git\umi\umi-next-copy1\packages\plugin-docs
@umijs/plugin-docs:build:extra: > tailwindcss -i ./client/theme-doc/tailwind.css -o ./client/theme-doc/tailwind.out.css
@umijs/plugin-docs:build:extra: 
@umijs/plugin-docs:build:extra: 
@umijs/plugin-docs:build:extra: Done in 482ms.
@umijs/plugin-docs:build:extra: 
@umijs/plugin-docs:build:extra: > @umijs/plugin-docs@4.0.0-rc.15 build:deps D:\git\umi\umi-next-copy1\packages\plugin-docs
@umijs/plugin-docs:build:extra: > umi-scripts bundleDeps
@umijs/plugin-docs:build:extra: 
@umijs/plugin-docs:build:extra: umi-scripts: bundleDeps
@umijs/plugin-docs:build:extra: 
@umijs/plugin-docs:build:extra: Build dep @mdx-js/mdx
@umijs/plugin-docs:build:extra: ncc: Version 0.33.3
@umijs/plugin-docs:build:extra: ncc: Compiling file index.js into CJS
@umijs/plugin-docs:build:extra: filesToCopy []
@umijs/plugin-docs:build:extra: Do not build dts for @mdx-js/mdx
@umijs/plugin-docs:build:extra: Build dep rehype-slug
@umijs/plugin-docs:build:extra: ncc: Version 0.33.3
@umijs/plugin-docs:build:extra: ncc: Compiling file index.js into CJS
@umijs/plugin-docs:build:extra: filesToCopy []
@umijs/plugin-docs:build:extra: Do not build dts for rehype-slug
@umijs/plugin-docs:build:extra: Build dep remark-gfm
@umijs/plugin-docs:build:extra: ncc: Version 0.33.3
@umijs/plugin-docs:build:extra: ncc: Compiling file index.js into CJS
@umijs/plugin-docs:build:extra: filesToCopy []
@umijs/plugin-docs:build:extra: Do not build dts for remark-gfm

 Tasks:    1 successful, 1 total
Cached:    0 cached, 1 total
  Time:    28.172s

```

#### pnpm doc:dev

经过以上安装后，所有的准备工作就完成了，执行 `pnpm doc:dev`
就会顺利启动文档了。

### 开发调试

#### 介绍

`pnpm doc:dev` 启动文档项目后，

修改以下文件，会自动执行编译命令，实时重载，渲染最新的效果，调试开发非常方便：

- /d/git/umi/umi-next-copy1/docs 目录下任何文件
- /d/git/umi/umi-next-copy1/packages/plugin-docs/client  目录下任何文件

因为前者的md文件相当于普通项目中的js，同时被下面引用：
```js
// D:\git\umi\umi-next\.umi\core\route.tsx
export { FeatureItem, Features, Hero, Message } from 'D:/git/umi/umi-next/packages/plugin-docs/client/theme-doc/index.ts';
```

后者(`plugin-docs/client`)的文件是jsx，同时被下面引用：
```js
// D:\git\umi\umi-next\.umi\plugin-docs\index.ts
export { FeatureItem, Features, Hero, Message } from 'D:/git/umi/umi-next/packages/plugin-docs/client/theme-doc/index.ts';
```

由上可知，上面两个目录下的文件，其实都处于 webpack 编译的树依赖下，会被实时监听。

#### 调试技巧
```js
// .umirc.ts
export default {
  // 定义 writeToDisk 为true，可以看编译后生成的文件
  writeToDisk: true,
  mfsu: false,
  plugins: ['@umijs/plugin-docs'],
};

```


## 文档项目的基础框架

### .umi目录的生成
umi官网仓库的根目录执行 `pnpm doc:dev`，就可以启动umi的文档。
说明了umi仓库的根目录下，就是一个umi的文档项目，这有别于umi的 plugin-docs 插件。

现在我们分析下 umi的文档项目 架构。

```
<!-- 主要文件或目录 -->
- docs
- .umirc.ts
```

```js
// .umirc.ts
export default {
  mfsu: false,
  plugins: ['@umijs/plugin-docs'],
};

```

```js
"doc:deps": "pnpm doc:deps-ts && pnpm doc:deps-extra",
"doc:deps-extra": "umi-scripts turbo --cmd build:extra --filter @umijs/plugin-docs...",
"doc:deps-ts": "umi-scripts turbo --cmd build --filter @umijs/plugin-docs...",
"doc:dev": "umi dev",
```

当启动 `pnpm doc:deps` 进行编译生成 umi所有包的dist，以便能正常运行 `pnpm doc:dev`。具体原因参考《文档的使用和开发》

执行 `pnpm doc:dev` 命令后会生成 .umi 目录。


### .umi 的项目结构
由于这部分涉及篇幅比较多，单独开一篇进行展示《umi系列(九) 文档插件》

## 以 mdx 的方式来写文档
允许 用react 组件以及md的方式来写 文档，
太棒了；
核心代码：
`packages\plugin-docs\src\compiler.ts`

核心组件
`import { createProcessor } from '../compiled/@mdx-js/mdx';`

在我们这个文档项目中，
通过 plugin-docs 会改变webpack 配置:
```js
{
    "test": "/\\.mdx?$/",
    "use": [{
      "loader": "D:\\git\\umi\\umi-next\\packages\\plugin-docs\\dist\\loader.js"
    }],
  }
```
```js
{
    "test": "/\\.mdx?$/",
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
  }
```

由上可知，一个 mdx 文件，经过  `plugin-docs\\dist\\loader.js` 后，变成一个react的jsx或js文件，但文件名和后缀依然是 mdx，
但这已经不重要，重要的是 文件内容和语法全部是 react的jsx或js。
这就好比linux系统，文件本无后缀名，后缀名只是为了阅读方便，一眼能知道这是什么类型的文件。

此时的 mdx 其实就是 js或jsx，然后再交给后面的 babel-loader 来处理。



## 如何集成 react-router-dom 6.x
```js
// .umi\core\history.ts
import { createHashHistory, createMemoryHistory, createBrowserHistory, History } from 'D:/git/umi/umi-next/packages/renderer-react';
```

## 主路由layout
```js
// .umi\core\route.tsx

// 主路由： layout :
"docs-layout": {
    "id": "docs-layout",
    "path": "/",
    "file": "D:\\\\git\\\\umi\\\\umi-next\\\\.umi\\\\plugin-docs\\\\Layout.tsx"
  },

// 其他路由 根据 
"id": "docs/introduce/upgrade-to-umi-4",
"parentId": "docs-layout",

// 来确定层级关系；
// 其实就是将一个树壮路由 扁平化了；
```

## webpack配置与原理
### webpack.config.js
这里打印了完整的 文档webpack.config.js 配置文件。
可以去这里看《umi系列(end)  -- 文档项目的webpack配置》

### 如何打印查看webpack配置
参考 《umi系列(二)  -- umi dev 过程源码分析  --   packages\bundler-webpack\src\server\server.ts 》

### 如何项目启动的整个原理流程
参考 《umi系列(二)  -- umi dev 过程源码分析 》