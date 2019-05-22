---
title: dva与umi笔记
date: {{ date }}
tags: [dva, umi]
categories:
- react
series: react
---

暂时没有想好如何整理笔记，暂且以每个项目为章节记笔记。

## user-dashboard项目细节


 ### .umi/ 目录
 此目录为验证目录，npm start生成，没有作用，也不推荐在此修改代码，为方便验证而生。

 ### 项目目录
 ![](/image/dva_umi/user-dashboard.png)

 ### 入口页面
 ```
src\pages\.umi\umi.js  ---ReactDOM.render
```
此页面集成了一个项目的两大要素： dva (状态) 和 路由：
```
src\pages\.umi\DvaContainer.js  ---dva (状态)
src\pages\.umi\router.js ---路由
```
### dva 布局

```
src\pages\.umi\DvaContainer.js
src\pages\users\models\users.js (reducers effects)
src\pages\users\components\Users\Users.js (connect mapStateToProps dispatch) 【dispatch 由connect集成】
```
### User.js页面分析
#### subscriptions setup
进入User页面后，首先触发 src\pages\users\models\users.js 下的:
```
subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/users') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
```
在setup 中触发 改js下的 effects fetch.
[原因参考dva文档---异步数据初始化](https://dvajs.com/knowledgemap/#%E5%BC%82%E6%AD%A5%E6%95%B0%E6%8D%AE%E5%88%9D%E5%A7%8B%E5%8C%96)

#### effects fetch
在fetch中首先 usersService.fetch 向后台请求数据；
然后将返回的数据，put触发 reducers save;
```
 *fetch({ payload: { page = 1 } }, { call, put }) {
      const { data, headers } = yield call(usersService.fetch, { page });
      yield put({
        type: 'save',
        payload: {
          data,
          total: parseInt(headers['x-total-count'], 10),
          page: parseInt(page, 10),
        },
      });
    },
```

#### reducers save
通过save reducer忘redux上造数据list，total。。。以后User页面使用。
```
 reducers: {
    save(state, { payload: { data: list, total, page } }) {
      return { ...state, list, total, page };
    },
  },
```

### 细节关注点

#### *fetch 与 yield 的 generateor写法
这里的*和yield是 generateor的写法，可到mdn网查询了解。

#### fetch的loading是怎么来的
发fetch请求时，通过dva-loading 配合dva中间件，会自动给redux 的store 改变store.loading的state，
在fetch开始和完成时将store.loading置为true或false：

```
//src\pages\.umi\DvaContainer.js
import createLoading from 'dva-loading';
app.use(createLoading());
```

在页面中，通过mapStateToProps拿到这个redux的state.loading值，根据这个值，自行开启或关闭loading组件或效果：
```
//src\pages\users\components\Users\Users.js
<Table
    columns={columns}
    dataSource={dataSource}
    loading={loading}
    rowKey={record => record.id}
    pagination={false}
/>

function mapStateToProps(state) {
  const { list, total, page } = state.users;
  return {
    loading: state.loading.models.users,
    list,
    total,
    page,
  };
}

export default connect(mapStateToProps)(Users);
```

#### import styles from './index.css' 的运用：

```
import styles from './index.css';
console.log(styles)//{normal: "index__normal___3v60A", content: "index__content___14HDd", main: "index__main___nz_0B"}
 <div className={styles.main}>{children}</div>
 ```

### dva与umijs在项目中起的作用统筹分析

本节分析参考pages/.umi/下的文件进行。

#### dva
项目中，通过dva，你不用写store与Provider的集成代码，dva帮你把这块实现,dva又将路由这块的逻辑剥离出来，提供类似接口(this.props.children)方式，方便接入项目路由js；(因此，dva只专注做redux相关的状态部分，并剥离路由且提供路由接口，方便接入路由)

而你只需专注于：

1、写reducer；(按dva规定，将reducer写在model下，以便dva能解析)

2、哪个组件需要redux了，给组件包一层connect，写好mapStateToProps，

#### umijs
至于路由，则由umijs处理，umijs可以将pages下的文件自动解析为路由router.js(.umi下的router.js);

至此，一个项目的 redux与路由两大块全部写好。
剩下一个工作就是 如何将redux与路由两大块有机结合起来呢，
这个工作就是umijs做的:
```
function render() {
  const DvaContainer = require('./DvaContainer').default; //dva处理的redux逻辑部分
ReactDOM.render(React.createElement(
  DvaContainer,
  null,
  React.createElement(require('./router').default)  //umijs处理的路由部分逻辑部分
), document.getElementById('root'));
}
```
#### 小结
因此在以上过程umijs做了以下事情：

1、封装路由，按约定会将pages下的文件编译为路由文件；

2、将上面的路由文件与 dva封装好的redux的reducer状态文件有机组合；

3、有机结合路由和redux后，ReactDOM.render生成启动入口js；

由上可知，umijs至始至终没有处理过redux部分，都是dva处理好后，umijs拿过来组合下而已。

整个项目过程，dva只做了一件事情：

封装reducer，处理redux，dva按约定会将model目录下的文件封装成reducer；

另外在整个过程中，umijs顺手还做了 webpack配置，比如module.hot 热更新。

### user-dashboard 与 with-dva
分析这两个项目，有利于理解dva与umi两个人干的事情，这两个项目将他们二人的配置有机串起来，
在刷一遍dva与umi文档的基础上，看这两个项目，看完项目后，再去看dva与umi的文档，发现更能看懂在文档中所表达的意思。
以上过程入手和研究其他框架的常用手段：
```
网上大量刷一些有关框架的作用比较和题外话，加深框架的整体影响；
刷一遍文档(快速)；
启动下官方推荐的例子；
再次刷文档；
```

## with-dva项目细节

### _layout.js 与 嵌套路由
[umi 里约定目录下有 _layout.js 时会生成嵌套路由，以 _layout.js 为该目录的 layout 。](https://umijs.org/zh/guide/router.html#%E5%B5%8C%E5%A5%97%E8%B7%AF%E7%94%B1)

本例的src\pages\list\_layout.js 是嵌套路由。

### 全局 layout
与上相应的是，全局路由，[参考官网](https://umijs.org/zh/guide/router.html#%E5%85%A8%E5%B1%80-layout)。
本例的src\layouts\index.js 是 全局路由。

### model.js 与 models/ 目录
[参考官网--快速上手-定义model](https://dvajs.com/guide/getting-started.html#%E5%AE%9A%E4%B9%89-model)
```
本例的 src\pages\list\search\model.js
本例的 src\pages\list\models\
```
以上两种情况都会被dva用来解析成reducer，组装store.getState().[nameSpace],也就是组装全局state的key值；
任何组件都可以通过store.getState()获取

这里想说的是，项目中，在不同位置定义的model，看起来没有什么区别或特殊，任意一个地方定义了model后，任何组件都可以凭model的nameSpace获取该状态。

### src\pages\index路由说明
在目录的 src\pages\index下有以下文件：
```
+ pages/
  + index/
    - components/
      - Count.js
    - model.js
    - index.js
```
按照umijs约定，输入以下路由到浏览器url上，应该是可以显示Count页面的：
```
http://localhost:8000/#/index/components/Count
```
但是却不行，原因是src\pages\index是主目录路由，src\pages\index\目录下定义的文件都将不被解析为路由，此目录下的index.js为默认主域名下的页面：
```
http://localhost:8000/#/
```

### 本例具有hot-loader功能
本例具有热更新功能，有兴趣可以研究底层配置实现。

### effects
Effect 被称为副作用，在我们的应用中，最常见的就是异步操作。
项目的异步请求，以及异步请求后根据接口数据，发起action，都是写在effects中。
effects定义了一些关键字(put\call\select..)用来处理比如发送action：
```
yield put({ type: 'reload' });

```
[参考dva--指南-dva概念-models-Effect](https://dvajs.com/guide/concepts.html#effect)
[参考dva--知识地图-Effect-effects](https://dvajs.com/knowledgemap/#effects)

### effects与reducers
effects跟reducers定义相似，二者都是用来定义action的reducer操作，不同的是，effects用来定义异步action，当action要发起post请求时，一般用effects；
相对的，reducer用来定义同步：[参考示例user-dashboard---src\pages\users\models\users.js](https://github.com/YeWills/dva-example/tree/user-dashboard)



## umi

### 路由

#### 权限路由 与 Routes
umi 的权限路由是通过配置路由的 Routes 属性来实现。
[参考demo](https://github.com/YeWills/umi-example/tree/routes-via-config)
以下是权限路由的写法：
```
{ path: '/list', component: './pages/list.js', Routes: ['./routes/PrivateRoute.js'] },
```
```
//PrivateRoute.js
export default (props) => {
  return (
    <div>
      <div>PrivateRoute (routes/PrivateRoute.js)</div>
      { props.children }
    </div>
  );
}
```
对于Routes定义的权限组件PrivateRoute而言，PrivateRoute可以通过props.children能访问上面component定义的组件，然后跳转到/list路由url时，实际显示的是Routes的组件。Routes组件拥有最高权限，通过props.child决定是否显示component定义的组件。

权限路由有些类似全局路由。
更多说明，[参考 umi--指南-路由-权限路由](https://umijs.org/zh/guide/router.html#%E6%9D%83%E9%99%90%E8%B7%AF%E7%94%B1)

### umi:command not found
#### mac
```
yarn global install umi
```
```
//查看yarn目录
yarn global bin
/Users/js/.yarn/bin
```
设置环境变量：
```
$ sudo vi ~/.bash_profile
//然后输入用户密码
//添加这一句话到.bash_profile文件
export PATH="$PATH:`yarn global bin`"
```

重启命令窗口
再次输入umi就可以了。

#### 关于mac环境变量配置有关
#### $PATH的字符串写法
接着上面mac对umi的环境变量配置，上面设置环境变量的步骤设置成如下也是的一样的效果：
```
export PATH=$PATH:/Users/js/.yarn/bin
```

#### $PATH的变量写法
我们观察到，export PATH="$PATH:`yarn global bin`" 是一种变量的写法，将yarn global bin 这个整体当成一个变量。
类似于 yarn global bin 等价于 /Users/js/.yarn/bin；
因为bash中执行
```
//查看yarn目录
yarn global bin
/Users/js/.yarn/bin
```

#### 多个环境变量以：打印echo输出
```
$ sudo vi ~/.bash_profile
//进入vim模式后，文件内容如下：
export PATH=$PATH:/usr/local/mongodb/bin
export PATH=$PATH:/Users/js/.yarn/bin
$ echo $PATH
/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/mongodb/bin:/Users/js/.yarn/bin
我们看到了 mongodb的环境变量并没有被后面的yarn路径覆盖，他们全部被平行保存，通过冒号:隔开表示。
```
#### .bash_profile中的环境变量不会覆盖
如上分析
```
export PATH=$PATH:/usr/local/mongodb/bin
export PATH=$PATH:/Users/js/.yarn/bin
```
虽然使用PATH=先后定义了mongodb和yarn，但是yarn并没有覆盖mongodb，通过echo打印可以查证。具体参考上面分析。


#### windows
windows解决方式一样，唯一不同的是，是将 yarn global bin 打印的地址添加到环境变量中。

### umi的使用
官网中通过 `快速上手` 和 `通过脚手架创建项目` 两部分详细介绍了如何使用umi，通过这种方式来创建项目工程，很有借鉴学习之用，亲试可行，在此单独从官网从拎出来说明，以示重视。
#### 快速上手
[参考umi–指南-快速上手](https://umijs.org/zh/guide/getting-started.html)
#### 通过脚手架创建项目
[参考umi–指南-通过脚手架创建项目](https://umijs.org/zh/guide/create-umi-app.html)

## demo

### with-dva
[demo地址](https://github.com/YeWills/umi-example/tree/with-dva)
一个很好的 umi 配合 dva的例子，讲了各种路由配置,已经dva的运用，是 umi约定式路由范例。
参考《with-dva项目细节》
 ![](/image/dva_umi/with-dva.png)
### routes
[demo地址](https://github.com/YeWills/umi-example/tree/routes)
本例展示在umijs中如何按约定生成 各种类型的路由，如 基础、动态、可选动态、嵌套、全局、404路由。
相关讲解，[参考umi--指南-路由-约定式路由](https://umijs.org/zh/guide/router.html#%E5%9F%BA%E7%A1%80%E8%B7%AF%E7%94%B1)
本项目也可用于react项目常用到的一些路由知识学习
 ![](/image/dva_umi/routes.png)
### routes-via-config
此demo相对简单，在umijs下，如何自行配置路由。是 umi配置式路由范例。
通过本例知道，主要是通过.umirc.js 来进行配置路由。 本例运用了权限路由。
[参考umi--指南-路由-配置式路由](https://umijs.org/zh/guide/router.html#%E9%85%8D%E7%BD%AE%E5%BC%8F%E8%B7%AF%E7%94%B1)
 ![](/image/dva_umi/routes-via-config.png)
### umi-dva-user-dashboard
一个简单的示例，可作为umi与dva结合的示例。是了解umi与dva的入门demo，其解说参见《user-dashboard项目细节》，
是下面的user-dashboard示例的优化版。
[demo地址](https://github.com/YeWills/umi-example/tree/umi-dva-user-dashboard)
 ![](/image/dva_umi/umi-dva-user-dashboard.png)

### user-dashboard
参考《user-dashboard项目细节》
这个示例没有 上面的 umi-dva-user-dashboard精细，但也可一看。
 ![](/image/dva_umi/user-dashboard-view.png)
### with-nav-and-sidebar
[demo地址](https://github.com/YeWills/umi-example/tree/with-nav-and-sidebar)
要做侧边栏(sidebar)和导航栏时，可参考本示例，非常简洁的，只有侧边栏和导航栏的示例
<img src="https://gw.alipayobjects.com/zos/rmsportal/DReQIejdcJPeaXWEDKDe.png" />

### ant-design-pro
深入了解umi与dva的综合示例

## 学习资料与小结
### github仓库
github中以下仓库为学习期间的全部demo：
[umi-example](https://github.com/YeWills/umi-example)
[dva-example](https://github.com/YeWills/dva-example)
[ant-design-pro](https://github.com/YeWills/ant-design-pro)
以上demo都基于官网开源demo，感谢。
### 小结
#### dva与umi学习
学习dva与umi，建议先从dva了解开始，然后是umi，然后再是ant-design-pro；
dva与umi的学习，快速过官网文档，然后运行文档中给出的demo，对照demo，再针对性看文档，多看文档。
以上熟悉后，再看ant-design-pro。
#### dva与umi认识
dva与umi创建项目的方式新颖，通过包管理方式创建脚手架，是很多公司大厂的常规做法，umi更像一个大厂内部的标准工程脚手架。
如果你处于一个公司的架构师位置，想要出一个全公司统一的前端开发脚手架，你所在公司安全级别高，对项目依赖包有安全要求，对项目有管控需求以便达到安全级别，umi无疑是你的标杆。
如果你们公司不是一个五六百人的公司，而且没有对公司内所有前端项目所用依赖包的版本有管制需求，并且没有统一前端脚手架的需求，建议还是自行配置一套脚手架，有利于 版本升级，问题追踪，风险可控性好。

## 参考文档：
### dva
[参考dva--指南-快速上手-定义model](https://dvajs.com/guide/getting-started.html#%E5%AE%9A%E4%B9%89-model)
[参考dva--指南-dva概念-models-Effect](https://dvajs.com/guide/concepts.html#effect)
[参考dva--知识地图-Effect-effects](https://dvajs.com/knowledgemap/#effects)

### umi
[参考umi--指南-路由-约定式路由](https://umijs.org/zh/guide/router.html#%E5%B5%8C%E5%A5%97%E8%B7%AF%E7%94%B1)
