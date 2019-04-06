---
title: vertical-align 与 baseline
date: {{ date }}
tags: css
categories: 
- css
series: css
---
## 为什么会这样
### 描述
如图两个定义为inline-block的div一模一样，就是一个多了555：
没有555时，两个div还是一起的：
![](/image/css/question1.png)
加了555，两个div不一起了：
![](/image/css/question2.png)
源码如下：
```
<head>
    <meta charset="utf-8">
    <style type="text/css">
        div{
            background: blue;
        }
        .qq{
            height: 80px;
            width: 80px;
            border: 1px solid black;
            display: inline-block;
        }
        .a1{
            background-color: yellow;
        }
        .a2{
            background-color: red;
        }

    </style>
</head>
<body>
<div>
    <div class="a1 qq"></div>
    <div class="a2 qq">555</div>
</div>
</body>
```

### 原因
#### 为什么之前是对齐的
在a2中没有加555之前，a2这个inline-block，它的基线(baseline)，就是它的下边距。因为[没有基线的元素，使用外边距的下边缘替代](https://developer.mozilla.org/zh-CN/docs/Web/CSS/vertical-align)；
a2所在的父元素，它的基线由父元素内的inline-block元素确定，那么父元素的基线，也是a1和a2的下边距，
此时 a1、a2默认的垂直对齐方式都是 vertical-align:baseline；
所以a1和a2是对齐的；

#### 为什么之后不对齐
在a2中加555之后，它的基线(baseline)就是a2行内块中的555这串文字决定的，它的基线就是下图黄色矩形框的下黄色边框；
![](/image/css/vertical-align/vertical1.png)
，因为a1、a2默认的垂直对齐方式都是 vertical-align:baseline，而父基线由a1决定，就是a1的下边框；所以a2需要下降，让它的的基线与父基线位置一致。

## 对上面例子延伸
```
<!-- 其他都一样 -->
  <div class="a1 qq">555</div>
  <div class="a2 qq">555</div>
```
这时候，他们又对齐了：
![](/image/css/vertical-align/vertical2.jpg)

这是因为他们的父baseline就是下图所示黄色矩形框的下边框，父级baseline其实就是a1和a2的baseline；
![](/image/css/vertical-align/vertical3.jpg)


在本例的修改基础上，现在我们又将a1定义为vertical-align:middle,其他保持不变
```
<!-- 其他保持不变 -->
.a1{
   vertical-align: middle;
}
```
效果变成如下：
![](/image/css/vertical-align/vertical4.jpg)

vertical-align: middle 意思是：使元素的中部与父元素的基线加上父元素x-height的一半对齐。

本例中，父元素的基线就是a2的基线，a2的基线如图所示，所以变成这样的效果。


## 验证--获取父基线最简单的方法
可能你疑惑，上面例子中，父基线真的是上面所说的吗，怎么验证呢，一个简单的方法，就是在父元素内，增加一段匿名行内元素，简单点说就是在父元素内，增加一段字符，那么这个字符的位置就说明了父元素的基线位置，因为，父元素的基线 总是与其内的匿名行内元素的基线一致：
比如

```
div{
    background: blue;
}
.qq{
    height: 80px;
    width: 80px;
    border: 1px solid black;
    display: inline-block;
}
.a1{
    background-color: yellow;
}
.a2{
    background-color: red;
}

<div>
     我这几个字就是所谓的匿名行内元素哦
    <div class="a1 qq"></div>
    <div class="a2 qq">555</div>
</div>
```
效果如下：
![](/image/css/vertical-align/vae1.jpg)

继续修改，其他不变，在a1中加555字符
```
<!-- 其他都一样 -->
  <div class="a1 qq">555</div>
```
效果如下：
![](/image/css/vertical-align/ver2.jpg)


继续修改，其他不变，修改如下
```
<!-- 其他保持不变 -->
.a1{
   vertical-align: middle;
}
```
效果如下：
![](/image/css/vertical-align/ver3.jpg)

## 另外一个例子
```
  .wrap{
        background: blue;
    }
    .item{
        height: 80px;
        width: 80px;
        border: 1px solid black;
        display: inline-block;
        background-color: yellow;
    }

    <div class="wrap">
               6666
                <div class="item"></div>
            </div>
```
![](/image/css/vertical-align/more1.jpg)

现在修改如下：
```
//其他不变
.item{
     vertical-align: middle;
}
```
效果如下：
![](/image/css/vertical-align/more2.jpg)

为什么呢，原因是，item改为vertical-align: middle时，直接将父baseline改到自身的中部位置了，
这个例子说明，父级内的空的inline-block元素，可以通过vertical-align: middle将父baseline改到自身的中部位置；

## 行内盒子
给一个行内盒子的结构图，上面说的baseline就是图中所示的baseline：
![](/image/css/vertical-align/column.png)

## x-height
![](/image/css/vertical-align/x-height.png)


## 如何确定父元素的baseline
通过以上例子，我们可以看到
### 全部是行内元素
当父元素内，全部是行内元素(非inline-block)时，类似：
```
 <div class="father">
    abc文字符
 </div>
```
父元素内的baseline 由'abc文字符'这几个字确定，此时父baseline就是文字的下划线的位置上

### 有inline-block
如果父元素内有inline-block，且inline-block内没有文字时，父baseline就是inline-block的下边距线；
如果父元素内有多个inline-block，且有些inline-block内有文字时,此时父元素内的baseline以没有文字的inline-block为准；
详细，参见上面例子。

### 有img图片
img图片其实就是inline-block，规则参见inline-block

### 另外的情况
见《另外一个例子》

## 小结
要解答文首抛出的疑问，我们要了解 父元素的baseline 如何确定；
inline-block内有无文字时，其baseline如何确定；
中间涉及到行内盒子的x-height概念。
而vertical-align并没有什么神秘，其实就是制定对齐规则而已。
本例只专门讨论
vertical-align:baseline
vertical-align:middle
这两种情况，用得最多，其他情况根据这两种情况类推就行。

还要特别注意的，在mdn上说了，**vertical-align只作用于 行内元素，inline-block，img 这些元素。**

## 彩蛋
### 为什么有间隙
在文首的提问中，为什么这里有缝隙呢，[原来这个默认vertical-align:baseline，而baseline的下方会给字母的一部分留出空间，因此会产生一个空隙，要产生理想的效果](https://www.cnblogs.com/starof/p/4512284.html?utm_source=tuicool&utm_medium=referral),链接上文章上说它与vertical-align有关（顺便说下，此链接上的文章有些例子有问题，注意了），至于为什么或者到底是否与vertical-align有关就不要穷究了，可能是vertical-align造成就行。
![](/image/css/question1.png)
