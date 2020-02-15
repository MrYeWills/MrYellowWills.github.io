---
title: 前端demo讲解
date: {{ date }}
tags: [前端demo讲解]
categories: 
- js
series: js
---

## 画一个时钟
### demo与效果
[查看demo](https://github.com/YeWills/canvas-demo/blob/master/pages/multy/css-animation/clock.html)
![](/image/js_demo/clock.jpg)
### 将元素按圆弧排放的两种方法
#### css方法 --表盘刻度
将元素旋转后，自身坐标系改变，再对所有元素等距离等方向位移即可。
![](/image/js_demo/clock_css.jpg)
#### 计算坐标点方法  --表盘数字
见上面《css方法》图
### 度与弧度制转换
π 相当于 180度， 1度转换为弧度制的值就是 π ／180：

1度=π ／180=Math.PI/180

### cos、sin与圆几何度经典应用
### transform-origin的细微处理
时针与刻度都用了transform-origin：left center；

### 更多讲解参考
[如何制作一个时钟](http://jiaolonghuang.github.io/2014/12/13/clock/)

## 全屏切换效果(轮播)
### demo与效果
[查看demo](https://github.com/YeWills/canvas-demo/blob/master/pages/multy/css-animation/switch-plugin/demo.html)
[demo讲解视频](https://www.imooc.com/learn/374)
![](/image/js_demo/switch.jpg)
### 轮播切换设计方案
#### 三层div设计
如下图,代码如下，说明的是，设置overflow: hidden;起到裁剪的作用，设置外层（container）是为了在文档流中预定位置。
![](/image/js_demo/switch_idea.jpg)
```html
<div id="container" data-PageSwitch>
		<div class="sections">
			<div class="section active" id="section0">
			</div>
			<div class="section" id="section1">
			</div>
			<div class="section" id="section2">
			</div>
			<div class="section" id="section3">
			</div>
		</div>
	</div>
```
```css
#container{
        overflow: hidden;
    }
/* sections设置成100%也好，当内部高度依赖外层高度时，将三层高度都设置成100% */
    #container,.sections,.section{
        height: 100%;
        position: relative;
    }
```
#### translateY实现切换显示
根据上面的三层div设置后，外层因为使用overflow hidden 遮挡了 sections壳的全部内容，形成裁剪效果，不过sections实际是全部显示的，
因此对sections使用translateY实现切换显示。
#### 内外三层都使用 height: 100%技巧
如上面代码， #container,.sections,.section都使用了height: 100%;让三者的高度保持一致。因为切换显示也是将内层的section全屏展示在container上，因此这种方法非常棒。
#### offsetTop获取translateY偏移值
offsetTop是非常棒的方法，使用方法自行网上查询。虽然上面的section0 section1 section2 section3可能没有被显示，但是它们相对于container或sections的offsetTop是确定好的。
每次轮播的时候，记住index值，根据index获取轮播单元 section，获取它的offsetTop获取translateY偏移值。
### 记住轮播单元的index很关键
显示哪一页都是index进行标识，设计这个轮播插件，关键是处理index，处理好index了，其他都是围绕这个处理。
### 有趣的动画监听事件transitionend
本demo为了效果立体，设置了transitionend，有兴趣可参看demo

## 图片跑马灯(轮播)
### demo与效果
[查看demo](https://github.com/YeWills/canvas-demo/blob/master/pages/multy/css-animation/animation-master/html/marquee-modify.html)
[查看demo效果](https://yewills.github.io/canvas-demo/pages/multy/css-animation/animation-master/html/marquee-modify.html)

这里还有一个[jquery版本的demo](https://github.com/YeWills/canvas-demo/blob/master/pages/multy/css-animation/animation-master/html/marquee.html)，方便理解，可以看看。
基本原理同上面的《全屏切换效果(轮播)》
### 最后位置重复添加第一张图片
如果不在最后的位置添加第一张图片，会有一个留白的效果。
原理在于，当transform: translateX(-1800px);时，此时页面将显示那张重复放置的第一张图片，
因为animation的动画在translateX(-1800px)时完成，设置的infinite特性，将瞬间0秒回到初始位置，也就是页面只有第一张图片的时候，此时就不会出现空白页，且图片循环播放流畅。
```html
    <div class="marquee">
        <div class="content">
            <div class="list"><img src="./../css/i/timg.jpg" alt=""></div>
            <div class="list"><img src="./../css/i/timg1.jpg" alt=""></div>
            <div class="list"><img src="./../css/i/timg2.jpg" alt=""></div>
            <!-- 重复放置第一张图片 -->
            <div class="list"><img src="./../css/i/timg.jpg" alt=""></div>
        </div>
    </div>
```
```css
.marquee, .content, .list{
  height: 400px;
}
.marquee, .list{
  width: 600px;
}
.content{
  /* width 600px * 3 */
  width: 1800px;
  animation: run 9s linear infinite;
}
@keyframes run{
  100%{
    transform: translateX(-1800px);
  }
}
```
### 页面留白问题分析与解决
参考上面《最后位置重复添加第一张图片》
### 使用animation的infinite特性保持循环流畅
参考上面《最后位置重复添加第一张图片》

### 怎么做左到右的循环播放
上面的例子是右到左的轮播，因此在最后的位置添加了第一张图片，如果需要左到右轮播，则在最开始的位置添加最后一张图片。

## JS实现京东无延迟菜单效果
### demo与效果
#### 介绍
[查看demo](https://github.com/YeWills/canvas-demo/blob/master/pages/multy/css-animation/nonDelay/index.html)
[demo讲解视频](https://www.imooc.com/video/14717)
![](/image/js_demo/delay.jpg)

#### 一级菜单与二级菜单
如上图，左侧菜单称之为一级，右侧内容显示称之为二级菜单。
### 需求分析
#### 垂直运动不延时
在一级菜单如下图做垂直运动时不延时，当测斜运动并处于三角区内时，做延时显示右侧面板，以达到选择好一级后，光标移到右侧二级时，二级不消失。
![](/image/js_demo/delay_idea.jpg)
#### 三角区内移到二级时做延时
分析如上《垂直运动不延时》
### 判断三角区内的方案
#### 方案设计
通过mousemove记录光标的移动路径，在全局内存储光标移动路径（坐标点），以二级菜单区域的右上角和右下角作为三角区内亮点，
给一级菜单都绑定mouseenter。
当mouseenter触发时，取全局移动路径的最后两个点，倒数第二个点为三角区第三个点，最后一个点为p点，判断p点是否处于上面三个点构成的三角区内。
#### document 绑定mouseenter
以此记录光标移动路径，这是常规做法。记住不用的时候需要解绑。
#### 一级菜单mouseenter触发时计算三角区
如上面《方案分析》
#### 二维向量叉乘判断是否在三角内
- 向量：Vab=Pb-Pa
- 二维向量叉乘公式：
a(x1,y1)*b(x2,y2)=x1*y2-x2*y1
- 用叉乘法判断点在三角形内
![](/image/js_demo/delay_ang.jpg)
代码如下：
```js
//判断 a b 是否全部为负数 或 正数；
function sameSign(a, b) {
	return(a * b) > 0
}

function vector(p, b) {
	return {
		x: b.x - p.x,
		y: b.y - p.y
	}
}

function vectorProduct(v1, v2) {
	return v1.x * v2.y - v2.x * v1.y
}

function isPointInTrangle(p, a, b, c) {
	var pa = vector(p, a)
	var pb = vector(p, b)
	var pc = vector(p, c)

	var t1 = vectorProduct(pa, pb)
	var t2 = vectorProduct(pb, pc)
	var t3 = vectorProduct(pc, pa)

	return sameSign(t1, t2) && sameSign(t2, t3)
}
isPointInTrangle(currMousePos, leftCorner, topLeft, bottomLeft)
```
#### 二级菜单定义mouseenter
二级菜单定义mouseenter，当鼠标移到二级菜单时，说明二级菜单处于打开状态，此时，在延时处理时不做任何处理。

### 光标路径移动趋势分析
通过光标移动的最后两个点，来判断光标的移动方向(趋势)，这点非常妙。
### 向量二叉乘
只需要知道坐标，就可以通过向量二叉乘知道某一点是否处于区域内。太妙。
### tab二级菜单显示方案
#### 二级菜单样式都一样
二级菜单的布局样式都一样（大小宽高等），需要显示哪一个时，display block／none进行切换。
#### display的none／block
每次只显示对应的二级菜单，其他二级菜单 display ：none。

## 动画demo 及 css动画知识点
### 会动的兔八公 与 step
#### demo与效果
[查看demo效果](https://yewills.github.io/canvas-demo/pages/multy/css-animation/animation-master/html/rabbit.html)
[demo地址](https://github.com/YeWills/canvas-demo/tree/master/pages/multy/css-animation/animation-master/html/rabbit.html)
![](/image/js_demo/rabbit.jpg)

#### step是针对keyframes内定义的每个百分比的
下面有方式一和方式二，效果是一样的，
step是针对keyframes内定义的每个百分比的，在方式一中keyframes内只定义了一个100%，
因此步进范围与速度为 100%／12
```css
//方式一
.tuzi0 {
  width: 200px;
  height: 200px;
  animation: run2 0.2s steps(12) infinite;
  background: url(./i/tuzi.png) no-repeat;
}
@keyframes run2 {
  100% {
    background-position-x: -2400px;
  }
}
```
在方式二中keyframes内只定义了一个50% 100%，
在0到50%时，步进范围与速度为 50%／6；
在50%到100%时，步进范围与速度为(100%-50%)／6；
因此方式一方式二效果一致。
```css
//方式二
.tuzi {
  width: 200px;
  height: 200px;
  animation: run 0.2s steps(6) infinite;
  background: url(./i/tuzi.png) no-repeat;
}
@keyframes run {
  50% {
    background-position-x: -1200px;
  }
  100% {
    background-position-x: -2400px;
  }
}
```

#### step的一些认识
动画片一定要用step，比如loading demo；
loading为什么定义成线性时间函数时，会出现晕眼的情况，是因为两个原因：
上一个loading刻度到下一个step时，没有完全踩在上一步step的脚印上，会乱，同时也会造成晕眼；
反之推算出，要实现这种拍浪或loading的效果，或跑火车的效果，就只能完全踩在上一步的脚印上的方案。

#### step更适合动画片相关场景
参考上面《会动的兔八公 与 step》讲解。


### loading效果 - step
#### demo与效果
[查看demo效果](https://yewills.github.io/canvas-demo/pages/multy/css-animation/animation-master/html/loading.html)
[demo地址](https://github.com/YeWills/canvas-demo/tree/master/pages/multy/css-animation/animation-master/html/loading.html)
#### step时间函数的经典应用
看demo的效果就知道，loading图片是一个12个刻度的圆，为了不晕图或者混乱，有一种递进的效果，就必须每走一个step，每个刻度踩在上一个刻度的上面，这样就不晕眼，因此，设置了step(12)，每个step旋转30度；
而原图的每个刻度之间刚好也是30度；
因此每走一个step，刚好完全踩在上一个刻度上。
```css
 .loading {
        width: 108px;
        height: 108px;
        background: url(../css/i/loading.png) no-repeat;
        border-radius: 50%;
        animation: round 1s steps(12) 3;
    }
    @keyframes round {
        100% {
            transform: rotate(360deg);
        }
    }
```

### 红包雨
#### demo与效果
[查看demo效果](https://yewills.github.io/canvas-demo/pages/multy/css-animation/animation-master/html/rain.html)
[demo地址](https://github.com/YeWills/canvas-demo/tree/master/pages/multy/css-animation/animation-master/html/rain.html)
#### 核心代码
```css
.content .yudi {
  position: absolute;
  opacity: 0;
  -webkit-animation: drops 1.2s cubic-bezier(0.54, 0, 0.18, 0.34) infinite;
          animation: drops 1.2s cubic-bezier(0.54, 0, 0.18, 0.34) infinite;
  width: 60px;
  height: 60px;
  background: url(./i/hongbao.png) no-repeat;
    /* 因为背景图片尺寸太大，背景图片宽度自适应，高度设置为60px */
  background-size: auto 60px;
}

@-webkit-keyframes drops {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    /* 可以设置translateY为0，设置为-10px有立体效果 */
    -webkit-transform: translate3d(10px, 100vh, -10px);
            transform: translate3d(10px, 100vh, -10px);
  }
}
```
```js
 let $content = $('.content');
    let initNumber = 0;
    for(let i=0;i<30;i++){
        let lefts =Math.floor(Math.random()*5+2);
        let delay = Math.floor(Math.random()*50+2)
        initNumber+= lefts;
        let $div = $('<div/>').addClass('yudi').css({
            "left":`${initNumber}%`,
            "top":`${lefts}%`,
            "animation-delay":`${delay/10}s`
        });
        $content.append($div);
    }
```
#### animation-delay的应用
见上面代码
#### position: relative 与 absolute的方案;
见源码
#### 彩蛋 - background-size
见上面代码


### animation的时间函数
#### 介绍
下面的ease-in-out就是时间函数，animation的时间函数分为线性时间函数与非线性；
线性时间函数全部是三次贝塞尔函数(浏览器控制台调试css时间函数时，通常显示的是一个三次贝塞尔函数正好印证了这一点)，
非线性时间函数主要指step。
```css
.tuzi {
  width: 200px;
  height: 200px;
  animation: run 0.2s ease-in-out infinite;
  background: url(./i/tuzi.png) no-repeat;
}
```
#### 线性函数 - 三次贝塞尔函数bezier
animation的线性时间函数都是三次贝塞尔函数(cubic-bezier)：
```css
.demo-3 {
    margin: 40px auto;
    border-radius: 50%;
    animation: jump 1s cubic-bezier(0.41, -0.04, 0.93, 0.29) infinite alternate;
}
```
有一些常规的cubic-bezier(x, x, x, x)值，我们直接用linear ease ease-in ease-out ease-in-out这些关键字来表示，这些关键字也称之为预设值。
就好比 我们用 black 关键字表示 #000000 这种颜色一样。
#### 非线性函数 - step
时间函数的非线性函数一般用step，参考上面的讲解。
#### 预设值linear ease ..
参考上面《线性函数-三次贝塞尔函数bezier》
#### 时间函数的控制台调试
谷歌浏览器提供了强大的css时间函数调试功能，参考[一位朋友的博客 - CSS3 动画](https://beat-the-buzzer.github.io/2019/11/27/c3-animation/)
#### 动画监听事件animationstart等等
[demo](https://github.com/YeWills/canvas-demo/blob/master/pages/multy/css-animation/animation-master/html/rabbit.html)
用这个的时候，注意以下兼容问题。
```js
$loading.addEventListener('animationstart',runstart);
$loading.addEventListener('webkitAnimationStart',runstart);
$loading.addEventListener('animationend',runend)
$loading.addEventListener('animationiteration',intertation)
```
 
## 其他demo
### 图片预加载
#### 方案设计
通常的做法是，在页面打开后，先添加一个进度条，监听加载进度，设置new Image()用来加载，加载好后，图片哪里需要就在src赋值上即可。
#### 原理
图片通过new Image()加载后，下一次在具体位置再使用src时，就不用等待了，直接就可以用。因此使用new Image() 达到预加载目的。
```
var images = [{
        url: 'https://github.com/CruxF/IMOOC/blob/master/ProImages/ImgPreloading01.jpg?raw=true',
        name: '无敌美少女一号'
      }]
  var $progress = $('.progress');
      // 遍历数组,i代表的是数组下标，src代表的是对应数组下标的对象或者属性值
      $.each(images, function(i, src) {
		  //此imgObj不会使用，只用来预加载
        var imgObj = new Image();
		//当图片有缓存时，不触发load事件，只能使用error来监听兼容此情况
        $(imgObj).on('load error', function() {
			//通过已加载的图片个数百分比来做进度条
          $progress.html(Math.round((count + 1) / len * 100) + '%');
          if(count >= len - 1) {
            $('.loading').hide();
          }
          count++;
        });
        imgObj.src = src.url;
      });

	  //以后使用时，直接赋给src，此时因为之前已经加载过，此时不会再次后台请求，直接秒显示
	   $('#img').attr({
          'src': images[index].url,
          'title': images[index].name,
          'alt': images[index].name
        });
```
#### 所有图片提前到页面初始时一起加载
参考《原理》
#### 图片加载百分比进度方案
通过已加载的图片个数百分比来做进度条，此方法是普遍做法，见上面代码《原理》；
#### 设置new Image()
参考《原理》
#### 监听load事件
参考《原理》
#### 监听error事件兼容缓存
当图片有缓存时，不触发load事件，只能使用error来监听兼容此情况，参考《原理》
#### 页面要用时再取值
参考《原理》
#### load与src顺序有讲究
上面的代码中src必须写在on('load')下面，先load，后src赋值，这样可以避免一些隐蔽的问题，比如图片缓存等等。
```js
    var imgObj = new Image();
	$(imgObj).on('load error', function() {});
	imgObj.src = src.url;
```
#### demo地址
[demo](https://github.com/YeWills/canvas-demo/blob/master/pages/multy/css-animation/ImgPreloading/index2-3_ok.html)

### 可调大小面板实现
#### demo与介绍
本demo基于[慕课网视频](https://www.imooc.com/learn/193)优化而来，[demo 地址](https://github.com/YeWills/canvas-demo/blob/master/pages/multy/css-animation/resizeable.html)
#### 方案分析
如下图，要实现左侧，下边，右下侧，三个位置可以拖动，
具体做法是在这三个地方添加一个看不见的拖动用的dom，给这三个dom绑定mouse事件，
在mouseMove中对矩形框持续设置宽高样式，
同时通过css设置三个位置Dom跟随。
![](/image/js_demo/resizable.jpg)
具体步骤如下：
#### 设置左、下、左下侧 拖动dom
```
panelDom = document.getElementById(panelId);
		['right', 'bottom', 'lean'].forEach(dragDomType=>{
			const dragDom = document.createElement("div");
			dragDom.class = dragDom.className   = `ui-Resizable-${dragDomType} ui-Resizable-ctrl`;
			panelDom.appendChild(dragDom);
			dragDom.addEventListener('mousedown', onMousemove);
		})
```
#### css设置拖动dom样式跟随矩形框
```
	.ui-Resizable-right{
		position:absolute;
		right:0px;
		top:0px;
		width:10px;
		height:100%;
		cursor: e-resize;
		}
```
#### mouseMove中改变矩形框宽高
```
	let newPanelWidth = panelDom.offsetWidth - 2 + moveDistance.x;
		let newPanelHeight = panelDom.offsetHeight - 2 + moveDistance.y;
		newPanelWidth = Math.max(newPanelWidth, 150);
		newPanelHeight = Math.max(newPanelHeight, 50);
		switch(mouseType){
			case 'movehorizontal':
				panelDom.style.width = newPanelWidth + 'px';
				break;
			case 'moveVertical':
				panelDom.style.height = newPanelHeight + 'px';
				break;
			case 'moveLean':
				panelDom.style.width = newPanelWidth + 'px';
				panelDom.style.height = newPanelHeight + 'px';
		}
```
### 固定侧边栏滚动
#### demo与介绍
[demo 地址](https://github.com/YeWills/canvas-demo/blob/master/pages/multy/css-animation/fixedSide/index.htm)
#### 需求分析
要求右侧的侧边栏，正常滚动的时候，正常滚动；
当侧边栏滚到底，但左侧内容还有，需要继续往下滚动时，右侧侧边栏固定显示最后面一段内容。
#### window.addEventListener('scroll')监听滚动
设置window的滚动事件scroll，当发生滚动时实时监听并设置侧边栏样式。
#### 滚动距离+视口高度 与 侧边栏实际高度 比较
当 滚动距离+视口高度 大于 侧边栏实际高度，启动bottom为0的 position：fixed；
反之，一切正常 position设置为static。
```js
var sideHeight = domSider.offsetHeight;
var screenHeight =document.documentElement.clientHeight||document.body.clientHeight;
var scrollHeight = document.documentElement.scrollTop||document.body.scrollTop;
//这种思想值得借鉴
if(scrollHeight+screenHeight>sideHeight){
	domSider.style.cssText = 'position:fixed;right:0px;bottom: 0px';
}else{
	domSider.style.position='static';
}
```
#### scrollTop的应用
参考上面《滚动距离+视口高度 与 侧边栏实际高度 比较》

### 网页定位导航特效

#### demo与介绍
[demo](https://github.com/YeWills/canvas-demo/blob/master/pages/multy/css-animation/location/location.html)

![](/image/js_demo/location.jpg)

#### html的锚点做业内跳转
如下，更多参考网上。
```
<a name="add"></a> 或者 <a id="add"></a> （ps：用id兼容性好些）
<a href="#add">跳转到add</a>
```
#### window.addEventListener('scroll')监听滚动
监听滚动距离，实时点亮上图右侧的菜单。

### CSS Sprite雪碧图应用
#### demo与介绍
[demo](https://github.com/YeWills/canvas-demo/blob/master/pages/multy/css-animation/priatice/priatice.html)
雪碧图用多个图标合成一个，可以用来减少http请求，优化性能，主要原理是对background-position的应用。
#### 减少http请求，优化性能
参考上面的讲解。
#### 核心是对background-position的应用
下面是background-position的坐标系：
```css
.regnow input{
				background: url(sp.png) no-repeat;
				background-position: 0 -38px;
				border: 0;
				padding: 0 0 3px 0;
			}
```
![](/image/js_demo/sprite.jpg)

