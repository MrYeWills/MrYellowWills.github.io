---
title: css知识点汇
date: {{ date }}
tags: css
categories: 
- css
series: css
---

本篇的css知识点，都在《css笔记》中有列举，由于知识点篇幅较大，单独将知识点放置于本篇详细描述。

##  float浮动定位
浮动定位有以下特点：
### 收缩为最小宽度
除非已经定义了浮动元素的宽度，否则浮动元素收缩为适应元素内容的最小宽度。
### 遇到块级元素将停止
对于自身而言，浮动元素脱离文档流后，遇到块级元素将停止，
### 脱离文档流，但不脱离文本流
当一个元素变为浮动元素时，对不同类型的相邻元素影响如下：
#### 与行内元素相邻
会让行内元素紧贴浮动元素，典型的场景--图片文字环绕
```
img{
  float: left;
}
<img src="./aa.jpg" alt="aa">
<span>行内元素文字行内元素文字</span>
```
#### 与块级元素相邻
浮动元素脱离文档流，此时效果类似position：absolute，相当于浮动元素不存在，与之相邻的块级元素将占领浮动元素位置；
**但是块级元素内的行内元素，将环绕浮动元素**，这是因为float不脱离文本流
浮动之前：
```
    .float {
        height: 60px;
        background: rebeccapurple;
    }
    .test {
        border: 45px solid #00BCD4;
        background: blue;
    }

<div class="float">浮动之前</div>
<div class="test">相邻块级元素</div>
```
![](/image/css/float-before.jpg)

浮动之后：
```
    .float {
      /* 其他代码省略 */
        float: left;
    }
<div class="float">浮动之后</div>
<div class="test">相邻块级元素相邻块级元素相邻块级元素...</div>
```
![](/image/css/float-after.jpg)

#### 与浮动元素相邻
浮动元素与浮动元素 将并列并排；
注意的是，如果浮动元素的高度不同，当浮动元素被挤到第二行时，将会卡住：
![](/image/css/float-pading.jpg)
```
 .triangle{
      float: left;
      width: 150px;
      height: 60px;
  }
  .it1{
      height: 80px;
      background:rebeccapurple;
  }
  .it2{
      background:blue;
  }
  .it3{
      background:#00BCD4;
  }
  <div class="triangle it1">浮动元素</div>
  <div class="triangle it2">浮动元素</div>
  <div class="triangle it3">浮动元素</div>
```
### 消除与相邻元素的间隙
当被定义为浮动元素时，它跟原来相邻元素可能由于系统中自带的缝隙，一旦变成浮动元素，此缝隙将没有了，参加《float清空格(间隙)的原因》；
消除间隙这个特性，在开发中经常被运用.
### 与绝对定位区别
浮动定位于绝对定位都会脱离文档流，但二者表现不一样；
绝对定位是完全脱离文档流，相当于文档中不存在此元素了，而浮动定位脱离文档流要区别行内元素，原因如上。
### float清空格(间隙)的原因
根本原因是由于float会导致节点脱离文档流结构。它都不属于文档流结构了，那么它身边的什么换行、空格就都和它没关系的，它就尽量的往一边去靠拢，能靠多近就靠多近，这就是清空格的本质。
### 几个相邻float元素卡住现象
参考《脱离文档流，但不脱离文本流  -- 与浮动元素相邻》
### float对自身的影响
#### 形成“块”（BFC），从而可以设置height等等
float可以形成一个bfc，bfc相当于一个块级元素，可以设置大小，消除外边距折叠。
### float对父元素影响
#### 父元素的高度坍塌
float元素脱离文档流，让父元素高度为0；
### 消除浮动的方法
#### 方法一 参考 《css笔记  -- BFC  -- 消除浮动》
#### 方法二 参考 《css笔记  -- 推荐使用伪类来消除浮动》
#### 消除浮动方法优缺点  参考 《css笔记  -- 推荐使用伪类来消除浮动》

## transform与坐标变换
### transform-origin
#### 参考外网 mdn与w3c
基础知识请移步参考上面两个地址。记住是外文的，其他版本可能是阉割后的内容。
### 两个相同写法引发的思考
#### 两种写法
下面两种运行效果为什么一样：
```
//写法一
transform-origin: -100% 50%;
transform: rotate(45deg);
```
```
//写法二
transform-origin: 0 0;
transform: translate(-100%, 50%) rotate(45deg) translate(100%, -50%);
```
#### 元素位移，自带坐标系跟着改变
当元素发生位移或者旋转后，自带坐标系也随着改变，上面写法中的transform-origin后面跟的坐标就是元素自带的坐标系，一个元素发生平移前后，如果transform-origin都指向(0 0),其相对于世界坐标是不同位置：

#### 位移只按自身坐标系运动
当自身坐标系改变时，比如发生旋转后，对元素进行水平或垂直偏移，都是沿着旋转后的自身坐标系而言的。

#### 二者transform-origin世界坐标位置相同
**假如世界坐标的原点与元素自带坐标系位移前的右上角坐标重合**：
先分析上面写法二：
元素位移前坐标 0 0，
位移-100% 50%后，
原来的0 0点将被移到世界坐标的 -100% 50%;
此时自带坐标系的0 0，与世界坐标 -100% 50%重合，为同一位置。

对于写法一，其transform-origin的世界坐标当然为 -100% 50%；
因此上面写法一和二，其ransform-origin位置是相同的。

#### 元素发生的旋转角度与transform-origin无关
下面写法中，旋转的原点位置尽管不一样，元素旋转前与旋转后，发生的角度偏移大小是一样的。
也就是说，发生下面两种偏移后，虽然元素在水平和垂直方向的位移不同，但是其旋转的角度大小是一样的。
```
//下面两种偏移后， 旋转角度还是一样

//写法一
transform-origin: -100px 50%;
transform: rotate(45deg);

//写法二
transform-origin: -200px 50%;
transform: rotate(45deg);
```

#### 相同transform-origin发生偏移
下面两种写法，其transform-origin在世界坐标上属于同一个坐标点，此时写法二相对于写法一发生的偏移为 -100% 50%，因此无论之后两种写法下，都发生同样都偏移，要让最后位置一样，只需在写法二中 抹平这个偏移差 -100% 50%即可。
```
//对于同一元素使用下面两种写法

//写法一
transform-origin: -100% 50%;
transform: rotate(45deg);

//写法二
transform-origin: 0 0;
transform: translate(-100%, 50%) ;

//写法二 延伸（抹平偏移差）
transform-origin: 0 0;
transform: translate(-100%, 50%) rotate(45deg) translate(100%, -50%);
```

如下也是相同效果（下面二者， transform-origin 相同）
```
//下面两种写法是一个意思
//写法A
transform-origin: 20px -50px;
transform: translate(-120px, 100px) rotate(110deg) translate(120px, -100px);

//写法B
transform-origin: -100px 50px;
transform: rotate(110deg);
```

#### 相同transform-origin的结论
同一个元素，当使用同一个世界位置的transform-origin时，形如如下时，要想写法A达到写法B的效果，写法A只需将transform定义的translate(-120px, 100px)等值反向以下，即可抹平偏移差，二者得到相同效果；
```
//写法A
transform-origin: 20px -50px;
transform: translate(-120px, 100px) rotate(110deg);
//transform: translate(-120px, 100px) rotate(110deg) translate(120px, -100px);

//写法B
transform-origin: -100px 50px;
transform: rotate(110deg);
```
#### 不懂就看demo
[长方形动画效果demo](https://github.com/YeWills/canvas-demo/blob/master/pages/multy/css-animation/transform-origin-rect.html)
[点动画效果demo](https://github.com/YeWills/canvas-demo/blob/master/pages/multy/css-animation/transform-origin-point.html)

### 元素位移，自带坐标系跟着改变
参考《两个相同写法引发的思考  -- 元素位移，自带坐标系跟着改变》

### 位移只按自身坐标系运动
参考《两个相同写法引发的思考  -- 位移只按自身坐标系运动》

##  css动画
### 25帧
指的是一秒内有25张静止的图片，一般达到25帧，在视觉上可形成流畅的动画效果。
### 其他
更多参考《前端demo讲解 -- 动画demo 及 css动画知识点》
