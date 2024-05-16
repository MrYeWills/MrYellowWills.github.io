---
title: webpack源码系列(二)：loader
date: 2022/3/23
tags: [webpack, webpack源码系列]
categories: 
- webpack源码系列
---


## 基础知识

### 汇集
compiler 会拿到最后一个loader 的产出结果， 这个结果应该是string 或者 buffer。

### loader 分类
> 对于loader 默认都是一样的，只不过使用的时候可以放在不同的位置或进行了不同的修饰，因此说清起来 loader 就有分类了
- 普通loader 没有任何配置
- 前置loader enforce 为 pre
- 后置loader enforce 为post
- 行内loader 使用!进行分割

#### 执行顺序如下：
pre > normal > inline > post
{% img url_for /image/webpack_one/loader.jpg %}

配置跟上图一样，index.js 上import一个行内 loader :
{% img url_for /image/webpack_one/in.jpg %}

#### inline配置符号的使用
为了使用方便，可以通过一些符号设置某些的开启和关闭
- ! 跳过了 normal loader
{% img url_for /image/webpack_one/in1.jpg %}
- -! 跳过了 normal+pre loader
- !! 跳过了 normal+pre+post loader 也就是说只保留了inline自己

### pitch
loader一般只需要 写loader本身即可，不过每个loader 其实还有一个pitch，作用见图
{% img url_for /image/webpack_one/pitch1.jpg %}
{% img url_for /image/webpack_one/pitch2.jpg %}
{% img url_for /image/webpack_one/pitch3.jpg %}
{% img url_for /image/webpack_one/pitch4.jpg %}

### loader结构与要点
loader-utils 获取 options
schema-utils 获取 对options进行验证
吐出结果的方式：
- 如果有异步需求时，使用 callback 代替 return 吐出结果，callback为 `this.async()` this为上下文；
- 默认情况下，loader都是同步的，没有异步需求时，直接return 吐出结果即可。

{% img url_for /image/webpack_one/demo.jpg %}

### file-loader
#### 要做的事情
file-loader 处理图片的时候怎么做
- 返回一个字符串形式的图片名称(路径)
- 资源拷贝一份到指定目录

webpack5 最常见的问题，默认转为 es module， 导致图片出错，解决方法如下：
{% img url_for /image/webpack_one/file1.png %}
```
esModule:false
```
现象如下：
{% img url_for /image/webpack_one/file2.jpg %}
{% img url_for /image/webpack_one/file3.jpg %}
{% img url_for /image/webpack_one/file4.jpg %}

#### 返回图片名或路径
file-loader 返回的是一个图片路径或图片名，当然也可能是一个base64 url；

#### 设置raw为true处理文件流
loader默认处理字符串，涉及文件流处理时，设置raw为true

## 参考

[手写简易打包器实现之手写 loader](https://www.bilibili.com/video/BV1QM4y1N7TR?spm_id_from=333.999.0.0)
