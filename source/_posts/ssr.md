---
title: 掘金小册笔记：服务端渲染ssr
date: 2023/06/25
tags: ssr
categories: 
- ssr
---


这是一篇掘金小册ssr册子的阅读笔记，

## 同构：
前后端使用同一套代码；
这里涉及到一个技术实现细节，
- 服务端使用babel，客户端使用webpack
后端代码通过babel实现，将es转为js；
前端代码通过webpack全部打包到一个index.js文件中；
- 服务端运行依赖node_modules，客户端将node_modules打包到index.js中
后端代码通过babel转义js后，babel并没有能力向webpack一样实现一套 import能力，因此经过编译后，其代码最终是采用
common.js形势：
```js
var _react = _interopRequireDefault(require("react"));
```
参考[better分支下的` `koa-react-ssr/packages/my-react-ssr](https://github.com/YeWills/koa-react-ssr/tree/better/packages/my-react-ssr)

## 服务端不实现事件绑定
服务端不实现事件绑定，只用于静态页面html直出；
事件绑定交给客户端去实现

## 对比能力，复用节点，避免一闪的问题
react会读取页面当时的dom，进而计算出dom节点，计算出一套虚拟dom对象。
然后react根据路由，计算客户端的虚拟dom对象，根据两边的对象，做最小的 patch，而不是粗暴的直接卸载。
然后对虚拟dom进行事件绑定。
这样就不会让页面出现一闪的情况（先渲染出服务端的页面，然后客户端不做对比，全部替换为客户端页面）。


## 经典demo

参考[ssr渲染demo](https://github.com/YeWills/koa-react-ssr/tree/better/packages/my-react-ssr)
该demo够简单，运行起来后，马上可直观感受ssr。

## 客户端与服务端ajax区别和跨端ajax
- 客户端可以使用 fetch，但fetch是一个浏览器api，服务端不能用；
所以需要一个能跨两端都能用的，比如axios；
- 服务端渲染请求，在浏览器端会自动默认带上当前的location.origin作为baseURL，在服务端则要 自己写；

## 为什么服务端无法执行didMount生命周期
为什么服务端渲染 didmount生命周期不执行，因为这个是dom完成的时候执行，服务端只负责html静态页面生成，不能无法操作dom节点；
但服务端可以执行render 这些生成 虚拟dom节点的生命周期，而didmount应该是执行 dom patch 的一些操作。

## 为什么不需要启动客户端服务器
服务端渲染，为什么不需要启动客户端服务，只需要启动一个服务端接口就行，
这是因为，客户端代码，已经编译成静态文件，
服务端直出的页面，通过静态链接引入了文件：
```js
  
     //将预取数据在这里传递过去 组内通过props.staticContext获取
    const context = {
        initialData: fetchResult
    };
    const html = renderToString(<StaticRouter location={path} context={context}>
        <App routeList={routeList}></App>
    </StaticRouter>);

    //静态资源 客户端编译好的代码
    const assetsMap = getAssets();

    ctx.body = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${tdk.title}</title>
    <meta name="keywords" content="${tdk.keywords}" />
    <meta name="description" content="${tdk.description}" />
     ${assetsMap.css.join('')}
</head>
<body>
    <div id="root">
       ${html}
    </div>
    <textarea id="ssrTextInitData" style="display:none;">
    ${JSON.stringify(fetchResult)}
    </textarea>
</body>
</html>
 ${assetsMap.js.join('')}
`;
     
```
### 弊端
这样有个弊端，每次都需要将代码编译到硬盘上；
每次编译完后，都需要重载或刷新页面，这样才能请求到最新代码

## 客户端编译没有html
服务端渲染有个特点 客户端编译只需编译生成js代码，不需要html，
Html交给了服务端；

## 为什么客户端编译 webpack-dev-server 和 webpack 要设置为`http://localhost:9002/`
 [demo地址 my-react-ssr-HMR ](koa-react-ssr/packages/my-react-ssr-HMR) 
编译客户端代码时，要保证webpack编译文件时，publicpath 设置为 `http://localhost:9002/`, 
同时也要保证webpack-dev-server 服务器的 publicpath 设置为 `http://localhost:9002/`
这是因为 webpack-dev-server 的websocket通讯要读取这两个配置，
由于我们这里奇特的服务端设计，我们页面的主域名是挂载在 `http://localhost:9001/`下，
而静态文件都是配置在 `http://localhost:9002/`下，所以 publicpath 不能单纯的设置为普通绝对路径，必须带上域名，以便 ws 能够正常找寻通讯，
如果都是配置成普通的 publicpath，比如 `/`,则正常渲染没有问题，当修改文件时，热更新ws通讯就会报错，找不到文件：
```js
log.js:26 [HMR] Update failed: Error: Manifest request to /a08be0b8ecc2cf4d8f71.hot-update.json failed.
    at request.onreadystatechange (http://localhost:9002/main.js:99:22)
module.exports @ log.js:26
eval @ dev-server.js:46
Promise.catch (async)
check @ dev-server.js:36
eval @ dev-server.js:55
emit @ events.js:153
reloadApp @ reloadApp.js:23
ok @ client:119
eval @ socket.js:47
sock.onmessage @ SockJSClient.js:67
EventTarget.dispatchEvent @ sockjs.js:170
eval @ sockjs.js:885
SockJS._transportMessage @ sockjs.js:883
EventEmitter.emit @ sockjs.js:86
WebSocketTransport.ws.onmessage @ sockjs.js:2958
sockjs.js:1681 WebSocket connection to 'ws://localhost:9002/sockjs-node/063/2vnv2rby/websocket' failed: 
WebSocketBrowserDriver @ sockjs.js:1681
WebSocketTransport @ sockjs.js:2955
SockJS._connect @ sockjs.js:826
SockJS._receiveInfo @ sockjs.js:800
g @ sockjs.js:66
EventEmitter.emit @ sockjs.js:86
eval @ sockjs.js:562
g @ sockjs.js:66
EventEmitter.emit @ sockjs.js:86
eval @ sockjs.js:371
g @ sockjs.js:66
EventEmitter.emit @ sockjs.js:86
xhr.onreadystatechange @ sockjs.js:1595
client:172 [WDS] Disconnected!
```

## 按需加载与服务端渲染
以 [「装修阶段」- 基于路由的按需渲染](https://juejin.cn/book/6844733810941100045/section/6844733810995642376 )章节和代码作为参考。
按照正常的按需加载配置后，
需要将服务端渲染的的路由全部转化为静态路由，利用的知识点是 所有的import其实就是Promise，
通过Promise.then.default可对组件进行替换或修改。
```js
  if (checkIsAsyncRoute(item.component)) {
            staticRoutes.push({
                ...item,
                ...{
                    component: (await item.component().props.load()).default
                }//调用下load方法得到返回值即可
            });
        } else {
            staticRoutes.push({
                ...item
            });
        }
```
需要对客户端对应匹配到页面地址的组件进行预加载，同样是使用上述的 component().props.load() 方式。
由于考虑双端渲染比对问题，也需要将客户端组件从动态变成静态组件，方法和服务端原理一致：
```js
   //等待异步脚本加载完成
    if (targetRoute.component[proConfig.asyncComponentKey]) {
            targetRoute.component().props.load().then(res => {
                    //异步组件加载完成后再渲染页面
                    console.log('异步组件加载我能成.....');
                    // 将动态组件 替换成静态组件，避免 服务端直出内容 与 服务端直出内容比对失败
                    targetRoute.component = res.default;

                    renderDom(routeList);
            });
    }
```

### import的本质
参考上述

### 通过import进行路由组件替换
参考上述

### 动态组件变成静态组件的方案
参考上述

### import与预加载
只要import了组件，才会通过异步请求组件js，就是加载了组件，达到了预加载。

### 按需加载的本质
按需加载的本质，其实就是写一个组件，只有当组件被渲染时，才真正异步加载对应的组件js，没有渲染的时候，不预先进行 import，达到不加载组件js：
```js

import React from 'react';
import LoadingCompoent from './loading-compoent';

/**
 * 动态加载组件一个组的容器
 *
 * @class Bundle
 * @extends {Component}
 */
export default class AsyncBundle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mod: null
        };
    }

    componentDidMount() {
        if (!this.state.mod) {
            this.loadComp(this.props);
        }
    }

    loadComp(props) {
        this.setState({
            mod: null
        });
        //注意这里，使用Promise对象; mod.default导出默认
        // 只有当组件被渲染时，才真正异步加载对应的组件js
        props.load().then((mod) => {
            this.setState({
                mod: mod.default ? mod.default : mod
            });
        });
    }

    render() {
        return this.state.mod ? this.props.children(this.state.mod) : <LoadingCompoent/>;
    }
}

```

### 调试
可通过`targetRoute.component[proConfig.asyncComponentKey]` 以及 动态组件(async-bundle)内 使用debugger 可以直观看到 import 的时候会如何进行异步js请求，以及渲染的情况



### 关于本章节项目的讲解补充：
>【另外客户端渲染也需要注意，需使用预加载，等异步组件加载完成再进行DOM的挂载，否则会出现客户端覆盖服务端渲染的问题。】本节最后一句描述不准确，
因为客户端渲染的时候，虽然使用了预加载，在客户端第一次react渲染前，加载好组件js，解决了ajax请求组件js时间，优化了体验。
但是服务端组件直出的是完整的组件html内容，而客户端第一次渲染的是 loading 组件，
双端比较失败，页面会使用 loading 来覆盖服务端内容；
然后组件执行 componentDidMount 生命周期，页面this.setState({mod})，
此时才显示完整的组件html内容。
以上现象可通过`targetRoute.component[proConfig.asyncComponentKey]` 以及 动态组件内 使用debugger 复现现象。
所以本节最后一句应该改为如下更加贴切：
【另外客户端渲染也需要注意，需使用预加载，等异步组件加载完成再进行DOM的挂载，否则会出现客户端先显示loading，再显示组件内容，一闪的问题】
>虽然无法解决双端比较失败的问题，但因为服务端直出的是最终组件要渲染的内容；
又由于客户端使用预加载技术提前加载好了对应组件的js；
因此在客户端渲染时，避免了再次异步加载组件js，极大影响体验，只是纯js的dom渲染，几乎可以避免看到一闪的现象，体验尚可。
这里的优化点时，通过方法，在执行 componentDidmount前，让mod有值，直接去渲染组件实际内容，而不是先渲染loading，再渲染 组件实际内容,
楼下的@地之鸿的评论解决了这个问题：
```js
// 等待异步脚本加载完成
if (targetRoute.component[proConfig.asyncComponentKey]) {
targetRoute.component().props.load().then(res => {
// 把异步组件变成公布组件
targetRoute.component = res.default;
// 异步组件加载完成后再渲染页面
renderDom();
});
}
```
完美解决了这个问题


## 关于小册需要解决问题：
启动项目后，修改代码，代码热重载后，报错 ws连接问题，从【第12：「装修阶段」- 双服务模式热更新 开始就有这个问题】，但貌似对热更新不影响
```js
sockjs.js:1681 WebSocket connection to 'ws://localhost:9002/sockjs-node/445/ulq5r1xb/websocket' failed: 
WebSocketBrowserDriver @ sockjs.js:1681
WebSocketTransport @ sockjs.js:2955
SockJS._connect @ sockjs.js:826
SockJS._receiveInfo @ sockjs.js:800
g @ sockjs.js:66
EventEmitter.emit @ sockjs.js:86
eval @ sockjs.js:562
g @ sockjs.js:66
EventEmitter.emit @ sockjs.js:86
eval @ sockjs.js:371
g @ sockjs.js:66
EventEmitter.emit @ sockjs.js:86
xhr.onreadystatechange @ sockjs.js:1595
client:172 [WDS] Disconnected!
```


### 使用popstate方法处理后退路由后，数据不更新问题
```js
window.addEventListener('popstate', ()=>{
      // 使用popStateFn保存函数防止addEventListener重复注册
    if (_this && _this.getInitialProps) {
        console.log('popStateFn');
        _this.getInitialProps();
    }
});
```