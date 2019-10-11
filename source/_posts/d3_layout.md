---
title: d3的各种图形介绍
date: {{ date }}
tags: [d3.js]
categories: 
- 前端
---

## 树图
### 树图API
### 节点(nodes)
### 连线(links)
### 实现
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
![](/image/d3/circle1.jpg)
