---
title: React hooks 笔记
date: {{ date }}
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
这是自己试验出来的，无论是usestate还是useReducer都有这个现象，当state值相同时，渲染两次之后，不再渲染，貌似react自己做了优化？

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