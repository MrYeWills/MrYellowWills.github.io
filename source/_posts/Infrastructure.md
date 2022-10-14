---
title: 设计一个中台项目架构
date: 2022/1/13
tags: 基建
categories: 
- 前端工程
series: 基建
---


## 如何快速阅读框架源码，或大组件

喜欢哪一个功能，就可以先看哪个功能；
凭兴趣来；
刚开始先打乱仗，把各个点击破；
最重要是车轮战，不要急，一定要有结果，不拿到结果，不罢战，不要怕多花了时间；
拿出一点林帅的气魄 "我不要伤亡数字，我只要塔山"。
有了大体感觉了；
然后再系统看一遍；

## 登录

### 登录方案设计

跳转到统一的 登录项目页面，
扫码登录完成后，
统一登录页面的后端会通过接口，设置cookie，此cookie包含各类登录信息，如session id，并设置此cookie 二级域名相同的全部共用；
并给此cookie设置了一个有效期，比如8小时，这样，就算页面关闭，重新打开页面，cookie依然有效和存在；
然后跳转到原来的项目页面；

- 1.项目页面中，每次与后端，都是通过上面的cookie，提取登录信息，
组装出后端需要的请求入参；
要非常注意的是：后端此时只校验 接口入参，并不校验或读取cookie，你是否登录，完全取决于你的接口入参，这一点可以在低代码平台的预览页面得到验证:
![](/image/infra/cookie.jpg)

- 2.不过，前端与后端接口通讯的过程中；
后端会经常校验你的包含session的入参，
如果发现session 有偏离，就会以接口响应数据的方式（注意不是cookie，自登录后，后端不再设置cookie 或与cookie打交道），返回最新的session给前端，
- 3.此时前端的request sdk 获取到最新的 session，
前端sdk，自行将此 session 写入到cookie中，并设置有效期，(其实这代替了之前 登录页面的后端做的设置cookie的工作);
然后sdk 重新发起一次请求，
按照之前的逻辑，sdk会从最新的cookie中读取session，(如果还发现验签失败，sdk还是会重新发起一次，此时超过5次校验还失败，直接终止发起请求)；
组装出后端需要的请求入参，
此时接口将正常返回业务数据。

上面的步骤 2 ，
后端会经常校验你的包含session的入参，如果发现session已经失效或其他原因，
就会返回未登录信息标识；
前端读取到未登录后，就会又跳转到 上面的 统一登录页面。


所以在sdk设计中
尤其是 上面的步骤 2、3 的 验签失败后，要重新设置 cookie 以及重复发送请求 这些都是很底层方面的；
这些逻辑其实就是结合网关设计的，与网关的架构后端商量出来的底层逻辑；
所以这部分逻辑内聚到了 sdk 中。

而其他的错误码，包含 未登录 等的处理，就交给 比如pc端的脚手架处理了。

### 延伸： 脚手架 的request 与 sdk 区别
脚手架 的request 与 sdk 区别

脚手架 的request 定义错误的处理方式，
比如
未登录 -200  直接  window.location.href 跳转登录页面；

-3xxxx 无权限 直接 跳转到 无权限页面 /noauthority ；
-1xxxx, "系统需要钉钉扫码登录进行访问"  直接执行一次 /authcenter/exitUrl 登出操作 并提示；
-13xxx, "帐号已在其他地方登录，当前系统被迫下线"  跳转登录页面；
等等；


sdk 里面写一个更底层的 移动端、pc段通用的 网关协议；

然后 关于pc段的 逻辑，则由脚手架的request实现；
关于移动端的逻辑，则由移动端脚手架的request实现；



### 至此，我们对整个登录设计有了清晰理解

统一登录项目页面 的后端，负责设置一个二级域名的cookie；

业务项目的后端 不再与cookie通讯，但通过接口响应数据 经常校验和返回最新的session值；

前端sdk使用最新的session值，更新cookie，(其实做了上面统一登录的后端做的事情)

业务项目的前端与后端 只通过 请求入参来进行通讯， 此时的cookie更像一个localstorage 或 全局的state，用cookie，只是有一个全局且有时效性的 state。
如果不嫌麻烦确实也可以使用localStorage，但非常不推荐用localStorage。


### 判断是否登录
#### componentDidMount 中 检测 cookie
在layout的componentDidMount 中 检测, 如果未登录则跳转统一登录页面:
```js
  checkTicket() {
    const url = window.location.href;
    const session = getCookie('session');
    if (!session) {
      window.location.href = `${window.conf.loginUrl}/?redirectUrl=${encodeURIComponent(url)}`;
      return false;
    }
  }
```
此外，app渲染前还要请求用户信息，此时 后端会校验包含 session的请求入参，判断是否登录，并以响应数据的方式告知前端
前端则直接跳转至登录页面；

#### 根据session-id 检测
判断登录与否是根据 session-id ，而不是我们通常认为的 account 账号信息，这样挺好。


### 用户信息存储设计
#### 设计分析
项目采用完全通过接口获取用户信息，前端不缓存任何用户账号信息，这一点非常妙；
而且统一登录页面后端 直接设置了一个包含有效期的 cookie ，每次根据这个cookie 组装出带有session信息的请求入参 去请求任意接口。
包含了请求 用户账号信息接口，
好比我们扔给后端一串无法语义化的session id ，
后端返回给我们前端一串语义化的 用户账号信息；
这样的 一进一出的设计，
#### 优点非常明显：
既避免了 用户账号 前端缓存在 localstorage 中的明文，让信息泄露，因为被缓存到前端也仅仅是一个 一串毫无语义化可言 的session id；
然后所有缓存交给接口，前端的逻辑就非常简单，前端可维护性更高；
让后期开发同样的项目，更加便捷，更加成本低；


### 如何更新cookie
除了登录接口，后端直接设置了cookie之外，
其他接口请求时，每次请求sdk会根据cookie组装最新的 token，
网关或接口接收token，判断是否过期，如果过期则返回统一的code码，以及最新session信息，
sdk根据最新的session，设置cookie，
然后重新发起请求，重新发起的请求就会传入读取最新cookie而来的tooken。
实现了 cookie、tooken的更新。

由此看出，登录接口通过后端设置cookie，其他接口由前端设置cookie。
其实想想，登录接口，同样也可以由前端来设置cookie。

## 改进点

### 创建一个公司的util工具集

比如 getCookie ：
```js
const getCookie = (name = '') => {
  let arr;
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  if ((arr = document.cookie.match(reg))) return decodeURIComponent(arr[2]);
  return null;
};
```
为什么要创建这样一个工具集，因为网关的cookie是网关后端统一设置的，每个项目具有通用性，适合将此工具提成一个工具集。

## 优点

### encodeURIComponent的加密应用
cookie 通过 decodeURIComponent encodeURIComponent 做一个简单的加密解密 也挺好的，可以让特殊字符或中文字符，变成普通的name字符。
也具有一定的混淆性，让信息脱敏，增加安全性。


## noWindow
### 为什么要兼容noWindow， 
因为你的系统可能要嵌入到其他系统；
### 方案
在设计layout时考虑：
左侧导航nav 可去掉
顶部导航nav 可去掉
顶部下面的 tab 可去掉
只有内容部分是一直可以显示的

## keepalive
这块比较简单，不多展开；

## iframe
iframe 嵌入设计
由于iframe嵌入的http地址非常不确定性；
所以脚手架比较简单的 写了一个组件 Iframe组件；
所有的 iframe 嵌入页面 共用一个 路由： '/iframe?url=http://www.baidu.com'


因为特殊字符存在会让 页面地址 格式出问题， 所有的http地址 使用 decodeURIComponent 转义一下特殊字符，让http地址只由正在字符组成。

## 无权限页面、welcome、404 页面；
项目中在 route中定义过的页面，然后权限接口没有这个页面时，说明是无权限页面；
其他的页面都作为 weblcom页面或 404页面；


404 页面如何处理；
keepalive 处理；
tab 能力；


## 待优化

不要在  this.props.history.listen 中去做权限监听，
应该在 页面组件中写入这一逻辑，写一个高阶函数，判断这些；
页面中 如何发现没有权限，直接页面都不会显示出来；

## 水印
canvas 实现 可根据即时信息生成即时的图片；
设置图片为background
设置  `warterModel.style.pointerEvents = 'none';`


## nav、tab、topHeader 设计

### 数据处理

#### nav数据
左侧导航 nav 的数据由后端接口返回，结构如下：
```js
[
  {
    name: '教育中心',
    children: [
      {
        name: '素质教育',
        children: [
          {
            name: '家庭教育',
            // path 很重要，是作为id唯一标识的，既是页面访问地址，也是路由地址，其实二者是一个意思
            path: `/tryq/beautiCenter/hometchCenter/index`,
          },
          {
            name: '学校教育',
            path: `/tryq/beautiCenter/hometchCenter/List`,
          },
        ],
      },
    ],
  },
  {
    name: '行政中心',
    children: [
      {
        name: '行政规则管理',
        path: '/tryq/xingzCenter/RuleManage/List',
      },
      {
        name: '行政规则编辑',
        path: '/tryq/xingzCenter/RuleManage/Edit',
        // 用这个来解决 nav 与 tab 一对多的关系，比如 列表、新增、详情 对应一个nav；
        relation: '/tryq/xingzCenter/RuleManage/List',
      },
    ],
  },
   {
    name: '实训中心',
    children: [
      {
        name: '搜狐2005页面',
        // 兼容上面 iframe的设计，所有iframe地址，将被组装成 /iframe?url=http://news.sohu.com/s2009/9616/s267059966/
        path: 'http://news.sohu.com/s2009/9616/s267059966/',
      },
    ],
  },
]
```

#### relation 解决一对多
如上

#### path为唯一值id
如上

#### router数据
对应的 router设计 不重要，就是遵循 react 就行，也不用管 父子等层级关系，反正最后都被根据path平铺就行了。

### 充分认识导航的onSelect与onOpen
选择最终的子节点 才触发 onSelect；
其他动作，如点击非子节点的父级节点，都属于 onOpen；
要充分认识onSelect与onOpen 带来的 其他模式比如下面的 openMode selectMode；
```html
 <Nav
      onSelect={setNavSelect}
      onOpen={setNavOpen}
      selectedKeys={selectedNavKeys}
      openKeys={openNavKeys}
      <!-- 是否支持多开 -->
      openMode="single"
      <!-- 是否支持多选 -->
      selectMode="single"
      mode="inline"
      type="primary"
      direction="ver"
    >
      {navContent}
    </Nav>
```

### 支持的功能

#### 功能概述
- 根据url，页面刷新后，打开对应的导航,tab
- 点击导航打开对应的导航，这个好做
- 要点击tab也能打开对应的导航，而且 新增、详情、列表 对应一个功能导航，这个一对多的设计
- 兼顾iframe 
- 层级为三级，最好考虑兼容 (或四级、五级)

#### 数据设计思路
为了兼顾iframe， 路由使用统一的 /iframe，以？加上 encode 后的http地址， 使用encode是为了处理特殊字符，不然地址无效；
为了兼顾导航与tab 是上面说的一对多的需求，需要提供一份 一对多的映射数据 (具体的实施方案是，导航数据中包含了child信息)，
这里有一个错误的数据设计思路：是通过约定导航与路由的命名方式来做，比如 脚手架，这种方法扩展性极差，问题排查极难，还要在代码成名做非常复杂的处理。


### 路由与nav tab 数据设计关系

iframe 支持；
如果支持 iframe ，就要考虑缓存，以及 nowindow， 因为希望同系统页面引入时， 设计 nowindow 功能；

路由数据设计上：
第一点：我们假定 导航 上的 路由都只有path，而没有search，信息
第二点：我们使用 tab 同时存储 不变的path信息，以及动态的新增编辑id信息 到search上；
当然 关于第一点，其实我们可以不用一定要 用path，也可以用 path + search， 然后一律以 path 作为 map映射计算，或者灵活改变都可以；


### 状态设计
基于以上分析

#### 数据设计如下
我们希望菜单数据包含这几个关键字：
```js
 const { path, name,  children,  relation } = item;
```
![](/image/infra/tab.png)


tab 数据包含：
```js
// 就是这三个关键字 const { label, path, search } = pane;
<Tab shape="wrapped" activeKey={currentValue} onClose={onCloseTab} className="custom-tab" animation={false}>
      {datas.map((pane) => {
        const { label, path, search } = pane;
        // search || '' 避免undefined
        return (
          <Tab.Item
            title={<Link to={`${path}${search || ''}`}>{label}</Link>}
            key={path}
            closeable={datas.length > 1}
          />
        );
      })}
    </Tab>
```

#### 状态响应设计

所有的nav 和 tab 只改变 path，也就是只改变 页面的访问路由；
至于 每个路由，要显示那些nav 的openkeys 还是 selectedKeys；
要显示哪些 tab 的 currentTab 以及 tabDatas；
这些全部交给 useEffect 响应 页面访问路由来处理

```js

  // 认为 menuDatas 就会引起tabMaps改变，因此监听tabMaps， 只有在页面初始化时才会改变，
  // 一旦menuDatas(tabMaps)稳定下来，页面将不会改变，所有的 导航和tab逻辑都基于此
  // 所以把页面刷新时，初始化 导航和tab 逻辑放到这里来，
  // 此设计待进一步验证 更多复杂情况 todo
  useEffect(() => {
    if (!tabMaps) return;
    let { pathname } = window.location;
    const { search } = window.location;

    if (tabAndNavnfo) {
      let { openKeys } = tabAndNavnfo;
      let { selectKeys } = tabAndNavnfo;
      if (tabAndNavnfo.relation) {
        openKeys = tabMaps[tabAndNavnfo.relation].openKeys;
        selectKeys = tabMaps[tabAndNavnfo.relation].selectKeys;
      }
      setNavOpen(openKeys);
      setNavSelect(selectKeys);

      setCurrentTab(pathname);
      setTab((pre) => {
        // iframe 页面没有 search 的说明，都是写死的完整 page url， 不需要考虑 search
        if (pre.find((t) => t.path === pathname)) {
          if (isIframePage) return pre;
          return pre.map((t) => ({
            ...t,
            search,
          }));
        }
        return [
          ...pre,
          {
            ...tabAndNavnfo,
            search: isIframePage ? undefined : search,
          },
        ];
      });
    }
  }, [tabMaps, window.location.href]);
```

这样的设计非常妙，

比如 在页面中，点击按钮进行页面路由跳转的时候， 他们只需做路由跳转的逻辑就行，
不用关心 什么 左侧导航的 openkeys seletedKeys 以及 tab的选中情况，tab datas。

这点非常关键。

让各种功能理解起来更简单，设计起来也更加简洁，扩展性非常强；


而 【左侧导航的 openkeys seletedKeys 以及 tab的选中情况，tab datas】这些就交给 上面的effect进行统一处理，非常之好。

而且这个effect还可以处理注意 权限控制 等等逻辑。


## 源码
[dashboard](https://github.com/YeWills/dashboard.git)

