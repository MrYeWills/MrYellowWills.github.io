---
title: js工具函数
date: 2022/2/22
tags: 其他
categories: 
- js
series: 其他
---



## 防抖
做一个类比，假设你和你的朋友chatty通过微信聊天，她非常的健谈，那么你有如下几种方式来处理她的消息:

最基本的就是时不时就看微信，这样会很浪费时间，但获取信息的实时性很高
函数节流: 每隔5分钟查看一次，这样获取信息的实时性不高，但是不会耽误你获取信息
函数防抖：假设她把她的故事分成了好几段发给你，你假定在5分钟内她没有再发信息就是整个故事已经发完了，然后再去查看。（函数防抖的非立即执行版）
在浏览器中，有很多事件比如window的onresize 鼠标的mousemove 以及滚轮事件wheel等，他们触发的很频繁，这个时候函数没必要一直执行。函数防抖就是让事件触发的n秒内只执行一次，如果连续触发就重新计算时间.

```js
// https://github.com/YvetteLau/Step-By-Step/issues/10
function debounce(fn, delay, immediate) {
    let timer = null;
    return function() {
        clearTimeout(timer); //重新计算时间
        let context = this;
        let args = arguments;
        if (!timer && immediate) {
            fn.apply(context, args);
        }
        timer = setTimeout(function() {
            if (!immediate) {
                fn.apply(context, args);
            } else {
                timer = null;
            }
        }, delay)
    }
}
```

也可以参考：
```
https://github.com/YvetteLau/Blog/issues/31
```

## 异步队列并发执行工具
实现一个 taskpool类，其至少具有 add 方法和最大并发数 max，该 add 方法接收函数(返回值为 promise)，
当前执行的任务数小于设定值 max 时，立即执行，大于 max，则等待任务空闲时执行该任务，模版代码如下:
```js
// 预期输出
// 2s 后
// task0 complete
// task1 complete
// 再 2s 后
// task2 complete
// task3 complete
// 再 2s 后
// task4 complete
// task5 complete
// ...
// task8 complete
// task9 complete

```
```js
class TaskPool {
  constructor(max) {
    this.max = max;
    this.tasks = [];
    this.isRun = false;
  }

  add(task) {
    this.tasks.push(task);
    if (this.isRun) return;
    this.isRun = true;
    setTimeout(() => {
      this.run();
    });
  }

  run() {
    this.splitTask();
  }

  // 执行每个并发任务
  executeTask = () => {
    return new Promise((resolve) => {
      const { max } = this;
      let cur = 0;
      const allPromise = [];
      while (cur < max) {
        if (this.tasks.length) {
          const task = this.tasks.shift();
          allPromise.push(task());
        }
        cur++;
      }
      Promise.all(allPromise).then(() => {
        resolve();
      });
    });
  };

  // 所有的任务 按 最大并发数量 分组执行
  splitTask = async () => {
    const taskLeng = this.tasks.length;
    // 向上取整
    const loopNum = Math.ceil(taskLeng / this.max);
    let loopCur = 0;
    while (loopCur < loopNum) {
      // eslint-disable-next-line no-await-in-loop
      await this.executeTask();
      loopCur++;
    }
  };
}

const taskpool = new TaskPool(4);

for (let i = 0; i < 10; i++) {
  const task = () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(`task${i}`);
      }, 2000);
    });
  taskpool.add(task);
}

```
