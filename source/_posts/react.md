---
title: React 笔记
date: 2020/5/1
tags: react
categories: 
- react
series: 前端框架
---

## 基础知识
### warning:uncontrolled .. to be controlled
主要还是给input的value在 有值与没有值-undefined 之间切换了，解决之道在于始终保持 value为值： value || ‘’ ；用‘’ 代替 undefined。
[解决方案参考](https://stackoverflow.com/questions/47012169/a-component-is-changing-an-uncontrolled-input-of-type-text-to-be-controlled-erro)
### <Chat /> 之类的 React 元素本质就是对象（object）
[参考官网](https://react.docschina.org/docs/composition-vs-inheritance.html)
`<Contacts /> 和 <Chat /> `之类的 React 元素本质就是对象（object）
```jsx
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```
### 什么是 React 元素
#### 介绍
如上《`<Chat /> `之类的 React 元素本质就是对象（object）》` <Chat\> `这些就是React元素。
注意 Chat 是字符串，不是React元素， 带上小书括号的` <Chat\> `才是React元素。
#### React元素就是object
如上《`<Chat /> `之类的 React 元素本质就是对象（object）》

### Context.Provider的更新与consumer组件渲染问题
[参考官网Context.Provider](https://react.docschina.org/docs/context.html#contextprovider)。
当 Provider 的 value 值发生变化时，它内部的所有消费组件都会重新渲染。Provider 及其内部 consumer 组件都不受制于 shouldComponentUpdate 函数，因此当 consumer 组件在其祖先组件退出更新的情况下也能更新。
### Context.Consumer
Context.Consumer是一种**child function 模式**，它类似一个context闭包，它会给它的child function 注入所有的context state；
并且会在底层 执行 child function。
```jsx
<MyContext.Consumer>
  {value => /* 基于 context 值进行渲染*/}
</MyContext.Consumer>
```
```jsx
<ThemeContext.Consumer>
      {({theme, toggleTheme}) => (
        <button          onClick={toggleTheme}
          style={{backgroundColor: theme.background}}>

          Toggle Theme
        </button>
      )}
    </ThemeContext.Consumer>

    //相当于：
<button          onClick={toggleTheme}
          style={{backgroundColor: theme.background}}>

          Toggle Theme
        </button>
```
### ref
#### ref是实例还是dom元素？
当 ref 属性用于 HTML 元素时，构造函数中使用 React.createRef() 创建的 ref 接收底层 DOM 元素作为其 current 属性。
当 ref 属性用于自定义 class 组件时，ref 对象接收组件的挂载实例作为其 current 属性。
**你不能在函数组件上使用 ref 属性，因为他们没有实例。**
#### 不能在函数组件上使用 ref 
参考《ref是什么》
#### ref转发技术与React.forwardRef
ref转发可用于获取子组件内部的ref，或者处理hoc ref无法获取的问题。
React.forwardRef理解与Context.Consumer类似，
通过React.forwardRef,可以让它的第一个参数是一个函数，并且这个函数有能力获得props和ref；当获得ref时，你就可以对ref的进一步的转发应用了。

详细参考官网[在高阶组件中转发 refs](https://react.docschina.org/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components)，这里有ref转发非常棒的应用。
```js
React.forwardRef((props, ref) => {
    return <LogProps {...props} forwardedRef={ref} />;
  });
```
#### React.forwardRef
一般用于以下两个作用：
- 转发 refs 到 DOM 组件
- 在高阶组件中转发 refs

#### 两种获取子组件内部元素的ref
有两种方式：
- 方式一，参考《ref转发技术与React.forwardRef》
- 方式二，函数回调方式：
```jsx
class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
      />
    );
  }
}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}
```
#### 处理hoc ref无法获取的问题
参考《ref转发技术与React.forwardRef》

### Portal 不一样的事件冒泡
尽管 portal 可以被放置在 DOM 树中的任何地方，但在任何其他方面，其行为和普通的 React 子节点行为一致。由于 portal 仍存在于 React 树， 且与 DOM 树 中的位置无关，那么无论其子节点是否是 portal，像 context 这样的功能特性都是不变的。
[参考](https://react.docschina.org/docs/portals.html#event-bubbling-through-portals)

### React.memo
#### 只用于function组件
React.memo只适用于函数组件，而不适用 class 组件
#### 仅检查 props 变更
React.memo 仅检查 props 变更

### 服务端渲染SSR的两个好处(相比客户端CSR)
利于seo与首屏渲染。

### Fiber与Stack
[参考](https://www.imooc.com/video/21308)
#### 动画1秒60帧
人眼中，如果1秒内有60帧，那么动画看起来流畅，否则就卡顿。这样算起来，一帧就是12毫秒。
#### Stack - 16版本之前的渲染模式 
主要特点，等等整个虚拟树完成了比较后，再统一渲染，如果渲染节点巨大，虚拟树比较的工作可能会超过12毫秒，此时会出现卡顿现象。
#### Fiber - 16版本的渲染模式
主要特点，将整个虚拟数的比对拆分成很多个小任务，每个小任务的完成时间控制在一帧12毫秒内，每个小任务完成后都会完成一次渲染（小任务对应的局部渲染）。
因为每次渲染都控制在一帧以内，不用等所有任务或整个树比对完后才渲染，所有看起来流畅，不卡顿。

### react 与 react native 关系
#### 概述
react框架设计时就考虑一个框架同时用于pc端和移动端。
其中将二者公共部分抽成 react 包内；
pc端 抽到 react-dom内，封装了浏览器的dom；
移动端 抽到 react-native内，封装了跟移动端有关的如打开相机 打开gps 原生能力；

因此 react+react-dom 结合用于pc开发；
react+react-native 结合用于移动端开发；
[更多参考](https://www.imooc.com/video/21307)

{% img url_for /image/react/native.jpg %}
#### react native 相当于pc的 react-dom
参考上面《概述》

### diff
#### 概述
[参考](https://segmentfault.com/a/1190000016539430) 
[参考](https://www.cnblogs.com/forcheng/p/13246874.html) 
[参考](https://www.bilibili.com/video/BV1B7411H7fL?from=search&seid=16040033068650647202) 
主要进行以下三方面比较：
- tree diff 树比较   如果根节点 类型不一样，直接卸载，如果类型一样，则进行props比较；
- component diff 组件比较  根据props不同，进行更新操作；
- element diff 组件内节点比较 比如组件内列表节点比较，
 - 若无，就新建，
 - 若删除，就卸载
 - 若有，就比较顺序，这里就有个性能问题了，一般将原来最后的组件放在最前面，比较消耗性能。下面单独讲这块。

#### 不一样的 element diff 比较规则
详细[参考](https://www.bilibili.com/video/BV1B7411H7fL?from=search&seid=16040033068650647202) 。
{% img url_for /image/react/diff.jpg %}
下面说明下为什么将最后面的组件放到最前面，最消耗性能：
```
//原来顺序 A B C D

//最新顺序 D A B C
// 比较 D： lastindex 初始值为0， D原来的下标montindex是3，由于 lastindex < mountindex, 因此D不移动，不过 lastindex将更新为mountindex， lastindex = 3.
// 比较 A： 由上一步可知 D的lastindex为3，那么A的lastindex按照位置递增为4；而A原来的mountindex为0，lastindex > mountindex ,A将向右移动，根据规则，lastindex不更新。
// 比较 B： 根A一样，B 的lastindex 递增为 5，B将向右移动。
// 比较 C： 跟上面一样， C的lastindex 递增为6，C将向右移动。
// 比较完毕
```
上面除了D没有移动位置，其他所有ABC元素都将移动位置，这将比较消耗性能。

## 高阶组件
### 使用代理hoc就够了
高阶组件有多种，但用得最多的是代理和继承hoc，由于代理hoc强大的便利性和作用，能用代理实现的不用继承hoc，因此实际项目中基本上用的是代理hoc，使用代理hoc，基本上就够你的开发需求了。
### hoc定义
#### 高阶函数定义
满足下面二者之一即为高阶组件(英文 Higher-Order Functions)。
- 函数可以作为参数被传递；
- 函数可以作为返回值输出：
[参考 Higher-Order Functions](https://blog.bitsrc.io/understanding-higher-order-functions-in-javascript-75461803bad)
[慕课网](https://www.imooc.com/video/18254/0)

#### hoc定义
高阶组件就是接受一个组件作为参数并返回一个组件的函数。高阶组件具有以下特征：
- 接受一个组件作为参数，并且返回一个新组件；
- 是一个函数，但不是一个组件；

### 代理hoc作用
因为项目中一般用的是代理hoc，这里先讲代理hoc作用。
#### 操纵prop
```
@defaultValueHoc
export default class Test extends Component {
    render() {
        return (
            <div>
                标题：{this.props.defaultValue}<br/>
            </div>
        )
    }
}


const defaultValueHoc = (Comp) =>{
    return class Wrap extends Component {
        render() {
            return <Comp defaultValue="testVale" />
        }
    }
}
```
#### 访问ref
```
@defaultValueHoc
export default class Login extends Component {
renderHear = ()=>{
    return <div>it is header title</div>
}
render() {
    return (
        <div>
            标题：good<br/>
        </div>
    )
}
}


const defaultValueHoc = (Comp) =>{
  return class Wrap extends Component {
      state = {
        header:''
      }
      setRef=(CompInstance)=>{
          const renderHear = CompInstance && CompInstance.renderHear;
          if(renderHear){
            this.setState({header: renderHear()})
          }
      }
      render() {
          return (
            <div>
              <div style={{background: 'red'}}>{this.state.header}</div>
              <Comp defaultValue="testVale" ref={this.setRef} />
            </div>
          )
      }
  }
}
```
#### 抽取状态
抽取状态的好处是，由hoc统一写状态，将相同状态逻辑提取到hoc上，下次有相同逻辑时，直接将hoc装饰上即可，避免相同逻辑重复写，便于维护和代码精简。
```
// 抽取状态之前
class Login extends Component {
  state = {
    value:''
  }
  onChange = (e)=>{
    this.setState({value: e.target.value})
  }
  render() {
      return (
          <div>
              <input value={this.state.value} onChange={this.onChange} />
          </div>
      )
  }
}
```
```
// 抽取状态之后
@defaultValueHoc
export default class Login extends Component {
  render() {
      return (
          <div>
              <input {...this.props} />
          </div>
      )
  }
}

const defaultValueHoc = (Comp) =>{
  return class Wrap extends Component {
      state = {
        value:'统一设置提示语'
      }
      onChange = (e)=>{
        this.setState({value: e.target.value})
      }
      render() {
        const moreProps = {
          value: this.state.value,
          onChange: this.onChange
        }
        console.log(moreProps)
          return (
            <div>
              <Comp {...this.props} {...moreProps}/>
            </div>
          )
      }
  }
}
```
#### 包裹组件
hoc包裹组件但作用显而易见，上面几个例子都是包裹了组件。


### 继承hoc作用
- 操作prop
- 操作生命周期

[参考](https://www.imooc.com/video/18258)

### 代理hoc与继承hoc比较
{% img url_for /image/react/hoc2.jpg %}
{% img url_for /image/react/hoc1.jpg %}

### 高阶组件显示名
```
const defaultValueHoc = (Comp) => {
  return class Wrap extends Component {
      static displayName = `NewComponent(${Comp.displayName || Comp.name || 'Component'})`;

      render() {
        return <Comp {...this.props} />;
      }
  };
};
```

### hoc 与 装饰器 配合时报错问题
hoc与装饰器一起使用的时候，请一定要加上`export default`，不然会报错：
```
@defaultValueHoc
export default class Login extends Component {
 ......
}
```
## 其他技术
### React.cloneElement是一把好刀
其最好的两个用法在于：
1.让你任意地方定义组件，然后让你按照意图，重新把组件渲染在指定位置；
2.重新组装props；
React.cloneElement是一个非常好用的API，给力你极大的自由，可以让你做很多意想不到的事情。

#### demo
详细参考[使用 Context 之前的考虑](https://zh-hans.reactjs.org/docs/context.html),
如下，Page是最外层父层 ，层级关系如下： Page-》PageLayout-》NavigationBar-》Link ，Link是最内层，最子层；如果Page要给Link传递参数，就必须给中间的每个组件设置相同的props，非常麻烦。还有一个麻烦是，如果后期Link还需要Page的更多参数，那么又要给每个组件加props，麻烦得狠。
```jsx
<Page user={user} avatarSize={avatarSize} />
// ... 渲染出 ...
<PageLayout user={user} avatarSize={avatarSize} />
// ... 渲染出 ...
<NavigationBar user={user} avatarSize={avatarSize} />
// ... 渲染出 ...
<Link href={user.permalink}>
  <Avatar user={user} size={avatarSize} />
</Link>
```
为了解决上面的问题，因为Link的数据只与Page相关，那么在Page上将Link写成一个函数，在Page组件内将Link组装好，最后将Link自身传给最内层渲染即可，减少了传props的个数，也容易维护。使用类似 Render props的形式：
```jsx
function Page(props) {
  const user = props.user;
  const userLink = (
    <Link href={user.permalink}>
      <Avatar user={user} size={props.avatarSize} />
    </Link>
  );
  return <PageLayout userLink={userLink} />;
}

// 现在，我们有这样的组件：
<Page user={user} avatarSize={avatarSize} />
// ... 渲染出 ...
<PageLayout userLink={...} />
// ... 渲染出 ...
<NavigationBar userLink={...} />
// ... 渲染出 ...
{props.userLink}
```

## 组合模式 与 Render Props模式
### 概述
这两种是React两种重要而常用的设计模式，Render Props模式是对 组合模式的扩展。
### 理论基础
两种设计模式的理论基础在于React的props可以接收任何对象。所以就可以愉快地给props传递react元素和function了。
这在官网多次提到。
### 组合模式
#### 示例说明
什么是React的组合模式，通俗的说，就是将多个组件组合在一起:
下面FancyBorder就是一种组合模式，组件内通过props.children 渲染其他组件内容。
```js
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}

function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}
```
下面也是一种组合模式
在PageLayout接收一个topBar，而这个topBar是一个渲染好的React元素。
```js
function Page(props) {
  const user = props.user;
  const content = <Feed user={user} />;
  const topBar = (
    <NavigationBar>
      <Link href={user.permalink}>
        <Avatar user={user} size={props.avatarSize} />
      </Link>
    </NavigationBar>
  );
  return (
    <PageLayout
      topBar={topBar}
      content={content}
    />
  );
}
```
#### 定义
由上面你应该可以看到，直白的说React组合模式就是 写好或组合好一个React元素，将此元素作为其他(子)组件的props，其他组件直接凭借props渲染的设计模式。
#### 特点：能拿到父组件所有数据
参考如下分析《需求延伸：如何拿到子组件数据(父子组件交互)》
#### 需求延伸：如何拿到子组件数据(父子组件交互)
在上面的《示例说明》中，`topBar`是组合好的react元素，它只能拿到父组件`Page`的所有state和props，但不能拿到`PageLayout`子组件的状态信息，如何可以获得呢，此时，我们可以把`topBar`设计成一个函数，比如下面的`mouseRender`，不仅可以拿到父组件的，还可以拿到子组件的state。
`mouseRender`所代表的react设计模式就是 render props 模式。
下面的例子又可以看到，可以通过setStateName进行父子组件交互，这也是render props 模式另外一个好处。

```js

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.state = { x: 0, y: 0 };
    props.setStateName('beautiful')
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { x: 0, y: 0 , name:'you'};
  }

  setStateName(name) {
   this.setState({name})
  }
  mouseRender(mouse, ) {
   return <Cat mouse={mouse} setStateName={this.setStateName} type={this.state} />
  }
  render() {
    return (
      <div>
        <h1>移动鼠标!</h1>
        <Mouse render={mouseRender}/>
      </div>
    );
  }
}
```
### Render Props模式

单独一章说明 《Render Props模式》
#### 定义
Render Props模式是在组合模式延伸而来；
function内返回一个React对象，然后将此function作为props传递给子组件，这种设计模式就是Render Props模式，详细参考《需求延伸：如何拿到子组件数据(父子组件交互)》
#### 可以拿到父子两个组件的state
详细参考《需求延伸：如何拿到子组件数据(父子组件交互)》
#### 可以将父子组件进行交互
详细参考《需求延伸：如何拿到子组件数据(父子组件交互)》

### 二者区别和联系
二者区别在于，组合模式只能拿到父组件信息，render props 能拿到两个组件的信息，并且可以做交互。
联系在于，render props 基于 组合模式发展而来。

## Render Props模式

### 概述
#### 定义
Render Props模式是在组合模式延伸而来；
function内返回一个React对象，然后将此function作为props传递给子组件，这种设计模式就是Render Props模式，详细参考《需求延伸：如何拿到子组件数据(父子组件交互)》
#### 可以拿到父子两个组件的state
详细参考《需求延伸：如何拿到子组件数据(父子组件交互)》
#### 可以将父子组件进行交互
详细参考《需求延伸：如何拿到子组件数据(父子组件交互)》

### 与组合模式的区别
见 《组合模式 与 Render Props模式   --  二者区别和联系》
### 与普通组件的区别
#### 概述
这点最容易迷惑，很多人认为 写成render props模式与直接写成组件有什么区别，
毕竟二者都是一个函数。
render是函数， 组件也是一个函数。但有区别。

#### 组件是国中国，render Props还是一国
比如封装next 的form的时候，使用自定义组件，自定义组件的state与父组件是隔绝的
render props则与父组件一体，用的是父组件状态。

其实用组件也好还是render props好，大多情况不会碰到太多区别，除非，就是上次封装next form时，就是一个经典的区别。

#### render Props 比组件更灵活
如下图，render props 获取父组件的state非常方便灵活，虽然自定义组件也可以获取，但要定义props等等，写法上要做出改变。
{% img url_for /image/react/renderprops1.png %}

[参考](https://blog.csdn.net/qq_40962320/article/details/87043581)


#### render props 可以实现高阶组件类似的代码复用
[参考](https://blog.csdn.net/qq_40962320/article/details/87043581)

#### render props重大作用之一就是代码复用
参考上面的《render props 可以实现高阶组件类似的代码复用》

### 与高阶组件的区别
[参考](https://blog.csdn.net/qq_40962320/article/details/87043581)

### 与hooks的区别
[参考](https://blog.csdn.net/qq_40962320/article/details/87043581)


## 黑知识

### 奇怪的渲染：每次渲染的状态是独立的黑箱
```ts
interface IState {
  like: any,
}
class LikeButton extends React.Component <any, IState>{
  constructor(props:any){
    super(props)
    this.state={like:0}
  }
  handleAlertClick =()=>{
    const {like} = this.state;
    setTimeout(() => {
      alert('you clicked on ' + this.state.like)  //like 为 17
    }, 3000)

    setTimeout(() => {
      alert('you clicked on ' + like) //like 为 5
    }, 3000)
  }

  render(){
    const {like} = this.state;
    return (
      <>
      <button onClick={() => {this.setState({like: like + 1});}}>
        {like} 👍
      </button>
      {/* like 为 5 的时候，  点击触发 handleAlertClick, 然后一直点击上面的onClick改变like值，3秒后like值变成17 */}
      <button onClick={this.handleAlertClick}> Alert!
      </button>
      </>
    )
  }
}
```

```ts
import React, { useState, useEffect, useRef, useContext } from 'react'
import { ThemeContext } from '../App'
const LikeButton: React.FC = () => {
  const [like, setLike] = useState(0)
  const likeRef = useRef(0)
  function handleAlertClick() {
    setTimeout(() => {
      alert('you clicked on ' + like)  //也是5 非 17
    }, 3000)
  }
  return (
    <>
    <button onClick={() => {setLike(like + 1); likeRef.current++}}>
      {like} 👍
    </button>
    <button onClick={handleAlertClick}> Alert!
    </button>
    </>
  )
}
export default LikeButton
```

每次渲染中 props state 是相互独立的黑箱（每次渲染会形成一个闭包）；
其实render也是一个函数，render的执行是一次渲染，只是渲染jsx或dom；
同样的handleAlertClick 函数内的程序执行，其实也是一次渲染，
此次渲染的所有 props state 是相互独立的黑箱，其props state的值 由 handleAlertClick函数执行的那一刻决定。
其props state的值就是handleAlertClick函数执行的那一刻的执行上下文。
handleAlertClick函数执行的那一刻 this.state.like为 5 所以最终渲染的是5；
至于直接使用 this.state.like 最终渲染成17 是因为 对象的引用导致。

{% img url_for /image/react/hook.png %}

```js
//错误写法
function foo(){
    var arr = [];
    for(let i = 0; i < 2; i++){
        arr[i] = function(){
            return i;
        }
    }
    return arr;
}
var bar = foo();
console.log(bar[0]());//2


//正确写法
function foo(){
    var arr = [];
    for(var i = 0; i < 2; i++){
        arr[i] = (function fn(j){
            var _j = j;//定义一个变量，更容易理解
            return function test(){
                return _j;
            }
        })(i);
    }
    return arr;
}
var bar = foo();
console.log(bar[0]());//0
```

### setState 的函数使用 和 妙用
react 的 setState 是异步更新，同步执行。
setState 本身并非异步，但对state的处理机制给人一种异步的假象。

下面是hook和class组件使用函数来setState，效果是一致的。
下面代码利用了两点知识：
- setState 是同步执行；
- setState 接收函数时， 其入参是最新的state；
```js
 const [ num, setNum ] = useState(0)
<Button onClick={()=>{
          setNum(pre=>{
            console.log(pre) //0
            return pre+1
          })
           console.log(num) //0
          // 因为 setState是同步执行，到这里的时候上面的 代码已经都执行过了，其状态已经更新；
          // 利用接收函数时，入参可以得到 最新 state 的特性，这里可以取到最新的状态值。
          setNum(pre=>{
            console.log(pre) //1
            return pre+1
          })
        }} >test</Button>
```
```js
 const [ num, setNum ] = useState(0)
<Button onClick={()=>{
          setNum(num+1)
          console.log(num) //0
          setNum(pre=>{
            console.log(pre) //1
            return pre+1
          })
        }} >test</Button>
```
```js
  this.state={
    num:0
  }
  <Button onClick={()=>{
           this.setState(pre=>{
              console.log(pre.num) //0
              return {num: pre.num + 1}
            })
            this.setState(pre=>{
              console.log(pre.num) //1
              return {num: pre.num + 1}
            })
        }} >test</Button>
```

## react 17

### 没有新增新能力
没有新增能力，为了后期能力的增加做铺垫：
### 不同点
以下特性， 源码层面的优化，react使用者而言 无感知，知道就行
- 事件委托机制改变 
- 向元素浏览器靠拢 
- 删除事件池

下面特性 没什么大变化，不过react使用者值得稍加注意：
- useEffect 清理操作改为异步操作 ，以前是同步操作
- jsx不可返回 undefined
- 删除部分私有api ，是react native 的api ，pc端不用关心


## 调试

### 断点正常，运行不正常
```js
 showDlgStatus(true);
 setDlgData({...item});
```
 此时去console.log() Dlg 组件的 constructor 生命周期，你会发现 DlgData 没有值，导致运行异常；
 但是如果控制台打开，断点调试，控制台又能打印 DlgData 的值，然后一切变得正常；

解放思路，先设Dlg模态框的 数据，然后再设置show值，简言之 调换下位置：
```js
 setDlgData({...item});
 showDlgStatus(true);
```

## 好文
- react作者博客：
[编写有弹性的组件](https://chojaehun.github.io/zh-hans/writing-resilient-components/)
对应的英文版：
[Writing Resilient Components](https://overreacted.io/writing-resilient-components/)

阅读这篇文章能够获取到很多来自官方认可的，react使用的实用技巧。


- [React新特性Hooks使用教学，以及与高阶组件、renderProps模式的对比](https://blog.csdn.net/qq_40962320/article/details/87043581)




     