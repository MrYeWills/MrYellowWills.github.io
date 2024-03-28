---
title: canvas笔记
date: 2020/5/1
tags: [canvas]
categories: 
- 图形化
---

## 基础知识
### html5、canvas、svg、WebGL历史
#### 介绍
html5的草案大概是2008年开始制定，用来取代1999制定的html 4.1，经历了html5草案制定，到2014年最终标准发布。
canvas [由苹果公司在 2004 年前后发明运用于Safari，后来其他的浏览器开始跟进](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Client-side_web_APIs/Drawing_graphics)，后来canvas被收入到html5草案中，之后大家对canvas关注越来越多(canvas被大家越来越多的关注，我推测应该在2008左右)，一直到2014年随着html5，作为标准发布。
[SVG 是由万维网联盟（W3C）自 1999 年开始开发的开放标准](https://developer.mozilla.org/zh-CN/docs/Web/SVG)，与canvas使用js绘图不同，svg使用xml来画图。
#### canvas是html5
canvas是html5.0的标准，在此前的标准(W3C标准,html4.1)中从未有过canvas，在html5.0标准于2014年被公布以前，canvas一直存在于html5.0的草案当中。
#### svg不是html5新创的标签
svg不是html5才出现的新标签，它在1999年就被开始制定，彼时还没有所谓的html5，但这不妨碍svg与html5的联系，因为在html5.0中，svg被丰富了更多的功能。
所以在html5之前与之后的svg，其功能还是有区别的。
#### canvas与svg的发展和区别
svg不是什么新的技术了，于1999年被创造后，一直到现在，svg并没有太多的突破发展。
相比而言，canvas是比较新的技术，于2008年(年份基于上面的推测)被大家关注以来，到现在，先后被用于2D，3D的位图绘制。
##### 从发展速度而言：
从这一点来看，canvas要比svg发展更快。
##### 从运用的角度来讲：
svg用于矢量图绘制，canvas用于位图绘制，所以二者不是纯粹的替代竞争关系；
- 只要你对矢量图有需求，svg永远不会被消失；
- 只要你对位图有需求，canvas永远不会被消失；
- 只要你对图有需求，svg和canvas都是你的选择；
##### 就兼容性而言：
svg、canvas 所有的浏览器都兼容，不同的是，svg因为很早就出现了，就算是低版本的浏览器也都兼容；
而canvas相对而言比较新，一些低版本的浏览器不支持，好消息是，都9102了，市面上的浏览器的版本基本都支持canvas，不用太担心兼容问题。
#### WebGL与canvas的关系
WebGL是基于canvas元素绘制3D图的js API。

### canvas基于状态绘图的特性
#### 介绍
先设置好路径作为绘图状态，再使用绘制的api绘图，例如：
```
//设置状态
context.moveTo(100,100)
context.lineTo(700,700)
context.lineWidth = 10
context.strokeStyle = “#058”

//绘图
context.stroke()
```
#### 使用beginPath来分别设置状态
如上面代码，canvas不针对某一个形状进行状态设置，因此设置的状态都是针对全局的，假如我们要对画布内几个图形分别设置状态如颜色，
此时需配合beginPath使用：
```
context.beginPath()
context.moveTo(100,100)
context.lineTo(700,700)
context.lineWidth = 10
context.strokeStyle = “#058”

context.beginPath()
context.moveTo(1100,1100)
context.lineTo(1700,1700)
context.lineWidth = 15
context.strokeStyle = “red”

//绘图
context.stroke()
```

### moveTo 与 lineTo
#### beginPath与lineTo一起，lineTo相当于 moveTo
```
context.beginPath()
context.moveTo(100,100)
context.lineTo(700,700)
```
等同于，因为beginPath相当于从新开始：
```
context.beginPath()
context.lineTo(100,100)
context.lineTo(700,700)
```
### 先填充后描边：先fill后stroke
如果你要对一个矩形填充，并且绘制样式多样的边线，那么请先fill，后stroke，反之 填充的效果就覆盖了线条的效果。

### 接口汇集
#### 矩形
```
rect( x , y , width , height )
fillRect( x , y , width , height )
strokeRect( x , y , width , height )
```

#### 填充与绘制
```
stroke()
fill()
```

### beginPath、 closePath
#### 介绍
画一个形状时，需要cxt.beginPath()，但closePath不是必须，可以不使用，下次再使用cxt.beginPath()时，会默认自动closePath上一个路径。
```
cxt.beginPath();
cxt.arc( x+j*2*(RADIUS+1)+(RADIUS+1) , y+i*2*(RADIUS+1)+(RADIUS+1) , RADIUS , 0 , 2*Math.PI )
cxt.closePath()
cxt.fill()
```
#### closePath不是必须
参考上面分析

#### 第一个beginPath可以省略
```
context.beginPath()//可省略
context.moveTo(100,100)
context.lineTo(700,700)

context.beginPath()
context.moveTo(1100,1100)
context.lineTo(1700,1700)
```
#### 封闭图形推荐使用closePath
封闭图形使用closePath的好处在于，自动封闭严密，一些封闭不齐，有凹角等等问题，都会被自动解决。

#### 使用beginPath来分别设置状态
参考《canvas基于状态绘图的特性 -- 使用beginPath来分别设置状态》


### 生成(2d)画布上下文的要素
注意的是canvas.width，不要使用css的方式嵌入，具体原因待写，最好直接以style属性或js直接写入。
```
var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");
canvas.width = WINDOW_WIDTH;
canvas.height = WINDOW_HEIGHT;
```

### 线条属性
#### lineCap 线条的帽子
线条两端的倒角设置。
#### lineJoin 折线的帽子
设置折线两条线相交处的倒角。
#### miterLimit 折线交点距离
miterLimit 是折线中心线交点与折线外边线交点距离
此属于通常与lineJoin一起使用，用来设置折线的尖角的尖锐度,下面是原理图：
{% img url_for /image/canvas/miter.jpg %}

### 画五角星
{% img url_for /image/canvas/five_star.jpg %}
```js
  var canvas = document.getElementById('canvas');
            canvas.width = 800;
            canvas.height = 800;
            var context = canvas.getContext('2d');

            context.lineWidth = 10;
            drawStar(context, 150, 300, 400, 400)
            //rotate旋转角度
            //r,R,x,y 小圆，大圆，x方向偏移量，y方向偏移量
        function drawStar(cxt,r,R,x,y,rotate=0){
            cxt.beginPath();
            for(var i = 0;i<5;i++){
                cxt.lineTo(Math.cos((18 + i*72 - rotate)/180 * Math.PI) * R + x,
                -Math.sin((18 + i*72 - rotate)/180 * Math.PI) * R + y);
                cxt.lineTo(Math.cos((54 + i*72 - rotate)/180 * Math.PI) * r + x,
                -Math.sin((54 + i*72 - rotate)/180 * Math.PI) * r + y);
            }
            context.closePath();
            context.stroke();
        }
```
### 阴影的理解
阴影是围绕图形的一层阴影图形，这个阴影图形是固定的，当你对这个阴影图形进行向右偏移时，**阴影图形大小不变，图形将整体平移**，这样阴影图形的左侧就会被原图形给**遮挡**，导致看起来只看到图形只有右侧才有阴影。
#### shadowOffsetX
下面两张图片分别展示了 阴影图形平移原理，具体是 阴影图形不变，整体偏移被遮挡。
{% img url_for /image/canvas/shadow1.jpg %}
{% img url_for /image/canvas/shadow2.jpg %}
#### shadowBlur 模糊程度
一般的人说这个是模糊程度，我觉得这个说法不太准确，shadowBlur是扩散并模糊才对，因为shadowBlur会导致阴影扩散的长度，比如定义为10的时候，阴影将扩散长度10px，然后针对这10px进行模糊，会导致阴影的。
此时，如果定义 shadowBlur 为30，然后偏移量 shadowOffsetX为10，会出现图形四周都有阴影，但左侧阴影长度为20，右侧为40，上下为30.
{% img url_for /image/canvas/shadowblur.jpg %}

### globalAlpha 透明度
设置canvas的透明度

### 图形叠加的遮盖设置
可以通过globleCompositeOperation 设置图形叠加时，如何遮盖的问题：
{% img url_for /image/canvas/shadowblur.jpg %}

### 剪辑区域 clip
与路径规划函数(如arc)等等共同使用，clip先使用，使canvas绘制区域只显示在clip的路径内，其他区域只显示整个context.fillStyle。
{% img url_for /image/canvas/clip.jpg %}
```
 context.beginPath();
context.fillStyle='yellow'
context.fillRect(0,0,w,h);
context.beginPath(); 
//指定clip路径    
context.arc(ball.x,ball.y,ball.r,0,2*Math.PI);
context.fillStyle='blue';
context.fill();
context.clip();
context.beginPath();
context.font='bold 120px Arial';
context.textAlign='center';
context.fillStyle='#ff55cc';
context.fillText('天若有情',w/2,h/1.6);
```
#### 探照灯动画 demo
代码如下，新颖的思想是：
- 每一次轮询，创建一个方法 update 来更新路径，然后创建一个方法使用新的路径进行绘制。
- 先绘制，紧接着更新路径，然后轮询这个动作。
- 这个例子再一次印证了canvas的 规划路径 和 绘制是分开的。
[demo地址](/Users/js/Desktop/work/git/canvas-demo/pages/canvas-master/绘图/探照灯.html)
```js
 var c = $('#canvas')[0];
    var context=c.getContext('2d');//用context进行绘制
    var w =canvas.width;
    var h =canvas.height
    var ball={
      x:w/2,
      y:h/2,
      r:100,
      vx:20,
      vy:15
    }
    setInterval(function(){
      draw();
      update();
    },50);
    
    function draw(){
      context.clearRect(0,0,w,h);
      context.save(); //////////
      context.beginPath();
      context.fillStyle='black'
      context.fillRect(0,0,w,h);
      context.beginPath();     
      context.arc(ball.x,ball.y,ball.r,0,2*Math.PI);
       context.fillStyle='white';
       context.fill();
       context.clip();
       context.beginPath();
       context.font='bold 120px Arial';
       context.textAlign='center';
       context.fillStyle='#ff55cc';
       context.fillText('天若有情',w/2,h/3);
       context.fillText('沧海桑田',w/2,h/4*3);
       context.restore();
    }
    
    function update(){
      ball.x+=ball.vx;
      ball.y+=ball.vy;
      if(ball.x<=ball.r){
        ball.x=ball.r;
        ball.vx=-ball.vx;
      }
      if(ball.x>=w-ball.r){
        ball.x=w-ball.r;
         ball.vx=-ball.vx;
      }
      if(ball.y<=ball.r){
        ball.y=ball.r;
         ball.vy=-ball.vy;
      }
      if(ball.y>=h-ball.r){
        ball.y=h-ball.r;
         ball.vy=-ball.vy;
      }
    }

```

### clearRect
常用于动画，当重新绘制图形时，使用此API清空画布。
```
context.clearRect(x,y width, height);
```
### isPointInPath
是否处于图形之内，[查看demo](/Users/js/Desktop/work/git/canvas-demo/pages/canvas-master/绘图/交互.html)
```
context.isPointInPath( x , y )
```
### 获取canvas坐标
```js
const canvas = document.getElementById('canvas');
  canvas.mousemove(function(e){
      //canvas画布内的x坐标 = 相对于整个视口x轴的值-画布离视口左侧的距离
      var x1= e.clientX-canvas.getBoundingClientRect().left;
      var y1= e.clientY-canvas.getBoundingClientRect().top;     
    })
```
### 阴影 shadowColor相关
参考《对阴影的影响》

## 黑知识
### 非零环绕原则
非零环绕原则 用来确认某一区域处于图形外面或里面；
如下图，A C处于图形里面，B处于图形外面，判断原则为：
区域内向外画一条线，这条线穿过N条线，指定一种方向为-1，相反方向为1，N条线加起来的值，
若为0，说明该区域处于图形外部；
若为非0，说明处于内部。
{% img url_for /image/canvas/zero.jpg %}

### 圆圈内外圆顺\逆时针影响到的
#### 内外两个圆不指定方向
如下，不指定方向的时候，画出来的图是一个大的实心圆，并非希望的镂空圆圈。
```
   var c = $('#canvas')[0];
    var context=c.getContext('2d');
    context.arc(400,250,100,0,2*Math.PI);//不指定方向
    context.arc(400,250,50,0,2*Math.PI);//不指定方向
    context.fillStyle='blue';
    context.fill();
```
#### 内外圆指定不同方向
```
 var c = $('#canvas')[0];
    var context=c.getContext('2d');
    context.arc(400,250,100,0,2*Math.PI, false);//顺时针
    context.arc(400,250,50,0,2*Math.PI, true);//逆时针
    context.fillStyle='blue';
    context.fill();
```
效果如下：
{% img url_for /image/canvas/ring.jpg %}
#### 非零环绕原则
当指定不同方向时，利用非零环绕原则，内圆的区域相对于整个图形而言处于图形之外，此时fill方法不会填充此区域，产生镂空效果。
#### 对阴影的影响
代码和效果如下，正常的情况，阴影默认都应该位于图形外侧，如B的位置，
因此如果给内圆定义阴影的画，阴影应该位于A的位置，但实际情况却位于图中所示但C位置。
初一看觉得不合理，但是我们用非零环绕原则时，发现内圆的确处于图形外侧，因此阴影处于C的位置是对的。

```js
  var c = $('#canvas')[0];
    var context=c.getContext('2d');
    context.arc(400,250,100,0,2*Math.PI, true);
    context.arc(400,250,50,0,2*Math.PI, false);
    
    context.fillStyle='rebeccapurple';
    context.shadowColor = 'blue';
    context.shadowOffsetX = 10;
    context.shadowOffsetY = 10;
    context.shadowBlur = 10;
    context.fill();
```
{% img url_for /image/canvas/ring2.jpg %}

### CanvasRenderingContext2D
#### 介绍
对canvas扩展使用 CanvasRenderingContext2D 进行扩展。可以扩展新API，可扩展现在API(谨慎),可扩展一个对象，存放数据。
```js
 var c = $('#canvas')[0];
    var context=c.getContext('2d');//用context进行绘制
    //扩展对象
    CanvasRenderingContext2D.prototype.lastMoveToLoc = {};
    //扩展现有方法
    var originMoveto = CanvasRenderingContext2D.prototype.moveTo;
    CanvasRenderingContext2D.prototype.moveTo = function(x,y){
      originMoveto.apply(context, [x, y]);
      this.lastMoveToLoc.x = x;
      this.lastMoveToLoc.y = y;
    }
   //扩展新方法
    CanvasRenderingContext2D.prototype.drawStar = function(r,R,rot){
      this.beginPath();
      var x = this.lastMoveToLoc.x;
      var y = this.lastMoveToLoc.y;
      var rot1 = rot || 0;
      for(var i =0;i<=5;i++){
        this.lineTo(Math.cos((18+i*72-rot1)/180*Math.PI)*R+x,
        -Math.sin((18+i*72-rot1)/180*Math.PI)*R+y)
        this.lineTo(Math.cos((54+i*72-rot1)/180*Math.PI)*r+x,
        -Math.sin((54+i*72-rot1)/180*Math.PI)*r+y)
      }
      this.closePath();
      this.fill();
    }
    context.fillStyle = 'blue';
    context.moveTo(400, 400);
    context.drawStar(150,300,30);
```
#### 扩展方法
参考上面
#### 扩展对象
参考上面

## 图形变换
### 图形变换的API
- 位移 translate( x , y )
- 旋转 rotate( deg )
- 缩放 scale( sx , sy )

### 变换矩阵
{% img url_for /image/canvas/transform_matrix.jpg %}

### transform 与 变换重置
当对context多次transform后，想丢弃、重置之前所有的transform的影响，可使用setTransform。
transform( a , b , c , d , e , f )
setTransform( a , b , c , d , e , f ) 

### 状态的保存和恢复(save\restore)
画两个矩形，第一个矩形向左偏移100，第二个矩形向左偏移200，
由于偏移都是对整个上下文执行的，为了免除第一次偏移的影响，在第一次偏移之前，执行save，保存当时的状态；
在给第二个矩形偏移之前，执行restore，将状态恢复到save时的状态。

### scale的副作用
scale会对坐标点的 xy值、图形宽度、线条宽度都产生放大缩小效果。这是scale的特点，但也是副作用，用的时候需注意。
### fillStyle
#### color
```
context.fillStyle='red';
```
#### 线性渐变color
线性渐变颜色创建context.createLinearGradient。
```
 //起始点坐标100 100， 终点 100 300；
    var linear = context.createLinearGradient(100,100,100,300);
    //addColorStop 第一参数是浮点数，取值范围为0-1，0表示起点，1表示终点
    linear.addColorStop(0.0,'green');
    linear.addColorStop(0.5,'yellow');
    linear.addColorStop(1.0,'blue');
    context.fillStyle=linear;
    context.fillRect(100,100,300,200);
```
#### 径向渐变color
用法与线性渐变一致，可网上查阅，这里不列出。
#### 图片填充
使用API createPattern 创建填充图片
```js
    var bi=new Image();
    bi.src='autumn.jpg';
    var pattern = context.createPattern(bi,'repeat');
    context.beginPath();
    context.fillStyle=pattern;
    context.fillRect(100,100,400,300);
```

### createLinearGradient 线性渐变填充色
此api用于创建线性渐变颜色，详细参考《线性渐变color》
### createPattern 图片填充
此API创建填充图片
```js
//接受图片
  context.createPattern(img,'repeat')
//接受canvas画布
  context.createPattern(canvas,'repeat')
```
### 文字渲染API
```
context.font = "bold 40px Arial"
context.fillText( string , x , y , [maxlen] );
context.strokeText( string , x , y  , [maxlen] );

```
### 一些几何思路
#### 带倒角的矩形
{% img url_for /image/canvas/rect.jpg %}
#### 圆的pi概念
{% img url_for /image/canvas/arc.jpg %}
#### 月亮
{% img url_for /image/canvas/moon.jpg %}
你也可以使用两段闭合的圆弧线来构建一个圆，[参考demo]()

## 图像处理API
### drawImage 图像处理
#### image.onload时加载
```
image.src = "img.jpg"
image.onload = function(){
    context.drawImage( image , 0, 0)
}
context.drawImage( image , 300 , 100, 800, 300, 300, 300 ,200,200 )
```

另外 drawImage有三种赋值模式：
#### drawImage(image,0,0) --此模式不会缩放图片
在画布的坐标 0，0的位置上开始画图片，图片以原像素和比例展示。
#### drawImage(image,0,0,100,100)
在画布的坐标0，0上开始画图片，并且将整个图片放置于宽高都为100的区域内，图片会根据区域大小缩放。
#### drawImage(image,0,0,100,100,0,0,200,200)
参数含义依次为：图片，原图片信息(0,0,100,100)，目的图片信息(0,0,200,200);
基本含义为：截取原图片坐标点为0，0起点宽高各100的区域，绘制到画布的坐标点0，0为起点，宽高各200的区域上。
截图的图片会按照目的区域大小缩放
{% img url_for /image/canvas/drawImage.jpg %}

### getImageData 获取图片信息
#### 介绍
getImageData 接受四个参数，这四个参数构造了一个矩形区域，分别是坐标点，宽高。表示获取该区域内所以图片的信息。
```
const imageData = getImageData( x , y , width , height )
imageData对象：
width
height
data(图片像素等信息,以多维数组的方式展示)
```
下面是imageData.data的信息，更多信息参考《putImageData 插入图像》：
{% img url_for /image/canvas/put_data.jpg %}
#### 跨域问题
图片存储在本地时，是默认没有域名的，如果不启动服务直接打开html，用getImageData方法时，浏览器会判定为跨域而报错！解决方法是启动本地服务打开html。
```
"Uncaught DOMException: Failed to execute 'getImageData' on 'CanvasRenderingContext2D': The canvas has been tainted by cross-origin data.
at HTMLImageElement.document.getElementById.onload"
```

### putImageData 插入图像
其7个参数意思依次为：getImageData获取的图片imageData对象，坐标点x(也是相对于canvas的相对位移，故写成dx)，坐标点y，脏位移x(脏是因为通过putImageData获取的图片信息，不是纯正的原图片信息，是“被污染了的”数据)，脏位移y，脏图片宽度，脏图片高度。
{% img url_for /image/canvas/put.jpg %}

要与 getImageData 一起使用，[demo 地址](http://127.0.0.1:3000/canvas-image/05-image-copy/index.html)：
```js
 var canvasa = document.getElementById("canvasa")
        var contexta = canvasa.getContext("2d")

        var canvasb = document.getElementById("canvasb")
        var contextb = canvasb.getContext("2d")

        var image = new Image()

        window.onload = function(){

            image.src = "autumn.jpg"
            image.onload = function(){

                contexta.drawImage( image , 0 , 0 , canvasa.width , canvasa.height )
            }
        }

        function copyImage(){

            var imageData = contexta.getImageData( 0 , 0 , canvasa.width , canvasa.height )
            var pixelData = imageData.data
            //改变图片像素，让新copy出来的图片置灰
            // for( var i = 0 ; i < canvasb.width * canvasb.height ; i ++ ){
            //     var r = pixelData[i*4+0]
            //     var g = pixelData[i*4+1]
            //     var b = pixelData[i*4+2]
            //     var grey = r*0.3+g*0.59+b*0.11
            //     pixelData[i*4+0] = grey
            //     pixelData[i*4+1] = grey
            //     pixelData[i*4+2] = grey
            // }
            contextb.putImageData( imageData , 0 , 0 , 0 , 0 , canvasb.width , canvasb.height )
            context.putImageData()
        }
```

## 曲线绘制
### arc 绘制圆弧
注意，arc绘制的是一条弧线，并非闭合的不规则圆。
```
context.arc(
	centerx, centery, radius,
	startingAngle, endingAngle,
	anticlockwise = false
)
```
### arcTo(需与 moveTo 的一起使用)
```
context.moveTo( x0 , y0 )   开始点；
context.arcTo( 
	x1 , y1 ,               控制点；
	x2 , y2 ,               控制点；
	radius );               结束点；
```
{% img url_for /image/canvas/arcTo.jpg %}


### 贝塞尔曲线 Bezier
#### 介绍
贝塞尔曲线类似于ps画图软件中的钢笔工具画出的线，无论下面介绍的二次还是三次曲线，它们都需要结合moveTo绘制开始点。
#### 需要moveTo配合绘制开始点
参考上面
#### 二次贝塞尔曲线
二次贝塞尔曲线API是quadraticCurveTo，二次贝塞尔曲线与三次贝塞尔曲线的区别在于，二次不能画波浪线，三次可以：
{% img url_for /image/canvas/bezeirinfo.jpg %}
如下图所示，演示了开始点、控制点、结束点。
{% img url_for /image/canvas/bezeir.jpg %}

#### 三次贝塞尔曲线
三次贝塞尔曲线API是 bezierCurveTo 更多信息参考《二次贝塞尔曲线 Bezier》：
{% img url_for /image/canvas/bezeircurve.jpg %}

### 画线条只能用stroke
如题，线条使用fill将无法绘制。
```
context.beginPath();
context.moveTo(2,2)
context.lineTo(300,400)
context.lineWidth=5;
context.fillStyle='yellow';
context.stroke();
```



## 炫丽的倒计时效果demo
### 数据建模--多维数组矩阵创建数字模型
用一个只有0和1的数组，1表示有路径，0表示填充为空。
{% img url_for /image/canvas/digit.png %}
{% img url_for /image/canvas/cell.png %}

### 计算数字矩阵模型内的元素坐标
如上图所示，只要我们能知道矩阵左上角的坐标值xy，就可以计算出矩阵内所有的元素坐标值；
值得注意的是，上面的i和j分别是二维数组的i和j，它们对应的初始值都是0，具体公式，参考上图。

### 模拟抛物线路径
#### 实现代码
```js
 var aBall = {
        x:x+j*2*(RADIUS+1)+(RADIUS+1),
        y:y+i*2*(RADIUS+1)+(RADIUS+1),
        //g是重力加速度，只影响在垂直方向的速度，Math.random() 创造每个不同小球不同的重力加速度，产生不同的速度，让每个小球运动更加自然
        g:1.5+Math.random(),
        //vx小球在x 水平方向的速度，Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4 其实就是随机生成-4和4
        vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4,
        //vx小球在y 垂直方向的速度，让小球有一个向上抛的动作。
        vy:-5,
    }
```
```js
 for( var i = 0 ; i < balls.length ; i ++ ){

        //模拟抛物线路径
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;
    //0.75是空气阻力，当球面落到地面时，小球应该反弹原来高度的0.75
        if( balls[i].y >= WINDOW_HEIGHT-RADIUS ){
            balls[i].y = WINDOW_HEIGHT-RADIUS;
            balls[i].vy = - balls[i].vy*0.75;
        }
    }
```
#### x、y坐标值
参考上面代码
#### g 重力加速度
参考上面代码
#### vx 水平方向速度
参考上面代码
#### vy 垂直方向速度
参考上面代码
#### 空气阻力
参考上面代码

### 碰撞检测
```
//只取屏幕内的元素
    var cnt = 0
    for( var i = 0 ; i < balls.length ; i ++ ){
        //碰撞检测--满足下面情况说明在屏幕上
        if( balls[i].x + RADIUS > 0 && balls[i].x -RADIUS < WINDOW_WIDTH ){
            balls[cnt++] = balls[i]
        }
    }
//balls数组前面的元素，都是最先生成的，因此，也应该最先被删除
    while( balls.length > cnt ){
        balls.pop();
    }
```
### 溢出删除的优化处理
参考《碰撞检测》
### 用50毫秒轮询模拟1秒的动作
```js
 setInterval(
        function(){
            //渲染时间的显示
            renderTimes( context );
            //渲染小球的显示
            renderBall( context );
            //更新时间 和 小球数据，以备下次时间和小球渲染使用
            updateBallDatas();
        } , 50
    );
```
当时在想，既然做一个定时器，那么就写一个1秒的轮询，这样才有道理，其实不然，如果写一个1秒的轮询就会有延迟的现象；
如果你用一个50毫秒的轮询，如果秒钟没有到达下一秒，画面其实也不会跳转，因为50毫秒内拿到什么画面，就显示什么画面，在一秒内，有20个50毫秒，
这20个50毫秒内拿到的时间肯定都是一个值，那么渲染出来的值肯定也是一个值，就不会有跳转，也不会出现延时，就算出现延时也只是50毫秒内，可以接受。
所以，要想做一个响应快速的，应该将轮询值改得更小，而不是放大。
#### 误区一：以为1秒的定时器就应该使用1秒的轮询
参考上面讲解
#### 误区一：以为50秒的轮询会让定时器加速跳转
参考上面讲解
#### 一秒的定时器，必须使用小于一秒的轮询
参考上面讲解
#### 轮询时间越小，延时更小，响应更快
参考上面讲解
#### 轮询时间需要平衡js代码执行时间和性能
代码轮询时，执行了很多js，这些js如果非常大量，也是需要时间才能执行完，所以轮询时间要考虑是否大量执行js会延迟轮询时间，也要考虑性能。

### demo地址
[点击查看demo](https://github.com/YeWills/canvas-demo/blob/master/pages/index.html)



