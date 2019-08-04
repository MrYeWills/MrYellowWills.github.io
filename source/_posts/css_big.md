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
