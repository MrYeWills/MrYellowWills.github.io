---
title: umi系列(十) umi项目脚手架、改造umi
date: 2022/6/12
tags: umi
categories: 
- 前端工具
series: 基建
---


本篇对 umi 项目的脚手架讲解：

开发时：
- 修改代码后，如何编译
- 修改代码后，如何实时测试效果

发布时，
- 修改代码后，如何编译，并发布；
- 如何管理版本；


示例 example；
文档；


## 待研究
为什么会利用pnpm的workplace功能，因为pnpm的workplace功能是根目录下设置的，如何影响`examples\with-react-17` 目录下，有兴趣可看看，到这个问题不大, 参考下面的《example示例》

## 开发时

### 编译

以packages 为例：
```js
// packages\preset-umi\package.json
  "scripts": {
    "build": "pnpm tsc",
    "build:deps": "magicbird-scripts bundleDeps",
    "dev": "pnpm build -- --watch"
  },

  // 或者
  // packages\plugin-docs\package.json
"scripts": {
    "build": "pnpm tsc",
    "build:css": "tailwindcss -i ./client/theme-doc/tailwind.css -o ./client/theme-doc/tailwind.out.css",
    "build:deps": "magicbird-scripts bundleDeps",
    "build:extra": "pnpm build:css",
    "dev": "pnpm build -- --watch",
    "dev:css": "pnpm build:css -- --watch"
  },

```

```js
// packages\preset-umi\tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}

```

```js
// tsconfig.base.json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "module": "commonjs",
    "moduleResolution": "node",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "strict": true,
    "skipLibCheck": true,
    "target": "es2019",
    "jsx": "react",
    "paths": {
      "umi": ["./packages/umi"],
      "@umijs/utils": ["./packages/utils"],
      "@umijs/renderer-react": ["./packages/renderer-react"]
    }
  },
  "exclude": [
    "**/node_modules",
    "**/examples",
    "**/dist",
    "**/fixtures",
    "**/*.test.ts",
    "**/*.e2e.ts"
  ]
}
```

由上可知，其编译全部依赖 tsc ，没有用到所谓的webpack rollup 等。

开发时，除了编译外，还外加了一个--watch 。


### 监听
如上。

### 如何(实时)测试效果
由上可知，可通过watch实时监听编译，
编译后生成最新的dist，
而umi项目，都是用的软链接，
使用到的 example 或文档项目， 都会实时通过软链接，使用最新的代码版本。


## 发布时

修改 packages 或 example 代码后，
及时git add commit。

然后运行 pnpm release 命令，
此命令的过程可参考《umi系列(四)：npm script命令  -- pnpm release》。
此 release 命令会运行：
```js
  // build packages
  logger.event('build packages');
  await $`npm run build:release`;
  await $`npm run build:extra`;
  await $`npm run build:client`;
```


```js
  // package.json
   "build:release": "magicbird-scripts turbo --cmd build --no-cache -- --declarationMap false",
   "build:extra": "magicbird-scripts turbo --cmd build:extra",
  "build:client": "magicbird-scripts turbo --cmd build:client",
```

其实就是给所有的 package包 统一先删除dist，然后再统一给每个package包执行 build，其实就是tsc编译。

然后通过learn 统一进行版本管理，修改各个包的package.json 的version，然后 git tag 、push 等 以及 npm publish。

上述过程中还有其他的 比如比较远程版本、发布鉴权、npm源检测 等等，这里就不细述了。



## example示例
这个比较简单，利用pnpm的workplace功能，example下的每个示例都是通过软链接引用的package包。
进入 example后，比如 `examples\with-react-17` 执行 pnpm install， 
则会自动 利用pnpm的workplace功能，建立软链接。
然后 npm start 即可正常启动了。

## 文档
可参考《umi系列(八) 文档插件》《umi系列(九) 文档插件》


## 改造umi

### 策略选择
umi源码看完后，有两个遗憾：如何进一步了解umi；如何自己写一套类似框架。
经过试错与选择后，决定直接套用umi项目源码，修改成一套自己的源码。
当时考虑点：
- 如果能直接将umi改成任意其他名字，也是非常棒的第一步；
- 用删除法来复制粘贴umi项目，重写项目最稳妥；
- 去掉不必要的一些编译，做一个精简版本的umi;
- 能精简umi，其实也是对umi了解非常深厚了

- 直接 copy 然后换名字，发布的原因在于：
- 过程中读 umi 认识一步加深；
- 熟悉了 它整个 脚手架 发包、包管理、lint 功能

没有对umi深入的了解，直接copy 替换名字 发布版本是很难的，
必须要对umi有深入的了解后，才可以做这件事情。
所以这个顺序要注意，也可以指导以后阅读其他大型组件库。

其实选择上述最重要的是：
性价比最高，就是时间成本最低；
最容易成功，其实就是典型的温州模式；
凡事先用起来，需求有了，自然就过程中反哺更加了解umi原理了，这比单纯读umi框架更有趣味性；
兴趣是最好的老师；


### 具体实施
直接从umi官网，clone下来项目，
全局搜索umi关键字进行替换，
由于工程量非常大，为避免出错，分三阶段替换：
- 只替换根目录下关键字（umi项目本身脚手架）
- 逐个替换 package下umi；
- 逐个替换 example下umi；

替换的技巧：
文件搜索 umi 关键字，然后一口气对所有相关的内容进行替换，
在文件下，直接对 `@mumijs/`  ---》 `@magicbirdjs/`
```
magicbird
magicbirdjs
@magicbirdjs/
node_modules,*.md,*.test.ts
```

因为涉及到很多原理的了解，非常考验umi了解程度。
基于此，umi的改造，一定要在对umi有了深厚了解后，再进行，否则将替换错误，或各种无法启动。
