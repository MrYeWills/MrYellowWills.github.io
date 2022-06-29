---
title:  ui组件库系列(二):打包
date: 2022/6/28
tags: [ui组件库]
categories: 
- 前端
series: ui组件库
---


以`@mgbd`项目为例，介绍以下两方面：
因为father-build 本身就是一个项目，fork自github，为了彻底理解 `@mgbd`项目打包，于是把 father-build的源码直接放入 `@mgbd`项目中。
- 因此本文第一部分讲解 father-build源码从ts打包为js的过程；
- 第二部分讲解 father-build 打包 `@mgbd`项目的原理；

## father-build项目打包
father-build 打包的目的在于将ts转为cmj规范的js，
tsc配置比较简单：
```js
{
  "compilerOptions": {
    "target": "esnext",
    // 转为cmj规范的js
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["./src"]
}ts

```
然后根目录执行 `tsc --project scripts/father-build/`  即可；

tsc 会打包指定目录下所有的ts，然后按目录原封不动打包到新目录，类似 babel 命令。


## father-build打包原理

`@mgbd` 要分别打包es、cjs 规范的包, 分别打包到 es、lib目录，
然后package.json中通过 这个关联， package.json module 代表最新的es规范，如果没有，打包工具就会去找 main 字段代表的cjs：
```js
{
  "name": "@mgbd/fusion",
  "version": "0.6.20",
  "description": "next增强组件",
  "author": "hz",
  "main": "lib/index.js",
  // 这个关联 es目录
  "module": "es/index.js",
  "types": "es/index.d.ts",
  "files": [
    "lib",
    "es",
    "CHANGELOG.md"
  ]
  }
```

### 启动打包

原来是 `cross-env BUILD_TYPE=lib father-build` 改造后，为 `cross-env BUILD_TYPE=es node ./scripts/father-build/bin/father-build.js`;


### 打包过程要点分析

#### @babel/register的妙用
启动打包后，会执行 buildForLerna ， 函数内执行：
```js
 registerBabel({
    cwd,
    only: CONFIG_FILES,
  });

//   其实就是：
    require('@babel/register')({
    ...babelConfig,
    extensions: ['.es6', '.es', '.jsx', '.js', '.mjs', '.ts', '.tsx'],
    only: only.map(file => slash(join(cwd, file))),
    babelrc: false,
    cache: false,
  });
```
@babel/register 非常有用，它将babel的编译过程集成到 node 的require函数内，
执行 @babel/register 后， 后期所有的 require 会自动编译，
本项目中使用@babel/register的目的在于 在node环境内，要require('.fatherrc.ts')，
经过@babel/register给require集成hoook后，
即可在node cjs的规范环境内 正常执行ts文件。
更多 @babel/register 说明[参考](https://www.ucloud.cn/yun/91786.html)


#### 根据packages遍历执行build
buildForLerna 收集到足够的配置后，然后根据有多少个 packages, 遍历执行 build。

这里有个技巧 process.chdir(pkgPath); 可以将运行目录切换到指定目录，然后执行遍历build。


#### 都是babel打包，没有rollup

如果是es，就执行 await babel({ cwd, rootPath, watch, dispose, type: 'esm', importLibToEs, log, bundleOpts });
如果是cjs，就执行  await babel({ cwd, rootPath, watch, dispose, type: 'cjs', log, bundleOpts });

所以 都是通过babel来编译


#### gulp与babel

这里用了gulp的流来处理；
```js
import vfs from "vinyl-fs";


vfs
// vfs将const srcPath = join(cwd, "src");目录下所有的文件放到管道流中
    .src(src, {
    allowEmpty: true,
    base: srcPath
    })
    .pipe(watch ? gulpPlumber() : through.obj())
    // ts转jsx： 将所有的ts tsx 文件转换为 jsx，并且生成d.ts文件， 后面详细讲解
    .pipe(
    gulpIf(f => !disableTypeCheck && isTsFile(f.path), gulpTs(tsConfig))
    )
    // 通过 gulpLess将 less 转为 css
    .pipe(
    gulpIf(
        f => lessInBabelMode && /\.less$/.test(f.path),
        gulpLess(lessInBabelMode || {})
    )
    )
    // jsx转js：这里匹配到上个步骤【ts转jsx】生成的jsx文件，将jsx转为js
    .pipe(
    gulpIf(
        f => isTransform(f.path),
        through.obj((file, env, cb) => {
        try {
            file.contents = Buffer.from(
            transform({
                file,
                type
            })
            );
            // .jsx -> .js
            file.path = file.path.replace(extname(file.path), ".js");
            cb(null, file);
        } catch (e) {
            signale.error(`Compiled faild: ${file.path}`);
            console.log(e);
            cb(null);
        }
        })
    )
    )
    // 将文件吐出，放到指定目录
    // const targetDir = type === "esm" ? "es" : "lib";
    // const targetPath = join(cwd, targetDir);
    .pipe(vfs.dest(targetPath));
```
这个管道非常像 webpack的 loader 或者说像 rollup 的 resolve hooks ，上个loader处理通过return 交给下一个loader处理。

#### 【ts转jsx】与"jsx": "preserve"

关于上面的【ts转jsx】

gulp的ts组件处理时，要加上下面这个配置，如此之后，将会将ts转为jsx文件，然后通过管道传给下面的 babel处理。
```json
"compilerOptions": {
    "jsx": "preserve",
  },
```

这里非常精彩的地方有两个：
通过gulp流，使用 import gulpTs from "gulp-typescript"; 将ts转为 jsx；
然后使用babel api 生成 js：
```js
  function transform(opts: ITransformOpts) {
    const { file, type } = opts;
    const { opts: babelOpts, isBrowser } = getBabelConfig({
      target,
      type,
      typescript: true,
      runtimeHelpers,
      filePath: slash(relative(cwd, file.path)),
      browserFiles,
      nodeFiles,
      nodeVersion,
      lazy: cjs && cjs.lazy,
      lessInBabelMode
    });
    if (importLibToEs && type === "esm") {
      babelOpts.plugins.push(require.resolve("../lib/importLibToEs"));
    }
    babelOpts.presets.push(...extraBabelPresets);
    babelOpts.plugins.push(...extraBabelPlugins);

    const relFile = slash(file.path).replace(`${cwd}/`, "");
    log(
      `Transform to ${type} for ${chalk[isBrowser ? "yellow" : "blue"](
        relFile
      )}`
    );

    return babel.transform(file.contents, {
      ...babelOpts,
      filename: file.path,
      // 不读取外部的babel.config.js配置文件，全采用babelOpts中的babel配置来构建
      configFile: false,
    }).code;
  }
```


#### 手写babel插件将less转为css路径
第二个精彩的部分在于 手写babel插件，修改 import代码，将import的less路径要改成 css文件路径
在管道流中，利用gulp的less插件转义less文件；
由于gulp对less进行了转义css，
那么原来tsx文件import的less路径要改成 css文件路径，
可以手写一个babel插件来完成,[关于这个插件解释参考 - babel笔记(二)：插件开发]()：
```js
function transformImportLess2Css() {
  return {
      name: 'transform-import-less-to-css',
      visitor: {
          ImportDeclaration(path, source) {
              const re = /\.less$/;
              if(re.test(path.node.source.value)){
                path.node.source.value = path.node.source.value.replace(re, '.css');
              }
          }
      }
  }
}
```



#### 其他文件(图片)保持原样不解析
出了 js、ts、less 文件需要处理， png文件不需要处理，直接原样被打包，这些交给业务项目的编译去打包
```js
import bigimage from "./assert/icon.png"

```

#### 利用gulp管道(pipe)流自动拷贝文件
第三个精彩的部分在于 利用gulp管道(pipe)流 将目录下所有的文件进行了自动拷贝。

关于这点 参考《打包的策略与方式》



### 其他细节

#### 打包概述
项目由 ts、less、文件(含图片)组成，那么打包也是针对这三类进行，
因为是ui框架，因为打包后我们要求原目录结构要保持不变，只是转成es规范，以及对es+的转义；
因此选择gulp，
利用gulp的文件流，来复制整个目录结构以及文件，保持原路径结构不变；
利用gulp的less插件转义less文件；
利用gulp的ts插件 将ts转义jsx，并生成 d.ts、sourcemap(sourcemap可配置，当前没有配置)
当然了这里做了 disableTypeCheck 配置，disableTypeCheck 顾名思义就是 是否禁止类型检测，类型检测一般指ts，
因为babel无法做类型检测，因此无法生成d.ts，也因为ts的特殊性，babel也无法对ts生成sourcemap，
d.ts sourcemap 都是交给tsc去生成的，
然后因为babel强大的最新的es语言插件能力，将高版本的es打包成低版本的js，一般交给babel完成。
如果 disableTypeCheck 了，意思就是不需要 d.ts与sourcemap，那么此时就不需要tsc参与了，
其实也就是不需要gulp的ts插件参与，
只需要babel进行ts转义即可：
关于disableTypeCheck的源码细节：
```js
    const babelTransformRegexp = disableTypeCheck ? /\.(t|j)sx?$/ : /\.jsx?$/;
   

     .pipe(
        gulpIf(f => !disableTypeCheck && isTsFile(f.path), gulpTs(tsConfig))
      )

   function isTransform(path) {
      return babelTransformRegexp.test(path) && !path.endsWith(".d.ts");
    }

        .pipe(
        gulpIf(
          f => isTransform(f.path),
          through.obj((file, env, cb) => {
            try {
              file.contents = Buffer.from(
                transform({
                  file,
                  type
                })
              );
              // .jsx -> .js
              file.path = file.path.replace(extname(file.path), ".js");
              cb(null, file);
            } catch (e) {
              signale.error(`Compiled faild: ${file.path}`);
              console.log(e);
              cb(null);
            }
          })
        )
      )

```
利用babel来转义tsc(当disableTypeCheck为true，不需要类型检测时)或jsx(当disableTypeCheck为false，需要类型检测，由tsc将ts转jsx)为js。

除了ts与less要特殊处理外，其他文件(含图片)原地复制过去即可，不用做处理。
这些其他文件(含图片)可由业务项目进行loader处理即可。

当然了，如果嫌麻烦，ts、less 也都不用处理，可以交给外部的业务项目去处理，
但这样的话业务项目的编译量就大了，编译速度会减速非常明显。


#### disableTypeCheck
disableTypeCheck 类型检查，参考上面的《打包概述》

<!-- disableTypeCheck -->

我们不是业务项目打包，所有不用打包成单页面文件


#### 打包的套路： 
ts 生成 d.ts、sourcemap, babel用来打包代码；
[参考](https://juejin.cn/book/7047524421182947366/section/7048282320230416395)



#### rimraf.sync
用来删除 `rimraf.sync(join(cwd, 'dist'));`

#### ts.readConfigFile 读取ts配置
ts.readConfigFile 读取ts配置


### lerna
只需要 lerna.json 空的即可，使用这个，是为了触发判断，走buildForLerna, 实际上 father-build 内部没有使用 lerna.json 逻辑：
```js
  const useLerna = existsSync(join(opts.cwd, 'lerna.json'));
  const dispose = isLerna ? await buildForLerna(opts) : await build(opts);
```
只是在打包的时候，引用了一个`import { getPackages } from '@lerna/project';`，用这个其实也就是简单用来获取 各个package下的package.json, 应该是可以取代的。

因此本ui项目打包实际上几乎没有用到 lerna。


### rollup
虽然 father-build 有很多rollup的代码，但本ui项目没有使用，rollup，
不过 rollup确实发挥了大道至简的原理，其配置相比webpack可能要简单点，
可以尝试用用rollup，其编译原理、插件模式 与webpack都有共通之处，
如果你会了webpack，并且阅读过webpack源码，那么学习rollup就会非常快，
好比学了react，学vue一样。

#### rollup demo
[rollup的demo仓库]()，以后自己玩rollup，可以用这个

## 打包的策略与方式

### 几种不同类型项目
业务项目打包 
ui组件库打包 如ant-design
ui工具库打包 如ajax业务封装等等
脚手架打包 如umi

### 不同类型项目打包目标不同

#### 业务项目打包
以上业务项目打包，是单页面打包，大多使用webpack、rollup 将所有的源码打包成一个单独的js【不考虑代码分割插件】，我们接触最多，这里不多说;

#### ui组件库、ui工具库
ui组件库、ui工具库 这类相似，属于浏览器端使用的组件或工具，为了方便调试代码，也为了进行treeshaking，
打包的时候要求保持源码目录结构一致。

为了提高被引用时 业务项目的编译速度，或者避免由于高版本的es+，导致业务项目的webpack ast解析报错:
>注意不是 业务项目的babel ast解析报错，
因为业务项目使用webpack转义代码时，会进行两次的ast解析，第一次是babel ast解析，然后将ast源码交给webpack，webpack再做第二次ast解析，
如果忽略了第三方包的babel-loader，那么就不会babel ast解析，直接交给webpack ast解析，不经过babel解析时，高版本的es+ 可能会让webpack ast报错，

为了达到以上目的，我们需要对此类库，要保持源码目录结构，进行ts转js，且进行高版本es+转低版本的js，以及对预编译样式文件（scss\less）的转义为css；

另外，有些ui工具库打包如一些sdk，要求以命名空间方式使用，这些可以使用各个编译工具的umd模式即可。

#### 脚手架打包
脚手架打包，这个比较简单，因为脚手架都是运行在 node环境上，
如果脚手架是js写的，可不用打包，直接发布即可；
简单的脚手架直接使用js也是一个好选择，方便调试【当然了，ts也可以生成sourcemap调试】；
如果是ts写的，那么用tsc或者上面的babel进行转js【因为node无法直接运行ts文件，虽然可以用esno包，单那是个盲盒，万一出问题不好排查】
有些脚手架涉及到 tsx或jsx，比如 umi，不过umi以及通过传送门将这些文件动态复制到.umi目录下，
直接交给业务项目的打包实现，不需要脚手架打包处理。

 
说起来 ui组件库打包 要注意更多，所以单独讲讲 ui组件库打包。
### ui组件库打包更多说明
基于 ui组件库打包 的目标，我们可以使用本文讨论的 gulp+gulp的less\scss插件+tsc+babel 的方式；

也可以 直接使用babel命令(+tsc命令) + 手写一个复制脚本，将所有非js、ts文件复制到新的目录中。
这种方式中，如果不考虑 样式文件less、scss的转换，d.ts生成，那么更简单了，
直接使用 babel 命令进行转义，然后手写一个复制脚本，即可解决。

因为一旦涉及到 less、scss的转换，就需要改动源码，将原来的less、scss文件路径改成 css文件路径，需要手写一个babel插件来转换路径；
一旦涉及到 d.ts 就要使用 tsc 进行编译。


以上是生产打包，下一篇接着讲本ui库的本地打包与启动。
