---
title: node笔记
date: 2020/8/13
tags: [node]
categories: 
- [后端]
series: node
---

## 基础知识
### 认识node的魔力很重要
#### 脱离浏览器下运行js
node最大的作用之一，就是让你在脱离浏览器的情况下运行js。一般js只能运行在浏览器上。
但node可以让你在脱离浏览器的情况下，写js，这点非常重要。
#### 提供底层操作能力
除此之外，node还提供了很多能力，让你通过js就可以操作cpu，内存，读写文件 这些以前后端才能做的底层的操作能力。
#### 中间层：服务器中负责IO读写的中间层服务器
待完善。
### 把玩node的技巧
#### 使用commonjs而不用import
node可以识别commonjs规范，但不能识别import es6。
在自己玩一玩node的时候，使用commonjs而不用import，避开webpack babel ts 等等干扰。
#### commonjs畅通无阻
如果玩一玩node，使用commonjs可以用得很爽。
#### 可以写个小js打印下node的各种模块变量
排除其他比如 webpack babel 等干扰，写一个小js，js中打印以下node的各种模块，比如 __dirname等等。


### 全局模块
#### 好用的process.argv
process.argv可以获取控制台命令的参数。
比如在控制台输入
```
node ./src/app.js node -v
```
js中 console.log(process.argv) 就是：
```
[ '/usr/local/bin/node',
  '/Users/js/Desktop/work/git/learns/sequelize-demo/src/app.js',
  'node',
  '-v' ]
```
你在js中获取到命令中最后两个参数是node 和 -v 后，就判定用户想知道版本号，那么就在js中console.log的方式打印版本号出来，在cmd中将会看到打印出来的版本号。
这只是其中一个例子，**你可以以此类推，可以自己写一些命令工具。**

#### __dirname在编译和未编译的js中的区别
在没有编译的地方__dirname就是文件当前的目录；
如果这个文件是webpack将会被编辑的，一般是前端业务js，此时的__dirname是webpack编译完成后的js所处文件的目录，也可能这个js经过webpack编译后，被合并到一个统一的versor.js文件中，此时__dirname就是此文件目录。

### 系统模块
指的是需要require，但不需要下载的模块，比如path模块。

### exports 与 module.exports
#### 优先用module.exports
```js
exports.a = 1;
exports.b = 2;

// 等效于
module.exports={
  a:1,b:2
}
```
不过导出时一般用 module.exports;

#### 区别
```js
class girl {
  constructor(age) {
    this.age = age
  }
  love(u) {
    return "你是个好人!"
  }
}
// 把她导出去
exports = girl  // 出错！ 不能重写exports！
// 正确做法
module.exports = girl
```
### http.createServer
#### listen
http.createServer表明启了一个服务，光一个服务还不行，你需要告诉我端口，因为服务的完整地址肯定包括端口。
下面的listen的意思
```js
const http = require('http');
http.createServer(()=>{
    console.log('我来了')
}).listen(8000)
```
#### res req
接着上面，既然访问了服务器，那么肯定要给一定响应,不然访问者就会一致访问且等待。
因此就有了req，res。
```js
const port = 3000;
http.createServer((req,res)=>{
    const file = req.url.replace('/','') || 'test.html'
    fs.readFile(path.resolve(__dirname,file), (err, data)=>{
        if(err){
            res.writeHead(404);
            res.end('404 not found')
        }
        res.end(data)//可以读取图片或html
    })
}).listen(port, ()=>console.log(`open port ${port}`))
```
#### 在浏览器中显示html或图片
参考《res req》，demo看参考里面。
#### demo
[图片和html 浏览器显示]()

### 设置不同响应头类型，html显示不一样
```js
const port = 3000;
http.createServer((req,res)=>{
    const file = req.url.replace('/','') || 'test.html'
    fs.readFile(path.resolve(__dirname,file), (err, data)=>{
        if(err){
            res.writeHead(404);
            res.end('404 not found')
        }else{
            res.writeHead(200,{
                // "Content-Type":"text/plain;charset=utf-8"//作为txt文件返回
                "Content-Type":"text/html;charset=utf-8"//作为html文件返回
            });
            res.end(data)
        }
      
    })
}).listen(port, ()=>console.log(`open port ${port}`))
```
这里是一个[demo  参看 typeApp.js]()，表现了不同响应头类型后，html在浏览器上显示效果不一样，一个以txt文件渲染，一个以html实际解析效果渲染

### res.writeHead设置响应头
参考《设置不同响应头类型，html显示不一样》





## 黑知识
### 神奇的相对路径
#### 报错not suce file

已知 test.md的路径为：
```
./sequelize-demo/src/test.md
```
已知 app.js的路径为：
```
./sequelize-demo/src/app.js
```
app.js的代码为：
```js
const fs = require('fs')
fs.readFile('./test.md',(err,data)=>{
    console.log(err)
    console.log(data.toString())
})
```
那么在根目录下执行命令：
```
node ./sequelize-demo/src/app.js
```
会报错 找不到 ./test.md 这个文件。

#### 解决方式一
原来是因为readFile的相对地址，不是以 app.js所在目录作为参考的，而是以执行node命令的目录为参考的。
因为我们是在根目录下执行node命令，因此需要修改readFile地址如下，就可以正常了：
```js
fs.readFile('./sequelize-demo/src/test.md',(err,data)=>{
    console.log(err)
    console.log(data.toString())
})
```
#### 解决方式二(推荐)
上面的相对地址容易出问题，在此推荐以绝对路径来处理：
```js
const fs = require('fs')
const path = require('path')

fs.readFile(path.resolve(__dirname,'test.md'),(err,data)=>{
    console.log(err)
    console.log(data.toString())
})
```
#### 如果同在根目录就没有此异常
如果上面的app.js在根目录下，就不会出现上面的问题，原因参考《解决方式一》

### JSON.stringify与toString使用
#### JSON.stringify输出内容的二进制
```js
fs.readFile(pa,(err,data)=>{
    console.log(JSON.stringify(data))//{"type":"Buffer","data":[97,98,99]}
    console.log(data.toString())//abc
})
```
#### toString可输出字符串的Buffer二进制流
如果我们知道这个二进制流Buffer是一个字符串，那么可以使用toString来解析成字符串。

#### toString输出正常内容
参考上面《JSON.stringify输出内容的二进制》《toString可输出字符串的Buffer二进制流》

#### 读取文件内容推荐toString
参考上面《JSON.stringify输出内容的二进制》

### require的路径
- 如果有路径，就去路径里面找   -- require('./ph.js')
- 没有路径就去 node_modules里面找  -- require('./react')
- 如果node_modules没有，就去node的全局安装目录找

### webpack编译时可使用fs，页面js中不行，why？
原来，node script 进行webpack编译的时候，其实是基于node环境的：
```js
 "start": "npx webpack-dev-server --config webpack.dev.js"
```
node script 本身就是基于node环境的，所以能够在webpack.dev.js中使用node的各种模块。
由webpack编译出来的html，放在webpack的devServe服务器上，我们才可以通过浏览器访问。
webpack编译完后会启动一个本地服务，因此从我们通过浏览器访问页面开始，我们所使用的环境已经不是node了，从编译完后，node的工作基本上就结束了。
运行在浏览器上的html，其运行环境是浏览器，非node环境，因此html不能获取node模块的各种包，当然了，也不排除webpack将node的一些包内置给html，
不过从目前看，fs是没有内置到html上的。

小结下：编译环境是运行在node上，html文件是运行在浏览器上，前者具备node各个模块，后者不具备。

### 为什么前端工程化都使用node
#### node让js脱离浏览器运行成为可能
前端工程化需要对前端文件进行压缩打包，需要提供前端开发环境或实时编译的开发模式。
要实现上面的文件压缩打包，就必然用到对文件的读写能力；
要提供开发环境或模式，就必然需要启动服务；
对文件的读写，你可以使用很多其他语言，比如java等等。
但一个前端人员肯定希望js能够做到底层操作，而node满足了这点。
原本js是运行在浏览器上的一门语言，脱离浏览器就能运行了。
而上面的编译或者提供服务器功能，都是在非浏览器环境下的。
因此在node出现前，上面的这些功能若使用js完全是不可能。
#### node为js提供了很多底层操作能力
node提供了fs文件操作能力，提供了http服务器能力，还有很多其他功能，如操作系统内存等等。
在node环境下，js具备了操作底层的能力，而这些在浏览器下js所不具备的。
#### 强大的npm生态
node提供了强大的npm生态，各种高手可以开发一个npm包，然后在node或js中运行。
#### 小结
基于以上，所以一般前端工程化（编译阶段），包括js的后端工程化基本上都是基于node(基于npm)
#### node后端工程的业务js都有node功能
与前端工程化不一样的是，前端一般只有编译阶段的代码具有node的环境。
node后端工程，包括后端工程的编译以及后端工程的接口业务逻辑代码，都是运行在node环境下的，都能使用node模块。
**后端工程中的代码，无论编译和运行都是在node环境内，都具有node模块能力**，如果不是这样，为什么后端能够到处使用express或koa来写接口逻辑呢。因为express是一个抽象了原生nodejs的框架。

## node调试
参考另外一篇博客《vscode笔记 - vscode调试》
