---
title: vue笔记(二)
date: 2022/11/28
tags: vue
categories: 
- vue
---

## 基础知识

### 属性劫持与渲染
假设属性位于data中的一个对象中。
- 如果data中未定义属性，上面又使用了这个属性，即时改变了这个属性，且页面也不能使用此数据渲染
- 如果data中定义了属性，但watch 的deep 为false，改变属性时，watch不会监听到，但页面能正常响应渲染
- 如果data中定义了属性，但watch 的deep 为true，改变属性时，watch会监听到，且页面能正常响应渲染
- 如果data中未定义属性，但watch 的deep 为true，改变属性时，watch不会监听到，且页面也不能使用此数据渲染
- 如果data中未定义属性，每次将状态设置为全新的引用，无论 watch 的deep 为true与否，watch都会监听，且页面能正常响应渲染