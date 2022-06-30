---
title: umi系列(七) 插件、hooks
date: 2022/5/24
tags: umi
categories: 
- umi系列
series: 基建
---



记录 各个配置对应的源码位置

## 参考

### 文档

## 待研究

参考 《api.register api.registerMethod》





## 对象

### hook

但是插件的代码本质其实只是调用 api 进行各种 hook 的注册，而 hook 的执行并非在此阶段执行，因此这里叫插件的注册

modifyAppData hook
onCheck hook
onStart hook

所以，文档中说的hook，其实就是 插件api文档上说的 扩展方法


### 扩展方法
与 hook 同义


### api 上注册一个方法


register() 注册的 hooks 供 applyPlugins 使用
registerMethod() 接收一个 key 和 一个 fn，它会在 api 上注册一个方法
Umi 提供给插件的 api (PluginAPI), 绝大多数都是依靠 registerMethod() 来实现的


## 插件机制(以addLayouts为例)

### addLayouts为例
在这里 `packages\preset-umi\src\registerMethods.ts` 注册；
```js
 [
    'addLayouts',
  ].forEach((name) => {
    api.registerMethod({ name });
  });
```

在这里 `packages\preset-umi\src\features\tmpFiles\routes.ts` 调用
```js
  const layouts = await opts.api.applyPlugins({
    key: 'addLayouts',
    initialValue: [
      existsSync(absLayoutPath) && {
        id: '@@/global-layout',
        file: absLayoutPath,
      },
    ].filter(Boolean),
  });
```

在这里  `packages\plugin-docs\src\index.ts` 注入事件
```js
  api.addLayouts(() => {
    return [
      {
        id: 'docs-layout',
        file: withTmpPath({ api, path: 'Layout.tsx' }),
      },
    ];
  });
```

### applyPlugins register registerMethod 前置知识
register 与 applyPlugins 前置知识：[参考 Umi 插件的机制及其生命周期 - register() 、 registerMethod() 以及 applyPlugins()](https://next.umijs.org/zh-CN/docs/guides/plugins#umi-%E6%8F%92%E4%BB%B6%E7%9A%84%E6%9C%BA%E5%88%B6%E5%8F%8A%E5%85%B6%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)

### on modify add 事件key区别
register 接收key，给此key标识注册 事件；

applyPlugins 接收key，触发此key标识下的所有事件；

并且根据 key 的写法不同分为三类:
```js
// packages\core\src\service\service.ts
 if (!type) {
      if (opts.key.startsWith('on')) {
        type = ApplyPluginsType.event;
      } else if (opts.key.startsWith('modify')) {
        type = ApplyPluginsType.modify;
      } else if (opts.key.startsWith('add')) {
        type = ApplyPluginsType.add;
      } else {
        throw new Error(
          `Invalid applyPlugins arguments, type must be supplied for key ${opts.key}.`,
        );
      }
    }
```
applyPlugins 执行事件的结果为：
>[然后通过 api.applyPlugins 即可拿到 ['a', 'b']](https://umijs.org/zh-CN/plugins/api#register-key-string-fn-function-pluginid-string-before-string-stage-number-)



### 可通过三种方式注册

#### api.register

```js
api.register({
  key: 'foo',
  fn() {
    return 'a';
  },
});
```

#### api.registerMethod 方式一
```js
// 原理与上 api.register 相同
api.registerMethod({
  name: 'foo',
  fn() {
    return 'foo';
  },
  exitsError: false,
});
```

api.registerMethod 其源码在，
```js
// packages\core\src\service\pluginAPI.ts
  registerMethod(opts: { name: string; fn?: Function }) {
    assert(
      !this.service.pluginMethods[opts.name],
      `api.registerMethod() failed, method ${opts.name} is already exist.`,
    );
    this.service.pluginMethods[opts.name] = {
      plugin: this.plugin,
      fn:
        opts.fn ||
        // 这里不能用 arrow function，this 需指向执行此方法的 PluginAPI
        // 否则 pluginId 会不会，导致不能正确 skip plugin
        function (fn: Function | Object) {
          // @ts-ignore
          // // 原理与上 api.register 相同，因为 registerMethod 最终走到 register
          this.register({
            key: opts.name,
            ...(lodash.isPlainObject(fn) ? (fn as any) : { fn }),
          });
        },
    };
  }
```

#### api.registerMethod 方式二
api.registerMethod 注册的时候，没有定义fn，此时可通过 `api[key](fn)` 的方式。
```js
// 原理与上 api.register 相同
api.registerMethod({
  name: 'foo',
});
```

其原理是， `api[key]` 中的 api 就是 proxyPluginAPI 对象。
```js
// packages\core\src\service\pluginAPI.ts
  static proxyPluginAPI(opts: {
    pluginAPI: PluginAPI;
    service: Service;
    serviceProps: string[];
    staticProps: Record<string, any>;
  }) {
    return new Proxy(opts.pluginAPI, {
      get: (target, prop: string) => {
        // api[key] 时，最终去 opts.service.pluginMethods 寻找
        if (opts.service.pluginMethods[prop]) {
          return opts.service.pluginMethods[prop].fn;
        }
      ....
      },
    });
  }
```

而 `opts.service.pluginMethods` 就是 第一步 registerMethod 创建的。
```js
// packages\core\src\service\pluginAPI.ts
  registerMethod(opts: { name: string; fn?: Function }) {
    this.service.pluginMethods[opts.name] = {
      fn:
        opts.fn ||
        function (fn: Function | Object) {
        this.register({
            key: opts.name,
            ...(lodash.isPlainObject(fn) ? (fn as any) : { fn }),
          });
        },
    };
  }
```

### modifyRendererPath示例

#### api.applyPlugins({key: 'modifyRendererPath'})
```js
 const rendererPath = winPath(
        await api.applyPlugins({
          key: 'modifyRendererPath',
          initialValue: dirname(
            require.resolve('@umijs/renderer-react/package.json'),
          ),
        }),
      );
```

如上，想获取 rendererPath 路径，
然后触发 一个hooks或plugin 【modifyRendererPath】，
modifyRendererPath 语义看出是 修改rendererPath路径；

也就是说，umi 定义了插件的 扩展方法 modifyRendererPath ；

### 彩蛋：插件的 id 和 key

[参考 插件的 id 和 key](https://next.umijs.org/zh-CN/docs/guides/plugins#%E6%8F%92%E4%BB%B6%E7%9A%84-id-%E5%92%8C-key)

### 彩蛋：插件的配置
在配置里通过 presets 和 plugins 配置插件，比如：
[参考 插件的配置](https://next.umijs.org/zh-CN/docs/guides/plugins#%E9%85%8D%E7%BD%AE)
```js
export default {
  presets: ['./preset/foo','bar/presets'],
  plugins: ['./plugin', require.resolve('plugin_foo')]
}
```
配置的内容为插件的路径。
