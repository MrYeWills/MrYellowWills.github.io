---
title: umi系列(七) 插件、hooks
date: 2022/5/24
tags: umi
categories: 
- 前端工具
series: 基建
---



记录 各个配置对应的源码位置

## 参考

### 文档

## 待研究

参考 《api.register api.registerMethod》



## applyPlugins register registerMethod

以上三个api使用方法，参考官网；

register 类似 tapable 的 tap；
applyPlugins 类似 tapable 的 call；

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



### 可通过两种方式注册 fn 也就是上面说的事件

#### api.register api.registerMethod

```js
api.register({
  key: 'foo',
  fn() {
    return 'a';
  },
});
```

<!-- todo 待研究-->
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
          this.register({
            key: opts.name,
            ...(lodash.isPlainObject(fn) ? (fn as any) : { fn }),
          });
        },
    };
  }
```

 当前存疑的是，比如 `packages\preset-umi\src\registerMethods.ts` 中,已经进行注册。
 ```js
 [    'modifyRendererPath',
    'modifyRoutes',
  ].forEach((name) => {
    api.registerMethod({ name });
  });
 ```
 但在调试中 `packages\core\src\service\service.ts` 的 this.hooks中 没有 modifyRendererPath 。

#### `api[key](fn)` 待研究
为什么可以注册！！！
<!-- todo -->
```js
api.foo(() => {
    return [];
  });
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



疑问：


如何定义 这个 modifyRendererPath ，
是通过 这种方式：

subcribe{

key:'modifyRendererPath',
fn:t=>t

}

还是
 api.modifyRendererPath(() =>
    dirname(require.resolve('@umijs/renderer-vue/package.json')),
  );
  
  
如何触发这个 modifyRendererPath ，

api.applyPlugins({
          key: 'modifyRendererPath',
          initialValue: dirname(
            require.resolve('@umijs/renderer-react/package.json'),
          ),
        }),
		
还是


#### api.modifyRendererPath

>modifyRendererPath
修改 renderer path。传入的 fn 接收原本的 path （string 类型）并且返回它。

 api.modifyRendererPath(() =>
    dirname(require.resolve('@umijs/renderer-vue/package.json')),
  );
