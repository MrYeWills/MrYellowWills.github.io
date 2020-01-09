---
title: css笔记
date: {{ date }}
tags: css
categories: 
- css
series: css
---

最近对从业以来的css知识从新梳理，整理成四篇博客，除本篇博客外，还有：
[《vertical-align、行盒子、baseline》](http://127.0.0.1:4000/2019/04/06/css_vertical_align/)
[《css之移动开发》](http://127.0.0.1:4000/2019/04/13/css_mobile/)
[《css之布局》](http://127.0.0.1:4000/2019/04/14/css_layout/)

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

### 阴影box-shadow
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

#### box-shadow 与 filter
filter也可以用来写一个阴影效果。filter还有其他很多功能。
以下两个写法，都可以达到元素阴影的效果，
```
 filter: drop-shadow(0px 0px 10px gray);
 box-shadow:0px 0px 10px gray;
```

### outline 轮廊线
#### outline能做到的效果：
![](/image/css/outline.jpg)

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

#### outline与box-shadow区别
outline 与 box-shadow有时候可以达到相同效果，不同的是，当元素有border-redius，outline会有缝隙，box-shadow不会。

### 充满父级或屏幕
#### 充满父级：
```
{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
```
#### 充满屏幕：
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

### 伪元素做边框
```
    .item {
            height: 100px;
            width: 100px;
            position: relative;
        }
        .text::after{
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            border: 1px solid;
        }
```
```
<div class="item">
            <div class="text">
            </div>
        </div>
```
这其实利用了经常使用的遮罩方法：
```
//以此达到百分之百撑满body，这比width：100%要少很多想不到的问题
.mask{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: grey;
}

```

### cursor 光标图标
设置光标图形，几乎你页面上看到的所有光标图样，都可以设置，参考MDN，如：
```
cursor: wait;
```
![](/image/css/cursor.jpg)

### 跟随神器
js 函数，自适应方向上下左右浮动

### 文字效果
E:\css-mastery-16-master\chapter-04\04-33-experimenting-with-shadows.html

### 平移和动画
可查看[GitHub上的demo](https://github.com/YeWills/css_demo)

 ### 四种居中方式
 #### flex居中
 flex为水平和垂直居中而生，是当代居中最佳方案，这里是展示相对屏幕居中，如果是元素居中更加简单。
```
body{
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
   }
.wrap {
	width: 18em;
	height: 18em;
	box-sizing: border-box;
	background: #00BCD4;
}

<body>
  <div class="wrap"> </div>
</body>
```
 #### translate居中
 flex没有出来之前，该方法最好，因为不需要知道元素宽度；
 ```
 //除flex外，最好的居中最好方法
  .wrap {
           position: absolute;
           top: 50%;
           left: 50%;
           transform: translate(-50%, -50%)
        }
 ```
 #### margin负数
 该方法有点，兼容性最强，弊端，需要知道元素宽度；
 ```
 //居中最好方法
  .wrap {
           position: absolute;
           top: 50%;
           left: 50%;
           margin-top: -3em;
           margin-left: -9em;
           width:18em;
           height:6eml
        }
 ```
  #### 视口vh方法
 该方法局限性很大，只能相对于视口，也就是相对于屏幕居中，无法相对元素居中；[demo](http://dabblet.com/gist/bf12b39d8f5da2b6e5b6)
 ```
.wrap {
	width: 18em;
	height: 18em;
	margin: 50vh auto 0;
	transform: translateY(-50%);
	box-sizing: border-box;
	background: #00BCD4;
}
<div class="wrap"> </div>
 ```
### 自定义CheckBox
主要是定义好这几个状态的样式： focus hover  同时focus和hover；
主要通过以下步骤：
#### 定义 label[for]和id
#### 隐藏元素input
#### 利用选择器 input[type="checkbox"] + label 
```
  <div>
    <input type="checkbox" name="lang-as" id="lang-as">
    <label for="lang-as">ActionScript</label>
   </div>
  

  input[type="checkbox"] {
        position: absolute;
        overflow: hidden;
        width: 1px;
        height: 1px;
        clip: rect(0 0 0 0);
      }
  input[type="checkbox"] + label {
    line-height: 1.5;
    color: #333;
    padding-left: 1.5em;
    background-position: .125em 36%;
    background-repeat: no-repeat;
    background-size: 18px 18px;
  }
  input[type="checkbox"] + label {
    background-image: url(images/checkbox-unchecked.png);
  }
  input[type="checkbox"]:checked + label {
    background-image: url(images/checkbox-checked.png);
  }
  input[type="checkbox"]:focus + label {
    background-image: url(images/checkbox-unchecked-focus.png);
  }
  input[type="checkbox"]:focus:checked + label {
    background-image: url(images/checkbox-checked-focus.png);
  }

```
[demo](https://github.com/YeWills/css_demo/blob/master/chapter-09/09-checkbox.html)

### 如何适配移动端页面
#### viewport
设置viewport让页面宽度与屏幕宽度适配，否则在移动端上显示时字体将变小
#### rem／viewport／media query
通过rem、viewport、媒体查询等进行响应式设计
#### 设计上：隐藏 折行 自适应
功能设计上，pc端有的功能，移动端可以去掉隐藏；
pc端一行显示的，移动端多行显示；
给一些元素留下自适应的空间，让一些元素可大可小。
### 扑克牌式展开图片(transform-origin)
#### 代码实现
```css
.cardfan > img{
		  transform-origin: center 400px;
		}
		.cardfan img:first-child{
		  transform:rotate(5deg);
		}
		.cardfan img:last-child{
		  transform:rotate(-5deg);
		}
```
#### transform-origin
transform-origin 默认值为 center，如果直接旋转会达不到此效果，需要设置圆心，此时可达到扑克牌式样展开效果，此时设置位置如下，更多用法参考mdn，
![](/image/css/transform-origin.jpg)

另外也可以设置transform-origin: center -400px;显示相反效果。

### 折角与翻页动画
#### 效果
![](/image/css/page.jpg)
#### 折角方案-两边border值为0
如下，border两面为0两面有值，形状如下，在上图图片的div上设置一个before伪元素，
伪元素content为0，只有两个border有width，半边白色，半边是带透明度的颜色(达到不完全遮住图片效果)：
![](/image/css/page0.jpg)
```
 <div class="image-layer" id="image-layer">
	  </div>
.image-layer:before {
		  content: '';
		  position: absolute;
		  top: 0;
		  right: 0;
		  border-style: solid;
		  border-width: 0;
		  border-color: rgba(0,0,0,0.2) #fff;
		  border-radius: 0 0 0 4px;
		  transition:all 0.4s ease-out;
		}

		.image-layer:hover:before{
		  border-right-width:80px;
		  border-bottom-width:80px;
		}
```

#### 翻页动画方案-设置border-width为较大值
翻页是一个页面呈三角形状直至三角为0的过程，也可以使用上面的方案，只有两个border有width，半边白色，半边是带透明度的颜色，
当border-width足够大时，白色区域足够大，形成翻页效果。
#### demo
[demo1](https://github.com/YeWills/canvas-demo/blob/master/pages/multy/css-animation/3-3/border-width.html)
[demo2](https://github.com/YeWills/canvas-demo/blob/master/pages/multy/css-animation/3-3/border-width-more.html)

### 绕(椭)圆行驶动画 (transform-origin)
#### 绕圆行驶动画
这个最简单，绕自身旋转就是,原地打转：
```
transform:rotate(1turn)
```
设置如下就可以绕圆行驶了
```
transform-origin:center 150%;
```
#### 绕椭圆行驶(translate)
椭圆的路径就要结合偏移了transform:translateY(200px);如下图，
每次行驶到上下两个顶点时候，让父节点跟着偏移：
![](/image/css/circle-ani.jpg)
```
<figure>
	  <div class="butterfly">
	    <img src="http://p7.qhimg.com/t01a4c54ef5309e561c.png" alt="" />
	  </div>
	</figure>

  .butterfly{
		  width:150px;
		  height:142px;
		  margin: 0 auto;
		  transform-origin:center 150%;
		  animation:circle 2s infinite linear;
		}
		.butterfly img{
		  width:100%;
		  height:auto;
		}
		figure{
		  margin-left: 200px;
		  animation:updown 1s infinite ease-in-out alternate;
		}
		@keyframes updown{
		    to{
		      transform:translateY(200px);
		    }
		}
		@keyframes circle{
		  to{
		    transform:rotate(-1turn);
		  }
		}
```

#### demo
[demo](https://github.com/YeWills/canvas-demo/tree/master/pages/multy/css-animation/3-4)

## css知识

### 行内盒子 匿名盒子 
具体参考 另外一篇博客《vertical-align、行盒子、baseline》
匿名盒子说的是没有任何标签的文本，如下， prity girl 这两个文本就是一个匿名盒子：
```
 <div>
      prity girl
      <p>can you liu one qq</p>
  </div>
```

###  float浮动定位
参考 《css知识点汇 -- float浮动定位》

### 有关em
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
当你想要当前元素的 padding\padding\border-radius\box-shadow\text-shadow\margin\line-height 等值，与当前字体大小成比例的时候，使用 em 单位。

### rem的使用场景
rem 主要用于移动端适配，pc端用得少.

### display:none与visibility:hidden
display:none 不为被隐藏的对象保留其物理空间 
visibility：hidden 为被隐藏的对象保留其物理空间

### 伪类与伪元素
#### 定义
```
::before  //伪元素
:focus  //伪类
```
#### 二者区别
伪元素是真的有元素，伪类只是元素的状态。
#### content - attr\url\counter
##### 配合attr使用
attr是css3的一个属性。
attr是用来content与元素进行通信的一个接口：
```
.text{
    position: relative;
}
.text:hover::before{
    content: attr(show-tip);
    position: absolute;
    top: -150%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
}

<span class="text" show-tip="6666"> prity girl</span>
```
##### 配合url使用
```
h1:after {content:url(/i/w3school_logo_white.gif)}
```
##### 配合counter使用
用得较少，用来计数，更多请->Google
```
  .conter p:before{
                     content: counter(count,decimal) "." /*调用计数器 并在数字后添加.*/
                     counter-increment: count;
                }
```
#### 伪元素相当于父级内的内联span元素
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

#### :hover::before
伪类结合伪元素一起使用
参考《content几种用法》
参考《自定义CheckBox》

#### hover active focus onblur 经典应用
一个按钮的hover active focus onblur这三个状态触发时候先后顺序的
hover  鼠标悬浮按钮上；
active  左键按住按钮；
focus  左键松开后，激活按钮状态为focus；
onblur 左键点击任意位置，变为非focus状态

理解上面四个状态非常关键，很多基本的样式都是基于上面开发的，一个前端不早弄懂上面四个状态，哭都没地方去。
```
.btn:hover{
    background: blueviolet;
}
.btn:active:focus{
    color: red;
}
.btn:focus{
    color: blue;
    outline: 2px solid yellow
}

 <button class="btn">9999999</button>
```

#### focus 与 tabindex
tabindex 是html5属性 ，非常好用， 指示其元素是否可以聚焦
在html4中，不是每个标签都拥有focus属性，在html5中，通过tabindex，每个标签都可以定义focus属性。
参考《博客---html笔记---tabindex》

#### 伪元素做边框
参考《伪元素做边框》

### 大汇集
font-weight 默认为normal，normal对应数值为400，可以使用关键字 normal、bold等等，也可以使用数数值，都是100的整数：100、200、300、400等等
text-transform 可以使英文单词首字母大写或者所有字母大写，或者所有字符小写的功能；
word-spacing: 0.1em; 英文单词间距
letter-spacing: 0.1em; 英文字母间距
text-shadow ： 字体阴影效果
text-overflow: ellipsis或clip
```
clip : 不显示省略标记（...），而是简单的裁切
ellipsis : 当对象内文本溢出时显示省略标记（...）
```
columns 可用来文本分多栏显示；
pointer-events 可用来打开的禁止元素的事件响应，设置为none的时候，不会触发该元素的hover和click事件；

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

### 颜色值函数-rgb/rgba/hsla
rgba是rgb的进化版，带有透明度；
#ffffff 六位数是没有透明度的；
#00000000 八位数的是有透明度的；
hsla是hsl的进化版，带有透明度；
hsla其实没什么特别的，也就跟rgba一样是个颜色单位，貌似它与rgba区别的是，hsla写法更加简洁。

### background
#### 关于background本身
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
#### background多重背景
```
background: url(./column.png), url(./column1.png), url(./column2.png), url(./column3.png);
background-position: left top, right top, left bottom, right bottom;
background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
background-color: pink;
```
#### 带颜色\图片\定位的背景
蓝色背景、背景图片、背景图片距离父级右边19px底部向上10px.[demo](http://dabblet.com/gist/0f226e63595d1bef88cb)
```
 .wrap {
            background: url(../image/css/outLine.jpg)  no-repeat  blue;
  	        background-position: right 19px bottom 10px;
        }
```
#### background-size
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
#### background相关属性
[background-origin：background-origin 属性规定 background-position 属性相对于什么位置来定位。](https://www.jianshu.com/p/e377c0bebfd0)
```
background-origin: padding-box|border-box|content-box;
```
[background-clip 规定背景的绘制区域;](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-clip)

```
background-clip: padding-box|border-box|content-box;
```

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

#### flex-shrink IE与谷歌差异
flexbox的规范是 当空间小是，元素宽度随之减少，当减少到元素的width时，将不再减少。
目前谷歌和火狐以及Op浏览器忽略上面这个规范，也就是说在这些浏览器中，元素可以减少到0px宽度；
IE遵守以上规范，当元素减少到width时，将不再减少。

### 媒体查询 与 响应式布局
#### 媒体查询能查的特性
可以尺度查询，如max-width；
可以宽高比查询：
可以横竖屏方向查询；
可以设备像素比查询 min-resolution
见P220

#### 媒体查询的技巧
```
/* 这种媒体查询的写法，很妙，由上到下进行层叠，下面的覆盖上面的，达到不用写 这种形式：30em<width<56em ,使用一个min-width就达到效果*/

    @media only screen and (min-width: 35em) {
      .row-quartet > * {
        width: 50%;
      }
      .subcategory-featured {
        width: 100%;
      }
    }
    @media only screen and (min-width: 50em) {
      .row-quartet > * {
        width: 25%;
      }
      .subcategory-featured {
        width: 50%;
      }
      
    }
    @media only screen and (min-width: 70em) {
      .subcategory-header {
        width: 20%;
      }
      .subcategory-content {
        width: 80%;
      }
    }
```

#### 很妙的响应式布局简单范例
GitHub 08-05-responsive-news.html
#### 感受下最简单的响应式设计demo
E:\css-mastery-16-master\chapter-08\08-05-responsive-news.html
#### 响应式设计 的一些应用

对字体的设计：
  body {
      font-family: 'Open Sans', 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.5;
    }
    @media only screen and (max-width: 37.5em) {
      h1,h2,h3,h4,h5,h6 {
        font-family: 'Open Sans Condensed', 'Arial Narrow', Arial, sans-serif;
      }
    }
高清图或多倍图或大小图查询：
 .profile-box {
      position: relative;
      height: 300px;
      background-size: cover;
      background-position: 50% 50%;
      background-image: url(img/small-cat.jpg);
    }
    @media only screen and (min-width: 600px) {
      .profile-box {
        height: 600px;
        background-image: url(img/big-cat.jpg);
      }
    }

#### 更多响应布局知识
参考博客《css之布局》

### calc
#### 介绍
calc能识别 px、百分比、em，且可以混写，如下有效：
```
width: calc(50% + 20px*4 - 1em);
```
注意，calc值内，运算符两边需要空格，否则无效。
#### calc居中__50%-xx
以下是常规利用margin auto让img图片居中的方法，弊端是需要给图片设置display: block;,原因参考《margin:0 auto在inline-block失效》
```
.wrap {
        background: rebeccapurple;
    }
img{
    margin: 0 auto;
    display: block;
}
 <div class="wrap">
        <img class="dd" src="http://csssecrets.io/images/adamcatlace.jpg" />
    </div>
```
可以使用calc来实现，可以让代码更简洁，利用的是数学原理，假设图片长度已知为400px；
那么 100%- (50%-200px)*2 = 400px ;这个400px就是图片长度，100%是父级宽度50%-200px是内边距或外边距。
记住 50%-xx 是calc居中的套路。
```
//方法一
 .wrap {
        background: rebeccapurple;
        padding: 0 calc(50% - 200px);
    }
```
```
//方法一
img{
    margin: 0 calc(50% - 200px);
}
```
  
### css3较好特性
#### max-width: min-content
 min-content是css3关键字，
 众所周知，如果不给元素一个具体的height,它就会自动适应内容的高度。假如我们希望width也具有同样的类似行为，如何达到，此时可以使用min-content。
 min-content 这个关键字将解析为这个容器内部最大的不可短行元素高度（即最宽的单词、图片或具有固定宽度的盒元素）
[直接参考这里](https://www.jianshu.com/p/b7c929fce368)
 ```
 .wrap {
	max-width: min-content;
}

  <div class="wrap">
      <img src="http://csssecrets.io/images/adamcatlace.jpg" />
      <div>
          The great Sir Adam Catlace was named after Countess Ada Lovelace, the first programmer ever.
      </div>
  </div>
 ```
### base64图片
base64来代替png图片，利于减少http请求，提高性能，但是图片经过编译变成base64文本时，其体积大小增加了三分之一，增加了css或html体积。
因此base64一般用于小图片，由于base64文本不利于后期修改和维护，所一般不直接使用base64，而是通过webpack等编译的方式，将png形式的图片编译成base64.
因此有以下特点：
#### base64是文本
#### base64要比原来图片体积增加1/3
#### base64用于小图片
#### 通过打包生成base64
#### base64的使用减少了http请求

## css黑知识

### css 覆盖原则
简写的方式，最容易覆盖原来定义好的规则，修改已有代码时，不覆盖以前样式的方式就是不要写简写。
例如outline，background的等等。
```
  outline-width: 15px;
  outline-color: #00BCD4;
  outline: solid; //覆盖了以上两句css样式，实际展示的轮廊线将为 默认的size，和黑色
```
### font-family 多值写法
```
//Times new Roman 使用了引号，因为它有空格，当有空格时，最好加上引号，也可以不加
font-family: Georgia, Times, "Times new Roman", sefif;
```
后备机制是font-family的重要特性。
以上是一种后备写法，从左到右，优先级左边最高，当此值在浏览器中无法识别时，往右顺延。

### % 参照的是父级的什么属性
#### position
```
{
    position: absolute;
    top: 10%;
    left: 10%;
}
```
left 参照父级的 width；
top 参照父级的 height；
#### margin 参照父width
margin 百分比只参照父级的宽度。
```
{
    margin-left: 10%;//父级的宽度
    margin-top: 10%;//父级的宽度
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
![](/image/css/margin2.png)

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
[不多写了，直接参考这里的---<2. 布局：自适应两栏布局>](https://segmentfault.com/a/1190000009545742)，效果如下：
![](/image/css/margin3.jpg)
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

### 推荐使用伪元素来消除浮动
#### 概述
参考《精通css》P181，
对于小的元素，使用overflow是比较方便，可以使用overflow；
对于大的元素，可能元素需要显示滚动条，或者有些定位元素需要放在这个大的元素之外，这时候使用overflow可能产生不利影响，所以大的元素，推荐使用伪元素来实现：
```
.row{
    content:'',
    display:block,
    clear:both,
    height:0
}
```
#### clear为什么能消除浮动
参考clear 在mdn官网的解释： 指定一个元素是否必须移动(清除浮动后)到在它之前的浮动元素下面。
因此在父元素内，放置一个块级元素，并且放置在浮动元素后面，设置clear：left／right／both；
此时此clear元素将移动到浮动元素下方，由于此clear元素处于父元素文档流内，将让父元素高度撑开到与浮动元素一样高。
达到消除浮动效果。
详细参考[清除浮动的四种方式及其原理理解](https://juejin.im/post/59e7190bf265da4307025d91)

**clear消除浮动方式的步骤**
#### 在父元素最底部放置一个元素
#### 设置此元素clear属性
#### 设置此元素为块级元素

### 兼容写法(后退机制)
background-image写两遍，是为了兼容后退机制写法。
```
.item{
    background-image:url(./column.png); 
    background-image:url(./column.png), url(./column1.png), url(./column2.png); 
}
```

### z-index只用于定位元素
Z-index 仅能在定位元素上奏效（例如 position:absolute;）！
很多人将它用于普通元素，没毛病，属于经典地犯错。

### 为什么line-height被默认成元素的height了
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>wills-react-pro</title>
  <style>
    .wrap{
      height: 30px;
      background: blue;
    }
    .test{
      line-height: 60px;
      display: inline-block;
      background: red;
    }
  </style>
</head>
<body>
  <div class="wrap"> 
      <span style="line-height:20px;">
        test<span class="test">最高1</span>的值
      </span>
    </div>
</body>
</html>
```
![](/image/css/line-height1.jpg)
![](/image/css/line-height2.jpg)
可以看到.test 的span的高度完全被其line-height所确定了，变成60px；
其他实验结果有，当给.test 的span设置display: inline;span为行内元素，span没有高度，其高度变成父层高度30px,但是span依然会撑开60px的空间：
![](/image/css/line-height3.jpg)

小结：对inline还是inline-block，在没有定义它对height时，line-height会被默认为元素高度；
此时可以通过给元素定义height达到指定高度的目的，但是line-height比height高的情况下，依然会让元素占满line-height的高度。

所以在开发时，遇到很多奇葩的元素高度从何而来时，不要指想着height，认为在谷歌浏览器上找不到height就很奇怪这个高度是怎么来的，你还需查看是否是其line-height生成的height。
另外，不要随意定义line-height，可能会导致意想不到问题。

### 视口
#### 简介
参考 博客《css布局》
视口的独有尺寸，vh，vw，
#### vh/vw 运用
vh其实很简单，就是相对视口的1%的长度意思。
参考《四种居中方式 --- 视口vh方法》
参考《分辨率\像素\视口 与 移动开发》

### css编写的建议
#### 关于媒体查询的使用
将媒体查询当做最后选择，如果你页面布局足够灵活，可能只需要少量的媒体查询即可，所以解决问题时，优先灵活解决，然后再考虑媒体查询。
#### css 书写原则
尽量不要使用id

### 流转块的三种方式
- 设置：display:block；
- 对inline元素设置float；
- 对inline元素设置position:absolute/fixed；
大家对第一种熟悉，但没想到后面两种也可以流转块；

### vertical-align、行盒子、baseline
参考博客《vertical-align、行盒子、baseline》

### 分辨率\像素\视口 与 移动开发
参考博客《css之移动开发》

### css之布局
参考博客《css之布局》

### inline-block元素之间的间隙
#### 原因
两个元素之间书写的时候没有紧挨一起，或者有换行，从而导致间隙。
```
<div class="inline-block">abc</div>
<div class="inline-block">abc</div>
```
#### 设置父元素font-size：0
在父亲元素设置font-size为0，然后在自己元素内设置回来。
#### 将元素书写时紧挨一起
#### 设置元素为float
利用float元素会脱离文档流的特性。

### transform与坐标变换
参考《css知识点汇 -- transform与坐标变换》