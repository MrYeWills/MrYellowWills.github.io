---
title: css趣事
date: 2020/11/28
tags: css
categories: 
- css
series: css
---

本篇用于记录css的一些难点、黑知识，了解并解决他们是一件很有趣的事情。
在《css笔记》中也有列举黑知识，不过该篇幅已经很多了，因此又写一篇。

##  黑知识
### 如何absolute的子元素不换行
#### absolute的子元素换行的问题
不过我不想让absolute子元素换行，如何实现呢。
效果：
{% img url_for /image/css_deep/ab.png %}
代码：
```html
  <style>
    .wrap{
      width: 300px;
      position: relative;
      background-color: grey;
    }
    .content{
      position: absolute;
    }
    .item{
      width: 110px;
      border: 1px solid;
      /* 使用float是因为 float可以将div元素转为 inline-block，同时消除间隙 */
      float: left;
      background-color: blueviolet;
      height: 100px;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="content">
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
    </div>
  </div>
</body>
```
#### absolute宽度默认不超过父元素
并不是absolute宽度不能超过父元素，absolute脱离文档流，你可以直接设置absolute元素宽度为任何宽度。
但是如果你不设置absolute宽度，absolute将使用默认宽度，由以下三者决定：
- 父元素宽度
- left值 默认0
- right值 默认0

因此当你不设置absolute宽度时，默认就是父元素宽度。
但是注意了，如果你设置了left值 10px， 因为没有设置right，right默认使用0，那么absolute宽度将为 ：
```
absolute宽度 = 父元素宽度 - 10px
```
#### 每设置left多少，自身宽度减多少
参考《absolute宽度默认不超过父元素》

#### 设置absolute大于父元素方法
- 直接给absolute 设置 width值；
- 设置left 或 right 父值；
- 设置自己为flex；这个下面当讲，见 《让absolute永远等于子元素之和(flex)》

#### 让absolute永远等于子元素之和(flex)
让absolute下的子元素高保真，且不换行，absolute元素宽度与子元素之和看齐，
此时给absolute元素 ，设置 display为flex。
display为flex的一大特性就是让所有子元素水平排为一列，
在不设置absolute自身宽度下，absolute宽度等于子元素之和。

#### absolute与flex同时使用的黑特性
当一个元素既使用absolute又使用flex时候，
因为flex最大特性是保证子元素为一排，且宽度不变；
当自身宽度不够时，css系统会给元素设置left或right设置一个负数值，保证自身宽度够长：
代码如下：
```html
<style>
    .wrap{
      width: 300px;
      position: relative;
      background-color: grey;
    }
    .content{
      position: absolute;
      display: flex;
    }
    .item{
      width: 110px;
      border: 1px solid;
      /* flex下float无效; */
      float: left;
      background-color: blueviolet;
      height: 150px;
    }
  </style>
```
{% img url_for /image/css_deep/flex.png %}
当absolute自身又同时设置left和right时，子元素设置flex-shrink为0时，flex优先级最高，依然能保证子元素为一排，且宽度不变，这个可自行试验。

#### 解决方法(flex)
方法代码同 《absolute与flex同时使用的黑特性》

### 用float给元素转inline-block的优点
#### 概述
使用float是因为 float可以将div元素转为 inline-block，同时消除间隙。
传统直接给元素设置display为inline-block，多个元素并列时，还要考虑消除间隙问题。
如果父元素本身是一个BFC，比如本身定义了postion为absolute或 relative 等，更应该用float，因此BFC元素自带消除浮动。
#### postion为absolute更加推荐使用
参考《概述》
#### BFC元素更加推荐用
参考《概述》，所有BFC元素更应该使用float来转inline-block。




