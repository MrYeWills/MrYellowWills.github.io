---
title: css之移动开发
date: {{ date }}
tags: [屏幕分辨率, 物理像素, css像素, ppi, dpr, 多倍图的响应式设计, 视口]
categories: 
- css
series: css
---


## 分辨率与像素
这是三星 GALAXY S5 手机
![](/image/css_mobile/mobile1.jpg)

### pixels单词含义
```
pixels //此单词含义为：像素
```
所以px，指得就是像素。

### 物理像素 与 分辨率
#### 物理像素
上图中1920X1080像素，其实就是1920pxX1080px；如下图：
![](/image/css_mobile/mobile2.jpg)
没错，这个像素就是(设备)物理像素(physical pixels)，它的单位也是px。(注意，这个px 非 css中使用的px，后面有讲解)。
上图表面，这个手机 横向的物理像素为 1080px; 竖向的物理像素为 1920px；
物理像素是一个虚拟的单位，与现实当中的厘米，毫米是两个东西，物理像素，能大能小，随不同设备变化。
(设备)物理像素，1px表示如下图的一个小方块：
![](/image/css_mobile/img.jpg)
上图中Device pixels说的就是物理像素 (物理像素英文名肯定是physical pixels，这毫无疑问，但对是否是Device pixels还存一些考证，下面章节做了一些补充《别名 -- Device pixels》)。

#### 分辨率
屏幕分辨率为：1920*1080px；屏幕分辨率其实就是横向和竖向物理像素的组合表达的。因此：
(屏幕)分辨率是由横向和竖向的物理像素值表示的一种屏幕参考。
#### 分辨率不等同于物理像素
由上分辨率的概念，屏幕分辨率不等同于物理像素。

### dpr 与 css像素
#### 定义
dpr (devicePixelRatio)，设备像素比。
我们在实际开发中，会发现GALAXY S5的屏幕是 360pxX640px：
![](/image/css_mobile/dpr.jpg)

GALAXY S5 的横向物理像素是1080px,为什么在上图中就变成360px了呢？
原来，手机厂商在手机出厂时，为每个手机提供了一个参数，这个参数就是dpr，通过window.devicePixelRatio获取。
根据MDN的解释：
```
dpr = 物理像素/css像素
```
[MDN的解释原文](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)：
```
The Window property devicePixelRatio returns the ratio of the resolution in physical pixels (物理像素) to the resolution in CSS pixels (css像素) for the current display device. 
```
因此，拿到一个手机的分辨率后，再通过window.devicePixelRatio 获取dpr后，就知道这个手机在前端开发时，它的css像素的 宽高。

#### dpr是联系分辨率与css像素的桥梁
由上可知，如何让分辨率为前端技术所用，就是通过手机厂商定义的dpr，把分辨率变成我们前端可以理解的css像素。

#### css像素
以上什么分辨率，物理像素，通通我们都不熟悉，都与前端开发无关，因为他们不是前端技术的度量范畴，此时说到css像素，是不是倍感亲切了，
它就是我们日常用的px，上面部分说的css像素就是这个东西。
例如：
```
//这个100px就是css像素
.wrap{
    width:100px;
}
```

#### dpr与css像素关系
在iPhone4之前，手机的dpr一般都是1，那时候手机的物理像素就是css像素。
随着iPhone4及以后高清屏的出现，dpr开始大于1，目前dpr场景值为 1、1.5、2、3。

#### iPhone4是Retina屏
从iPhone4开始，及以后的iPhone都是Retina屏。[参考](https://baike.baidu.com/item/Retina/4616695?fr=aladdin)

### 放大2倍还是4倍？
下图 左侧是dpr=1，右侧dpr=2；
这里的放大几倍基于物理像素(英文可以是physical pixels 或 Device pixels )而言，
一个css像素为2X2px的元素。
dpr=1下，物理像素是 2X2px；
dpr=2下，物理像素是 4X4px；
![](/image/css_mobile/img.jpg)
dpr=2下，原来的1小方块变成4个方块表示，好像是放大了四倍，其实不然，
1个方块可以写成：1X1px;
4个方块可以写成：2X2px；
```
//其实就是放大2倍
(2*2px)/(1*1px) === 2

//其实还是放大2倍
(4*4px)/(2*2px) === 2
```

所以dpr=2时相比dpr=1时，只是放大了两倍。
下面讲到的响应式设计时，用到媒体查询，需要UI根据dpr设计不同倍率的图片，需要多少倍的图片，由上面就知道了。


### 多倍图响应式设计
当dpr大于1是，容易出现图片模糊的问题，以iPhone6为例:
iPnone6参数：
![](/image/css_mobile/flex.jpg)
iPnone6 的 dpr为2，对应的屏幕的css像素尺寸为：375X667px；
由图片可知，i6的横向物理像素为750px，此时，如果在html页面定义展示一个img{width:375px}的图片，
i6在展示时因为会将此图片拉伸两倍，导致图片失真。解决的方法是，让UI设计一个750px的图片，避免失真，
这里解释失真可能有些牵强，姑且这样理解吧，也或者简单理解成，凡是dpr大于1的手机，**只要提供与手机物理像素不一致的图片,显示时都会失真；**
不用太穷究为什么要失真，知道这样会失真就行。如果对失真有兴趣，去网上搜索，很多资源。

高清时，一般也就图片这种失真的情况，其他还好，为了解决这个图片失真，一般采用媒体查询方式。

#### 如何才图片不失真
由上面推测可知，**只有UI给的图片与手机的物理像素相等时才不失真**，
比如，我在html上定义了一个100px css像素的图片；
手机的dpr为2；
此时这个100px css像素，对应的是 100*2=200px 的物理像素尺寸。
此时只有UI提供200px的图片放在上面的HTMl上才不失真。

#### 媒体查询
解决方法如下，详细的可网上搜索：
主要思路，就是让UI提供几种不同尺寸的图片，通过媒体查询方式灵活使用。[参考](https://www.cnblogs.com/sese/p/5977486.html)
```
.css{/* 普通显示屏(设备像素比例小于等于1.3)使用1倍的图 */ 
    background-image: url(img_1x.png);
}
@media only screen and (-webkit-min-device-pixel-ratio:1.5){
.css{/* 高清显示屏(设备像素比例大于等于1.5)使用2倍图  */
    background-image: url(img_2x.png);
  }
}
```
当然，解决失真的方式还有js或svg矢量图的方式。

### ppi
ppi:屏幕像素密度,这个概念其实与前端开发无关，可以不用过多了解。
只是最上面的图片中提到了GALAXY S5 的像素密度，具体公式如下，[详细了解点击这里](https://www.jianshu.com/p/c3387bcc4f6e)：
![](/image/css_mobile/ppi.jpg)

### 别名
#### 注意
下面列举了如 设备独立像素、什么其他像素...这些统统不要管，与前端开发无关，与前端开发有关的东西，上面已经单独列出讲解。
在这里写一些别名，只是为了在阅读别人的文文章时，他们写出这些名词你知道是什么，避免看不懂其他人的文章。
#### 设备独立像素
有很多地方将 dpr = 物理像素 /设备独立像素;
显然这里 将设备独立像素看成是css像素了。我这里不说对不对，这里只是让大家知道**设备独立像素 把它简单认为是 css像素就好，不必深究。**关于dpr的定义还是以MDN网址定义为准，请看上文《dpr 与 css像素》
[参见](https://www.jianshu.com/p/3d28f4959c5a?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation)

我们再看 它的定义：
[设备独立像素（Device Independent Pixel）：与设备无关的逻辑像素，代表可以通过程序控制使用的虚拟像素，是一个总体概念，包括了CSS像素](https://www.cnblogs.com/jiangzilong/p/6700023.html)

#### 设备无关的像素
参考《设备独立像素》。
设备无关的像素 其实就是 设备独立像素 的说法，下面公式是相等的：
```
CSS像素 =设备独立像素 = 设备无关的像素
```
####  逻辑像素
[这篇文章提到:](https://www.jianshu.com/p/3d28f4959c5a?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation)
```
CSS像素 =设备独立像素 = 逻辑像素
```

#### 虚拟像素
其实 物理像素、css像素、这些都是虚拟像素。(个人认为，未佐证)

#### Device pixels
Device pixels应该就是物理像素的英文名称，[根据外文W3c -- CSS Units 中关于 px的解释](https://www.w3schools.com/cssref/css_units.asp)，原文如下：
```
* Pixels (px) 【css像素】 are relative to the viewing device. For low-dpi devices, 1px is one device pixel (dot) of the display. For printers and high resolution screens 1px implies multiple device pixels【多倍的设备像素】.
```
结合上面的分析，我们知道，屏幕中一般只有一种设备像素，那就是物理像素，因此物理像素的另外英文名称为 device pixels.


### 物理像素的px与css像素px区别
虽然通过上面的分析，我们知道物理像素与css像素，有本质上的不同。
不过通过分析多倍dpr图片失真问题，解决失真，就要放与物理像素相同的px图片时才不失真。我们知否可大胆推测物理像素的px可能与css像素的px是一回事。
以上仅代表个人揣测。
然而物理像素确实又与css像素有本质区别。


## 视口
视口部分，参考《精通css》这边书，若有问题，查询这边书的第八章。

### 理想视口
理想视口就是每个手机的屏幕css像素尺寸，例如GALAXY S5屏幕360pxX640px，它的理想视口就是360pxX640px 的css像素尺寸。 见《dpr 与 css像素》。

### 默认视口
手机设备都有一个默认视口，且不同类型的手机设备，其默认视口都是一样的尺寸，不同类型手机设备的默认视口，宽约为1000px css像素。
每想到吧，默认视口居然还有一个统一的宽度：约为1000px css像素，而且不同类型的手机宽度一样。

### 显示
#### 理想视口显示
使用 理想视口显示，设置meta如下：
```
<meta name="viewport" content="width=device-width, initial-scale=1">
```

#### 默认视口显示
如果不设置meta，那么手机将采用默认视口显示，将html写的页面按照屏幕宽大约1000px排列布局好，然后把它缩小显示到手机中：
```
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>vs_test</title>
    <style>
        .wrap {
            background: rebeccapurple;
            word-break: break-word;
            font-size: 16px;
        }
        .cell{
            display: inline-block;
            height: 50px;
            width: 100px;
            font-size: 40px;
        }
        .cell:nth-child(even){
            background: #FF9800
        }
        .cell:nth-child(odd){
            background: #00BCD4
        }
    </style>
</head>
<body>
<div class="wrap">
    <div class="cell">1</div>
    <div class="cell">2</div>
    <div class="cell">3</div>
    <div class="cell">4</div>
    <div class="cell">5</div>
    <div class="cell">6</div>
    <div class="cell">7</div>
    <div class="cell">8</div>
    <div class="cell">9</div>
    <div class="cell">0</div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>
    <div class="cell"></div>
</div>
</body>
</html>
```
 GALAXY S5手机端显示如下：
![](/image/css_mobile/view-port.jpg)

#### 默认视口 与 qq截图工具量元素尺寸
如上图所示， 采用默认视口显示，会将原来在大约1000px显示好的页面，缩小到GALAXY S5手机宽360px的屏幕显示，
这样调试的时候，我们就无法使用qq或微信的截图工具里面显示的尺寸，来量元素的尺寸。
以此举一反三，只有移动端采用理想视口的情况时，才可以使用qq截图工具量元素尺寸。
不过，pc浏览器屏幕不存在此情况，pc浏览器任何情况下可以采用qq截图工具量尺寸。

### 不要禁用缩放
很多人喜欢用下面的方式来定义meta，下面配置了user-scalable=no，禁用了缩放，这样是不推荐的。
```
//不推荐这种写法，因为禁用了缩放
<meta 
    name="viewport" 
    content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
 />
```
推荐写法：
```
//推荐写法：
<meta name="viewport" content="width=device-width, initial-scale=1">
```
上面写initial-scale=1完全是为了兼容，如果不考虑兼容，直接这样写就行，因为initial-scale=1表达的意思和width=device-width一样：
```
//推荐写法也可以这样写
<meta name="viewport" content="width=device-width">
```

参考：
[精通css 高级web标准解决方案](http://www.ituring.com.cn/book/1910)
[MDN --devicePixelRatio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)
[外文W3c --CSS Units](https://www.w3schools.com/cssref/css_units.asp)
[高清屏及适配不同设备的方案总结](https://www.cnblogs.com/sese/p/5977486.html)
[（全解析）屏幕尺寸，分辨率，像素，PPI之间到底什么关系？](https://www.jianshu.com/p/c3387bcc4f6e)
[一篇文章搞懂CSS像素、物理像素、逻辑像素、设备像素比、PPI、Viewport](https://www.jianshu.com/p/3d28f4959c5a?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation)
[CSS像素、设备独立像素、设备像素之间关系](https://www.cnblogs.com/jiangzilong/p/6700023.html)



