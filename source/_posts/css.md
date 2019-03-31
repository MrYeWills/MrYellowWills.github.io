---
title: css笔记
date: {{ date }}
tags: css
categories: 
- css
series: css
---

## css需求方案

### 三角
```
<div class="triangle"></div>

.triangle{
  height: 0;
  width: 0;
  border: 40px solid;
  border-color: red #00ff37 #1b00ff #673AB7;
}
```
效果如下,边框的四边并非我们想象的四个矩形，而是四个三角形：
![](/image/css/block.jpg)

border-color可以接受透明色：transparent

将上面代码的border-color改成如下，即可得到一个三角：
```
    border-color: transparent transparent #1b00ff transparent;
```
![](/image/css/triangle.jpg)

### 阴影
#### 参数介绍
box-shadow: none|h-offset v-offset blur spread color |inset|initial|inherit;
            是否需要阴影|竖直偏移 水平偏移 模糊度 扩展度 颜色|方向|基本不用|基本不用
模糊度 其实就是对阴影的边缘进行模糊处理，让阴影与外界颜色过渡自然；
扩展度 在阴影的基础上，对阴影进行等长度加长，如图。
![](/image/css/shadow6.jpg)

方向 阴影默认向外扩散，可以设置向内；
下面通过一组图片展示每项参数意义：
![](/image/css/shadow1.jpg)
![](/image/css/shadow2.jpg)
![](/image/css/shadow3.jpg)
![](/image/css/shadow4.jpg)
![](/image/css/shadow5.jpg)

#### 竖直、水平偏移都设置为0
二者都设置为0，可以达到outline的效果，并且还有模糊度
![](/image/css/shadow7.jpg)
#### 多个阴影
```
height: 80px;
width: 180px;
background: gainsboro;
box-shadow: 5px 5px blue, 10px 10px red, 15px 15px green;
```
![](/image/css/shadow8.jpg)
#### box-shadow脱离文档流
box-shadow 是脱离文档流的，给元素设置box-shadow，无论数值多少，都不会让元素移动，这点很好
