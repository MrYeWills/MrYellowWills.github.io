---
title: React hooks 笔记
date: 2020/5/1
tags: react hooks
categories: 
- react
series: 前端框架
---

以下内容很多是阅读react官网，做的读书笔记。
## 遗憾的是hooks并没增加新的能力
hooks相比之前的react，并没有增加新的功能，只是针对以前的功能的重新封装和优化，它没有增加新的功能，比如没有增加redux功能，更不可能替代redux，因此在项目中建议class与hooks一起写，而不是一味用hooks，至少当前阶段是这样。
## 基础知识
### 先在不复杂的新组件使用
不建议重写原有的组件，开始“用 Hook 的方式思考”前，需要做一些思维上的转变。按照我们的经验，最好先在新的不复杂的组件中尝试使用 Hook，并确保团队中的每一位成员都能适应。
### 不用class就可用state -存在的意义
以前，如果组件有state就一定要使用class，hooks解决了这点，因此使用纯函数也可以拥有state变成了现实。这是hooks最大的变动。
###  靠Hook调用顺序对应state
那么 React 怎么知道哪个 state 对应哪个 useState？答案是 React 靠的是 Hook 调用的顺序。
react不是神，它是通过hook的顺序将不同的变量名对应到当时定义它的state中。
详细[参考官网](https://zh-hans.reactjs.org/docs/hooks-rules.html#explanation)
### hook的位置顺序至关重要
参考上面的 《靠Hook调用顺序对应state》
### 任何时候保持顶层使用hook
无论是在函数组件内还是**自定义的hook函数**内，请都保证在顶层使用hook，原因见《靠Hook调用顺序对应state》
### 值相同，第二次后就不会再次render
这是hooks自己做的优化，可在官网找到相关论述，无论是usestate还是useReducer都有这个现象，当state值相同时，渲染两次之后，不再渲染。
class组件无此现象。
### 父组件render会导致子render，但setState不一定
父亲render的时候，肯定导致函数式组件render；
但这个函数式样组件内使用useState更新时，如果state值相同，两次后就不会render；

### 由useRef/createRef的区别 想到的
#### 一个用在function，一个用在class
详细参考[useRef 与 createRef 的区别](https://juejin.im/post/5e5c5f6a6fb9a07cad3ba383)
useRef用在function组件内，后者用在class组件内，这是他们表现出来的主要区别。
useRef是hook它有这个能力，在function组件内，只在初始的时候运行一次；
而creatRef不是hook没有这个能力，是一个普通函数，在function组件内时，会每次都执行，因此不能用于function组件，
只用于class组件，并在class组件的constructor或didmount生命周期内定义。
#### 一个定义在function内部，一个定义在装卸载时
参考上面
#### 普通函数在hook组件内会被每次执行
参考上面
#### hook函数基本是只执行一次
参考上面《由useRef/createRef的区别 想到的》，hook函数的最大特征之一，有别于普通函数，hook函数在函数组件内，不会被多次执行。

## useEffect
### 是三合一的API
useEffect 给函数组件增加了操作副作用的能力。它跟 class 组件中的 componentDidMount、componentDidUpdate 和 componentWillUnmount 具有相同的用途，只不过被合并成了一个 API。
### 运行时机
当你调用 useEffect 时，就是在告诉 React 在完成对 DOM 的更改后运行你的“副作用”函数。由于副作用函数是在组件内声明的，所以它们可以访问到组件的 props 和 state。默认情况下，React 会在每次渲染后调用副作用函数 —— 包括第一次渲染的时候。
### 反模式的设计
我们给useEffect每次传递的是一个崭新的函数，这样做的目的可能是这个崭新的函数每次可以获得组件内最新的上下文；官网对此做的解释如下，【每次我们重新渲染，都会生成新的 effect，替换掉之前的。某种意义上讲，effect 更像是渲染结果的一部分 —— 每个 effect “属于”一次特定的渲染。】[详见官网](https://zh-hans.reactjs.org/docs/hooks-effect.html)。
```
 useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
```
## useState
### 只会在组件的初始渲染中调用--使用函数设置初始值
initialState 参数只会在组件的初始渲染中起作用，后续渲染时会被忽略。如果初始 state 需要通过复杂计算获得，则可以传入一个函数，在函数中计算并返回初始的 state，此函数只在初始渲染时被调用：
```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```
## useContext
### 监听到变化后会渲染当前组建
### 需要配合hemeContext.Provider使用


## useReducer
### useReducer 与 redux 的关系
#### 经典demo
如下demo， 
这里的dispatch就是redux的dispatch API；
这里的todos就相当于redux的全局的store 的state；
这里的Provider与context结构 就是 redux 结合react的 react-connect的一套；
所以useReducer在思想上深度模仿了redux，很像一个迷你的redux。
```js
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // 提示：`dispatch` 不会在重新渲染之间变化
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```
#### 原理上借鉴了redux
参考上面《经典demo》
#### 就是一个迷你的redux
参考上面《经典demo》
### 惰性初始化
运用场景：第一次计算state的逻辑复杂，以后不复杂，可以将第一次的计算逻辑剥离出来；
好处除了上面说的，还有就是逻辑剥离出来后，代码更加清晰，维护容易；
```js
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}

```

### 场景 - 深层子层改变顶层state (reducer/context)
以前我们是将顶层setState的函数传给子层，现在我们建议使用**context与reducer**的方式，
参看[《如何避免向下传递回调》](https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down)
```js
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // 提示：`dispatch` 不会在重新渲染之间变化
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}


function DeepChild(props) {
  // 如果我们想要执行一个 action，我们可以从 context 中获取 dispatch。
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}
```
### 场景 - 如何避免向下传递回调
参考上面《场景 - 深层子层改变顶层state (reducer/context)》

## useCallback
### 介绍
useCallback的本质作用是将每次创建的函数都指向同一个引用对象。
```js
const resultCallback = useCallback(fn, deps); //resultCallback 可以认为就是fn
const resultMemo = useMemo(fn, deps);//resultMemo 就是 fn的执行后的结果
```
[更多介绍](https://www.teaspect.com/detail/5756)
### 可与React.memo或shouldComponentUpdate结合使用
useCallback并非一定要与以上一起使用，但与上面使用可体现它的威力，如果有其他场景，也可试试。

## useRef
### 介绍
传统用法和详细介绍，[参考](https://blog.csdn.net/hjc256/article/details/102587037)；
除了传统用法，useRef另外一个好处在于用来保存值，修改它，不会造成重新渲染。
### 给useRef设置一个值
刚开始不太理解设置一个值是什么意思，原来就是给current设置一个初始值。
[参考 如何惰性创建昂贵的对象？](https://react.docschina.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily)；
```js
  const ref = useRef(9999);
  console.log(ref)//{current: 9999}
```
### 修改它不会造成组件重新渲染
[参考](https://blog.csdn.net/hjc256/article/details/102587037)；
```jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';

export default function App(props){
  const [count, setCount] = useState(0);

  const doubleCount = useMemo(() => {
    return 2 * count;
  }, [count]);

  const timerID = useRef();
  
  useEffect(() => {
    timerID.current = setInterval(()=>{
        setCount(count => count + 1);
    }, 1000); 
  }, []);
  
  useEffect(()=>{
      if(count > 10){
          clearInterval(timerID.current);
      }
  });
  
  return (
    <>
      <button ref={couterRef} onClick={() => {setCount(count + 1)}}>Count: {count}, double: {doubleCount}</button>
    </>
  );
}
```

## useImperativeHandle
与useRef、 forwardRef 一起使用，自定义暴露给父组件使用时的ref，也是比较有用的API，我觉得它的作用之一是将子组件的内部方法，很容易的传给父组件。，详细[参考官网](https://zh-hans.reactjs.org/docs/hooks-reference.html)。

## useLayoutEffect
用法同useEffect，只有在useEffect不满足情况下才使用，它的特点在于dom布局时同步触发，而不是渲染完成后触发，服务端不要使用此API。


## hooks出现的意义

### 概述
hooks 实现了state状态的复用，以前state状态的复用，只能通过高阶组件，
现在可以通过hooks，但hooks比高阶组件复用状态时，写法简单，方便，可读性，易维护性更强。

以前必须使用高阶组件实现的state复用，现在只需要一段自定义hooks就可以马上实现非常简洁，清晰，易读易维护。
[更多，参考这篇博客，讲的很好](https://blog.csdn.net/qq_40962320/article/details/87043581)

### 非常重要：可读性易维护性 
hooks的重要意义一方面是增加了方便性，比如可以替代原来高阶组件所实现的功能。
另外一个重要的核心就是，增加了可读性，易维护性，这点非常重要。

就好像es6没有出现前，一个变量可能被层层污染，不知道哪里被重新设置了，
es6的出现很好解决了这点。
![](/image/react/hooks-read.png)
[参考](https://blog.csdn.net/weixin_43606158/article/details/106715134)

### 功能是一方面，可读易维护也是重要方面
参考上面《非常重要：可读性易维护性 》
### hooks与高阶组件区别
hooks与高阶组件都可以实现代码复用，比如state复用，二者本质上无区别，
但使用方式上却一个繁杂沉余，且要多一层组件包裹。
但hooks写法灵活，简单，且可读性极强。
[更多，参考这篇博客，讲的很好](https://blog.csdn.net/qq_40962320/article/details/87043581)

## FAQ之一
### 我应该使用单个还是多个 state 变量？
我们推荐把 state 切分成多个 state 变量，每个变量包含的不同值会在同时发生变化。
说的是，一个useState应该只改变 这个动作 改动的state；
比如一个是改变postion的，一个是改变宽高的，这两个应该写在不同state上，
当然，没有唯一的标准，靠自己平衡，分开与不分开，考虑的是后期维护性扩展和可读性，如果业务越来越复杂，应该碎片化state；
如果业务简单，是否分开可能作用不大，看个人的编程习惯。
详细[查看官网 我应该使用单个还是多个 state 变量？](https://react.docschina.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down)

### 我可以只在更新时运行 effect 吗？(componentDidupdate)
官网上的这个问题，讨论的就是如何使用useEffect 来模拟componentDidupdate，官网推荐方法是，使用Ref。

### 如何获取上一轮的 props 或 state？
目前，你可以 通过 ref 来手动实现.详细参看官网。
也许你说，可以通过useReducer

### ref 并非一定要跟子组件一起用，一定要嵌入子组件---ref大有可为，是新时代的实例对象和this不变指针。
比如 FAq [为什么我会在我的函数中看到陈旧的 props 和 state ？ ](https://react.docschina.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down)也说到了ref的用处。

### 我该如何实现 getDerivedStateFromProps?
[参考官网](https://react.docschina.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops)，模拟getDerivedStateFromProps的关键在于获取上一次的props和state。官网的例子设置一个不用于渲染的state存储prestate。这里的**特别之处在于：**一般认为state用于渲染组件的，不渲染组件时不要用state。
这里官网都推荐了，所以，凡事无固定，平衡就好。

另外一种方式也可以通过 ref 来获取上一轮的props和state，也可以来模拟 getDerivedStateFromProps，参考上面的《如何获取上一轮的 props 或 state？》

### 为什么我会在我的函数中看到陈旧的 props 和 state ？--内部函数作用域问题
```js
function Example() {
  const [count, setCount] = useState(0);

  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + count);
    }, 3000);
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <button onClick={handleAlertClick}>
        Show alert
      </button>
    </div>
  );
}
```

### 有类似 forceUpdate 的东西吗？
使用计时器结合 useState等来做，值得注意的是，**必须要用计时器，因为useState相同的值，两次后，都不会更新，这是hooks于setState的根本区别**。
```
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
```
### 我该如何测量 DOM 节点？-- callback ref 的使用
在这个案例中，我们没有选择使用 useRef，因为当 ref 是一个对象时它并不会把当前 ref 的值的 变化 通知到我们。使用 callback ref 可以确保 即便子组件延迟显示被测量的节点 。
值得注意的是，这里的callback ref其实就是老的class组件内使用的callback ref，没有区别。并不是hooks独创。
如果你可以定义一个实例唯一的函数，在下面代码中也可以不使用useCallback。
```
  function MeasureExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <>
      <h1 ref={measuredRef}>Hello, world</h1>
      <h2>The above header is {Math.round(height)}px tall</h2>
    </>
  );
}
```

### 形成闭包时，如何拿到最新的state
[详细参考官网 - 如果我的 effect 的依赖频繁变化，我该怎么办？](https://react.docschina.org/docs/hooks-faq.html)
可通过函数式的useState：
```js
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1); // ✅ 在这不依赖于外部的 `count` 变量
    }, 1000);
    return () => clearInterval(id);
  }, []); // ✅ 我们的 effect 不适用组件作用域中的任何变量

  return <h1>{count}</h1>;
```



## FAQ之二
### 获取pre state和props的两种方式
#### useState
#### ref
### hooks 与 setState的渲染的最大区别之一
相同的值，两次后，将不再渲染，[查看官网--有类似 forceUpdate 的东西吗？](https://react.docschina.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops)
### 如何给父组件暴露子组件的方法或自定义方法
通过  useImperativeHandle Hook 。
### callback ref 与 useRef 的区别
#### 区别
参考《我该如何测量 DOM 节点？》，要说的是：
- callback ref其实就是class组件以前使用的 函数 ref，并没有区别；
- useRef 其实就是以前class组件内的，给ref传一个字符串；

二者的区别在于 前者可实时获取ref组件最新内容，后者不行。
也可以这样描述，callback形式的ref要比字符串形式的ref更能感知dom的信息，保证每次 didmount或didupdate前获得最新的dom。[参考官网 - 回调 Refs](https://react.docschina.org/docs/refs-and-the-dom.html#callback-refs)

#### 可以配合usecallback使用
ref其实跟class版本的react使用一样，可以设定一个函数，在class组件中，这个函数通常是组件内部函数，通过this指向，属于实例范畴，因此升级到hooks，就是用usecallback来创建一个恒定不变的方法类似实例方法。
如果你有其他创建恒定函数的方式，也可以不用usecallback。

### ref 代替原来的 this
在官方文档中，多次提到了，如果要使用原来class组件的this，就使用ref代替；

### 函数式的的useState的妙用
#### 不依赖外层，通过参数就可拿到最新的state
参考《形成闭包时，如何拿到最新的state》
#### 减少计算
[如何惰性创建昂贵的对象？](https://react.docschina.org/docs/hooks-faq.html)
```js
//不推荐
function Table(props) {
  // ⚠️ createRows() 每次渲染都会被调用
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
```
```js
//推荐
function Table(props) {
  // ✅ createRows() 只会被调用一次
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

## render prop 是一种关键技术
render prop 的介绍看[官网](https://react.docschina.org/docs/render-props.html)，或者看另外一篇博客《React 笔记 - 其他技术 -- Render Props 代替 HOC 》。
据官网介绍，hooks的出现与 render prop的运用有很大关系[参考---Hook 使用了哪些现有技术？](https://react.docschina.org/docs/hooks-faq.html#what-is-the-prior-art-for-hooks).
因此在react开发中，无论是hooks还是class组件，要注重这种思想的运用。

更多参考，另外一篇笔记《React 笔记  --  组合模式 与 Render Props模式   --   Render Props模式》










