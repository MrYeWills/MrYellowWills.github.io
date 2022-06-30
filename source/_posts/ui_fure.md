---
title:  ui组件库系列(四):发布、ui项目架构、小结
date: 2022/6/30
tags: [ui组件库]
categories: 
- ui组件库
series: ui组件库
---


前面讲了项目的 本地编译启动调试、生产编译，接着讲发布。
发布最重要的功能是 npm版本管理 以及npm publish。

## 发布

### 过程
关于发布这块，做的比较好的，可以看 umi的release，参考[umi系列(四)：npm script命令  -- pnpm release]()。
一般公司用，可以做下以下，有精力可以更加完善，
云谦说过，他做脚手架这么多年沉淀下来的经验有，这里展示部分，这段话的出处找不到了，应该在umi相关的演讲、文档内：
- monorepos；
- 所有pkg包共用一个版本；
- 默认最新，启动项目，默认提示升级到最新版本；

本次ui库的方案与上述的第二点不一致，但无伤大雅；
第三点是脚手架框架的要求，与ui框架无关。

下面列举本次ui库做的内容，详细可参考 publish.js:

遍历各个pkgs，讲所有的pkg全部列出，
提示选择要发布的包
提示要发布的平台(npm 源)
提示输入版本更新的内容说明
提示输入发布的版本号(校验版本号)

执行npm publish 发布
根据是否有beta设置更多发布参数

发布成功后
更新对应pkg包(主要是版本号)
更新版本发布的记录文件

将以上内容做提交
提交前，
提示检查内容，
确定无误后，确认提交，
自动提交git仓库


### 技术点
#### prompt的验证
```js
  const promptList2 = v => {
    return [
      {
        type: 'input',
        message: '请输入发布后的版本号：',
        name: 'version',
        default: v,
        validate(val) {
          const rep = new RegExp(/^([1-9]\d|[0-9])(\.([1-9]\d|\d)){2}$/);
          if (val.indexOf('beta') !== -1) {
            return true;
          } else if (rep.test(val)) {
            return true;
          } else {
            return '请输入正确的版本格式';
          }
        },
      },
    ];
  };

   const { version, des } = await prompt(promptList2(pckJson.version));
```


#### npm publish的beta处理

```js
  const publishNpmArgs = ['publish', '--registry', 'https://registry.npmjs.org/'];
    if (pckJson.version.indexOf('beta') !== -1) {
      publishNpmArgs.push('--tag');
      publishNpmArgs.push('beta');
    }
    const result = spawn.sync('npm', publishNpmArgs, {
      stdio: 'inherit',
      cwd: packageObj[package1],
    });
```




## ui项目架构

### 文档站点项目是用md来写页面
首先一定要明确认知到，本ui项目就是一个文档站点项目，而不是传统的业务jsx项目。
将以上定位认识清楚，非常必要。

传统业务项目与文档站点项目 其实同属于 页面系统项目。

只是二者的文件类型不一样，文档站点项目是用md来写页面，传统业务项目是用jsx来写页面。


### 当有编译器(loader)，将md编译成jsx
所有的非传统业务项目，最终将转化成传统业务项目来解析。
所以，当有一个编译器，可以将md编译成jsx，那么 文档项目也变成了传统的业务jsx项目了。

所以本ui项目，其实就是 写了一个 md转义器，此时，你把所有的md文件看出jsx文件，
那么本ui项目将于传统项目无异。

dumi的源码没有非常细节的去看，不过其大致实现细节，与umi4的文档插件@umijs/plugin-docs一样。

去看 @umijs/plugin-docs 的源码，就知道，

@umijs/plugin-docs 写了一个loader，获取所有的md文件，转义成jsx语法后，再转发给 babel-loader 转义成低版本js，
最终渲染。
下面是 @umijs/plugin-docs 部分源码,详细参考[umi系列(八) 文档插件 - 以 mdx 的方式来写文档]()：
```js
{
    "test": "/\\.mdx?$/",
    "use": [{
      "loader": "D:\\git\\umi\\umi-next\\packages\\plugin-docs\\dist\\loader.js"
    }],
  }

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

这就像，你写的是 scss文件，经过scss-loader 转后，再给 css-loader,
虽然你写的是 scss less xxxcss xxyy任何后缀名都可以的文件，其实就是写css；
其原理是一样的。

### 纯正的umi项目
本ui项目 就是 dumi + @umijs/preset-dumi 的项目；
由于dumi只是做了 umi的转发之前，集成了@umijs/preset-dumi；
所以本项目 其实就是 umi+@umijs/preset-dumi。

我们将所有的md文件当jsx来认， @umijs/preset-dumi 是不是一下子觉得这就是一个很纯正简单的umi项目。

相当于本项目，通过 umi dev 启动；
通过 @umijs/preset-dumi 实现 md 转 jsx 的loader；
除此之外的路由、编译配置、开发启动、项目结构 全部就是通用的 umi逻辑。


## ui项目小结

本ui项目 采用了monorepos模式；
npm版本管理上，采用的是非统一版本方式，后期如果相互引用的pkg较多时，采用统一版本管理比较好；
目前采用统一版本管理的有 umi、babel 等库；
开发编译直接用umi；
生产编译使用father-build；
开发、生产编译用的不是同一套配置，这点好处值得待定。
>不过这点也与ui框架的场景有关：
如果是公司内部的组件二次封装；
如果公司的业务项目编译没有忽略 node_module 编译；
那么这样是没有问题的，毕竟最后都要交给业务项目外层再编译一次。


一个组件库的开发，
- 方案上最难的是诸如monorepos模式等的选择；
- 技术上最难的是编译(自动化构建),搞定编译原理，游刃有余；







