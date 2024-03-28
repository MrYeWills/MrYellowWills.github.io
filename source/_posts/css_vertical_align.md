---
title: vertical-align、行盒子、baseline
date: 2020/5/1
tags: [css, vertical-align, baseline, 行盒子, x-height, line-height, 半铅空]
categories: 
- css
series: css
---

本文讲解vertical-align, baseline, 行盒子, x-height, line-height, 半铅空,以及这些概念如何运用于行内元素居中、和使用line-height让元素居中，其中花了大量示例和说明介绍了如何确定父元素和行内元素的baseline。
## vertical-align
### 为什么会这样
#### 描述
如图两个定义为inline-block的div一模一样，就是一个多了555：
没有555时，两个div还是一起的：
{% img url_for /image/css/question1.png %}
加了555，两个div不一起了：
{% img url_for /image/css/question2.png %}
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

#### 原因
##### 为什么之前是对齐的
在a2中没有加555之前，a2这个inline-block，它的基线(baseline)，就是它的下边距。因为[没有基线的元素，使用外边距的下边缘替代](https://developer.mozilla.org/zh-CN/docs/Web/CSS/vertical-align)；
a2所在的父元素，它的基线由父元素内的inline-block元素确定，那么父元素的基线，也是a1和a2的下边距，
此时 a1、a2默认的垂直对齐方式都是 vertical-align:baseline；
所以a1和a2是对齐的；

##### 为什么之后不对齐
在a2中加555之后，它的基线(baseline)就是a2行内块中的555这串文字决定的，它的基线就是下图黄色矩形框的下黄色边框；
{% img url_for /image/css/vertical-align/vertical1.png %}
，因为a1、a2默认的垂直对齐方式都是 vertical-align:baseline，而父基线由a1决定，就是a1的下边框；所以a2需要下降，让它的的基线与父基线位置一致。

### 如何对齐
将同时设置两个inline-block 为 
vertical-align: middle;
或者
    vertical-align: top;都可以
当然，还可以设置inline-block为浮动元素，脱离文档流，也可以对齐；
解释下同时设置两个inline-block 为 vertical-align: middle时为何能对齐；
上面的例子，a1是空的inline-block，a2是非空inline-block，父基线以 空的a1为准，当a1设置vertical-align: middle，
a1将父基线的位置由a1的下边距，提升至a1的中部+x-height/2,可以近似看成就是a1的中部。
a2也将自己的中部与父基线对齐，所以就对齐了。
如果不清楚，可以看下面章节《如何确定父元素的baseline》或《另外一个例子》

### 对上面例子延伸
```
<!-- 其他都一样 -->
  <div class="a1 qq">555</div>
  <div class="a2 qq">555</div>
```
这时候，他们又对齐了：
{% img url_for /image/css/vertical-align/vertical2.jpg %}

这是因为他们的父baseline就是下图所示黄色矩形框的下边框，父级baseline其实就是a1和a2的baseline；
{% img url_for /image/css/vertical-align/vertical3.jpg %}


在本例的修改基础上，现在我们又将a1定义为vertical-align:middle,其他保持不变
```
<!-- 其他保持不变 -->
.a1{
   vertical-align: middle;
}
```
效果变成如下：
{% img url_for /image/css/vertical-align/vertical4.jpg %}

vertical-align: middle 意思是：使元素的中部与父元素的基线加上父元素x-height的一半对齐。

本例中，x-height的值差不多5px，x-height 的值计算，参考下面章节《x-height》,
父元素的基线就是a2的基线，a2的基线如图所示，所以变成这样的效果。


### 确定父基线最简单的方法
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
{% img url_for /image/css/vertical-align/vae1.jpg %}

继续修改，其他不变，在a1中加555字符
```
<!-- 其他都一样 -->
  <div class="a1 qq">555</div>
```
效果如下：
{% img url_for /image/css/vertical-align/ver2.jpg %}


继续修改，其他不变，修改如下
```
<!-- 其他保持不变 -->
.a1{
   vertical-align: middle;
}
```
效果如下：
{% img url_for /image/css/vertical-align/ver3.jpg %}

### 另外一个例子
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
{% img url_for /image/css/vertical-align/more1.jpg %}

现在修改如下：
```
//其他不变
.item{
     vertical-align: middle;
}
```
效果如下：
{% img url_for /image/css/vertical-align/more2.jpg %}

为什么呢，原因是，item改为vertical-align: middle时，直接将父baseline改到自身的中部位置了，
这个例子说明，**父级内的空的inline-block元素，可以通过vertical-align: middle将父baseline改到自身的中部位置。**

### 为什么会有间隙
上面的例子中，看到因为 img 的存在，导致了父层底部与图片底部有间隙。 这是因为，img 的排版默认是按照行盒子排列的，也就是按照baseline对齐，而baseline与行盒子的底线是有一定距离的，这个距离就是间隙。
当img 的父层 字体越大时，间隙越大。
**这种现象一般出现于图片，在项目中遇到图片排列时，要注意会产生这种间隙。**
再举例：
```
 .wrap{
        background: blue;
        font-size: 50px;
    }
    img{
        height: 150px;
        width: 200px;
    }

   <div class="wrap">
        <img src="./git3.png" />
    </div>
```
{% img url_for /image/css/vertical-align/verialign-1.jpg %}

消除间隙的方法是，给img 一个vertical-align：middle或者其他值都可以。


### 如何确定父元素的baseline
父元素的baseline依据其内部行内元素类型不同，baseline不同。
通过以上例子，我们可以看到
#### 全部是行内元素
当父元素内，全部是行内元素(非inline-block)时，类似：
```
 <div class="father">
    abc文字符
 </div>
```
父元素内的baseline 由'abc文字符'这几个字确定，此时父baseline就是文字的下划线的位置上

#### 有inline-block
如果父元素内有inline-block，且inline-block内没有文字时，父baseline就是inline-block的下边距线；
如：
```
 <div class="father">
    <div class="inline-block"></div>
 </div>
```
如果父元素内有多个inline-block，且有些inline-block内有文字时,此时父元素内的baseline以没有文字的inline-block为准；
如：
```
 <div class="father">
    <div class="inline-block">来电文字</div>
    <div class="inline-block"></div>
 </div>
```
详细，参见上面例子。

#### 有img图片
父元素含有img图片其实就是空的inline-block，规则参见《有inline-block》

#### 可使用vertical-align修改父基线
父级内的空的inline-block元素，可以通过设置不同的vertical-align值达到修改父baseline。
见《另外一个例子》

### 如何确定自己的baseline
这里的自己，就是上面例子中的a1、a2、字符串等等的行内元素，依据不同类型行内元素的自己，baseline取值不同
#### 字符串
这个最简单，基线几乎等于紧贴字符串的下划线
```
abc字符串
```
#### inline-block
当自己是inline-block时，
分两种情况：
- 当自己是空的inline-block时，自己的基线就是自己的下边框,如
```
 <div class="inline-block"></div>
```

- 当自己是非空的inline-block时，自己的基线就是自己元素内部的字符串的下边框，也就是紧贴字符串的下划线,更多请参考《为什么之后不对齐》
```
 <div class="inline-block">abc456</div>
```
#### img
这种最好分别，参考同《inline-block》的空inline-block情况，它的基线就是图片下边框。

### 小结
要解答文首抛出的疑问，我们要了解 父元素的baseline 如何确定；
inline-block内有无文字时，其baseline如何确定；
中间涉及到行内盒子的x-height概念。
而vertical-align并没有什么神秘，其实就是制定对齐规则而已。
本例只专门讨论
vertical-align:baseline
vertical-align:middle
这两种情况，用得最多，其他情况根据这两种情况类推就行。

还要特别注意的，在mdn上说了，**vertical-align只作用于 行内元素，inline-block，img 这些元素。**

### 彩蛋
#### 为什么有间隙
在文首的提问中，为什么这里有缝隙呢，[原来这个默认vertical-align:baseline，而baseline的下方会给字母的一部分留出空间，因此会产生一个空隙，要产生理想的效果](https://www.cnblogs.com/starof/p/4512284.html?utm_source=tuicool&utm_medium=referral),链接上文章上说它与vertical-align有关（顺便说下，此链接上的文章有些例子有问题，注意了），至于为什么或者到底是否与vertical-align有关就不要穷究了，可能是vertical-align造成就行。
{% img url_for /image/css/question1.png %}

#### 利用伪类垂直居中
```
  .wrap {
        background: #00bcd4ba;
        height: 150px;
    }

    .item {
        vertical-align: middle;
    }

    .item1 {
        height: 50px;
        width: 50px;
        display: inline-block;
        background: blue;
    }

    .item2 {
        height: 80px;
        width: 80px;
        display: inline-block;
        background: blue;
    }

<div class="wrap">
    80版经典上海滩
    <div class="item1 item"></div>
    <div class="item2 item"></div>
</div>

```
效果：
{% img url_for /image/css/vertical-align/after1.jpg %}

你看到就算你把item1和item2都做了vertical-align: middle;
都无法让元素相对于整个wrap元素垂直居中，
增加下面代码就可以了,给父层增加一个伪类，设置这个伪类为inline-block,从而能设置宽高；
这个伪类的高度撑满整个wrap，然后设置vertical-align: middle;
因为这个伪类的高度相对其他元素最高，所以，它设置vertical-align: middle会将父元素的baseline拉到伪类的中部去，
而伪类又与父元素同高，这样就可以达到相对父元素垂直居中。
```
.wrap::after {
    content: '';
    display: inline-block;
    height: 100%;
    <!-- 注意的是上面代码不起作用时，可以定义width: 1px; 一般是不必定义width: 1px-->
    <!-- width: 1px; -->
    vertical-align: middle;
}
```
其实这样的after伪类有些人也称为幽灵元素。
效果：
{% img url_for /image/css/vertical-align/after2.jpg %}

### 关于vertical-align你要知道的
vertical-align 就是用来让行内元素对齐的；vertical-align这个属性就是为了行内元素而生，如果没有行内元素，vertical-align就没有任何存在的意义；
同样的，如何要做行内元素的对齐，你可以不使用vertical-align，但如果不懂vertical-align，那么你能把行内元素做得对齐，也是碰运气，瞎搞搞。
要全面的理解vertical-align，不仅要知道vertical-align的定义，还要知道行内元素的特性，如行内元素的基线；
还要知道父元素的基线(这是最难的)，还要知道行盒子的概念，例如x-height,行盒子的baseline；
很多奇型八怪的问题都是 父元素 与 行内元素的vertical-align 搞出来的。

## 行盒子
### 概念
每行文本都会生成一个行盒子。(语出《精通css 高级web标准解决方案》)
行盒子主要涉及以下概念：
x-height；
行盒子的baseline；
注意font-size 与 行盒子的关系；
半铅空(《精通css 高级web标准解决方案》有讲到)，以下也有讲解；
直接上图理解吧，以下三张都是行盒子介绍图：
{% img url_for /image/css/vertical-align/column.png %}
{% img url_for /image/css/vertical-align/x-height.png %}
{% img url_for /image/css/vertical-align/inline-box.jpg %}
### 行盒子 与 行内盒子
span、strong等等这些是行内元素，他们内容以**行内盒子**形式展示，直白的说span 元素就是一个行内盒子；
由一行文本形成的水平盒子叫行盒子，行盒子的高度由它所包含的行内盒子决定；
以上均语出《css精通》 P43 P44。
由上可知，行盒子可以包含很多个行内盒子。当行盒子只有一个行内盒子时，行内盒子就是行盒子。

### x-height
x-height,也就是上面图片中的x高度，说白点，就是小写字母X的高度；
另外一个注意的是，**相同的font-size，相同的字符，在不同的字体font-family中x-height是不同的**，这也就解释了有些字体下，明明文本看起来是居中的，换其他字体可能就看起来不太居中了。
上面的例子中，font-size,默认是浏览器的16px，那么x-height值差不多是font-size的三分之一，就是5px左右。

### line-height居中原理
我们经常会利用将height于line-height设置成一致进行居中，如下，然而，这个原理是什么呢？ 其实它的居中利用的是行盒子上下两个半铅空永远相等得到的,下面会慢慢讲解:
```
height: 100%;
line-height: 100%;
```
我们先看一段代码：
```
.wrap{
    background: #00bcd4b5;
    height: 75px;
}

 <div class="wrap">
   经典good morning, koa2!
</div>
```
此时wrap内的文字不居中，这个不居中与 "经典good morning, koa2!"这段文本生成的行盒子有莫大关系，
根据line-height默认值是1.2，我们可以画出行盒子的line-height,下面是这串代码的效果图和文本行生成的行盒子：
{% img url_for /image/css/vertical-align/line-height.jpg %}

其他不变，我们把line-height设置为75px:
```
.wrap{
    line-height: 75px;
}
```
居中了，效果如下：
{% img url_for /image/css/vertical-align/line-height2.jpg %}
由图中可以看出，使用height与line-height相同值达到居中的，其实是利用了行盒子半铅空相等的特性,因为在行盒子内，文本相对于行盒子，永远是居中的，行盒子的高度取决于line-height，如何将line-height的值设成与height一致，就达到了，height高度下的文字居中了。

## 父元素与对齐相关的概念
这里说的父元素，就是上面通篇都在讲的父元素,这个父元素一般就是一个div，div内有文字，有inline-block元素，有img；（img也是一种inline-block），
那么这个父元素与行内元素垂直对齐相关的有哪些概念或属性呢，直接上图说明：
{% img url_for /image/css/vertical-align/father.jpg %}

为什么这些属性与行内元素垂直对齐相关呢，这都是因为vertical-align,我们说过，vertical-align就是为了行内元素对齐而生而创造的，
vertical-align有以下对齐方式，可参考mdn：
baseline | sub | super | text-top | text-bottom | middle | top | bottom | <percentage> | <length>
这些对齐方式就是基于父元素的相关属性。
具体信息参考[mdn](https://developer.mozilla.org/zh-CN/docs/Web/CSS/vertical-align)

## 行内元素与对齐相关的概念
这里的行内元素，包含了inline-block、img元素；
行内元素与对齐相关的 是 元素中部、顶部、底部、基线；
前三者好理解，只有基线这个不好理解，请参考《如何确定自己的baseline》

## 其他
关于如何划定父元素的baseline，目前就算官方也没有一个很清晰的定义，上文中关于baseline的划定，在参考了很多资料后，很多都基于试验而来,读者请分别好。
另外就参考资料而言，mdn里面讲得很好，解释了vertical-align特性，还讲了元素的基线确定。

## 参考资料

[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/vertical-align)
[外网w3c](https://www.w3schools.com/cssref/pr_pos_vertical-align.asp)
[精通css 高级web标准解决方案](http://www.ituring.com.cn/book/1910)

