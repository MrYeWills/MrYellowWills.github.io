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

#### 遇到块级元素将停止
对于自身而言，浮动元素脱离文档流后，遇到块级元素将停止，

#### 脱离文档流
当一个元素变为浮动元素时，对其不同类型的相邻元素影响如下：
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
#### 消除与相邻元素的间隙
当被定义为浮动元素时，它跟原来相邻元素可能由于系统中自带的缝隙，一旦变成浮动元素，此缝隙将没有了，参加《疑难点》；
消除间隙这个特性，在开发中经常被运用.

#### 与绝对定位区别
浮动定位于绝对定位都会脱离文档流，但二者表现不一样；
绝对定位是完全脱离文档流，相当于文档中不存在此元素了，而浮动定位脱离文档流要区别行内元素，原因如上。

### 关于em

#### font-size的em叠加
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
#### font-size:1.314em 与 height: 1.314em 区别
由下面代码可知，font-size 与 height\margin\padding这些属性不一样；
font-size的em的基准是父font-size;
height\margin\padding等的em基准是自身的font-size；
```
.it1{
  font-size:1.314em;
}
.it2{
  font-size:1.314em;
  height: 1.314em;
}
<div class="it1">
  <!-- 元素1  font-size 将为16px*1.314 =21px -->
  元素1
  <!-- 元素2  font-size 将为16px*1.314*1.314 =28px -->
  <!-- 元素2  height  将为自己的font-size*1.314 =36px -->
  <div class="it2">元素2</div>
</div>
```
#### em的使用场景
font-size
padding
border-radius (不包含border-with)
margin

#### 为什么要使用em
当你想要当前元素的 padding，margin，line-height 等值，与当前字体大小成比例的时候，使用 em 单位。

### em rem场景
rem 主要用于移动端适配；
em运用场景见《关于em》



### float清空格
根本原因是由于float会导致节点脱离文档流结构。它都不属于文档流结构了，那么它身边的什么换行、空格就都和它没关系的，它就尽量的往一边去靠拢，能靠多近就靠多近，这就是清空格的本质。

### display:none与visibility:hidden
display:none 不为被隐藏的对象保留其物理空间 
visibility：hidden 为被隐藏的对象保留其物理空间


### % 参照的是父级的什么属性
position是left top针对的是父级的什么
```
{
    position: absolute;
    top: 10%;
    left: 10%;
}
```
left 参照父级的 width；
top 参照父级的 height；

### 让元素充满父级和屏幕的方法：
### 充满父级：
```
{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
```
### 充满屏幕：
在css中position: fixed是由position: absolute发展而来，相对于屏幕定位
```
{
position: fixed;
left: 0;
right: 0;
top: 0;
bottom: 0;
}
```

### 伪类相当于父级内的内联span元素

伪类其实相当于定义在父级元素内的内联span元素或匿名行内元素，可以通过display改变其属性。
把伪类当成父级元素内的元素看即可，没有什么不同

```
   .father::after{
            content: 'after伪类 content'
        }
        .father::before{
            content: 'before伪类 content'
        }

<div class="father">父元素的text</div>
```
相当于
```
<div class="father">
    <span>before伪类 content</span>
    父元素的text
    <span>after伪类 content</span>
</div>

```
由上得出：
- before 相当于 紧跟父元素之前的行内块；
- after 相当于 紧跟父元素之后的行内块


### 0.5px的下边框
#### 0.5px的元素
定义高度为1px，然后缩小高度一半，得到0.5px;
```
 .small{
     width: 200px;
     background: blue;
     height: 1px;
     transform: scaleY(0.5);
 }
<div class="small"></div>
```
#### 0.5px的下边框
给要定义下边框的元素定义一个伪类，这样的好处是不用另外写html；
伪类相当于一个元素，在伪类中，写一个0.5px的元素;
```
.item {
    position: relative;
}
.item::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: blue;
    height: 1px;
    transform: scaleY(0.5);
}

<div class="item">1</div>
```



### 大汇集

font-weight 默认为normal，normal对应数值为400，可以使用关键字 normal、bold等等，也可以使用数数值，都是100的整数：100、200、300、400等等
text-transform 可以使英文单词首字母大写或者所有字母大写，或者所有字符小写的功能；
word-spacing: 0.1em; 英文单词间距
letter-spacing: 0.1em; 英文字母间距
text-shadow ： 字体阴影效果
text-overflow: ellipsis
        clip : 不显示省略标记（...），而是简单的裁切
        ellipsis : 当对象内文本溢出时显示省略标记（...）


columns 可用来文本分多栏显示；
pointer-events 可用来打开的禁止元素的事件响应，设置为none的时候，不会触发该元素的hover和click事件；
background-clip 设置元素的背景（背景图片或颜色）是否延伸到边框下面

### @font-face写法
format 给浏览器提示，src内的文件类型是什么，方便浏览器阅读；
font-face用的是后备机制写法，如下src写了很多，就是给不同设备的浏览器解析，增加兼容性；
font-weight和font-style作为可选配置，如果配置了，那么在使用此字体时，必须设置与**这里一样的font-weight和font-style值时才起作用,这点很容易让人忽视**
见P84《精通css 高级web标准解决方案》
```
   @font-face {
	font-family: 'YourWebFontName';
    font-weight: '400';
	src: url('YourWebFontName.eot'); /* IE9 Compat Modes */
	src: url('YourWebFontName.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
             url('YourWebFontName.woff') format('woff'), /* Modern Browsers */
             url('YourWebFontName.ttf')  format('truetype'), /* Safari, Android, iOS */
             url('YourWebFontName.svg#YourWebFontName') format('svg'); /* Legacy iOS */
   }
```

### margin:0 auto在inline-block失效
如下，child将不居中；
```
    .wrap{
            background: #00bcd4b5;
            height: 90px;
        }
        .child{
            display: inline-block;
            height: 50px; 
            width: 100px;
            background: rebeccapurple;
            margin: 0 auto;
        }

<body>
    <div class="wrap">
        <div class="child"></div>
    </div>
</body>
```
解决的方法就是从新设置 child 的display: block;
```
 .child{
     <!-- 其他不变 -->
      display: block;
        }
```
为什么margin: 0 auto对inline-block无效呢，对于margin来说，auto是一个特殊关键字，在[以下是w3c关于margin的auto关键字执行机制的解释](https://www.w3schools.com/css/css_margin.asp)
```
You can set the margin property to auto to horizontally center the element within its container.
The element will then take up the specified width, and the remaining space will be split equally between the left and right margins:
可以将Margin属性设置为Auto，使元素在其容器内水平居中。
元素将占用指定的宽度(就是自己的width)，剩余的空间将在左右页边距之间平均分配：
```
从上面的话中，我们知道，要想auto有效，必须提供如下条件---
- 必须给元素设置宽度
浏览器要将元素所处的行的宽度减去元素宽度，获得剩余宽度，然后平均分配；
- 必须是块级元素
必须是block元素，因为在block元素中，这一行只有这一个元素，如果不是block，例如是inline-block时，就算浏览器可以让元素居中，但是该行中还有其他行内元素，那么这个居中元素是覆盖还是将其他行内元素一起居中呢。
所以非block元素，auto关键字无效。

#### 注意
- 这里说的是auto关键字无效，而不是margin这个属性失效，auto无效，你也可以给定一个具体值，margin都是有效的；
- 对于img，button这些元素本身是有宽度的，可以不用设置宽度，只需指定display: block;就可以使用 margin:0 auto居中；
- 对于行内元素，含inline-block，要让他们居中的最好方法是text-align,毕竟text-align是针对行内元素居中而创造的，这个故事告诉我们，对于不同类型的居中，虽然很多种方法都可以居中，但要选对规范的犯法;
简单点就是，块级元素 使用 margin: 0 auto居中，行内元素使用text-align居中； 

#### 敲黑板
 在现代浏览器中，如果要把一些东西水平居中，使用 display:flex; 对于不兼容flex的浏览器如IE8-9 才建议使用 margin: 0 auto;

### 外边距折叠
外边距折叠只发生在margin垂直方向，水平方向没有此现象，所以外边距折叠，指的就是margin-top与margin-bottom两个方向。

#### 现象
```
  .wrap{
            background: red;
            height: 150px;
        }
        .chilid{
            margin-top: 80px;
            height: 50px; 
            background: blue;
        }

<body>
    <div class="wrap">
        <div class="chilid"></div>
    </div>
</body>
```
效果如下：
![](/image/css/margin1.jpg)

这里的效果并没有达到我们的预期，我们对chilid做了margin-top，那么child理应是相对父wrap进行margin，而实际中，child却相对浏览器边缘进行了margin-top；
这就是外边距折叠的现象之一。

解决方案，就是在wrap中写一个border或者写一个padding，就可以达到预期效果了；

#### 其他外边距折叠现象：
![](/image/css/margin2.jpg)

#### 出现外边距折叠的条件
外边距折贴**只发生在正常文档流中的块级元素的 margin 垂直方向上；**
margin水平方向无此现象；
行内盒子，浮动盒子，绝对定位无此现象；
而且块级元素发生此现象的另外重要条件是，父元素**既没有border又没有padding才会发生此现象**。参考上面的例子。
所以我们在实际开发中，往往要对header进行margin-top处理时，不要使用margin-top，使用padding-top代替，因为可能会发生折叠现象；
外边距折叠现象其实是有很多好处的，可以避免很多多余的margin，可参考 《精通css》P45页，[外网w3c也提到了margin 垂直方向上的折叠现象](https://www.w3schools.com/css/css_margin.asp);


### BFC
块格式化上下文，全称Block Formatting Context，你也可以叫它肯德基；相关概念去mdn或w3c查。
#### BFC特征
BFC有以下特征：
- 内部的Box会在垂直方向，一个接一个地放置。
- Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠
- 每个元素的左外边缘（margin-left)， 与包含块的左边（contain box left）相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。除非这个元素自己形成了一个新的BFC。
- BFC的区域不会与float box重叠（可阻止因浮动元素引发的文字环绕现象）。
- BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。 (利用此特性，解决外边距折叠问题)
- 计算BFC的高度时，浮动元素也参与计算 （利用这一特性，使用overflow消除浮动）
[参考1](https://segmentfault.com/a/1190000009545742)
[参考2](https://www.jianshu.com/p/11e764268c0d)

#### 创建一个BFC
根元素或其它包含它的元素
浮动 (元素的 float 不是 none)
绝对定位的元素 (元素具有 position 为 absolute 或 fixed)
块级元素具有overflow ，且值不是 visible
非块级元素具有 display: inline-block，table-cell, table-caption, flex, inline-flex
[更多创建方式](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)

#### 为什么要创建BFC
在MDN中单独讲了BFC的两个作用：消除浮动与避免外边距折叠；
所以，在正常编程中，我们不用刻意去关心什么是BFC，不过当遇到消除浮动，消除浮动环绕，消除外边距折叠问题时，为了解决这个问题，
我们可以创建一个BFC来解决，为什么BFC能解决？
因为BFC有自己的特征，一旦元素变成了一个BFC，它就具备了BFC赋给它的特征，而这些特征可以解决上面说的问题。

#### 消除浮动
子元素定义float后，父元素的高度变成很小或者0了，这个时候，我们可以将父元素变成一个BFC，而利用BFC上面的特征6，计算BFC的高度时，浮动元素也参与计算 ，这个时候父元素的高度将包含浮动的子元素高度，解决浮动了。
由上面可知，将元素定义一个overflow，可以将该元素编程BFC。
```
.wrap{
    background: red;
    width: 100%;
    overflow: hidden;
}
.chilid{
    float: left;
    width: 100%;
    height: 50px; 
    background: blue;
}

<div class="wrap">
        <div class="chilid"></div>
    </div>
```

#### 自适应两栏布局
[不多写了，直接参考这里吧](https://segmentfault.com/a/1190000009545742)

#### 消除外边距折叠
这里有两个例子
[一个例子，见文中的--防止垂直margin合并](https://segmentfault.com/a/1190000009545742)
第二个例子，我们改写下 《外边距折叠》章节的《现象》例子，给wrap添加一个float属性，将.wrap变成一个BFC，利用BFC特征5：BFC就是页面上的一个隔离的独立容器，margin是wrap的一部分，所以margin不受外部影响。
```
.wrap{
    width: 100%;
    float: right;
}
```

### position定位相关
position:relactive:
相对定位：相对于自身原位置偏移；
仍处于标准文档流中；
随即拥有偏移属性和z-index属性；

position:absolute:
绝对定位：
完全脱离了标准文档流；
随即拥有偏移属性和z-index属性；
元素具有了包裹性，与float类似；

### 流转块的三种方式
- 设置：display:block；
- 对inline元素设置float；
- 对inline元素设置position:absolute/fixed；
大家对第一种熟悉，但没想到后面两种也可以流转块；


### 颜色值函数-rgb/rgba/hsla
rgba是rgb的进化版，带有透明度；
#ffffff 六位数是没有透明度的；
#00000000 八位数的是有透明度的；

### background相关属性
### background
background是个简写属性，会重置以前定义的很多background属性，因此定义的时候，把它放在最上面，然后使用background-color等等属性叠加定义：
```
//不推荐，background会重置background-repeat属性，达不到no-repeat效果
background-repeat: no-repeat;
background: url(../image/css/vertical-align/column.png);
```
```
//推荐这种写法
  background: url(../image/css/vertical-align/column.png);
  background-repeat: no-repeat;
```
### background多重背景
```
background: url(./column.png), url(./column1.png), url(./column2.png), url(./column3.png);
background-position: left top, right top, left bottom, right bottom;
background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
background-color: pink;
```
### background-size
如果要让背景图片充满整个元素，则基本上要用到这个属性
background-size: 100% 100%  背景图片的宽度为元素宽度100%，高度为元素高度100% （此种写法会让图片充满元素，但会失真）
background-size: 100% auto  背景图片的宽度为元素宽度100%，高度由浏览器自动计算一个值，保持不失真(推荐)
其他可取值：
```
background-size:auto;
background-size:cover;
background-size:contain;
background-size:auto;
background-size:50px;
background-size:50%;
```

### 兼容写法
background-image写两遍，是为了兼容后退机制写法。
```
.item{
    background-image:url(./column.png); 
    background-image:url(./column.png), url(./column1.png), url(./column2.png); 
}
```

### 渐变
关于渐变的东西太多，这里只写点东西，留个印象。

#### 线性渐变
线性渐变由linear-gradient定义，linear-gradient是一个css函数,
##### 同位置定义两个颜色
同位置定义两个颜色会形成一个分割线：

```
background-image: linear-gradient(blue, green 30%, red 50%);
```
从上到下，蓝色开始，到30%的位置时是绿色开始，到50%是红色开始，以后都是红色，效果：
![](/image/css/linear1.jpg)

```
background-image: linear-gradient(blue, green 50%, red 50%);
```
同位置定义了绿色和红色 50%；发现绿色和红色重合了，这个也是一个小技巧，效果：
![](/image/css/linear2.jpg)

。

##### 其他值
```
/* 渐变轴为45度，从蓝色渐变到红色 */
linear-gradient(45deg, blue, red);
/* 从右下到左上、从蓝色渐变到红色 */
linear-gradient(to left top, blue, red);
```

#### 线性渐变
```
 background-image: radial-gradient(circle, red, yellow, green);
 ```

#### 渐变的应用场景
渐变的应用场景非常广泛，很多css技巧，很多图形，如四边形，菱形，梯形，多边形，格子背景，背景图案 等等，都可以有渐变完成；
在《css 揭秘》这边书中，有很多技巧都基于渐变完成


### z-index只用于定位元素
Z-index 仅能在定位元素上奏效（例如 position:absolute;）！
很多人将它用于普通元素，没毛病，属于经典地犯错。

### flex
#### 介绍
注意，设为 Flex 布局以后，子元素的float、clear和vertical-align属性将失效。
两个概念：主轴、辅轴(交叉轴)；

#### 属性
以下6个属性设置在容器上
- flex-direction
- flex-wrap  ---是否换行
- **flex-flow 上面二者缩写**
- justify-content
- align-items
- align-content 多行（多轴）如何对齐，与align-items意义一样，前者是单行，后者多行；


- order 定义项目的排列顺序，实际中用得少；
- flex-grow 放大
- flex-shrink 收缩
- flex-basis 属性定义了在**分配多余空间之前**，项目占据的主轴空间，容器根据这个属性，计算主轴是否有多余空间，然后决定如何执行- flex-grow或flex-shrink，这个属性是flex中比较难理解的，同时设置width和flex-basic时，flex-basic覆盖width，在flex子项中，建议使用flex-basic，少用width，有些人说，flex-basic是用来代替width的。
- **flex 上面三者的简写**  flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
- align-self  单独垂直对齐，可覆盖align-items属性

#### 运用技巧

##### 行内自适应宽度
一行当中，某几个行元素固定高度，给剩下一个元素随意定义一个flex值，比如1、2、3...都可以，让这个元素自适应。
```
   .box{
            display: flex;
        }
        .box-item1{
            width: 80px;
            background: rebeccapurple;
        }
        .box-item2{
            flex: 1;
            background: red;
        }

        <div class="box box-2">
                <div class="box-item1">2</div>
                <div class="box-item2">3</div>
            </div>
```
效果：
![](/image/css/flex1.jpg)