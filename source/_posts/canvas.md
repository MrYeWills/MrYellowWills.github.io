---
title: canvas笔记
date: {{ date }}
tags: [canvas]
categories: 
- 前端
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

