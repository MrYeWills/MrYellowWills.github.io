---
title: koa2笔记
date: {{ date }}
tags: [koa2]
categories: 
- [koa2]
series: 服务端
---

## koa2常用知识

### ctx.state
Koa 还约定了一个中间件的存储空间 ctx.state。通过 state 可以存储一些数据，比如用户数据，版本信息等。如果你使用 webpack 打包的话，可以使用中间件，将加载资源的方法作为 ctx.state 的属性传入到 view 层，方便获取资源路径。[摘自此文](https://www.jianshu.com/p/d3afa36aa17a)


## koa2黑知识
### ctx.request.url、ctx.url与ctx.request、ctx.req
ctx是context。
[ctx.request.url 可以写成 ctx.url](https://www.jianshu.com/p/d3afa36aa17a)
[ctx.request可写成ctx.req, ctx.response可写成ctx.res](https://koajs.com/#context)

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


## 参考和学习资料
[koa 官网](https://koajs.com/#context)
[koa github ](https://github.com/koajs/koa#readme)
[koa2入门笔记](https://www.jianshu.com/p/d3afa36aa17a)
