---
title: 后端demo
date: 2020/08/17
tags: [egg, demo]
categories: 
- 后端
series: egg
---

## egg简单demo

这是一个后端demo
功能有：
### 跨域
### view 模版引擎文件 配合插件 egg-view-ejs 一起用
### 存储静态文件 - public 目录中
### 下载文件功能
### 抽取service
### 接口返回必须加上await
```js
class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const res = await ctx.service.product.index();
    //await 这里必须加上await ，不然访问路由会报错 404 not found
    await ctx.render('index.html', { res });
  }
}

```
### post请求需禁用csrf安全攻击验证
加入以下代码，不然会报异常。
```js
//egg-demo/config/config.default.js
 // 禁止post安全攻击验证功能
  config.security = {
    csrf: {
      enable: false,
    },
  };
```
### demo

[demo](https://github.com/YeWills/learns/tree/master/egg-demo)

## egg+vue入门demo(前后端实战)
### 使用
前端启动`npm run serve`,后端启动`npm run dev`.
### vant 的使用
### babel-plugin-import按需加载vant
(参考)[https://youzan.github.io/vant/#/zh-CN/quickstart]
### 跨域
```js
// vue.config.js
module.exports = {
    devServer: {
        proxy: { // 配置代理信息
            '/article': {
                target: 'http://127.0.0.1:7001',
                changeOrigin: true,
                ws: true,
            }
        }
    }
}
```

### 创建后端工程
创建项目，详细参考egg官网：
```
npm init egg --type=simple
npm i
```
### 编写mysql
```sql
-- egg-mysql-serve/vue_egg_test.sql
CREATE TABLE `article`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `summary` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `content` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `img` MEDIUMTEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `createTime` timestamp(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
)
```
### 生成数据库、表
#### 创建数据库
有两种方式，一种通过cmd命令方式，另外一种通过navicate方式图形化生成。
具体参考《后端笔记 - sequlize集成使用 - 新建数据库》
用navicate创建好后，在cmd中再次show databases;即可查看新增数据库。
#### 创建表
有以下方式：
- 直接将上面的sql 内容放在cmd中执行，生成数据库。
- cmd 中 source sql文件。
- 利用navicate创建表，然后将表数据导出。

### egg-mysql桥接数据库
egg-mysql获取配置信息中的数据库登陆用户信息 登陆连接数据库。
让后通过`this.app.mysql.select('article')`等进行数据库的增删改查。
更多查看网上。
### egg开发规范
- 使用命令生产egg项目
- 命名规范：文件小写，文件内class大写驼峰。
- egg的router写法等
- 接口数据处理使用 async await
- controller的概念
- service的概念
### demo与参考

[前端demo](https://github.com/YeWills/learns/tree/master/egg-client)

[后端demo](https://github.com/YeWills/learns/tree/master/egg-mysql-serve)

[慕课教程](https://www.imooc.com/learn/1185)





