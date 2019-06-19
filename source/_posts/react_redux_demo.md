---
title: react_redux_demo项目笔记
date: {{ date }}
tags: [react, redux-thunk]
categories: 
- 前端工程
series: 前端工程
---

本篇博客针对 github 的[react_redux_demo项目](https://github.com/YeWills/react-redux-demo)一些知识点讲解。

## redux-thunk
项目使用了redux-thunk来处理异步请求，redux-thunk最重要的思想，就是可以接受一个返回函数的action creator。如果这个action creator 返回的是一个函数，就执行它，如果不是，就按照原来的next(action)执行。
正因为这个action creator可以返回一个函数，那么就可以在这个函数中执行一些异步的操作。
[参考](https://www.jianshu.com/p/a27ab19d3657)
详细示例可参考 项目的tag login_pro_v1.0
```
//src/views/login/index.js
const mapDispatchToProps = {
  loginUser: appAction.loginUser,
};
```
## ajax设计
项目通过两方面来封装 ajax：
- 通过api.js 封装三个常用的ajax方法 post、get、delete，在此js上，主要封装axios相关。
- 通过createAsyncAction.js 抽象出 公共的请求的成功和异常处理。
这样的设计好处在于
可以将axios与 回调处理的代码分离管理，减少耦合性。
详细示例可参考 项目的tag login_pro_v1.0
```
//src/views/login/index.js
const mapDispatchToProps = {
  loginUser: appAction.loginUser,
};
```

## 技术栈
### connected-react-router 与 history
这是一种固定写法，不用过多关注：
```
//参考 项目的tag login_pro_v1.0
//src/app/init/createStore.js
import { connectRouter, routerMiddleware } from 'connected-react-router';

connectRouter(history)(combineReducers(reducers)),
```

### 路由设计
#### ConnectedRouter配置
ConnectedRouter类似BrowserRouter。MultiIntlProvider可以不用管就是一个高阶组件。

```
<ConnectedRouter history={history}>
    <MultiIntlProvider defaultLocale={locale} messageMap={messages} >
        <Switch>
            <Route key={path} path="/dashboard/analysis/realtime" component={Page} />
        </Switch>
    </MultiIntlProvider>
 </ConnectedRouter>
```
#### 使用BrowserRouter
项目的具体布局主要看 src/src-acl-router/AclRouter.jsx;
本项目应该用的是BrowserRouter，而非HashRouter，因为页面的路由都没有#。
整理出来如下：
```
<BrowserRouter history={history}>
    <Switch>
      <Route
        path="/"
        render={() => <Redirect to="/outlets" />}
      />
      <Route
        path="/login"
        render={props => (
          <NormalLayout {...props}>
            <RouteComponent {...props} />
          </NormalLayout>
        )}
      />
      <Route
        path="/outlets"
        render={props => (
          <BasicLayout {...props}>
            <RouteComponent {...props} />
          </BasicLayout>
        )}
      />
      <Route
        path="/exception/403"
        render={props => (
          <BasicLayout {...props}>
            <Unauthorized {...props} />
          </BasicLayout>
        )}
      />
      <Route
        render={props => (
          <NotFound {...props} />
        )}
      />
    </Switch>
 </BrowserRouter>
```

#### 页面权限管理
通过 permissions 配置，通过比对 登陆后 个人的权限user.authorities 与 页面的 permissions，来重组拼合 上面的 《使用BrowserRouter》：
**本项目在登陆后会重新重组渲染上面的 《使用BrowserRouter》**

```
{
  path: '/dashboard/analysis/offline',
  exact: true,
  permissions: ['admin', 'user'],
  redirect: '/login',
  component: W11orkInProgress,
  pageTitle: '',
}
```
#### 重定向
场景一：当用户对某个页面没有权限时，AclRouter会将此页面 重定向到403页面
```
<Route
        path="/outlets"
        render={() => <Redirect to="/exception/403" />}
      />
```
#### NotFound
在《使用BrowserRouter》中的NotFound页面的路由设计挺好，此路由没有配置path，当上面的路由都未匹配时，就顺延到NotFound页面。

#### 路由配置项介绍
```
{
  path: '/outlets',
  exact: true,
  //权限
  permissions: ['admin', 'user'],
  //当有权限时，一切正常时显示Outlets
  component: Outlets,
  //当没有权限时，换成显示Unauthorized
  unauthorized: Unauthorized,
  pageTitle: 'pageTitle_outlets',
  //面包屑
  breadcrumb: ['/outlets'],
}
```
#### AclRouter
所有路由重组，全部在 AclRouter.js.
这个js亮点在于，在登陆前与登陆后，改变 mapStateToProps 中的 user props值。
```
const Router = ({ history, user }) => (
  <ConnectedRouter history={history}>
    <MultiIntlProvider
      defaultLocale={locale}
      messageMap={messages}
    >
      <AclRouter
        authorities={user.authorities}
        authorizedRoutes={authorizedRoutes}
        authorizedLayout={BasicLayout}
        normalRoutes={normalRoutes}
        normalLayout={NormalLayout}
        notFound={NotFound}
      />
    </MultiIntlProvider>
  </ConnectedRouter>
);

const mapStateToProps = state => ({
  user: state.app.user,
});

Router.propTypes = propTypes;
export default connect(mapStateToProps)(Router);
```
根据登陆前后的user props值在 AclRouter.js中重组
```
<BrowserRouter history={history}>
    <Switch>
      <Route
        path="/"
        render={() => <Redirect to="/outlets" />}
      />
      <Route
        path="/login"
        render={props => (
          <NormalLayout {...props}>
            <RouteComponent {...props} />
          </NormalLayout>
        )}
      />
      ......
    </Switch>
 </BrowserRouter>
```
真正做到了根据用户权限，动态改变重组整个BrowserRouter组件。

#### BrowserRouter是组件
如上，BrowserRouter 可通过connect 的 mapStateToProps 中的 user props值 重新渲染 BrowserRouter。
这也验证了 react-router中说的所有router都是组件的说法。
#### 因为BrowserRouter是组件，所以能理所当然地使用connect
见《BrowserRouter是组件》
参考demo /src/app/init/Router.js


### redux 设计
#### 概述
在初始化公共目录下的js中统一注入reducer，并写了一个公共的action和reducer，此公共的action和reducer可能很多页面都要用，因此写在公共目录下，供很多页面使用
：参考：src/app.
每个页面的reducer与action写在每个页面目录下,例如：
```
- outlets
  - action.js
  - index.js
  - index.scss
  - reducer.js
```
#### reducer
在初始化js中，统一注入reducer
```
import outlets from 'views/outlets/reducer';
import outletDetail from 'views/outletDetail/reducer';
import app from '../reducer';

export default {
  app,
  outlets,
  outletDetail,
};
```
每个页面的reducer写在每个页面的目录下。

#### action
参考上面。

#### connect
每个页面都要处理 connect(mapStateToProps, mapDispatchToProps)(injectIntl(OutletDetail));

#### 等待改进部分
connect 和 公共的action 单独整理 成connect高阶件，然后对比 考虑如何将post等继承其中


