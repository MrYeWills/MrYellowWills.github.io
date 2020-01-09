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
```
1度=π ／180=Math.PI/180
``` 
### cos、sin与圆几何度经典应用
### transform-origin的细微处理
时针与刻度都用了transform-origin：left center；

### 更多讲解参考
[如何制作一个时钟](http://jiaolonghuang.github.io/2014/12/13/clock/)

