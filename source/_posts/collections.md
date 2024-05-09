---
title: 随笔杂记
date: 2024/4/24
tags: [node]
categories: 
- [前端]
---


此篇用于随笔记录，后期进行分类整理
## 杂记

### 统计star增长的网址
记录历年前端所有库的star增长情况，可以以此查看每年前端流行技术，非常好的一个网站
[JavaScript Rising Stars](https://risingstars.js.org/2020/en)

react vue star 增长趋势：
```
年份
16 17 18 19 20 21 22 21
react
22 27 34 22 19 18 19 16
vue 
26 40 45 31 22 14  9  7
```

### 生成指定长度的数组
```js
new Array(10).fill(null).map(()=> console.log(1)) //打印10次

new Array(10).map(()=> console.log(1)) //没有打印
```

### 经典阻塞测试
```js
 const pre = Date.now();       
 while(Date.now() - pre < 500) {}
```

### 用来展示useLayoutEffect与useEffect区别
用上述阻塞测试例子来理解useLayoutEffect demo上效果更好：
```js
useLayoutEffect(() => {
    if (ref.current) {
      const { height } = ref.current.getBoundingClientRect();
      setTooltipHeight(height); // 设置高度
    //   这里做一个延时操作，这样现象就更明显
      const pre = Date.now();
      while(Date.now() - pre < 500) {}
    }
  }, [children]);
```
下面是[react官网：](https://zh-hans.react.dev/reference/react/useLayoutEffect#usage)的demo说明：
>下面是这如何一步步工作的：
- Tooltip 使用初始值 tooltipHeight = 0 进行渲染（因此 tooltip 可能被错误地放置）。
- React 将它放在 DOM 中，然后运行 useLayoutEffect 中的代码。
- useLayoutEffect 测量 了 tooltip 内容的高度，并立即触发重新渲染。
- 使用实际的 tooltipHeight 再次渲染 Tooltip（这样 tooltip 的位置就正确了）。
- React 在 DOM 中对它进行更新，浏览器最终显示出 tooltip。
- 将鼠标悬停在下面的按钮上，看看 tooltip 是如何根据它是否合适来调整它的位置：

如果官网的demo运行不起来，可以看这个demo [精读React hooks（六）：useLayoutEffect解决了什么问题？](https://blog.csdn.net/BigYe_ChengPu/article/details/135241438)，也是官网的demo，只是挂到了next云demo上，可以把代码拷贝出来，然后把编译后的css拷贝出来，测试。

**经过测试后可以理解为：**
useLayoutEffect 触发时机在 dom真正渲染前，在 useEffect 之前；
如果设置了useLayoutEffect，如果其内部函数使用了setState,就会用最新的状态进行重新渲染，原来的dom渲染不再进行；
如果没有使用setState，执行完useLayoutEffect内的函数后，再进行dom渲染；
useLayoutEffect 的弊端是，会阻塞渲染；

一般用于接口一闪而过的抖动场景，比如tooltip等

#### 延伸：和componentDidMount、componentDidUpdate触发时机一致
useLayoutEffect和componentDidMount、componentDidUpdate触发时机一致

#### 参考
[何时使用useLayoutEffect？](https://segmentfault.com/a/1190000023396433)
[react官网：](https://zh-hans.react.dev/reference/react/useLayoutEffect#usage)
[精读React hooks（六）：useLayoutEffect解决了什么问题？](https://blog.csdn.net/BigYe_ChengPu/article/details/135241438)


