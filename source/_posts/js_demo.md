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
#### demo地址
[demo](https://github.com/YeWills/canvas-demo/blob/master/pages/multy/css-animation/ImgPreloading/index2-3_ok.html)




