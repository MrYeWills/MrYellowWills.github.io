---
title: svg笔记
date: 2020/5/1
tags: [svg]
categories: 
- 图形化
---

## svg知识
### 常见的svg标签
```
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" version="1.1">
    <defs>
        <marker id="marker" markerWidth="10" markerHeight="10" refX="4" refY="4" orient="auto">
            <path d="M 0 0 4 4 0 8" style="fill:none;stroke:black;"/>
        </marker>
    </defs>
    //矩形  --可用于生成直方图
    <rect width="200" height="100" x="20" y="20" style="fill:red;stroke:blue;stroke-width:4"/>
    <rect width="200" height="100" x="250" y="20" rx="20" ry="20" style="fill:red;stroke:blue;stroke-width:4"/>
    <circle cx="100" cy="280" r="80" style="fill:yellow"/>
    //椭圆
    <ellipse cx="330" cy="280" rx="100" ry="80" style="fill:yellow"/>
    //直线
    <line x1="0" x2="360" y1="0" y2="360" style="stroke:#000;stroke-width:4;marker-end:url(#marker);"/>
    //多边形比如三角形、矩形、梯形、多边形，会自动闭合
    <polygon points="25 10,10 40, 50 27" style="fill:green;stroke:orange;stroke-width:4"/>
    //折线 也可以画多边形， 不会自动闭合
    <polyline points="25 10,10 40, 50 27" style="fill:green;stroke:orange;stroke-width:4" transform="translate(100,0)"/>
    <text x="200" y="150" style="fill:purple;font-size:60;" textLength="300">
        I love <tspan fill="green">D3.js</tspan>
    </text>
    //万能path，能画任何线条
    <path d="M 200 200 A 200 200 0 0 1 400 400" style="fill:none;stroke:orange;stroke-width:10;" />
</svg>
```
### xmlns 与 version
xmlns是固定写法，固定值如下，version也是固定写法，最近的版本就是1.1:
```
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" version="1.1">
</svg>
```


### path
#### path命令基本规律：
1.区分大小写：大写表示坐标参数为绝对位置，小写为相对位置
2.最后的参数表示最终要到达的位置
3.上一个命令结束的位置就是下一个命令开始的位置
4.命令可以重复参数表示重复执行同一条命令
#### 小写 相对坐标 与 大写 绝对坐标
上面介绍的都是用绝对坐标，其实一般画图都使用相对坐标小写的，比如：
```
//效果跟上面的 《path指令 M 、V、 H、Z、L --- demo2》是一样的，但增加了灵活性，
//当随意改变起始点坐标是，图形不被破坏，这是绝对坐标做不到的。
<path stroke='orange' stroke-width='.8' fill='orange' d='M 20 70 h 30 v -10 l 10 20 l -10 20 v -10 h -30 z' />
```

#### 逗号有没有不影响
比如下面两个代码，一个有逗号，一个没有，对于电脑而言都能正常识别，加逗号只是为了人能够识别理解
```
 <polygon points="25 10,10 40, 50 27" style="fill:green;stroke:orange;stroke-width:4"/>
 <polygon points="25  10 10 40  50 27" style="fill:green;stroke:orange;stroke-width:4"/>
```

#### path 指令
这里只列举部分，[更多参考](https://www.bbsmax.com/A/A7zgmMwW54/)：
```
指令 	参数 	说明
M	x y	将画笔移动到点(x,y)
L	x y	画笔从当前的点绘制线段到点(x,y)
H	x	画笔从当前的点绘制水平线段到点(x,y0)
V	y 	画笔从当前的点绘制竖直线段到点(x0,y)
A	rx ry x-axis-rotation large-arc-flag sweep-flag x y	画笔从当前的点绘制一段圆弧到点(x,y)
C	x1 y1, x2 y2, x y	画笔从当前的点绘制一段三次贝塞尔曲线到点(x,y)
```
```
 <path d="M 200 200 A 200 200 0 0 1 400 400" style="fill:none;stroke:orange;stroke-width:10;" />
```
#### path的贝塞尔曲线
ps工具中的钢笔工具就是一个贝塞尔曲线，贝塞尔曲线由几个点组成，[具体参考这个视频的末尾段的介绍](https://www.bilibili.com/video/av13105102/?spm_id_from=333.788.videocard.3)
#### path指令 M 、V、 H、Z、L
##### 指令介绍

- M 坐标点
- V 垂直
- H 水平
- Z 闭合
- L 连线到坐标点
##### demo 1
如下，viewBox代表从原点 0 0 开始，像x、y轴各延伸100；
```
<svg viewBox='0 0 100 100' style='border:green solid'>
//d='M 10 0 V 100' 从坐标x 10 、 y 0开始，垂直方向延伸y 100；
<path stroke='green' stroke-width='.2' d='M 10 0 V 100'/>
//d='M 0 10 H 100' 从坐标x 0 、 y 10开始，水平方向延伸x 100；
<path stroke='green' stroke-width='.2' d='M 20 0 H 100'/>
</svg>
```
##### demo2
```
//在坐标点20 10 开始，水平移到 x50，再垂直移到y0，然后连线到坐标点60 20，再连线到坐标点 50 40，然后垂直移动到y30
//然后水平移到x20，然后连接到起始点闭合。
<path stroke='blue' stroke-width='.8' fill='blue' d='M 20 10 H 50 V 0 L 60 20 L 50 40 V 30 H 20 Z' />
```
效果：
{% img url_for /image/d3/all/svg1.jpg %}


### polygon 与 polyline
#### 代码
```
   //多边形比如三角形、矩形、梯形、多边形，会自动闭合
   //坐标 25 10， 坐标点10，40， 坐标点 50，27 形成三角形
    <polygon points="25 10,10 40, 50 27" style="fill:green;stroke:orange;stroke-width:4"/>
    //折线 也可以画多边形， 不会自动闭合
    <polyline points="25 10,10 40, 50 27" style="fill:green;stroke:orange;stroke-width:4" transform="translate(100,0)"/>
```
#### polygon 画多边形
参考上面代码
#### polyline 画折线
参考上面代码
#### 二者区别
polygon 会自动闭合，画多边形比较方便，polyline不会自动闭合，可以画多边形，当不方便，更多用于画折线。

### 指令Q - quadratic 二次曲线
#### Q指令
如下 Q 后面跟两个坐标点，第一个点为曲线最高或最低点，第二个点为曲线终点。
```
<path stroke='red' stroke-width='.8' fill='none' d='M 20 30 Q 25 0, 50 30 ' />
```
#### Q第一个点y轴实际位置为 (自身y+起始点y)/2
比如上面代码`d='M 20 30 Q 25 0, 50 30 '` q的第一个点为 25 0，自身的y值为0，起始点M的y值为30，那么实际位置为15.
不需知道为什么，知道是这个规律就行。
#### Q 的镜像指令 T指令
T跟着的坐标点为终点。终点恰当与否，决定镜像是否更像。
```
<path stroke='red' stroke-width='.8' fill='none' d='M 20 50 Q 25 10, 50 50 T80 50' />
```
[参考demo]()

### 指令C - curve 曲线
#### C指令
如下 C 后面跟三个坐标点，第一和第二个点用来控制曲线的弧度，第三个点为终点。
```
 <path stroke='blue' stroke-width='.8' fill='none' d='M 20 50 C 40 40, 60 40, 80 50' />
```
#### C指令 与 Q指令关系
二者都用来画曲线，能达到一样效果，不过，c后面跟着三个点，所以相比Q（两个点），更能精确控制曲线弧度。

#### C 的镜像指令 S指令
相比Q的镜像T指令，C时只能用S进行镜像，S的最后一个点为终点，之前的点用来调节镜像弧度：
```
 <path stroke='yellow' stroke-width='.8' fill='none' d='M 20 50 C 30 40, 40 40, 50 50 S 70 60 80 50' />
```
[参考demo]()

### 指令A - Arc 圆弧
#### A指令
```
 <path stroke='blue' stroke-width='.8' fill='gray' d='M 30 50 A 1 1, 0 , 0 0, 70 50' />
```
如上 C 后面跟7个参数。
- 最后两个参数：70 50为终点
- 第一、二个参数： 
情况一：比如本例： 1 1 ，为圆弧的x、y轴比例，M30 50 与终点70 50，已经确定了圆半径，此时圆弧xy比例不一样，就形成对应比例的圆或椭圆。
情况二：当值大于圆弧半径时，此参数就不是比例了，就是圆弧的圆心，此种情况就有些复杂了。
- 第五个参数： 0 ，后面的0代表画下半圆，如果是1就是画上半圆,如下上下两句各画半个圆，一起拼起来就是一个圆：
```
<path stroke='blue' stroke-width='.8' fill='gray' d='M 30 50 A 1 1, 0 , 0 0, 70 50' />
  <path stroke='blue' stroke-width='.8' fill='purple' d='M 30 50 A 1 1, 0 , 0 1, 70 50' />
```
- 第三个参数： 0 是圆弧的旋转角度，类似transform的scal，当大于45时，圆弧的x、y轴值将颠倒。
- 第四个参数： 当为0时，显示圆弧，当为1时，显示圆弧剩余部分。：
```
<path stroke='blue' stroke-width='.8' fill='purple' d='M 30 50 A 50 50, 0 , 1 1, 70 50' />
```

#### C指令 与 Q指令关系
二者都用来画曲线，能达到一样效果，不过，c后面跟着三个点，所以相比Q（两个点），更能精确控制曲线弧度。

#### C 的镜像指令 S指令
相比Q的镜像T指令，C时只能用S进行镜像，S的最后一个点为终点，之前的点用来调节镜像弧度：
```
 <path stroke='yellow' stroke-width='.8' fill='none' d='M 20 50 C 30 40, 40 40, 50 50 S 70 60 80 50' />
```

### text
#### dx 与 dy
dx与dy 表示的是相对于前一个字符的长度，[参考](https://www.w3cplus.com/svg/how-to-manipulate-svg-text.html)

### g 与 坐标系
#### 元素的x是相对于父层的g，而非原始坐标
如下rect的坐标 0 0 ，相对的是g形成的坐标系，而非原始坐标，
[详细demo](https://github.com/YeWills/d3-note-demo/blob/d3-demo/pages/d3-jt-book/chapter6/6.8/6-8-1-lineChart.html)
```
node.append("g")
    .append("rect")
    .attr("x",0)
    .attr("y",0)
```


### 参考demo
[参考demo -里面的几个svg html](https://github.com/YeWills/d3-note-demo/tree/d3-demo/pages/mars)

## svg进阶知识
### viewport viewbox preserveAspectRatio
#### 三者关系
其实三者关系很好理解，也很简单，不过网上有很多博客或教程将此复杂化了，如下图：
在坐标系上画了一个矩形，现在只想显示阴影部分，取 viewbox 100 100 20 20；
现在设置svg的viewport 为200 200；
在显示时，
svg的机制，会让viewbox自动缩小或放大以填充整个viewport；
放大后，viewport显示了刚才viewbox的内容。
[demo参考](http://127.0.0.1:3000/multy/SVG/Lesson2/viewbox.html)
{% img url_for /image/svg/viewbox.jpg %}
#### viewbox会缩小或者扩大填满viewport
参考上面。
#### preserveAspectRatio
可网上查询，机制跟css 的background 的图片填充一样。

### defs
[参考这里](https://blog.csdn.net/chy555chy/article/details/53364561)


## 参考
[视频教程有7个，在这个网站上是能找到这七个视频的](https://www.bilibili.com/video/av13492121/?spm_id_from=333.788.videocard.0)


