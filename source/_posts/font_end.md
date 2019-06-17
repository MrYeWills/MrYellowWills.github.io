---
title: 前端缓存笔记
date: {{ date }}
tags: 前端缓存笔记
categories: 
- 前端缓存笔记
series: 前端缓存笔记
---


## 缓存1
### cookie 与 http
cookie是后台传给前台，前台再利用浏览器的cookie可以随http发回给后台的特性，对发回对cookie进行验证。
- 第一次向后台发起请求后，后台返回的响应头（response headers）包含了给浏览器设置cookie对功能（set-cookie）
![](/image/font_end/cookie.jpg)
- 浏览器拿到cookie后，cookie有个特性，同域名下的cookie在发起请求时，都会发回给后台
- 后台通过比对session的cookie，进行超时、登陆等校验

补充一点cookie知识：
如下图 Expires／max-age 的值为 N／A是session永久有效的意思，另外一个每个cookie对应一个域名。
![](/image/font_end/cookie1.jpg)

