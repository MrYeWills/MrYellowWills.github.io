---
title: umi系列(七) 文档插件
date: 2022/5/24
tags: umi
categories: 
- 前端工具
series: 基建
---


umi的源码根目录下，执行pnpm doc:dev 就可以启动文档；
umi的文档其实就是一个典型的umi项目；
而文档的生成的核心逻辑都是基于umi的文档插件 plugin-docs 实现的。

分析umi的文档系统，可以了解惊叹于如何使用react来写一个文档系统；
因为本质上是一个典型的umi项目，因此又可以了解到umi的整个核心原理或流程。

## 参考

### 文档

## 待研究

参考 《api.register api.registerMethod》

疑问 是否要全局执行build ，因为其他依赖 执行build

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
但不知为何，会给项目下所有的 packages 下面的包都进行build，然后所有packages下的包都会生成dist，具体情况如下：

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

