---
title: wills-react-pro项目笔记
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
## ajax封装

### 什么时候需要success提示
ajax分为两种：
一种是进入页面请求数据渲染页面的，此时不需要提示接口响应成功，只需loading即可。
一种是与后台交互，需要响应结果的，如交易、删除、编辑等，提交到后台，后台告知是否成功。
因此在做ajax封装时，可以不用配置success 的提示处理，需要提示的接口自行配置success提示处理。
### 什么时候需要loading
原则上每个请求都应该有loading，但是有很多组件有自己的loading样式，例如在非刷新整个页面的情况下，组件内刷新gird，只需在grid内显示loading，不需要统一的loading格式。
因此ajax封装时，配置可选的 loading标识是否loading。
### 什么时候需要error提示
ajax封装需要封装请求异常处理并提示，统一的异常处理和提示应该放在最后，为了不同接口个性化errorhandle，配置errorhandle，优先级高于统一处理模式。
### 断网时、请求超时的的error提示
断网和请求响应超时时，应该统一处理，并优先级最高。
### 使用options
loading，errorhandle等等，有很多参数，使用一个对象参数options。
### ajax设计
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
### ajax过程的三次dispatch
```
dispatch({
    meta,
    type: `${name}_REQUEST`,
  });
dispatch({
  meta,
  type: `${name}_SUCCESS`,
});

dispatch({
  meta,
  type: `${name}_ERROR`,
});
```
这三次dispatch可以用作如loading的控制等等。


## eslint

### eslint 配合 vscode 使用
#### 概述
eslint在vscode生效：
安装eslint插件在vscode中；
如果用到airbnb的，就安装相关的airbnb 的 node_module包即可。
不用设置什么setting。json。
任意打开一个js文件，不能是ts文件哦，看是否生效。
#### 误区
很多人以为eslint要设置一大堆的vscode插件，其实不然，只需要安装一个eslint插件即可。

### 禁用规则
基本上所有的规则都可以通过设置 值为 0的数组来禁用。
```
"no-unused-expressions": [0]
```

### eslint 不生效
#### 概述
想要vscode的fix all autoFixable problem；配置airbnb后 eslint不生效；
首先eslint除了上面说的 vscode 可能需要安装linter-eslint外，因为用了 airbnb，所有一定要在安装airbnb相关的两个node_module:
```
"eslint-config-airbnb": "^17.0.0",
"eslint-import-resolver-babel-module": "^4.0.0",
```
当然还要安装其他相关的：
```
"babel-eslint": "^8.2.6",

"eslint-plugin-import": "^2.13.0",
"eslint-plugin-jsx-a11y": "^6.1.1",
"eslint-plugin-react": "^7.10.0",
"eslint-plugin-react-hooks": "^3.0.0",
```
之所以在webpack未运行时，eslint能够起作用，估计是eslint默认直接通过 '/node_module/eslint-config-airbnb/index.js'等的方式引用了相关文件，如果这些引用存在，eslint将开启实时监听。
#### 其他情况
注意的是，vscode使用eslint时，必须安装 linter-eslint 插件才能生效，装了插件后才能识别根目录下的eslint配置文件。
#### ts tsx不生效，js生效
如果你的项目中使用了ts，可能对于ts tsx的文件，ts自带的验证规则将优先于eslint，此时eslint可能在js文件中生效，ts文件中不生效。
不过ts文件中有ts自带的验证规则生效。
## jest
### mock的用法
示例见 [wills-react-pro 的 Login.test.js](https://github.com/YeWills/wills-react-pro)
```
 const mockPost = jest.fn(testPost({ success: false }));
```

## enzyme
### shallow的两种情况
shallow一个组件时，和shallow组件内一个返回div的函数用法稍微有区别，
前者需要通过’<>‘括号起来，后者不需要。
示例见 [wills-react-pro 的 Login.test.js](https://github.com/YeWills/wills-react-pro)
#### shallow一个组件
这种情况最通用，不多说：
```
shallow(<Login />);
```

#### shallow组件内的函数返回的div

```
renderErrorMsg = () => {
    return (
        <div className={`${prefixCls}-errorMsg`}>
          {errorMsg}
        </div>
      );
  };

  //测试代码如下：
  const ErrorComponent = warpInstance.renderErrorMsg();
  const errorWrap = shallow(ErrorComponent);
  expect(errorWrap.exists('.view-login-errorMsg')).toBeTruthy();
```

### shallow测试hoc
shallow一个经过hoc的组件时，只能shallow到hoc层面，为了能直接测试该组件时，需要特殊处理；
在hoc层面上，要写一句这样的代码：
```
FinalComponent.WrappedComponent = WrappedComponent;
```
然后通过type属性，可以捕捉这个组件：
```
const getComponentFromHoc = warp => (warp.type && warp.type.WrappedComponent
  ? <warp.type.WrappedComponent {...warp.props} /> : warp);
```
详细demo见:
```
https://github.com/YeWills/wills-react-pro/blob/master/src/utils/testUtil.js
https://github.com/YeWills/wills-react-pro/blob/master/src/utils/connectWills.js
https://github.com/YeWills/wills-react-pro/blob/master/test/Login.test.js
```

## connected-react-router 与 history
这是一种固定写法，不用过多关注：
```
//参考 项目的tag login_pro_v1.0
//src/app/init/createStore.js
import { connectRouter, routerMiddleware } from 'connected-react-router';

connectRouter(history)(combineReducers(reducers)),
```

## 路由设计
### ConnectedRouter配置
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
### 使用BrowserRouter
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

### 页面权限管理
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
### 重定向
场景一：当用户对某个页面没有权限时，AclRouter会将此页面 重定向到403页面
```
<Route
        path="/outlets"
        render={() => <Redirect to="/exception/403" />}
      />
```
### NotFound
在《使用BrowserRouter》中的NotFound页面的路由设计挺好，此路由没有配置path，当上面的路由都未匹配时，就顺延到NotFound页面。

### 路由配置项介绍
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
### AclRouter
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

### BrowserRouter是组件
如上，BrowserRouter 可通过connect 的 mapStateToProps 中的 user props值 重新渲染 BrowserRouter。
这也验证了 react-router中说的所有router都是组件的说法。
### 因为BrowserRouter是组件，所以能理所当然地使用connect
见《BrowserRouter是组件》
参考demo /src/app/init/Router.js


## redux 设计
### 概述
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
### reducer
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

### action
参考上面。

### connect
每个页面都要处理 connect(mapStateToProps, mapDispatchToProps)(injectIntl(OutletDetail));

### 等待改进部分
connect 和 公共的action 单独整理 成connect高阶件，然后对比 考虑如何将post等继承其中

## 待做
- js源码调试
- css-source map
- mock
- 跨域请求 koa
- webpack 代码分离 DllPlugin

# 版本v0.01
## 版本介绍
此版本是一个最简单的工程配置版本，指包含一个简单界面和项目最基本的html js css webpack处理。

## 如何开始从0启动一个webpack项目
### 注重 webpack 入口 ：
```
"scripts": {
    "start": "webpack-dev-server --config webpack.dev.js"
  },
```
### 项目最基本配置：
一个项目无非围绕 html，css，js，图片，axios进行，因此对应的配置如下，本版本下的package.json配置的依赖都是基于以下最基本的配置：
#### html
html模版插件
#### css
scss、css、图片 loader
css、图片与html分离
css3加兼容性前缀
#### js
es6、es7编译成es5
es6、es7的api(如Promise等等)运行profill
一些es6等相关的babel js插件
#### webpack
#### axios
#### 小结
webpack无非就是对html css js 图片文件的打包，因为又多了babel对js的打包，可以说工程项目中对js的打包是最丰富的。

