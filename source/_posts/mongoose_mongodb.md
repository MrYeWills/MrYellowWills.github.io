---
title: mongoose 与 mongodb笔记
date: 2020/5/1
tags: [mongoose, mongodb]
categories: 
- 后端
series: [mongoose, mongodb]
---

关于 mongoose 与 mongodb笔记 暂时以问答方式叙述。
## mongoose 与 mongodb 基本知识

### 什么是mongodb服务端和客户端
启动mongodb服务端，cmd命令为 mongod；这表明在电脑上启动了mongodb服务，启动了mongodb服务端；
启动mongodb客户端，cmd命令为 mongo；此命令执行后，cmd处于输入状态，可以对数据库进行增删改查；
以上两面命令 都基于mongodb安装目录(C:\Program Files\MongoDB\Server\4.0\bin)下的mongod.exe和mongo.exe；

### 在哪些目录下执行mongo等命令才能连接数据库?
启动mongodb有两层意思，一个是启动mongodb服务器，一个是启动mongodb的客户端mongo。
上面两个动作没有目录限制，这个命令是全局的，在任意目录上都启动cmd都可以操作MongoDB数据库。
整个电脑，任何项目创建的数据库，都可以通过任意目录下，启动
cmd都可以查到，并且对数据库进行增删改查操作。

### 启动mongodb 以及数据库、表格的查看
主要为两个命令：
mongod //启动mongod 服务器，这是一切操作数据库的基础准备工作
mongo //启动mongodb客户端，用来连接mongodb并进行相关数据的查询
具体步骤如下：
####  在任意目录下启动cmd 执行 mongod;
```
$ mongod
2019-03-24T11:25:33.479+0800 I CONTROL  [main] Automatically disabling TLS 1.0, to force-enable TLS 1.0 specify --sslDisabledProtocols 'none'
2019-03-24T11:25:33.483+0800 I CONTROL  [initandlisten] MongoDB starting : pid=8380 port=27017 dbpath=C:\data\db\ 64-bit host=UO4SB7YL9WOZ3OK
2019-03-24T11:25:33.483+0800 I CONTROL  [initandlisten] targetMinOS: Windows 7/Windows Server 2008 R2
2019-03-24T11:25:33.483+0800 I CONTROL  [initandlisten] db version v4.0.6
2019-03-24T11:25:33.483+0800 I CONTROL  [initandlisten] git version: caa42a1f75a56c7643d0b68d3880444375ec42e3
2019-03-24T11:25:33.483+0800 I CONTROL  [initandlisten] allocator: tcmalloc
2019-03-24T11:25:33.483+0800 I CONTROL  [initandlisten] modules: none
2019-03-24T11:25:33.484+0800 I CONTROL  [initandlisten] build environment:
2019-03-24T11:25:33.484+0800 I CONTROL  [initandlisten]     distmod: 2008plus-ssl
2019-03-24T11:25:33.484+0800 I CONTROL  [initandlisten]     distarch: x86_64
2019-03-24T11:25:33.484+0800 I CONTROL  [initandlisten]     target_arch: x86_64
2019-03-24T11:25:33.484+0800 I CONTROL  [initandlisten] options: {}
2019-03-24T11:25:33.486+0800 I STORAGE  [initandlisten] exception in initAndListen: NonExistentPath: Data directory C:\data\db\ not found., terminating
2019-03-24T11:25:33.486+0800 I NETWORK  [initandlisten] shutdown: going to close listening sockets...
2019-03-24T11:25:33.486+0800 I CONTROL  [initandlisten] now exiting
2019-03-24T11:25:33.486+0800 I CONTROL  [initandlisten] shutting down with code:100
```

####  接着执行 mongo；
```
$ mongo
MongoDB shell version v4.0.6
connecting to: mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("4f84c125-8db8-4d3a-ad61-5c85b2817fb7") }
MongoDB server version: 4.0.6
```

此时命令窗口处于等待输入命令的状态，就像输入node后，等待执行的情况。

####  数据库、表格的查看；
此时在此cmd窗口，接着输入以下命令，对数据库进行增删改查：

```
$ mongo
MongoDB shell version v4.0.6
connecting to: mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("4f84c125-8db8-4d3a-ad61-5c85b2817fb7") }
MongoDB server version: 4.0.6
show dbs  //显示MongoDB目前有多少数据库
admin           0.000GB
config          0.000GB
douban-test     0.000GB
douban-trailer  0.000GB
local           0.000GB
test            0.000GB
yyy             0.000GB
use yyy //使用yyy数据库，use 数据库name，有此name就是用此数据库，没有就是创建数据库
switched to db yyy
show tables //显示数据库有多少表格
fruits
db.fruits.find() //显示 fruits 表格的数据内容
{ "_id" : ObjectId("5c964dbe52f3fd21d06da3a0"), "category" : "apple", "name" : "apple", "__v" : 0 }
{ "_id" : ObjectId("5c964dca541443051483e3c8"), "category" : "apple", "name" : "apple", "__v" : 0 }
```

[更多信息点击](https://www.cnblogs.com/shirly77/p/6536327.html)


### 用mongodb原生命令还是mongoose操作数据库？
在这里只讨论node端。
值得注意的是，我们大多不通过mongodb原生命令操作数据库，而是通过mongoose；
一个是mongoose 更能优雅地进行MongoDB对象建模，
而且Mongoose写了很多mongodb的验证机制、类型转换与业务逻辑模板，然后提供几个简单的api给我们，简化了工作，等等。
因此在实际项目开发中，包括连接数据库以及之后的所有操作都是通过mongoose来操作。
因此建议不用太去花太多时间去看mongodb的api教程，稍微了解下即可，然后多看看mongoose的相关操作。

### 花更多时间学mongodb还是mongoose教程？
请参看《用mongodb原生命令还是mongoose操作数据库？》。

### 要不要手动建文件夹目录data\db？
我在刚接触 mongodb时，以为启动mongodb要建文件夹目录，用来存放数据库数据，其实不必了。
只要在cmd上启动好mongodb服务器就好，其他的就交给项目使用mongoose来操作mongodb就好。
不要创建什么数据库文件夹目录。

### 经典demo-创建数据库、表格和数据 
#### demo 代码
启动mongodb后，在任意目录下，使用node 执行如下代码：
```
const mongoose = require('mongoose');
//mongoose.connect 连接mongodb服务器中的数据库，newdbName是数据库名，有则连，无此name数据，就创建
mongoose.connect('mongodb://localhost:27017/newdbName',{
    useNewUrlParser:true
});
//Schema 定义表格Field的类型和规则，这个过程称为 建数据模型
var schema = new mongoose.Schema({ name: 'string', size: 'string' });
//Model 将Schema定义的模型继承过来，生成表格tables,这里生成的名字为 Tank，在数据库中表格名是复数，见《的解释》
var Model = mongoose.model('Tank', schema);
//new Model()此方法用来表格数据的增删改查,
var small = new Model({ size: 'small' });
small.save(function (err) {
  if (err) return handleError(err);
  console.log('创建成功');
})
```

#### mongodb客户端mongo检测是否生成成功
将以上代码复制到js中，然后 node 该js试试，如果出现创建成功；
然后任意目录下 启动cmd，打开mongodb客户端，查看newdbName数据库是否生成，以下是正常生成的代码：

```
Administrator@UO4SB7YL9WOZ3OK MINGW64 ~/Desktop
$ mongo
MongoDB shell version v4.0.6
connecting to: mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("a6d3c14e-703d-44d8-851f-60dbb5ad2b9e") }
MongoDB server version: 4.0.6
show dbs
admin           0.000GB
config          0.000GB
douban-test     0.000GB
douban-trailer  0.000GB
local           0.000GB
newdbName       0.000GB
onedb           0.000GB
test            0.000GB
twodb           0.000GB
yyy             0.000GB
use newdbName
switched to db newdbName
show tables
tanks
db.tanks.find()
{ "_id" : ObjectId("5c974d5df84c0d2b9450f43c"), "size" : "small", "__v" : 0 }
```

### mongodb、mongoose概念
本节内容参考如下，如有疑问点击如下连接详细了解。
[参考1](https://www.cnblogs.com/chris-oil/p/9142795.html)
[参考2](http://www.runoob.com/mongodb/mongodb-databases-documents-collections.html)
#### mongodb 与 传统数据库 概念对比
![](/image/mongodb/db.jpg)

#### mongodb 、mongoose 与 传统数据库 概念对比
结合 《经典创建数据库、添加表格和数据 demo》一起看
![](/image/mongodb/mongoose.jpg)

#### mongoose核心概念 与 数据库知识 对应关系
结合 《经典创建数据库、添加表格和数据 demo》一起看
![](/image/mongodb/index.jpg)

#### 小结
- mongodb中说的集合，其实就是tables，通过model生成；
- mongodb中说的文档，其实就是tables的行数据，通过model实例生成；
- mongoose的重点在Schema和model，其实与数据直接打交道最多的是model；
- 至于生成或连接数据库，就是mongoose.connect方法。


### mongoose.model第一个参数的复数才是tables名字！！
mongoose.model(abc,oneSchema)定义的第一个参数abc,abc并非tables表格名字,它的复数才是，数据库中的表格名字是abces。
例如：
```
let Model = mongoose.model("fruit",Schema);
let apple = new Model({
        category:'apple',
        name:'apple'
    });
	apple.save()
	
cmd中执行命令：
show tables，
名字是fruits,非 fruit。
```


### 创建或连接数据库

创建和连接数据库一般通过mongoose，用的命令都是mongoose.connect。

在任意目录cmd，然后执行如下命令，看到mongodb服务器中有数据库twodb；
```
mongo
show dbs
admin           0.000GB
config          0.000GB
local           0.000GB
newdbName       0.000GB
onedb           0.000GB
test            0.000GB
twodb           0.000GB
```
例如我现在要连接 数据库twodb，步骤如下

```
mongoose.connect('mongodb://localhost:27017/twodb',{
    useNewUrlParser:true
});
```

如上，mongodb://localhost:27017/ 这是默认写法，twodb是数据库写法，
当twodb这个数据库在mongodb存在时，就连接此数据库，当不存在时，就是创建名为twodb的数据库。

### mongodb://localhost:27017/dbName
我们如果要连接dbName数据库，为什么mongoose.connect的时候，却要写成mongodb://localhost:27017/twodb;
例如：
```
mongoose.connect('mongodb://localhost:27017/twodb')
```
那么为什么要这样呢。
**原来这是mongodb的标准 URI 连接语法：**

```
mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
```

- mongodb:// 这是固定的格式，必须要指定。
- username:password@ 可选项，如果设置，在连接数据库服务器之后，驱动都会尝试登陆这个数据库
- host1 必须的指定至少一个host, host1 是这个URI唯一要填写的。它指定了要连接服务器的地址。如果要连接复制集，请指定多个主机地址。
- portX 可选的指定端口，如果不填，默认为27017
- /database 如果指定username:password@，连接并验证登陆指定数据库。若不指定，默认打开 test 数据库。
- ?options 是连接选项。如果不使用/database，则前面需要加上/。所有连接选项都是键值对name=value，键值对之间通过&或;（分号）隔开
这里就不展开了，[更详细的请点击这里了解](http://www.runoob.com/mongodb/mongodb-connections.html)。

一般使用mongoose.connect('mongodb://localhost:27017/twodb')连接即可。

### mongodb目录
C:\Program Files\MongoDB\Server\4.0\bin

## 参考
[深入浅出mongoose-----包括mongoose基本所有操作,非常实用!!!!!](https://www.cnblogs.com/chris-oil/p/9142795.html)
[mongodb 怎样检测 安装成功 以及mongodb的一些增删改查命令](https://www.cnblogs.com/shirly77/p/6536327.html)
[MongoDB 教程](http://www.runoob.com/mongodb/mongodb-query.html)
