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

### outline 轮廊线
#### outline能做到的效果：
![](/image/css/outLine.jpg)

#### outline 相关属性：
outline-width/outline-style/outline-color/outline-offse;

#### outline-style的相反值：
- ridge groove

- inset outset

#### outline 写法
outline 是 outline-width outline-style outline-color 的简写，如：
outline: 15px solid grey;
也可简写：outline: solid;

#### outline-offse
outline-offse 是 outline相关的另外一个样式，但不包含在outline的简写当中。

#### outline 与 box-shadow
outline 与 box-shadow有时候可以达到相同效果，不同的是，当元素有border-redius，outline会有缝隙，box-shadow不会。


### css 覆盖原则
简写的方式，最容易覆盖原来定义好的规则，修改已有代码时，不覆盖以前样式的方式就是不要写简写。
例如outline，background的等等。
```
    outline-width: 15px;
    outline-color: #00BCD4;
    outline: solid; //覆盖了以上两句css样式，实际展示的轮廊线将为 默认的size，和黑色
```

### 伪类与伪元素
```
::before  //伪元素
:focus  //伪类
```
### font-family 多值写法
```
//Times new Roman 使用了引号，因为它有空格，当有空格时，最好加上引号，也可以不加
font-family: Georgia, Times, "Times new Roman", sefif;
```
后备机制是font-family的重要特性。
以上是一种后备写法，从左到右，优先级左边最高，当此值在浏览器中无法识别时，往右顺延。


### css 书写原则
尽量不要使用id

### 行内盒子 匿名盒子 匿名块盒子 匿名行盒子 P45

###  浮动定位
浮动定位有以下特点：
#### 收缩为最小宽度
除非已经定义了浮动元素的宽度，否则浮动元素收缩为适应元素内容的最小宽度。



#### 脱离文档流
针对不同类型元素表现不同：
##### 行内元素
会让行内元素紧贴浮动元素，典型的场景--图片文字环绕
```
img{
  float: left;
}
<img src="./aa.jpg" alt="aa">
<span>行内元素文字行内元素文字</span>
```
##### 块级元素
浮动元素脱离文档流，此时效果类似position：absolute，相当于浮动元素不存在，与之相邻的块级元素将占领浮动元素位置；
**但是块级元素内的行内元素，将环绕浮动元素**
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

##### 浮动元素
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
#### 与绝对定位区别
浮动定位于绝对定位都会脱离文档流，但二者表现不一样；
绝对定位是完全脱离文档流，相当于文档中不存在此元素了，而浮动定位脱离文档流要区别行内元素，原因如上。



### 父子font-size 的em叠加
```
.it1{
  font-size:1.314em;
}
.it2{
  font-size:1.314em;
}
<div class="it1">
  <!-- 元素1  font-size 将为16px*1.314 =21px -->
  元素1
  <!-- 元素2  font-size 将为16px*1.314*1.314 =28px -->
  <div class="it2">元素2</div>
</div>
```
### em的使用场景
font-size
padding
border-radius (不包含border-with)
margin


display:none与visibility:hidden
display:none 不为被隐藏的对象保留其物理空间 
visibility：hidden 为被隐藏的对象保留其物理空间



