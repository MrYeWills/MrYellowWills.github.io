---
title: React Router
date: 2020/5/1
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

### url中添加参数的两种模式
#### ？与 分段路由
![](/image/router/params.png)

上面第一种模式，我们很熟悉了，不再举例。
其实第二种模式，我们一直在用，只是没意识到，第二种模式 定义如下：

```js
 <BrowserRouter>
    <Switch>
      <!-- 第二种模式  -->
      <Route path="/detail/:touristRouteId" component= {DetailPage} />
      />
    </Switch>
  </BrowserRouter>
```

#### 适用场景

第二种模式 是restful思维，每个资源有唯一id，很适合详情页面路由配置。

## 核心概念及原理
### match location history
#### 概述
以上三者是 react-router的核心三大对象。
match 是url的匹配结果
location 是当前路由的信息状态
history 是history是router核心，通过 history.push 等方法实现也前进后退 等等功能
#### 都是基于组件，而非页面
要非常注意一点，上面三大对象，针对的是 组件层面上的， 而非页面层级的。
因为上面三大对象，都是定义在 组件的props上。

因为一个页面路由下，可能会匹配多个 Route，比如下面情况：
```js
// http://127.0.0.1:4000/signIn 将匹配 path="/" path="/signIn" 两个
<BrowserRouter>
    <Route exact path="/" component={HomePage} />
    <Route path="/signIn" component={SignInPage} />
    <Route path="/register" component={RegisterPage} />
    <Route path="/detail/:touristRouteId" component={DetailPage} />
</BrowserRouter>
```
这两个组件三大路由对象中的match打印值都不一样：
```js
<Route exact path="/" component={HomePage} /> 中的 HomePage组件的props中路由对象的match
{
  isExact: false,  //当前页面路由http://127.0.0.1:4000/signIn是否与该组件的路由 全匹配
  params:{}, //页面传参
  path: '/', //匹配到的path，通常是本组件定义的路由
  url: '/',//匹配到的path，通常是本组件定义的路由
}
```
```js
<Route path="/signIn" component={SignInPage} /> 中的SignInPage组件的props中路由对象的match
{
  isExact: true,  //当前页面路由http://127.0.0.1:4000/signIn是否与该组件的路由 全匹配， 比如输入
  params:{}, //页面传参
  path: '/signIn', //匹配到的path，通常是本组件定义的路由
  url: '/signIn',//匹配到的path，通常是本组件定义的路由
}
```
#### match
参考上面 《都是基于组件，而非页面》

### withRouter为什么能获取到路由三大对象

#### 先看demo
```js
<BrowserRouter>
    <Route exact path="/" component={HomePage} />
    <Route path="/signIn" component={SignInPage} />
</BrowserRouter>
```
```js
// HomePage 组件
import React from "react";
import { Header} from "../../components";
 
export class HomePage extends React.Component {
  render() {
    return (
      <>
      // 引用了 Header 组件
        <Header />
        <div className={styles["page-content"]}>
        </div>
        <Footer />
      </>
    );
  }
}
```
```js
// Header 组件，通过 hooks 获取 路由三大对象
import React from "react";
import { useHistory, useLocation, useParams, useRouteMatch } from "react-router-dom";

export const Header: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  const match = useRouteMatch();
  return (
    <div >
    </div>
  );
};
```

```js
// Header 组件，通过 withRouter hoc 获取 路由三大对象
import { withRouter, RouteComponentProps } from "react-router-dom";
interface PropsType extends RouteComponentProps {
  id: string;
}
const OriginHeader: React.FC<PropsType> = ({
  id,
  history,
  location,
  match
}) => {
  ...
};

export const Header = withRouter(OriginHeader);
```

#### HomePage 为什么可以自动有 路由三大对象
如上面代码，这里的Route 会给 HomePage 自动注入 路由对象。
```js
<Route exact path="/" component={HomePage} />
```

#### 为什么withRouter能拿到 路由对象
我们可以看到，无论是 Header 组件也好， 它们都在 顶级组件BrowserRouter 包裹中：
```js
<BrowserRouter>
    <Route exact path="/" component={HomePage} />
    <Route path="/signIn" component={SignInPage} />
</BrowserRouter>
```
这就好比 react-redux 的 Provider 顶级组件 内部所有子组件公用 context：
```js
import { Provider } from "react-redux";
import store from "./redux/store";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
```

因此BrowserRouter顶级组件做了一层 Provider 的 context, 将三大对象放入此顶级组件的上下文中。
因此 BrowserRouter顶级组件内 所有的子组件，都可以通过 withRouter 或 hoc 获取到该 路由对象

### useHistory 等等 hooks
这些hooks作用与 withRouter 一样，形式不同而已。
参考《为什么withRouter能拿到 路由对象》
## 路由系统
### SPA 

- js、css、html 打包为一个超级大的文件， 一次性丢给浏览器
  多页面应用，通常每个功能使用不同路由，后端根据路由返回不同页面；
- js劫持浏览器路由， 生成虚拟路由来动态渲染页面 dom元素
- 符合前后端分离的趋势，服务端不负责UI输出，而专注于数据支持，因此服务端可以同时支持桌面、手机、网站 app

react 网站使用的路由系统都是虚拟的
  
![](/image/router/spa.png)

### 为什么要有路由系统
项目有很多页面，但react是spa框架；
相比多页面的路由，都是服务端返回不同的html文件；
spa应用的不同页面展示，完全是由前端自己渲染的；
那么前端渲染页面的这一套机制 就是 路由系统。

### 路由系统要做哪些事情
根据读取url ，定向渲染jsx代码，动态更新虚拟dom元素
除此之外，我们要考虑更复杂的情况，
比如 路由缓存，浏览器的历史纪录 等等；

### 当前主要react路由系统
综合性路由框架  react-router 
浏览器路由框架 react-keeper 
手机app框架 react-native react-navigation
### react-router 
是最主流 也是完整的 react 路由系统解决方案
它做了以下事情：
- 它可以保证 url 与 ui 的同步
- 代码缓冲加载
- 路由动态匹配功能
- 可以在所有浏览器中运行：比如兼容各种浏览器的后退前进行为 等等。

### 经典react-router使用示范
注意 BrowserRouter Route Switch 这三者的功能区别，
另外记住这三者全部都是组件，因为是组件，就天生具备堆叠的特性，尤其 Router，在不加 Switch的时候，只要匹配到的，全部都被渲染出来。
这也是为什么项目一定要用Switch的原因。
![](/image/router/ok.png)
![](/image/router/ok1.png)
![](/image/router/ok2.png)

### 多页面应用不存在 路由系统的概念
多页面中，不同的url地址，会匹配到服务端不同的路径，服务端返回不同的html文件给浏览器。
就不存在路由系统一说，因为所有的页面显示什么内容，都是服务端来控制。

而只有 SPA 应用， 服务端不再管理页面显示，只负责应用接口数据处理。
那么前端就必须要有一套自己的 根据不同url地址，显示不同页面内容的方案， 这套显示方案就是路由系统。

### 路由系统与react的关系
react是一个很纯粹的 ui显示框架。
不像 Angular.js 他自带了路由的解决方案。
react 自身不具有 路由能力，不过可以通过配合 react-router 来解决 react应用的路由能力。


