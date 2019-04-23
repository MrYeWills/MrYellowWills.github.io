---
title: html笔记
date: {{ date }}
tags: [html5, html]
categories: 
- html
series: html
---

## html知识
### html语义化
#### 概念
js有语义化，html也有语义化，
HTML的语义化强调不要都使用div，建议使用header\footer\nav\section\input num\input email.....
#### 意义
##### 利于阅读；
##### 利于seo
##### 响应不同移动端弹框键盘
移动设备会根据不同的input 如何number、email、text、password；弹出不同的键盘，这是很多移动开发使用input语义化编写的重要原因。

## 标签
### input与form
#### name 与 form 结合
name配合submit，再结合form的action使用。
点击下面的submit后，浏览器跳转url到 /submit.action?firstname=Mickey&lastname=Mouse
```
   <form action="/submit.action">
        <input type="text" name="firstname" value="Mickey">
        <input type="text" name="lastname" value="Mouse">
        <input type="submit" value="Submit">
    </form>
```

## HTML5属性
### tabindex
tabindex 是html5属性 ，非常好用， 指示其元素是否可以聚焦,
在html4中，不是每个标签都拥有focus属性，在html5中，通过tabindex，每个标签都可以定义focus属性。
比如input text，可直接在input元素定义onfocus，在任意的div中，要想使用onfocus等，定义tabindex就可使用。
```
<div tabindex="0">Tabbable due to tabindex.</div>
```


