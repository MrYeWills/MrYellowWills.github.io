---
title: d3的三种模式 及 append、data、selectAll
date: 2020/5/1
tags: [d3.js]
categories: 
- 图形化
series: d3
---

这里讲解d3的 enter update exit三种模式，以及 append、data、selectAll。

## 基本代码
下面代码都基于以下代码：
```
 var svg = d3.select("body")
                 .append('svg')
                 .attr('width', 800)
                 .attr('height', 800);
```
以上是d3常用写法，下面示例皆以此为基础展开：

## append
### 单个使用
```
    var new_circle = svg.append('circle')
                .attr('cx', 250)
                .attr('cy', 50)
                .attr('r', 25)
                .attr('fill', 'blue')
```
效果：
{% img url_for /image/d3/circle1.jpg %}

### 多个使用
```
 svg.append('circle')
                .attr('cx', 250)
                .attr('cy', 50)
                .attr('r', 25)
                .attr('fill', 'blue')
    svg.append('circle')
                .attr('cx', 250)
                .attr('cy', 150)
                .attr('r', 25)
                .attr('fill', 'green')
    svg.append('circle')
                .attr('cx', 250)
                .attr('cy', 250)
                .attr('r', 25)
                .attr('fill', 'orange')
```
效果如下：
{% img url_for /image/d3/circle4.jpg %}

### 小结
由上可知append其实就是用来添加实际效果的。

## selectAll
### 在上面《append》的代码上增加：
```
    var new_circle = svg.selectAll('circle')
            .attr('cx', 250)
            .attr('cy', 100)
            .attr('fill', 'green')
            .attr('r', 25)
```
效果：
{% img url_for /image/d3/circle2.jpg %}

### 示例二
#### 在基本代码上增加如下代码
```
 svg.append('circle')
                .attr('cx', 250)
                .attr('cy', 50)
                .attr('r', 25)
                .attr('fill', 'blue')
    svg.append('circle')
                .attr('cx', 250)
                .attr('cy', 150)
                .attr('r', 25)
                .attr('fill', 'green')
```
效果如下：
{% img url_for /image/d3/circle3.jpg %}

#### 增加selectAll后：
```
   svg.selectAll('circle')
                .attr('cx', 250)
                .attr('cy', 350)
                .attr('r', 25)
                .attr('fill', 'yellowgreen')
```
效果如下：
{% img url_for /image/d3/circle5.jpg %}

### 小结
上面的例子都是单独使用selectAll，没有使用data()，此时selectAll选中所有的匹配，进行update，此时selectAll就是一个选择器，对selectAll进行链式操作，可将所有被命中的改写（可称之为update）

## data()
### 在基本代码上，增加如下代码：
```
svg.append('circle')
                .attr('cx', 250)
                .attr('cy', 50)
                .attr('r', 25)
                .attr('fill', 'blue')
    svg.append('circle')
                .attr('cx', 250)
                .attr('cy', 150)
                .attr('r', 25)
                .attr('fill', 'green')

var data = [10, 20];
svg.selectAll('circle')
                .data(data)
                .attr('cx', 250)
                .attr('cy', 350)
                .attr('r', 25)
                .attr('fill', 'yellowgreen')
```
效果如下：
{% img url_for /image/d3/circle5.jpg %}

### 修改data数组 length=1
修改以上代码中的
```
var data = [10];
```
效果如下：
{% img url_for /image/d3/circle8.jpg %}

### 修改data数组 length=0
修改以上代码中的
```
var data = [];
```
效果如下：
{% img url_for /image/d3/circle3.jpg %}

### selectAll 与 data 的关系
由上可知，selectAll 是一次性命中了所有，如果要对这所有对命中进行过滤等操作，就使用data();
且经过data()操作后，就拥有了enter或exit操作方法，当然你可以不使用这些方法。
因此说白了，enter和exit无非是data()\selectAll()选择数据能力的延伸。

### selectAll data enter exit 的联系
参考《selectAll 与 data 的关系》，selectAll data enter exit都是数据的采集命中匹配。

## enter
### 基本用法
enter 匹配 数据大于已存在时。
```
 var svg = d3.select("body")
                 .append('svg')
                 .attr('width', 800)
                 .attr('height', 800);
      
var data = [10];
svg.selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                .attr('cx', 250)
                .attr('cy', 350)
                .attr('r', 25)
                .attr('fill', 'yellowgreen')
```
### enter()要与append搭配使用
见上面《基本用法》

### enter 不会 改变已存在的
```
    var new_circle = svg.append('circle')
                .attr('cx', 250)
                .attr('cy', 50)
                .attr('r', 25)
                .attr('fill', 'blue')
    var data = [10, 20];
    var new_circle = svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', 250)
            .attr('cy', 100)
            .attr('fill', 'green')
            .attr('r', 25)
```
效果：
{% img url_for /image/d3/circle3.jpg %}

### 比较好的exitdemo
- [demo 1](https://github.com/YeWills/nodemon-server-template/blob/d3-demo/pages/wangjingzhi/fifth.html)，此demo是一个简单散点图，其中的去掉图中散点功能非常棒。


## exit

### 不使用exit

在上面代码上增加：
```
   svg.append('circle')
               .attr('cx', 250)
               .attr('cy', 50)
               .attr('r', 25)
               .attr('fill', 'blue')
   svg.append('circle')
               .attr('cx', 250)
               .attr('cy', 150)
               .attr('r', 25)
               .attr('fill', 'green')
   svg.append('circle')
               .attr('cx', 250)
               .attr('cy', 250)
               .attr('r', 25)
               .attr('fill', 'orange')
```
效果如下：
{% img url_for /image/d3/circle4.jpg %}

### 使用exit
在上面代码上加入以下代码

```
 var data = [10];
  svg.selectAll('circle')
              .data(data)
              .exit()
              //exit不与append一起使用,此处不能使用append
              //.append('circle')
              .attr('cx', 250)
              .attr('cy', 350)
              .attr('r', 25)
              .attr('fill', 'yellowgreen')
```
效果如下：
{% img url_for /image/d3/circle7.jpg %}

### exit不与append一起使用
使用《使用exit》代码中，注释的部分解注，效果将是：
{% img url_for /image/d3/circle4.jpg %}
此时exit没有任何作用。

### exit将会改变已存在的
参考《使用exit》

## update
### 示例一
```
 var svg = d3.select("body")
                 .append('svg')
                 .attr('width', 800)
                 .attr('height', 800);
    svg.append('circle')
               .attr('cx', 250)
               .attr('cy', 50)
               .attr('r', 25)
               .attr('fill', 'green')
   svg.append('circle')
               .attr('cx', 250)
               .attr('cy', 150)
               .attr('r', 25)
               .attr('fill', 'orange')
   svg.append('circle')
               .attr('cx', 250)
               .attr('cy', 250)
               .attr('r', 25)
               .attr('fill', 'black')
      
var data = [10];
svg.selectAll('circle')
                .data(data)
                .attr('fill', 'blue')
```
效果如下：
{% img url_for /image/d3/circle9.jpg %}

### 示例二
```
<p>default</p>
<p>default</p>
<p>default</p>
<p>default</p>
<p>default</p>


var data = [10, 20, 30];
d3.selectAll('p')
  .data(data)
  .text(t=>t)
```
效果如下：
{% img url_for /image/d3/update.jpg %}
### update = p.data(arr)
比如示例二可写成：
```
var data = [10, 20, 30];
var update = d3.selectAll('p');

update.data(data)
  .text(t=>t)
```
因此可认为  update 等于 data()方法的修改。

### 小结
通过上面例子，update实际上是元素与数据绑定时，元素与数据 的交集部分的更新。
这种情况少。


## 大话各者之间关系
### 选择集 - select selectAll
### 数据绑定 - selection.data()
### 数据绑定的选择集 - enter exit
### DOM操作 - attr append insert
### 远程加载数据 d3.josn()

## 应用demo
### [柱状图demo](https://github.com/YeWills/nodemon-server-template/blob/d3-demo/pages/d3-jt-book/chapter4/4.8/4-8-2-update-data.html)
此demo非常简短，对enter update exit理解非常有帮助。

## 参考
[彻底弄懂 D3js enter update exit 是咋回事](https://v.youku.com/v_show/id_XNDE3MTEwNDE4OA==.html?refer=seo_operation.liuxiao.liux_00003303_3000_Qzu6ve_19042900)
