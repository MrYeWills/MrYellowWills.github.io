---
title:  ui组件库系列(三):本地编译、启动与调试
date: 2022/6/29
tags: [ui组件库]
categories: 
- 前端
series: ui组件库
---


接上一篇，以`@mgbd`项目为例。
本身涉及到的源码版本为：
dumi 版本 1.1.19
umi 版本 3.4.13

本项目使用dumi启动：
```js
  "scripts": {
    "start": "dumi dev"
  },
```
因此以这条线 `dumi dev` 开始讲解。

### dumi dev 就是 umi dev

`dumi dev`命令执行 dumi 包的下面文件
```js
// packages\dumi\src\index.ts
const { fork } = require('child_process');

module.exports = () => {
  // umi dev 其实就是 umi dev， 并且为 umi dev ，设置了环境变量 UMI_PRESETS，
  // umi dev 执行时，会读取 UMI_PRESETS 插件。
  process.env.UMI_PRESETS = require.resolve('@umijs/preset-dumi');

  // start umi use child process
  // require.resolve('umi/bin/umi') 相当于 umi 命令, process.argv.slice(2) 就是 dev
  //  这句话就是 umi dev 同义
  const child = fork(require.resolve('umi/bin/umi'), [...(process.argv.slice(2) || [])], {
    stdio: 'inherit',
  });
```

上述 require.resolve('umi/bin/umi') 其实就是 umi 命令，
```js
// packages\umi\package.json
 "bin": {
    "umi": "bin/umi.js"
  },
```

因此 dumi dev 命令就是 umi dev 命令。并且为 umi dev 执行，加了一个上述的插件 process.env.UMI_PRESETS = require.resolve('@umijs/preset-dumi');

### 集成@umijs/preset-dumi到umi dev

#### dumi小述
通过看dumi的源码可知，dumi其实就是一个中转的作用，
文档功能交给 @umijs/preset-dumi 插件去做， 
dumi dev 与 build 功能，转发给 umi 去做，dumi只是设置了一个配置或插件或preset。

#### 集成到 umi dev
由上可知， dumi dev 其实就是 umi dev。

那么umi dev的过程分析，可以查看另外一篇博客[umi系列(二)：基础知识，如umi dev过程分析]()。

上述插件是这里集成的：
```js
// packages\core\src\Service\utils\pluginUtils.ts
function getPluginsOrPresets(type: PluginType, opts: IOpts): string[] {
  const upperCaseType = type.toUpperCase();
  return [
    // opts
    ...((opts[type === PluginType.preset ? 'presets' : 'plugins'] as any) ||
      []),
    // env  就是这里集成的 process.env.UMI_PRESETS = require.resolve('@umijs/preset-dumi');
    ...(process.env[`UMI_${upperCaseType}S`] || '').split(',').filter(Boolean),
    // dependencies
    ...Object.keys(opts.pkg.devDependencies || {})
      .concat(Object.keys(opts.pkg.dependencies || {}))
      // 根目录下如果依赖了umi插件，会自动集成进来，比如 "@umijs/plugin-sass" 
      .filter(isPluginOrPreset.bind(null, type)),
    // user config
    ...((opts[
      type === PluginType.preset ? 'userConfigPresets' : 'userConfigPlugins'
    ] as any) || []),
  ].map((path) => {
    return resolve.sync(path, {
      basedir: opts.cwd,
      extensions: ['.js', '.ts'],
    });
  });
}
```


### 本地调试套路分析(文档、demo)

以一个md为例子说明：
```md
<!-- packages\fusion\src\components\MGBDTagCell\index.md -->
# TagCell - 带标签Cell布局

用于带标签的表格格子

示例
<code src="./demos/index.tsx"></code>
```

dumi dev 启动本ui项目后，即可在浏览器上浏览上述文档，且能展示示例中的demo，且能看到源码，并且接入codesandbox在线修改调试。

一般只需要将 md 文件，经过编译直接变成jsx文件；
查找关键字code，将此关键字变成一个组件的引用；
就可以实现既能展示文档，又能展示demo了，
至于源码展示，也属于上述编译的一部分；
接入 codesandbox 在线修改调试，只需要按照 codesandbox 的api进行调用集成即可。

目前无论是dumi 还是 umi4 的文档都是以上套路。

遗憾的是，umi4的文档尚未支持 源码展示、codesandboxcodesandbox 。

很多文档工具的实现，其实就是 md文件编译成 jsx 的编译工具选择不一样，

#### dumi的编译工具 `remark-parse`
dumi使用的编译工具是 `remark-parse`,
原理如下：
```js
// packages\preset-dumi\src\transformer\index.ts

import remark from './remark';

 markdown(
    raw: string,
    fileAbsPath: string | null,
    { type = 'jsx', noCache, throwError }: { type?: 'jsx' | 'html'; noCache?: boolean; throwError?: boolean } = {},
  ): TransformResult {
    // use cache first
    let result = fileAbsPath && !noCache && cachers.markdown.get(fileAbsPath);

    if (!result) {
      try {
        // 这里进行编译
        result = { value: remark(raw, fileAbsPath, type) };
      } catch (error) {
        // return empty result & cache error
        result = { value: { contents: '', data: {} }, error };
      } finally {
        if (fileAbsPath && !noCache) {
          cachers.markdown.add(fileAbsPath, result);
        }
      }
    }

    // throw error for webpack loader but not throw for route initialize stage
    if (result.error && throwError) {
      throw result.error;
    }

    return {
      content: result.value.contents,
      meta: result.value.data,
    } as TransformResult;
  },
```

```js
// packages\preset-dumi\src\transformer\remark\index.ts
// 这是上面的  import remark from './remark';

import parse from 'remark-parse';
import gfm from 'remark-gfm';

export default (source: string, fileAbsPath: string, type: 'jsx' | 'html') => {
  const rehypeCompiler: any = {
    jsx: [jsxify],
    html: [stringify, { allowDangerousHtml: true, closeSelfClosing: true }],
  }[type];
  const processor = unified()
    // parse to remark
    .use(parse)
    .use(debug('parse'))
    .use(gfm)
    .use(debug('gfm'))
    // remark plugins
    .use(frontmatter)
    .use(debug('frontmatter'))
    .use(math)
    .use(debug('math'))
    .use(meta)
    .use(debug('meta'))
    .use(codeBlock)
    .use(debug('codeBlock'))
    // remark to rehype
    .use(rehype)
    .use(debug('rehype'))
    // rehype plugins
    .use(mathjax)
    .use(debug('mathjax'))
    .use(sourceCode)
    .use(debug('sourceCode'))
    .use(raw)
    .use(debug('raw'))
    .use(domWarn)
    .use(debug('domWarn'))
    .use(comments, { removeConditional: true })
    .use(debug('comments'))
    .use(img)
    .use(debug('img'))
    .use(code)
    .use(debug('code'))
    .use(embed)
    .use(debug('embed'))
    .use(api)
    .use(debug('api'))
    .use(slug)
    .use(debug('slug'))
    .use(headings)
    .use(debug('headings'))
    .use(link)
    .use(debug('link'))
    .use(previewer)
    .use(debug('previewer'))
    .use(isolation)
    .use(debug('isolation'))
    .data('fileAbsPath', fileAbsPath)
    .data('outputType', type);

  // apply compiler via type
  processor.use(rehypeCompiler[0], rehypeCompiler[1]);

  const result = processor.processSync(source);
  debug('compiler').call(processor);

  return result;
};
```


umi4 的文档用的是 `@mdx-js/mdx` 实现的转jsx，与dumi选择的remark功能目标是一致的。


#### 把md看出jsx
知道一般的文档套路后，我们就可知道，md最终被转义成一个jsx，
>如何转的细节，可以看 umi4的这个文件`packages\plugin-docs\src\compiler.ts`，以此类推 dumi的文档编译。

我们在md中写的如`<code src="./demos/index.tsx"></code>`，
其实就相当于在jsx中写的：
```jsx
import DemosIndex from './demos/index.tsx';

<DemosIndex />
```
那么下面的时期就简单了，就是如何编译jsx、tsx的问题了。
所以，下面我们要讨论 dumi dev 其实就是 umi dev 使用的编译工具 以及 配置。


### webpack
dumi dev 触发的 umi dev，使用的是 webpack，详细细节 参考[umi系列(二)：基础知识，如umi dev过程分析]()。
umi 对webpack的配置采用的是`webpack-5-chain`链式调用，
>这点比较吐槽， webpack-5-chain 的作者已经停更了，只支持 webpack4的配置，
umi为了支持webpack5，umi作者后面不得不fork了原webpack-5-chain，自己扩展了webpack5的配置，折腾人，这是一件非常耗精力以及高阶的活，
感觉为了一个链式的写法，是否值当，
后期webpack5有新的配置，还得继续更新 webpack-5-chain 打补丁，实在是违背了最小职责原则以及扩展非常不便。

### 支持sass
#### 集成@umijs/plugin-sass到umi dev
```js
// 本ui库的根目录 package.json
"devDependencies": {
    "@umijs/plugin-sass": "^1.1.1",
  },
```
其他参考《集成@umijs/preset-dumi到umi dev》

@umijs/plugin-sass 源码如下
```js
import { IApi, utils } from 'umi';

export default (api: IApi) => {
  api.describe({
    config: {
      schema(Joi) {
        return Joi.object({
          implementation: Joi.any(),
          sassOptions: Joi.object(),
          prependData: Joi.alternatives(Joi.string(), Joi.func()),
          sourceMap: Joi.boolean(),
          webpackImporter: Joi.boolean(),
        });
      },
    },
  });

  api.chainWebpack((memo, { createCSSRule }) => {
    createCSSRule({
      lang: 'sass',
      test: /\.(sass|scss)(\?.*)?$/,
      loader: require.resolve('sass-loader'),
      options: utils.deepmerge(
        {
          implementation: require('sass'),
        },
        api.config.sass || {},
      ),
    });
    return memo;
  });
};

```


###  支持less
默认支持 less
```js
// packages\bundler-webpack\src\getConfig\css.ts
  createCSSRule({
    type,
    webpackConfig,
    config,
    isDev,
    lang: 'less',
    test: /\.(less)(\?.*)?$/,
    loader: require.resolve('@umijs/deps/compiled/less-loader'),
    options: deepmerge(
      {
        modifyVars: theme,
        javascriptEnabled: true,
      },
      config.lessLoader || {},
    ),
    browserslist,
    miniCSSExtractPluginLoaderPath,
  });
```


### webpack 配置及其他

其他编译细节都参考[umi系列(二)：基础知识，如umi dev过程分析]()


### 调试

放开对md的偏见，将所有md文件，看成jsx tsx文件，那么根目录执行 dumi dev，其实就是一个纯粹普通的umi的react项目。
所以 只要改变 ui组件源码，就会触发编译，重刷。

```md
---
title: 带标签Cell布局
group:
path: /
nav:
path: /components
---

# TagCell - 带标签Cell布局

用于带标签的表格格子

示例
<code src="./demos/index.tsx"></code>

```
```jsx
// <code src="./demos/index.tsx"></code> 就是下面
// packages\fusion\src\components\MGBDTagCell\demos\index.tsx
import React, { FC, useRef } from 'react';
import { Tag, Button } from '@alifd/next';
import MGBDTagCell from '../index';

export default () => {
  return (
    <>
      <div style={{ width: 200, border: '1px solid red' }}>
        <MGBDTagCell>
       ....
        </MGBDTagCell>
      </div>
    </>
  );
};

```

#### .umirc.ts对md的路径、范围处理
每个 pkg 下的文档md，也做了稍微处理：

```js
//根目录下的 .umirc.ts
const pkgList = readdirSync(join(__dirname, 'packages')).filter(pkg => pkg.charAt(0) !== '.' && !headPkgList.includes(pkg));

const tailPkgList = pkgList
  .map(path => [join('packages', path, 'src'), join('packages', path, 'src', 'components'), join('packages', path, 'src', 'hooks')])
  .reduce((acc, val) => acc.concat(val), []);

```

### 本地、生成编译区别和联系
上一篇我们分析了 本ui组件库的 生成打包，其实是用gulp结合babel的打包方式，
配置文件等等与本地编译的配置以及工具毫无相关。
这一点，感觉似有不妥之处，与我们想象的业务项目 开发与生成共用一套编译配置不同（不考虑生产的压缩混淆等）

### 与lerna
本ui项目开发启动，需要用到 lerna，不安装lerna就报错；
生产编译不需要 lerna，只需要lerna.json即可；
这些与编译主流程关系不大，就不展开研究了。