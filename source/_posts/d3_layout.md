---
title: d3的各种图形介绍
date: {{ date }}
tags: [d3.js]
categories: 
- 前端
---
## d3图形图解
![](/image/d3/all/images.jpg)

## 树图
### 树图布局API
#### d3.layout.tree() 创建一个树图布局
#### tree.size([]) 设置相邻节点间隔
#### tree.separation([separation]) 设置相邻节点间隔
#### tree.nodes(root) 根据root 计算获取节点数组
#### tree.links(nodes) 根据nodes 计算获取连线数组
### 节点对象(nodes)
#### parent 父节点
#### children 子节点
#### depth 节点深度
#### x 节点x坐标
#### y 节点y坐标
### 连线(links)
#### source 前端节点
#### target 后端节点
### 实现步骤
#### 设置svg 宽高，添加g，设置位置
#### 生成树状布局，设置尺寸
#### 对角线生成器
#### 请求数据
- 获取nodes节点数组和link连接线数组
- 生成连线
- 生成节点
- 给节点添加圆圈，设置半径
- 给节点添加文本、设置文本的样式 位置
### 实现
下面代码都基于以下代码：
```
 var svg = d3.select("body")
                 .append('svg')
                 .attr('width', 800)
                 .attr('height', 800);
```
以上是d3常用写法，下面示例皆以此为基础展开：

### 树图demo
#### 概述
上面《树图》介绍的，在这个demo上都有体现。
效果：
![](/image/d3/layout/tree1.jpg)

```
 var nodes = tree.nodes(root),
   links = tree.links(nodes);
```
#### 转换坐标
```
 // diagonal 生成对角线
        var diagonal = d3.svg.diagonal()
                // 转换坐标轴方向
                .projection(function (d) {
                        return [d.y, d.x];
                });
```
#### enter 时隐藏， update时 显示：
```
 // .attr('r', 0) 意为 隐藏，会在下面都 updateNodes.select("circle") 更新时，显示出来 .attr("r", 6)
                enterNodes.append('circle')
                        .attr('r', 0)
                        .style('fill', (d) => d._children ? 'red' : '#fff')
```
```
 updateNodes.select("circle")
                        .attr("r", 6)
                        .style("fill", function (d) {
                                return d._children ? "red" : "#fff";
                        });
```
#### 连点确定一线
```
//开始绘制点，亮点成一线，起始点-source 终点-target 二点相连，就是连线
//如果起始点和终点在同一个位置，说明连线就是一个点
.attr("d", function (d) {
        var o = {
                x: source.x0,
                y: source.y0
        };
        return diagonal({
                source: o,
                target: o
        });
})

// 使用对角线生成器
//连线没有像上面一样指明起始点和终点，就意味着是一个正常的连线
.attr("d", diagonal);
```
#### 参考与demo地址
[demo地址, 找到其中的 circle d3 demo](https://github.com/YeWills/nodemon-server-template/tree/d3-demo)
[更多讲解看视频](https://ke.qq.com/course/306436?taid=2254411154107652)