---
title: canvas demo
date: {{ date }}
tags: [canvas]
categories: 
- 前端
---

## 写一个字
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
#### isMouseDown保存是否鼠标按下
画图基本上基于此标识；

#### onmousemove画图
```js
canvas.onmousemove = function(e){
    e.preventDefault()
    if( isMouseDown ){
        moveStroke({x: e.clientX , y: e.clientY})
    }
};
```
#### 画图方法
```js
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
#### onmousedown、onmousemove之间是可以计算距离的
如上面《画图方法》代码，笔画的移动就是通过计算二者之间的位置算出来的距离。
#### onmousemove、onmousemove 之间是可以计算距离的
如上面《画图方法》代码中的下面内容说明了这一点：
```js
//重置上一次的状态
    lastLoc = curLoc
    lastTimestamp = curTimestamp
    lastLineWidth = lineWidth
```
#### lineCap lineJoin 让线条更加平滑
```js
// todo 截图 ，看视频
```
#### onmouseup、onmouseout 设置 isMouseDown false
onmouseup、onmouseout 设置 isMouseDown false，此时不画图。



