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


