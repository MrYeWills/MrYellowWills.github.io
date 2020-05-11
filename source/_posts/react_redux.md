---
title: react-redux笔记
date: {{ date }}
tags: react react-redux
categories: 
- react
- react-redux
series: 前端框架
---

## react-redux 源码解读
这些博客是我以前写在csdn的，现在将博客地址放在这里。阅读的react-redux的版本为5.0.7
### react-redux 源码解读之connect的selector布局
参考[react-redux 源码解读之connect的selector布局](https://blog.csdn.net/ybdt1201/article/details/83759641)
### react-redux 源码解读之connect的mapStateToProps
参考[react-redux 源码解读之connect的mapStateToProps](https://blog.csdn.net/ybdt1201/article/details/84201064)
### react-redux 源码解读之connect的mapDispatchToProps
参考[react-redux 源码解读之connect的mapDispatchToProps](https://blog.csdn.net/ybdt1201/article/details/84279996)
### react-redux 源码解读体会拾遗
参考[react-redux 源码解读体会拾遗](https://blog.csdn.net/ybdt1201/article/details/84350232)

## 为什么要整理笔记
原本以为有过这么多的项目经验，加上前年的时候也看过react-redux的源码，我对react-redux应该记忆是深刻的。
无奈，最近使用了react-redux的hooks，发现了一些疑问，需要与之前非hooks的方式进行对比，可却发现我对以前的非hooks版本细节忘得差不多了，细节觉得成败啊。
于是今天花了小半天对比了5.0.7与最新react-redux版本，对知识做了梳理，为免再次忘却，也为了便于下次查阅，秉着好记性不如烂笔头，特此笔记之。
**注意的是，我对react-redux 5.0.7版本源码熟悉，对hooks 版本的react-redux 还没有看过，以下结论，涉及到hooks，都是从试验中得出**


## react-redux知识概要

### shallowEqual 与 props的浅比较
shallowEqual是react-redux用于比较props各个属性的，react-redux比较props时，通过 shallowEqual 只比较props的每个属性，一种浅比较方式。
shallowEqual除了react-redux自己使用，也可作为工具函数使用，是一个react-redux对外的API，其代码比较简洁，是一个考虑很周全的对象属性比较工具函数。

### connect 拥有的能力
#### 概述
connect就是一个高阶组件，每个使用了connect的组件形式如下，每个组件如果结合connect后，将具备如下能力(这些能力也是connect的能力)：
- shouldComponentUpdate 结合shallowEqual函数对props进行浅层比较优化
- 监听store变化的能力
如下代码中，通过 new Subscription 可监听store的变化，当你发送一个dispatch后，每个使用connect的组件有能力监听到store是否变化。
- 若全局的store变化，整个项目所有组件的mapStatetoProps都会被执行
因为disptch必然导致全局的store数据变化，因此dispatch后，整个项目的所有mapStateToProps会被执行，当然了，有些dispatch并不会改变store，那么。

```js
function wrapWithConnect(WrappedComponent) {

   return class Connect extends Component {
      constructor(props, context) {
        super(props, context)
        this.initSelector()
        this.initSubscription()
      }
      componentWillReceiveProps(nextProps) {
          //this.selector.run做以下几个事情：
            //   1.通过shallowEqual对props各属性比较后得出this.selector.shouldComponentUpdate值；
            //   2.执行mapStateToProps，因为要比较mapStateToProps执行后得到的props；
        this.selector.run(nextProps)
      }
      shouldComponentUpdate() {
        return this.selector.shouldComponentUpdate
      }
      initSubscription() {
           //初始化store变化的监听：
        this.subscription = new Subscription(this.store, parentSub, this.onStateChange.bind(this))
      }
      onStateChange() {
        //   若变化，将执行 run，获取 shouldComponentUpdate 的值，并是否通过setState让组件render
        this.selector.run(this.props)
        if (!this.selector.shouldComponentUpdate) {
          this.notifyNestedSubs()
        } else {
          this.componentDidUpdate = this.notifyNestedSubsOnComponentDidUpdate
          this.setState({})
        }
      }
      render() {
        const selector = this.selector
        //render后，记得将 shouldComponentUpdate 值重置为 false
        selector.shouldComponentUpdate = false
         return createElement(WrappedComponent, this.addExtraProps(selector.props))
      }
    }
  }
```
#### shouldComponentUpdate优化
参考上面的《概要》
#### 监听store变化的能力
参考上面的《概要》
#### 比较props并判断是否render的能力
参考上面的《概要》

### 分清props类别很必要
参考下面《ownerprops、mapState props、dispatch props》
参考下面《 render与否参考mapStatetoprops的结果，而非组件所有的props》

### ownerprops、mapState props、dispatch props
connect组件的props有： ownerprops、mapState的props、dispatch的props：

ownerprops是指父组件引用组件时定义在react元素上的props属性；
mapState props是指 mapStatetoprops函数执行完后形成的props；
dispatch props是指 mapDispatchToProps定义的props；
三者定义的不同导致了一些特性：
ownnerprops基本上受父亲组件render时而变化；
mapState props 受dispatch时变化；
dispatch props 在组件装载时就确定好了，直到组件卸载都不会变化。


### dispatch后相关的事情
#### 父层和子层的是否会render
这里的dispatch指的是会改变store变化的那种，dispatch后，项目中无论祖先父子儿孙兄弟组件，只要你使用了connect，那么都会触发connect组件内的监听Subscription，
组件就会让mapStatetoprops执行，获取到执行结果后，组件将得到ownerprops、mapState props、 dispatch props；
由于ownerprops只有父亲组件render时才会改变；dispatch props只有在组件装载时才会改变；
这两种props在dispatch的时候，都不会改变；
因此是否render将只与mapState props有关，也就是mapStatetoprops执行结果有关。
不过凡事有例外，万一其他两中props改变来呢，具体情况需要具体看待。
如果mapStatetoprops执行的结果跟上次的结果不一样，那么就会触发本组件render。

小结下：当dispatch后，**改变了store的state**，那么一定会触发 mapStatetoprops 的执行，而且是项目内所有connect组件的mapStatetoprops，不分父子兄弟，都将执行，render与否，只与本组件的mapStatetoprops的结果对比有关

#### dispatch后会触发mapStatetoprops
为什么dispatch后会触发mapStatetoprops的执行。
其实这句话，说的不严谨，dispatch后，只有改变了store.getState才会触发 mapStateToProps；
这是react-redux机制，dispatch后，如果改变了 store.getState，才会触发Connect组件内的状态改变监听事件，
该监听事件会比较两次的props，从而决定是否render；
要比较就要获取props，其中在获取mapState props时，react-redux会比较store.getState，如果store没有改变，就认为mapState没有改变，就返回上一次的mapState；如果store改变了，需要从 mapStateToProps 执行得来最新的mapState，从而触发了 mapStateToProps的执行；

因此，只要dispatch改变了store，就一定触发每个组件的 mapStateToProps执行。
如果没有改变store，也不会触发 mapStateToProps的执行。
#### dispatch不一定会触发mapStatetoprops
参考《为什么dispatch后会触发mapStatetoprops》

#### render与否可认为只看mapStatetoprops的结果
render与否本来是要对比 所有种类的props，但由于dispatch的时候，ownerprops与dispatch props 不会改变，因此只与剩下的 mapState props有关。
因此render与否 可认为只看mapStatetoprops的结果。
更多参考《父层和子层的是否会render》

#### render与否不受外界(Connect)影响
有些人认为在祖先、父亲、子孙 组件内可能也使用了Connect；
那么自己的Connect组件，在自己dispatch的时候，自己组件是否render会受他们的影响吗；
这肯定是不影响的，因为自己dispatch的时候，改变的是全局变量Store.getState，当dispatch完后，你就与其他组件是一样的了，
你就会跟其他Connect组件一样，利用监听是否有变化，执行mapstatetoprops，比对masState props，若变化自己将render，反之则不render，根本不受其他组件是否有Connect影响。
更多参考《父层和子层的是否会render》


#### 是不是所有 mapStatetoprops 会执行
是的，参考《父层和子层的是否会render》

### 反模式下 父级与dispatch驱动的render的奇怪差异
一个Connect组件，如下在父组件下引用时定义了一个反模式的test1属性：
```jsx
<Connect test1={[]} />
```
此时，只要父组件render，都会导致Connect组件render；
但是，在Connect组件内，如果你dispatch，如果你的mapState的props没有变化，就不会导致组件render，这就是二者render的差异性所在；
原因在于，父组件render时，给test1每次都赋值一个新的数组，造成ownerProps改变；
dispatch的时候，父组件不会render，test1的数组一直指向上一次父组件render创建的数组，因此不会render；

### mapStatetoprops的触发时机
#### 父级驱动的render不触发mapStatetoprops执行
父级与dispatch驱动的render都会执行:
```
this.selector.run(nextProps)
```
可以通过上面wrapWithConnect组件的代码看出：
```jsx
     componentWillReceiveProps(nextProps) {
        this.selector.run(nextProps)
      }
      initSubscription() {
        this.subscription = new Subscription(this.store, parentSub, this.onStateChange.bind(this))
      }
      onStateChange() {
        this.selector.run(this.props)
      }
```
为什么父级驱动render不触发mapStatetoprops执行，而dispatch会触发呢。
这与react-redux的机制有关，在run的后续一系列代码中，会比较store.getState()，如果发生变化，就会进一步执行 mapStatetoprops 来获取最新的mapState props；如果没有变化就不执行；
这两种render中，只有dispatch会导致store的变化。而父级驱动的render则不会。

#### dispatch驱动的render触发mapStatetoprops执行
参考《父级驱动的render不触发mapStatetoprops执行》

#### store改变肯定触发mapStatetoprops执行
要想store改变只有dispatch，dispatch不一定产生store变动，一旦store改变，一定触发mapStatetoprops执行。
更多参考《父级驱动的render不触发mapStatetoprops执行》

#### 小结
有上面分析可知，mapStateToProp只在store改变时才会执行，而store的改变只与dispatch有关，因此只有dispatch时，且改变了store时，才会触发mapStateToProp的执行。


## hooks
### hooks、Connect 原理基本一致
react-redux的用法有 传统的Connect用法，以及 新的hooks用法。
他们二者的原理基本一致，

### useDispatch
useDispatch 时， 
如果改变了store，则会触发所有的 useSelector 与 mapStateToProp 的执行；
组件是否render，根据各自的 useSelector、mapStateToProp执行结果决定；

如果没有改变store，则只会触发本组件的 useSelector，但不会引起render，不会触发其他组件的 useSelector与mapStateToProp执行；

### useSelector 触发时机：
当组件render时；
当有组件dipatch时，无论是否改变store，都会执行；
与mapStateToProp不一样的地方：
第一：mapStateToProp不会在render的时候执行； 第二：mapStateToProp 只会在store变化时才执行  参考《mapStatetoprops的触发时机》。
因此如果同一个项目中，有的组件你用的是Connect，有些用的是useSelector，当你dispatch，不过未改变store的时候，你会发现useSelector执行了，mapStateToProp未执行。

### useSelector 产生的作用
ccc与mapStateToProp这点一样，执行的结果如果改变，将会触发组件render，否则就不会。

### useSelector 常用错误用法
#### 返回一个新构造的对象
以下两种错误用法，会导致组件在dispatch的时候，总是刷新，因为下面两种方式useSelector执行的结果都是一个新建的对象。这样造成前后两次比较的时候认为变化了： `{} !== {}`:
```js
  const courses = useSelector(state => {
    return {};
  });
```
```js
  const {test, data} = useSelector(state => {
    return {test:state.test, data:state.data};
  });
```

#### hooks与Connect的区别
hooks组件其行为还是类似一个纯函数组件，没有像Connect一样对组件以高阶组件的形式包裹，没有做shouldComponentUpdate优化。

### 新旧版本的Connect异同
新版本的react-redux的Connect与旧版本的Connect，使用方法及产生的现象没有什么差别。

## 参考
### [官网]()
### [React-Redux 官方 Hooks 文档说明](http://react-china.org/t/topic/34076/1)
### [react-redux-hooks demo](https://github.com/YeWills/react-redux-hooks-demo/commits/blog-demo)
### [react-redux 5.0.7 demo](https://github.com/YeWills/test-react-redux)