---
title: koa2笔记
date: {{ date }}
tags: [koa2]
categories: 
- [koa2]
series: 服务端
---

## koa2常用知识

### context的别名
[更多参看 官网 Request aliases Response aliases](https://koajs.com/#introduction)
摘录部分：
```
//Request aliases 下面的简写，都指的是Request
ctx.url  -- ctx.request.url 的别名
ctx.method  -- ctx.request.method 的别名
ctx.header
ctx.path
```
```
//Response aliases 下面的简写，都指的是Request
ctx.body  -- ctx.response.body 的别名
ctx.status  -- ctx.response.status 的别名
```
另外 ctx.req 是 ctx.request 的别名；
另外 ctx.res 是 ctx.response 的别名；



### POST请求参数的获取
koa 没有封装获取post请求参数的方法，要么通过ctx.req.on原生方式，要么通过koa-bodyparser
#### 方式一：
使用ctx.req.on原生方式。
```
app.use(async (ctx)=>{
  let postdata='';
  ctx.req.on('data', (data)=>{
    postdata +=data;
  })
  ctx.req.on('end', ()=>{
    console.log(postdata);
  })
})

// 另起一个git bash 窗口执行以下命令，注意，
//一定用git bash， 因为cmd 没有curl命令
curl -d "param1=abc&param2=qqw" http://localhost:3000/

// 在npm start 所在的cmd或git bash窗口，会出现 打印：
//param1=abc&param2=qqw
```

#### 方式二：
使用koa-bodyparser方式。koa-bodyparser的底层也是使用ctx.req.on实现的。
```
const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const app = new Koa()
app.use(bodyparser())
app.use(async (ctx, next)=>{
  let postData = ctx.request.body;
  console.log(postData);
})
app.listen(3000)

// 另起一个git bash 窗口执行以下命令，
curl -d "param1=abc&param2=qqw" http://localhost:3000/

// 在npm start 所在的cmd或git bash窗口，会出现 打印：
//{ param1: 'abc', param2: 'qqw' }
```

### 有关content-type
#### 先来看一个实例demo，感受下：
前端代码：
```
  fetch('http://127.0.0.1:3000/test', {
      method: 'GET', // or 'PUT'
      headers: new Headers({
        'Content-Type': 'image/png'
      })
    })
    .then(res => res.text())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
```
后台代码：
```
const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
var cors = require('koa2-cors');

const app = new Koa()
app.use(cors());
app.use(bodyparser())
app.use(async (ctx, next)=>{
  ctx.response.type='text';
  ctx.response.body='<p/>999<p/>';
})
app.listen(3000)
```
页面响应：
![](/image/koa2/content-type.png)
![](/image/koa2/content-res.png)

后续操作：
- 当切换设置不同的ctx.response.type='text';对应的Response Header 的 Content-type随之改变


#### 另外一个实验：
前端代码：
```
    fetch('http://127.0.0.1:3000/test', {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'image/png'
      })
    })
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
```
后台代码：
```
const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
var cors = require('koa2-cors');

const app = new Koa()
app.use(cors());
app.use(bodyparser())
app.use(async (ctx, next)=>{
  ctx.response.type='html';
  ctx.response.body={data:'Hello World'};
})
app.listen(3000)
```
发现的现象：
- 设置不同的ctx.response.type='html'时，Response Header 的 Content-type没有随之改变，还是显示为application/json
- 后台ctx.response.body={data:'Hello World'};改成  ctx.response.body='<html/>';
前台代码不变，发现res.json()解析报错，Unexpected token < in JSON at position 0，
将res.json改成res.text就好了
- 后端实际的数据是json数据(ctx.response.body={data:'Hello World'})，但设置 ctx.response.type='html';然而并不影响前台通过res.json()正常解析到正确数据；
- 后端实际的数据是json数据(ctx.response.body={data:'Hello World'})，虽然前端设置了自定义Header content-type为image/png，但不影响前端正常解析，前端一样能正常获取数据。


#### 得出结论：
结合上面页面响应的图片中：
- 一个请求，有两个content-type,分别是Response Header 和 Request Header上的。
- 小区别是 Response Header 的是首字母大写的 Content-type ，Request Header 的是首字母小写的 content-type;
- fetch 的 headers: new Headers({'Content-Type': 'image/png'}) 设置的是 Request Header 的 content-type；
- Response Header 的 Content-type 是 原则上是ctx.response.type控制设置的，但如上例，有时Response Header 的 Content-type 是 浏览器或koa自动识别ctx.response.body数据类型设置的。
- fetch要想正确解析数据，需要根据后台实际数据，使用对应的解析方式，如 res.json() 、res.text()等等，如果解析方式不对，就报错。
- 另外注意的是，前端fetch的时候，如果自定义header，而且请求是跨域的，每发一次fetch，可能会产生两次请求，具体分析参见《koa2黑知识 -- 跨域请求有时会发两次请求》：

#### 常见的 content-type值--对应的ctx.response.type：
application/json  -- ctx.response.type='json'
text/html  -- ctx.response.type='html'
image/png  -- ctx.response.type='image/png'
text/plain  -- ctx.response.type='text'  浏览器默认text/plain

### 设置响应状态码
通过ctx.status设置，ctx.status是ctx.response.status的别名
```
const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
var cors = require('koa2-cors');

const app = new Koa()
app.use(cors());
app.use(bodyparser())
app.use(async (ctx, next)=>{
  ctx.response.type='text';
  ctx.status=562;
  ctx.response.body='<p/>999<p/>';
})
app.listen(3000)
```
页面响应：
![](/image/koa2/status.png)

#### 注意点：
koa-bodyparser的底层也是使用ctx.req.on实现的，所以不能同时使用 koa-bodyparser与ctx.req.on，否则，可能报错，
详见《koa2黑知识 -- koa-bodyparser导致ctx.req.on事件失效》

### 如何在koa使用中间件
#### 中间件是由app.use加载的
中间件一般都通过 app.use 函数来加载中间件
```
const app = new Koa()
app.use(cors());
app.use(bodyparser())
app.use(async (ctx, next)=>{
  ctx.response.type='text';
  ctx.response.body='<p/>999<p/>';
})
app.listen(3000)
```
#### 中间件执行顺序
中间件在 koa中执行顺序，遵循洋葱模型方式：
```
![](/image/koa2/middle.jpg)
```
代码展示：
```
app.use(async (ctx, next)=>{
  console.log('one start');
  await next();
  console.log('one end');
})
app.use(async (ctx, next)=>{
  console.log('two start');
  await next();
  console.log('two end');
})
app.use(async (ctx, next)=>{
  console.log('three start');
  await next();
  console.log('three end');
})

// one start
// two start
// three start
// three end
// two end
// one end
```

#### next()
next()返回一个Promise对象，配合await使用，可以达到阻塞后面程序执行，等待 next() 返回类似reject()才最终执行nex()后面的程序。
每个中间件必须使用next()，否则异常。

### koa-bodyparser
此中间件的作用 是 把POST请求的参数解析到ctx.request.body中，koa-bodyparser底层就是基于ctx.req.on实现的。
其他信息见《koa-bodyparser导致ctx.req.on事件失效》  《POST请求参数的获取》

### koa-router
#### Usage
```
const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const router = require('koa-router')()
var cors = require('koa2-cors');
const app = new Koa()
 router.get('/', async (ctx, next) => {
    ctx.response.body = `<h1>index page</h1>`
})
router.get('/home', async (ctx, next) => {
    ctx.response.body = '<h1>HOME page</h1>'
})
router.get('/404', async (ctx, next) => {
    ctx.response.body = '<h1>404 Not Found</h1>'
})
app.use(cors()) // 解决跨域
app.use(bodyparser())// 解析post参数
app.use(router.routes())// 注册路由中间件
app.use(router.allowedMethods())// 对异常状态码处理
app.listen(3000, ()=>{
  console.log('server is running at http://localhost:3000')
})
```
关键 是在最后使用
```
app.use(router.routes())// 调用路由中间件
app.use(router.allowedMethods())// 对异常状态码处理
```
当然，如果你不想处理异常状态码，完全可以不使用router.allowedMethods(),单独使用router.routes()即可。

#### 模拟路由中间件
下面模拟路由写的中间件，可以加深对路由中间件的理解
```
class Router{
  constructor(){
    this._routers = [];
  }
  get(url, handler){
    this._routers.push({
      url:url,
      method:'GET',
      handler
    })
  }
  routes(){
    return async (ctx, next) => {
      const {method, url} = ctx;
      const matchedRouter = this._routers.find(r => r.method === method && r.url === url);
      if( matchedRouter &&
        matchedRouter.handler){
          await matchedRouter.handler(context, next);
        }else{
          await next();
        }
    }
  }
}
```

### 写一个中间件
这里动手写一个logger中间件小demo，用来打印日志：
原代码
```
 app.use(async (ctx, next)=>{
   console.log(ctx.method,ctx.host + ctx.url)
   await next();
   ctx.body = 'hellow world'
 })
```
动手写一个logger中间件，用于打印日志，改造后如下：
```
const Koa = require('koa')
const app = new Koa()
const logger = async function(ctx, next){
  console.log(ctx.method,ctx.host + ctx.url)
  await next();
}
app.use(logger)
app.use(async (ctx, next)=>{
  ctx.body = 'hellow world'
})
app.listen(3000)

```

### ctx.state
Koa 还约定了一个中间件的存储空间 ctx.state。通过 state 可以存储一些数据，比如用户数据，版本信息等。如果你使用 webpack 打包的话，可以使用中间件，将加载资源的方法作为 ctx.state 的属性传入到 view 层，方便获取资源路径。[摘自此文](https://www.jianshu.com/p/d3afa36aa17a)



## koa2黑知识

### /favicon.ico
我们常加载dom时，会看到有一个/favicon.ico请求，这个是Dom渲染时，默认自带的静态资源。

### this 指向 ctx

```
app.use(async (ctx)=>{
 this; //此this其实就是ctx，就是Context
})
console.log('run in 3000')
```

### koa-bodyparser导致ctx.req.on事件失效
下面代码会报错，因为koa-bodyparser的底层就是基于ctx.req.on实现的，如果使用了koa-bodyparser，它可能会劫持ctx.req.on这个事件，导致ctx.req.on事件失效
```
app.use(bodyparser())
app.use(async (ctx)=>{
  let postdata='';
  ctx.req.on('data', (data)=>{
    postdata +=data;
  })
  ctx.req.on('end', ()=>{
    console.log(postdata);
  })
})
console.log('run in 3000')
```
解决的方法也简单，koa-bodyparser本来是为了方便获取ctx.req.on,使用了koa-bodyparser就没必要使用ctx.req.on。
或者用kctx.req.on，就不要用koa-bodyparser；

### koa2-cors解决跨域
var cors = require('koa2-cors');
app.use(cors());

### 跨域请求有时会发两次请求
当前端fetch自定了header时，且接口跨域时，fetch一次，可能会发两次相同请求，两次请求一次是Request Method: OPTIONS的，
一次是Request Method: GET的，
原来fetch在发送真正的请求前, 会先发送一个方法为OPTIONS的预请求(preflight request), 用于试探服务端是否能接受真正的请求[详细原因参见这里](https://blog.csdn.net/cc1314_/article/details/78272329)；
解决之道就是把自定义headers字段删掉后；
或者不要使用require('koa2-cors')的方式解决跨域，可以通过服务端请求服务器的方式解决跨域；
因为跨域是浏览器的限制机制，而服务器与服务器之间不存在跨域问题，具体思路：
在同域名下通过 koa 截取 项目的所有fetch请求，然后使用 request 模块，通过 request 给另外域名下的服务器发请求。

### 后台报错app有错误日志，也会报跨域错误
如果配置了koa2-cors解决跨域，但请求时有跨域报错，可能是app.use内部程序执行报错，会导致后台响应异常，然后前台可能显示为跨域限制错误

## 参考和学习资料
[koa 官网](https://koajs.com/#context)
[koa github ](https://github.com/koajs/koa#readme)
[koa2入门笔记](https://www.jianshu.com/p/d3afa36aa17a)
