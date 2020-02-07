---
title: canvas demo
date: {{ date }}
tags: [canvas]
categories: 
- 图形化
---

## 写一个字
### demo 地址
[demo地址]()
### 根据速度设置线条粗细
#### 代码

```js
var lastLineWidth = -1;
var maxLineWidth = 30;
var minLineWidth = 1;
var maxStrokeV = 10;
var minStrokeV = 0.1;
function calcLineWidth( time , distance ){
   //v 速度 （注意，不是加速度）
    var v = distance / time;
    var resultLineWidth;
    if( v <= minStrokeV )
        resultLineWidth = maxLineWidth;
    else if ( v >= maxStrokeV )
        resultLineWidth = minLineWidth;
    else{
        resultLineWidth = maxLineWidth -
        (v-minStrokeV)/(maxStrokeV-minStrokeV)*(maxLineWidth-minLineWidth);
    }

//lastLineWidth == -1 说明是刚开始画图，此时lastLineWidth不存在，直接取resultLineWidth
    if( lastLineWidth == -1 )
        return resultLineWidth;

//有人说直接 return resultLineWidth，这样的缺点是，线条过渡不平滑；
//为了让线条平滑过渡，使用原来的宽度2/3，加上新的宽度1/3
    return resultLineWidth*1/3 + lastLineWidth*2/3;
}
```
#### 刚开始画图宽度取值
参见上面代码的`lastLineWidth == -1`情况。

#### 2/3与1/3的平滑过渡技巧
参考上面代码，其实也不一定要设置成1/3 2/3，也可以是其他值，可以自己试验，只要壁画看起来平滑过渡即可。

### 笔画的主体方法
#### 从onmousedown开始
```js
function beginStroke(point){

    isMouseDown = true
    //设置按下鼠标时的鼠标坐标 与 此时的时间戳
    lastLoc = windowToCanvas(point.x, point.y)
    lastTimestamp = new Date().getTime();
}
```
#### 只在isMouseDown true时才画图
onmousedown时设置isMouseDown为true，在鼠标松开(onmouseup)、鼠标离开dom时(onmouseout)设置isMouseDown为false，
onmousemove时不设置 值，此事件只负责画图。

#### 在onmousemove事件中画图
所以的绘制方法都在此事件中写：
```js
canvas.onmousemove = function(e){
    e.preventDefault()
    if( isMouseDown ){
        moveStroke({x: e.clientX , y: e.clientY})
    }
};

function moveStroke(point){
//获取当前坐标
    var curLoc = windowToCanvas( point.x , point.y );
    var curTimestamp = new Date().getTime();
    var s = calcDistance( curLoc , lastLoc )
    var t = curTimestamp - lastTimestamp

    var lineWidth = calcLineWidth( t , s );

    //draw
    context.beginPath();
    context.moveTo( lastLoc.x , lastLoc.y );
    context.lineTo( curLoc.x , curLoc.y );

    context.strokeStyle = strokeColor
    context.lineWidth = lineWidth
    // lineCap lineJoin 让线条更加平滑
    context.lineCap = "round"
    context.lineJoin = "round"
    context.stroke()

    //重置上一次的状态
    lastLoc = curLoc
    lastTimestamp = curTimestamp
    lastLineWidth = lineWidth
}
```
#### onmousedown、onmousemove之间计算距离
如上面《画图方法》代码，笔画的移动就是通过计算二者之间的位置算出来的距离。
#### onmousemove、onmousemove 之间计算距离
如上面《画图方法》代码中的下面内容说明了这一点：
```js
//重置上一次的状态
    lastLoc = curLoc
    lastTimestamp = curTimestamp
    lastLineWidth = lineWidth
```
### lineCap lineJoin 让线条更加平滑
在没有加下面时，效果图如下：
```js
 context.lineCap = "round"
 context.lineJoin = "round"
```
![](/image/canvas/canvas_demo/font.jpg)
为什么会这样？我们画的线其实是有很多段矩形拼接而成，如此啊，在拼接处就会有缝隙，此时可以使用线段的帽子lineCap，再加一个lineJoin，双保险，平滑过渡：
![](/image/canvas/canvas_demo/line.jpg)

## 图像处理-缩放图片
### 放大或缩小的显示
放大的时候，我们希望图像显示的中心点与原来图片中心点是重合的，为了保证中心点不动，就必须找准截取图片的坐标点，计算方法如下：
![](/image/canvas/canvas_demo/scale.jpg)
#### 思路一(常规思路：误区)
常规的思想是从原来图片选择一个点，然后截取一个区域，放到画布上，进行显示，如下，下面的计算方式无法达到自动缩放要求。
这种思路也可以达到缩放，但是需要大量的计算，非常麻烦。
```
var imageWidth = 1152 * scale
var imageHeight = 768 * scale
var sx = imageWidth / 2 - canvas.width / 2
var sy = imageHeight / 2 - canvas.height / 2
context.drawImage( image , sx , sy , canvas.width , canvas.height 
    , 0 , 0 , canvas.width , canvas.height )
```
#### 思路二(推荐)
参考《经典的缩放处理方案》

### 经典的缩放处理算法
#### 概述
缩放时必须保证 中心点不动。
放大的时候，x为负数，达到放大效果，缩小时，x为正值，达到缩小效果，完美兼容放大和缩小两种情况。
```
var imageWidth = 1152 * scale
var imageHeight = 768 * scale

x = canvas.width /2 - imageWidth / 2 
y = canvas.height / 2 - imageHeight / 2

context.clearRect( 0 , 0 , canvas.width , canvas.height )
context.drawImage( image , x , y , imageWidth , imageHeight )
```
#### 保证中心点不动
参考上面
#### 选取坐标点技巧
参考上面
#### 放大或缩放处理图片
参考上面，为了缩放显示图片，在drawImage的最后两个参数时，都进行放大或缩放处理。

### onmousemove 代替 onchange
为了达到鼠标移动时就触发绘图，需要使用onmousemove，因为onchange只有在停止滑动时才触发事件。
```
//  slider.onchange = function(){
//      scale = slider.value
//      drawImage( image , scale )
//  }

slider.onmousemove = function(){
    scale = slider.value
    drawImageByScale( scale )
}
```
## 离屏canvas技术
### 水印demo
#### 介绍
定义一个水印的canvas，display 设置为不可见，让后将此canvas作为 drawImage 的第一个参数，绘制到画布当中。
因为水印的canvas本身不被显示，而只将其投影显示到画布当中，因此称之为离屏canvas。
![](/image/canvas/canvas_demo/go_canvas.jpg)

```html
<!-- 原来的canvas将会被cody到上一个图片画布中作为水印展示，不需要展示原来的canvas，因此隐藏原有的canvas -->
    <canvas id="watermark-canvas" style="display:none;margin:0 auto;border:1px solid #aaa;">
        您的浏览器尚不支持canvas
    </canvas>
```
```js
 //setup watermark canvas
    watermarkCanvas.width = 600
    watermarkCanvas.height = 100

    watermarkContext.font = "bold 50px Arial"
    watermarkContext.lineWidth = "1"
    watermarkContext.fillStyle = "rgba( 255 , 255 , 255 , 0.5 )"
    watermarkContext.textBaseline = "middle";
    watermarkContext.fillText( "== liuyubobobo.com ==" , 20 , 50 )
    
  function drawImage( image , scale ){

            imageWidth = 1152 * scale
            imageHeight = 768 * scale
            x = canvas.width /2 - imageWidth / 2
            y = canvas.height / 2 - imageHeight / 2

            context.clearRect( 0 , 0 , canvas.width , canvas.height )
            context.drawImage( image , x , y , imageWidth , imageHeight )
            context.drawImage( watermarkCanvas , canvas.width - watermarkCanvas.width ,
                                                  canvas.height - watermarkCanvas.height )
        }
```
#### 将canvas作为drawImage参数
利用了drawImage 可以将图片和canvas作为参数进行处理。

### 放大镜
#### 原理
只使用一张高清图片。
离屏canvas绘制原尺寸图片，并且display none。
原屏canvas绘制缩放后图片，
计算离屏与缩放后图片的 倍率，以此作为缩放参数。
原屏绘制好后就不动它了，
每次放大镜时，都使用clip剪切区显示离屏投射。
可以参考上面代码。
![](/image/canvas/canvas_demo/big.jpg)

#### 代码 和 demo地址
[demo地址](http://127.0.0.1:3000/canvas-image/04-image-magnifier/index.html)
```html
  <canvas id="canvas" style="display:block;margin:0 auto;border:1px solid #aaa;">
        您的浏览器尚不支持canvas
    </canvas>

    <canvas id="offCanvas" style="display: none">
```
```js
  var canvas = document.getElementById("canvas")
        var context = canvas.getContext("2d")

        var offCanvas = document.getElementById("offCanvas")
        var offContext = offCanvas.getContext("2d")

        var image = new Image()
        var isMouseDown = false
        var scale

        window.onload = function(){

            canvas.width = 1152
            canvas.height = 768

            image.src = "img-lg.jpg"
            image.onload = function(){

                offCanvas.width = image.width
                offCanvas.height = image.height
                scale = offCanvas.width / canvas.width

                context.drawImage( image , 0 , 0 , canvas.width , canvas.height )
                offContext.drawImage( image , 0 , 0 )
            }
        }

     function drawMagnifier( point ){

           //设置放大镜圆半径
            var mr = 200

            var imageLG_cx = point.x * scale
            var imageLG_cy = point.y * scale

            var sx = imageLG_cx - mr
            var sy = imageLG_cy - mr

            var dx = point.x - mr
            var dy = point.y - mr

            context.save()

            context.lineWidth = 10.0
            context.strokeStyle = "#069"
            //使用剪切 clip 来做放大镜
            context.beginPath()
            context.arc( point.x , point.y , mr , 0 , Math.PI*2 , true )
            context.stroke()
            context.clip()
            context.drawImage( offCanvas , sx , sy , 2*mr , 2*mr , dx , dy , 2*mr , 2*mr )
            context.restore()
        }
```
#### 计算离屏信息
这里需要计算离屏canvas的这些信息（sx , sy , 2*mr , 2*mr），原理见下图：
```
context.drawImage( offCanvas , sx , sy , 2*mr , 2*mr , dx , dy , 2*mr , 2*mr )
```
![](/image/canvas/canvas_demo/go_canvas1.jpg)
#### 计算原屏信息
这里需要计算离屏canvas的这些信息（dx , dy , 2*mr , 2*mr），原理见下图：
```
context.drawImage( offCanvas , sx , sy , 2*mr , 2*mr , dx , dy , 2*mr , 2*mr )
```
![](/image/canvas/canvas_demo/go_canvas2.jpg)
#### 使用剪切 clip 来做放大镜
见上面代码。
#### 为什么clip不隐藏原屏图片
刚开始以为clip可能会隐藏原屏图片，结果没有，究其原因，估计是原屏图片是在clip之前就绘制好了，所以不受影响，后期绘制的离屏投射就受影响了


 