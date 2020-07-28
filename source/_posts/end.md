---
title: 后端demo
date: {{ date }}
tags: [node]
categories: 
- node
series: node
---

## 0到1快速构建自己的后台管理系统
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
#### 登陆mysql账户(root)
mysql里面可能有很多账号，因此需要登陆mysql账号。
命令如下：
```
mysql -u root -p  //user root 使用-p密码登陆
//输入上面设置的 root的账户密码
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

















