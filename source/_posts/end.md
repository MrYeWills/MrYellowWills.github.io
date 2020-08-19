---
title: 0到1快速构建自己的后台管理系统
date: 2020/7/28
tags: [node]
categories: 
- 后端
series: 后端demo
---

## 基本信息
### mysql安装和使用
#### 安装
安装的过程可以参照网上，不过安装的过程中，mysql会给你一个初始密码，需要记住。
![](/image/end/pd.png)
```
root@localhost: xxxxxxxxx   //root 超级用户， localhost 本地环境， 本地环境下的超级用户密码
```
#### not found 报错
有一个not found 报错，可能是mysql正在运行，切掉mysql进程即可，（mac下，打开偏好设置配置，在底部就会出现mysql图标，点击进去，手动停止）
#### show databases 报错重置密码
```
ERROR 1820 (HY000): You must reset your password using ALTER USER statement before executing this statement.
修改
```
解决如下：
![](/image/end/1820.jpg)
[参考](https://www.youtube.com/watch?v=q1UNz5eisN8)

#### 设置(新)密码相关
像上面的密码设置好后，需要设置密码的使用期限，并且刷新mysql密码信息，才能使得新密码生效：
```
SET PASSWORD = PASSWORD('新密码');  //上面的设置新密码
ALTER USER 'root'@'localhost' PASSWORD EXPIRE NEVER; //设置本地环境下的超级用户root 密码的使用期限是永远不过期(never)。
FLUSH PRIVILEGES;//刷新特权，让刚才设置的密码相关生效
```
#### mysql命令以分号结尾
如果不以分号结尾，mysql则会认为命令还未执行完成，将不予执行。
#### 登陆mysql账户(root)
mysql里面可能有很多账号，因此需要登陆mysql账号。
命令如下：
```
mysql -u root -p  //user root 使用-p密码登陆
//输入上面设置的 root的账户密码
```


### 修改koa项目下的secure.js用户名和密码
如果不修改，npm启动lin-cms-koa-master就会报错。无法与数据库链接。
```js
// lin-cms-koa-master/app/config/secure.js
    database: 'lin_cms',//需要将中斜杠改成下斜杠
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    username: 'root',
    password: 'xxx', //数据库中密码
    logging: false,
    timezone: '+08:00'
```

### 项目导入数据库
#### mysql的source命令
[详细参考](https://doc.cms.talelin.com/start/koa/)
主要使用mysql的source命令来做，后期可以了解下
![](/image/end/db.png)

### navicat - mysql图形化工具
#### 安装
[破解版安装](https://www.macwk.com/soft/navicat-premium)
![](/image/end/db.png)

#### 操作mysql
可通过这个图形化工具，对mysql进行增删改查，实时生效。

### sequelize - 桥接koa与mysql的工具
```json
 "dependencies": {
    "@koa/cors": "^2.2.3",
    "koa": "^2.7.0",
    "koa-bodyparser": "^4.2.1",
    "koa-mount": "^4.0.0",
    "koa-static": "^5.0.0",
    "lin-mizar": "^0.3.5",
    "mysql2": "^2.1.0",
    "sequelize": "^5.21.13",//
    "validator": "^13.1.1"
  }
```



## post请求的演变

### 传统非权限方式
代码主要放置于 `default-post`分支中。
```js
class AddContentValidator extends LinValidator {
  constructor () {
    super();
    this.image = [
      new Rule('isNotEmpty', '内容封面不能为空')
    ];
    this.type = [
      new Rule('isNotEmpty', '内容类型不能为空'),
      new Rule('isInt', '内容类型id必须是数字')
    ];
    this.title = [
      new Rule('isNotEmpty', '内容标题不能为空')
    ];
    this.content = [
      new Rule('isNotEmpty', '内容介绍不能为空')
    ];
    this.url = [
      new Rule('isOptional'),
      new Rule('isURL', '内容外链必须是合法url地址')
    ];
    this.pubdate = [
      new Rule('isNotEmpty', '发布不能为空'),
      new Rule('isISO8601', '发布日期格式不正确')
    ];
    this.status = [
      new Rule('isNotEmpty', '内容有效状态未指定'),
      new Rule('isInt', '内容有效状态标识不正确')
    ];
  }
}

import { AddContentValidator} from '../../validator/content';

const contentApi = new LinRouter({
  prefix: '/v1/content'
});

contentApi.post('/', async ctx => {
  const v = await new AddContentValidator().validate(ctx);
  return ctx.json(v.get('body'));
});

```

post请求
url:`http://localhost:5000/v1/content`
body：
```json
{
        "image": "https://www.imooc.com/video/21672",
        "type": "100",
        "title": "七月",
        "content": "七月的三伏天",
        "pubdate": "2020-05-20",
        "status": "1"
    }
```
![](/image/end/post.jpg)

### 权限验证方式
#### 配置说明
lin-cms框架封装好了权限验证，只需要将上面请求的post改为linPost即可。
以下说明，可参考官方文档。
```js
const contentApi = new LinRouter({
  prefix: '/v1/content'
});
contentApi.linPost(
  'addContent',   //请求这个事件的唯一id，可随意定义，保持唯一即可
  '/',   //请求的路由
  {
    permission: '添加期刊内容',     // 需要什么权限
    module: '内容管理',   //是哪个模块的权限
    mount: true   //权限是否挂载到全局
  },
  groupRequired,   //守卫函数  需登陆且被授予相应的权限后才可访问
  logger('{user.username}新增了期刊内容'),   //用户操作日志
  async ctx => {
    const v = await new AddContentValidator().validate(ctx);
    await ContentService.addContent(v.get('body'));
    ctx.success({
      msg: '期刊内容新增成功'
    });
  });
```
#### 登陆前端页面获取令牌
打开前端页面，登陆进去后，打开控制台，获取 请求头中的Authorization，这里的内容就是token 令牌。
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTYzNTkxMzcsImlkZW50aXR5IjoxLCJzY29wZSI6ImxpbiIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE1OTYzNTU1Mzd9.HYrFWNES78tMGYd6O-Wdb_PBnp7XFGRy1boNIAb1Rkk
```
注意的是，上面令牌码中 Bearer 是定义令牌的类型，因此不是令牌码本身，因此真正的令牌是去掉Bearer后的：
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTYzNTkxMzcsImlkZW50aXR5IjoxLCJzY29wZSI6ImxpbiIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE1OTYzNTU1Mzd9.HYrFWNES78tMGYd6O-Wdb_PBnp7XFGRy1boNIAb1Rkk
```
#### postman使用令牌请求
如下图，postman中，带令牌的和不带令牌的区别不大，其他照旧，就增加了一个如下的token，由上面可知，lin-cms用的是bearer类型token，因此就用bearer Token
![](/image/end/token.jpg)

#### 普通用户与超级用户
可以使用超级用户root，创建一些普通用户测试相关权限的问题，普通用户登陆后，将令牌给postman，会发现令牌权限不足，这个时候可以通过前端来管理用户权限。
具体的权限管理，在前端项目中的分组管理中。

## 日志管理
为了查看用户做了哪些曾删改查的操作，在每个请求中，使用logger，这样的话，在前端页面中就可以查看到日志信息：
```js
const contentApi = new LinRouter({
  prefix: '/v1/content'
});
contentApi.linPost(
  'addContent',   //请求这个事件的唯一id，可随意定义，保持唯一即可
  '/',   //请求的路由
  {
    permission: '添加期刊内容',     // 需要什么权限
    module: '内容管理',   //是哪个模块的权限
    mount: true   //权限是否挂载到全局
  },
  groupRequired,   //守卫函数  需登陆且被授予相应的权限后才可访问
  logger('{user.username}新增了期刊内容'),   //用户操作日志
  async ctx => {
    const v = await new AddContentValidator().validate(ctx);
    await ContentService.addContent(v.get('body'));
    ctx.success({
      msg: '期刊内容新增成功'
    });
  });
```
![](/image/end/log.jpg)

## 异常处理
lin-cms框架使用了组件`NotFound`做错误处理，只要使用了这个错误码，框架层面就会给你处理好报错信息
```js
  static async editMovie (id, params) {
    const movie = await MovieModel.findByPk(id);
    if (!movie) {
      throw new NotFound();
    }
    return await movie.update({ ...params });
  }
```
```
{
    "code": 10040,
    "message": "令牌失效",
    "request": "PUT /v1/content/3"
}
```

## 请求流程与目录
### 发起请求与最后结果
下面两种图是发起请求的参数和最后数据库结果。
下面一小节会讲如何处理这个请求流程。
![](/image/end/post1.jpg)
![](/image/end/post2.jpg)

### 处理请求的流程
如下图，从左至右，
业务模块目录下的的js中接收到请求后，转发给服务层目录下的js，
服务层本该转发给模型层目录，但为了后期易维护性，将模型层的业务分割层dao目录和专门写模型的模型层。
因此服务层将请求转发给 dao目录，dao目录再转发给模型层。
模型层连接数据库，对数据库进行增删改查的写入。
![](/image/end/db_flow.jpg)
### service 服务层 
如上图
### model 模型
模型都放在 model目录，一个模型对应一张表。
模型相关的逻辑，为了维护方便，部分写在dao目录下。

### dao 模型逻辑的分割
模型相关的逻辑，为了维护方便，部分写在dao目录下。
### 全局数据库实例目录
如上图，最右侧的 db.js，配置数据库相关信息。

## 权限管理
主要看[官方文档](https://doc.cms.talelin.com/client/authority.html)
前端主要对菜单路由、按钮做了权限控制，表现形式就是显隐与disabled等；
后端同时也对相应权限处理，主要对请求的接口做权限控制。
注意的是前后端的权限名字需要约定成一致。
详细可参考 上面的官方文档 以及 [慕课网 - 核心机制权限控制联调](https://www.imooc.com/video/21690)

## FAQ
### 返回的数据中包含日期格式时报错处理
比如在项目中，如下的get请求会报错。
```js
  static async getContentList () {
    const movieList = await MovieDao.getMovieList();
    const musicList = await MusicDao.getMusicList();
    const sentenceList = await SentenceDao.getSentenceList();
    let res = [];
    res.push.apply(res, movieList);
    res.push.apply(res, musicList);
    res.push.apply(res, sentenceList);
    res.sort((a, b) => b.created_at.localeCompare(a.created_at));//报错
    return res;
  }
```
解决方法：
```js
//lin-cms-koa-master/app/config/secure.js
module.exports = {
  db: {
    database: 'lin_cms', // 需要与原来视频修改
   ...
   //处理日期格式
    dialectOptions: {
      dateStrings: true,
      typeCast: true
    }
  },
  secret:
    '\x88W\xf09\x91\x07\x98\x89\x87\x96\xa0A\xc68\xf9\xecJJU\x17\xc5V\xbe\x8b\xef\xd7\xd8\xd3\xe6\x95*4'
};

```


## postman使用
### post请求
![](/image/end/post.jpg)

## navicat使用
### 逆向表到模型
可以看表的结构
![](/image/end/navicat_dir.jpg)

## 前端部分
### 跨域
通过设置如下文件，然后在axios中直接使用。
```
//lin-cms-vue-demo/.env.development
VUE_APP_BASE_URL = 'http://localhost:5000/'
```
## github与参考资料
[sequelize中文文档](https://github.com/demopark/sequelize-docs-Zh-CN/tree/v5)
[慕课网教程](https://www.imooc.com/learn/1247)
[lin-cms官方文档](https://doc.cms.talelin.com/)
[前端github](https://github.com/YeWills/lin-cms-vue-demo)
[后端github](https://github.com/YeWills/lin-cms-koa)

