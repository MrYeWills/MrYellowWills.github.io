---
title: next框架及项目笔记
date: 2020/10/08
tags: [next框架]
categories:
- 常用ui库
---

## 黑知识
### dialog要考虑的
#### 要考虑内容区域与按钮设计
#### 内容区域是否滚动
#### 按钮是否显示、还是滚动显示
#### 内容更新时，如何设计
当dialog内的内容重新渲染时，如何重新让dialog布局，保持垂直居中。
#### next的isFullScreen与shouldUpdatePosition模式

### 项目中数据设计
#### 用于渲染的 redux数据
#### 用于渲染的 state数据
#### 用于逻辑处理 的公共数据(类似单例)
这种数据不用于渲染，不应该放置于 redux state 或context上，因为这些都会引起render。
可以考虑存储于一个单例下。
#### 用于逻辑处理 的本地数据(ref)
一般存储于this内，或 useRef内。






