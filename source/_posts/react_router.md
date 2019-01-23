---
title: React Router
date: {{ date }}
tags: react
categories: 
- react
- React Router
series: 前端框架
---


## React Router常见知识

### HashRouter 还是 BrowserRouter 以及 Router  Route 讲解
简言之如果项目服务端做了服务端渲染，可以选择BrowserRouter，否则请选择HashRouter，因此一般项目都是HashRouter，因为大多项目么有做服务端渲染。
详细见下面（还讲了：利用服务器解析机制，服务器不会解析路由#以后的部分）：
摘自《React 实战：设计模式和最佳实践》第15章；
react-router 的工作方式，是在组件树顶层放一个 Router 组件，然后在组件树中散落着很多 Route 组件（注意比 Router 少一个“r”），顶层的 Router 组件负责分析监听 URL 的变化，在它保护伞之下的 Route 组件可以直接读取这些信息。

很明显，Router 和 Route 的配合，就是之前我们介绍过的“提供者模式”，Router 是“提供者”，Route是“消费者”。

更进一步，Router 其实也是一层抽象，让下面的 Route 无需各种不同 URL 设计的细节，不要以为 URL 就一种设计方法，至少可以分为两种。

第一种很自然，比如 / 对应 Home 页，/about 对应 About 页，但是这样的设计需要服务器端渲染，因为用户可能直接访问任何一个 URL，服务器端必须能对 /的访问返回 HTML，也要对 /about 的访问返回 HTML。

第二种看起来不自然，但是实现更简单。**只有一个路径 /，通过 URL 后面的 # 部分来决定路由，/#/ 对应 Home 页，/#/about 对应 About 页。因为 URL 中#之后的部分是不会发送给服务器的，所以，无论哪个 URL，最后都是访问服务器的 / 路径，服务器也只需要返回同样一份 HTML 就可以，然后由浏览器端解析 # 后的部分，完成浏览器端渲染。**

在 react-router，有 BrowserRouter 支持第一种 URL，有 HashRouter 支持第二种 URL。

因为 create-react-app 产生的应用默认不支持服务器端渲染，为了简单起见，我们在下面的例子中使用 HashRouter，在实际产品中，其实最好还是用 BrowserRouter，这样用户体验更好。

修改index.js文件，增加下面的代码：
```
import {HashRouter} from 'react-router-dom';

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('root')
);
```
把 Router 用在 React 组件树的最顶层，这是最佳实践。因为将来我们如果想把 HashRouter 换成 BrowserRouter，组件 App 以下几乎不用任何改变。

### 带#与不带#的路由的区别
利用服务器解析机制，服务器不会解析路由#以后的部分，详细见本章第《HashRouter 还是 BrowserRouter 以及 Router  Route 讲解》

### Switch
摘自《React 实战：设计模式和最佳实践》第15章；
我们来看 Content 这个组件，这里会用到 react-router 最常用的两个组件 Route 和 Switch。
```
const Content = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/about' component={About}/>
    </Switch>
  </main>
)
```
Route 组件的 path 属性用于匹配路径，因为我们需要匹配 / 到 Home，匹配 /about 到 About，所以肯定需要两个 Route，但是，我们不能这么写。
```
      <Route path='/' component={Home}/>
      <Route path='/about' component={About}/>
```
如果按照上面这么写，当访问 /about 页面时，不光匹配 /about，也配中 /，界面上会把 Home 和 About 都渲染出来的。

解决方法，可以在想要精确匹配的 Route 上加一个属性 exact，或者使用 Switch 组件。

可以把 Switch 组件看做是 JavaScript 的 switch 语句，像这样：
```
switch (条件) {
  case 1: 渲染1; break;
  case 2: 渲染2; break;
}
```
从上往下找第一个匹配的 Route，匹配中了之后，立刻就 break，不继续这个 Switch 下其他的 Route 匹配了。

可以看到，react-router 巧妙地用 React 组件实现了路由的所有逻辑，印证了那句话：React 世界里一切都是组件。

### 动态路由
摘自《React 实战：设计模式和最佳实践》第15章；
在了解了 react-router的基本路由功能之后，再来理解“动态路由”就容易了。

假设，我们增加一个新的页面叫 Product，对应路径为 /product，但是只有用户登录了之后才显示。如果用静态路由，我们在渲染之前就确定这条路由规则，这样即使用户没有登录，也可以访问 product，我们还不得不在 Product 组件中做用户是否登录的检查。

如果用动态路由，则只需要在代码中的一处涉及这个逻辑：

    <Switch>
      <Route exact path='/' component={Home}/>
      {
        isUserLogin() &&
        <Route exact path='/product' component={Product}/>,
      }  
      <Route path='/about' component={About}/>
    </Switch>
可以用任何条件决定 Route 组件实例是否渲染，比如，可以根据页面宽度、设备类型决定路由规则，动态路由有了最大的自由度。