---
title: canvas笔记
date: {{ date }}
tags: [canvas]
categories: 
- 前端
---

## 基础知识
### html5、canvas、svg、WebGL历史
#### 介绍
html5的草案大概是2008年开始制定，用来取代1999制定的html 4.1，经历了html5草案制定，到2014年最终标准发布。
canvas [由苹果公司在 2004 年前后发明运用于Safari，后来其他的浏览器开始跟进](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Client-side_web_APIs/Drawing_graphics)，后来canvas被收入到html5草案中，之后大家对canvas关注越来越多(canvas被大家越来越多的关注，我推测应该在2008左右)，一直到2014年随着html5，作为标准发布。
[SVG 是由万维网联盟（W3C）自 1999 年开始开发的开放标准](https://developer.mozilla.org/zh-CN/docs/Web/SVG)，与canvas使用js绘图不同，svg使用xml来画图。
#### canvas是html5
canvas是html5.0的标准，在此前的标准(W3C标准,html4.1)中从未有过canvas，在html5.0标准于2014年被公布以前，canvas一直存在于html5.0的草案当中。
#### svg不是html5新创的标签
svg不是html5才出现的新标签，它在1999年就被开始制定，彼时还没有所谓的html5，但这不妨碍svg与html5的联系，因为在html5.0中，svg被丰富了更多的功能。
所以在html5之前与之后的svg，其功能还是有区别的。
#### canvas与svg的发展和区别
svg不是什么新的技术了，于1999年被创造后，一直到现在，svg并没有太多的突破发展。
相比而言，canvas是比较新的技术，于2008年(年份基于上面的推测)被大家关注以来，到现在，先后被用于2D，3D的位图绘制。
##### 从发展速度而言：
从这一点来看，canvas要比svg发展更快。
##### 从运用的角度来讲：
svg用于矢量图绘制，canvas用于位图绘制，所以二者不是纯粹的替代竞争关系；
- 只要你对矢量图有需求，svg永远不会被消失；
- 只要你对位图有需求，canvas永远不会被消失；
- 只要你对图有需求，svg和canvas都是你的选择；
##### 就兼容性而言：
svg、canvas 所有的浏览器都兼容，不同的是，svg因为很早就出现了，就算是低版本的浏览器也都兼容；
而canvas相对而言比较新，一些低版本的浏览器不支持，好消息是，都9102了，市面上的浏览器的版本基本都支持canvas，不用太担心兼容问题。
#### WebGL与canvas的关系
WebGL是基于canvas元素绘制3D图的js API。


### cxt.clearRect
重新渲染时，需要清除画布中上一次渲染：
```
 cxt.clearRect(0,0,WINDOW_WIDTH, WINDOW_HEIGHT);
```

### canvas基于状态绘图的特性
#### 介绍
先设置好路径作为绘图状态，再使用绘制的api绘图，例如：
```
//设置状态
context.moveTo(100,100)
context.lineTo(700,700)
context.lineWidth = 10
context.strokeStyle = “#058”

//绘图
context.stroke()
```
#### 使用beginPath来分别设置状态
如上面代码，canvas不针对某一个形状进行状态设置，因此设置的状态都是针对全局的，假如我们要对画布内几个图形分别设置状态如颜色，
此时需配合beginPath使用：
```
context.beginPath()
context.moveTo(100,100)
context.lineTo(700,700)
context.lineWidth = 10
context.strokeStyle = “#058”

context.beginPath()
context.moveTo(1100,1100)
context.lineTo(1700,1700)
context.lineWidth = 15
context.strokeStyle = “red”

//绘图
context.stroke()
```

### moveTo 与 lineTo
#### beginPath与lineTo一起，lineTo相当于 moveTo
```
context.beginPath()
context.moveTo(100,100)
context.lineTo(700,700)
```
等同于，因为beginPath相当于从新开始：
```
context.beginPath()
context.lineTo(100,100)
context.lineTo(700,700)
```
### 注意stroke 与 fill 顺序
如果你要对一个矩形填充，并且绘制样式多样的边线，那么请线fill，后stroke，反之 填充的效果就覆盖了线条的效果。

### 接口汇集
#### 矩形
```
rect( x , y , width , height )
fillRect( x , y , width , height )
strokeRect( x , y , width , height )
```

#### 填充与绘制
```
stroke()
fill()
```

### beginPath、 closePath
#### 介绍
画一个形状时，需要cxt.beginPath()，但closePath不是必须，可以不使用，下次再使用cxt.beginPath()时，会默认自动closePath上一个路径。
```
cxt.beginPath();
cxt.arc( x+j*2*(RADIUS+1)+(RADIUS+1) , y+i*2*(RADIUS+1)+(RADIUS+1) , RADIUS , 0 , 2*Math.PI )
cxt.closePath()
cxt.fill()
```
#### closePath不是必须
参考上面分析

#### 第一个beginPath可以省略
```
context.beginPath()//可省略
context.moveTo(100,100)
context.lineTo(700,700)

context.beginPath()
context.moveTo(1100,1100)
context.lineTo(1700,1700)
```
#### 封闭图形推荐使用closePath
封闭图形使用closePath的好处在于，自动封闭严密，一些封闭不齐，有凹角等等问题，都会被自动解决。

#### 使用beginPath来分别设置状态
参考《canvas基于状态绘图的特性 -- 使用beginPath来分别设置状态》


### 生成(2d)画布上下文的要素
注意的是canvas.width，不要使用css的方式嵌入，具体原因待写，最好直接以style属性或js直接写入。
```
var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");
canvas.width = WINDOW_WIDTH;
canvas.height = WINDOW_HEIGHT;
```

## 炫丽的倒计时效果demo
### 数据建模--多维数组矩阵创建数字模型
用一个只有0和1的数组，1表示有路径，0表示填充为空。
![](/image/canvas/digit.png)
![](/image/canvas/cell.png)

### 计算数字矩阵模型内的元素坐标
如上图所示，只要我们能知道矩阵左上角的坐标值xy，就可以计算出矩阵内所有的元素坐标值；
值得注意的是，上面的i和j分别是二维数组的i和j，它们对应的初始值都是0，具体公式，参考上图。

### 模拟抛物线路径
#### 实现代码
```js
 var aBall = {
        x:x+j*2*(RADIUS+1)+(RADIUS+1),
        y:y+i*2*(RADIUS+1)+(RADIUS+1),
        //g是重力加速度，只影响在垂直方向的速度，Math.random() 创造每个不同小球不同的重力加速度，产生不同的速度，让每个小球运动更加自然
        g:1.5+Math.random(),
        //vx小球在x 水平方向的速度，Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4 其实就是随机生成-4和4
        vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4,
        //vx小球在y 垂直方向的速度，让小球有一个向上抛的动作。
        vy:-5,
    }
```
```js
 for( var i = 0 ; i < balls.length ; i ++ ){

        //模拟抛物线路径
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;
    //0.75是空气阻力，当球面落到地面时，小球应该反弹原来高度的0.75
        if( balls[i].y >= WINDOW_HEIGHT-RADIUS ){
            balls[i].y = WINDOW_HEIGHT-RADIUS;
            balls[i].vy = - balls[i].vy*0.75;
        }
    }
```
#### x、y坐标值
参考上面代码
#### g 重力加速度
参考上面代码
#### vx 水平方向速度
参考上面代码
#### vy 垂直方向速度
参考上面代码
#### 空气阻力
参考上面代码

### 碰撞检测
```
//只取屏幕内的元素
    var cnt = 0
    for( var i = 0 ; i < balls.length ; i ++ ){
        //碰撞检测--满足下面情况说明在屏幕上
        if( balls[i].x + RADIUS > 0 && balls[i].x -RADIUS < WINDOW_WIDTH ){
            balls[cnt++] = balls[i]
        }
    }
//balls数组前面的元素，都是最先生成的，因此，也应该最先被删除
    while( balls.length > cnt ){
        balls.pop();
    }
```
### 溢出删除的优化处理
参考《碰撞检测》
### 用50毫秒轮询模拟1秒的动作
```js
 setInterval(
        function(){
            //渲染时间的显示
            renderTimes( context );
            //渲染小球的显示
            renderBall( context );
            //更新时间 和 小球数据，以备下次时间和小球渲染使用
            updateBallDatas();
        } , 50
    );
```
当时在想，既然做一个定时器，那么就写一个1秒的轮询，这样才有道理，其实不然，如果写一个1秒的轮询就会有延迟的现象；
如果你用一个50毫秒的轮询，如果秒钟没有到达下一秒，画面其实也不会跳转，因为50毫秒内拿到什么画面，就显示什么画面，在一秒内，有20个50毫秒，
这20个50毫秒内拿到的时间肯定都是一个值，那么渲染出来的值肯定也是一个值，就不会有跳转，也不会出现延时，就算出现延时也只是50毫秒内，可以接受。
所以，要想做一个响应快速的，应该将轮询值改得更小，而不是放大。
#### 误区一：以为1秒的定时器就应该使用1秒的轮询
参考上面讲解
#### 误区一：以为50秒的轮询会让定时器加速跳转
参考上面讲解
#### 一秒的定时器，必须使用小于一秒的轮询
参考上面讲解
#### 轮询时间越小，延时更小，响应更快
参考上面讲解
#### 轮询时间需要平衡js代码执行时间和性能
代码轮询时，执行了很多js，这些js如果非常大量，也是需要时间才能执行完，所以轮询时间要考虑是否大量执行js会延迟轮询时间，也要考虑性能。

### demo地址
[点击查看demo](https://github.com/YeWills/canvas-demo/blob/master/pages/index.html)



