---
title: vue笔记
date: 2020/10/28
tags: vue
categories: 
- vue
- vue基础
---

## 基础知识
### 挂载点，模版与实例
```js
<div id="root"></div> //挂载点

<script>
new Vue({//实例
  el:"#root",
  template:"<h1>hello {{msg}}</h1>", //模版 //也叫插值表达式
  data:{
  msg : "world"
  }
});
</script>
```
### 插值表达式 与 v-text v-html
#### 插值表达式
参考上面《挂载点，模版与实例》
#### 插值表达式相当于v-text 
v-text 是vue框架 插值写法一种，
另外还有 v-html。
![](/image/vue/values.jpg)

#### v-text v-html可认为是插值表达式的延伸
如题。

#### 几种写法
![](/image/vue/value2.png)
### 赋值
参考《插值表达式》的图片。

### 单向绑定与双向绑定
参考《vue特有写法  -  v-model》

### vue特有写法
#### v-text v-html
是一种插值写法，见《插值表达式》，与双花括号写法差不多。
#### v-on:click 与 @click
![](/image/vue/values.jpg)
#### v-bind: 与 ：
后者是前者的缩写，用于html元素属性绑定。
当被绑定后，属性等号后面的字符串是一个js表达式，js内表达式变量指向实例中的data下面的属性值：
![](/image/vue/bind.jpg)
#### v-model
一般用于可交互的html元素，比如input，而不是单纯的div，定义v-model后，就是数据双向绑定，
input元素可改变数据，数据改变也同样改变input的显示。
与之相对的是单向绑定的v-bind，一般用于纯展示的html元素，如div，只用于数据获取，而不能改变数据。

#### v-if v-show v-for :key
![](/image/vue/for.jpg)
如上图， v-if 显示隐藏是删除dom，v-show，通过css display none， v-for用于遍历, :key用于遍历唯一值，与react一致。

#### v-if v-else-if v-else
![](/image/vue/if.jpg)

#### v-if v-else 必须连着写
![](/image/vue/if-err.jpg)

### v-for列表渲染
#### 结合v-if
![](/image/vue/forif.jpg)
#### 结合v-show
![](/image/vue/for-show.jpg)
#### v-if v-show 列表渲染区别
v-if，更加灵活；
v-show，如果是过滤效果可以使用。

#### 组件驼峰定义，小斜杠使用
```html
<!-- 组件定义： -->
components:testOk
<!-- 使用： -->
<test-ok></test-ok>
```
### class绑定 与 style绑定
#### class绑定
```html
<div id="app">
        <div v-for="item in list">
            姓名：{{item.name}}，年龄：{{item.age}}
        </div>
        <div v-for="item in list">
        <div v-show="item.age > 24" :class="['banana','more',{'another':item.age < 26}]">
                年龄大于24的人有：{{item.name}}
            </div>
        </div>
    </div>
```
#### style绑定
![](/image/vue/style.jpg)

### 计算属性(合成属性)computed
#### 概述
当某一个数据来源于多个数据计算而来时，用这个，并且类似react的hooks功能，此计算具有缓存计算性能优化能力，
只有所依赖的数据变化时才重新计算，否则取缓存。
computed可以说是data的升级版。
![](/image/vue/compd.jpg)
#### 使用场景：数据联动
数据联动时，使用computed。

### 数据监听器 watch
#### 可监听的数据
可以监听 vue实例中的data和computed内的数据变化，当变化时，定义自定义事件。
#### 使用场景：异步请求
类似 react hooks 中的effect 依赖一些如参，根据如参是否变化，决定是否重新post请求。
#### 如参分别为newVal，oldValue
如题

#### computed与watch区别
前者可监听多个变量，后者只能监听一个变量变化。

#### 复合计算的三种方法(computed\watch\methods)
推荐用computed，其次watch，最次methods。
如下图，
computed 性能最好，最简洁；
watch 因为只能一次监听一个参数，需要写多个监听；
methods 只要vue render时，无论依赖的参数是否变化，都会重新执行一次，性能最差。

![](/image/vue/watch.jpg)

#### computed的get和set
![](/image/vue/setter.jpg)

### this指向与优先级
this指向vue实例，
```
this.namekey 其实是 this.$data.namekey
```
vue底层做了封装，优先去data找然后是 computed， 然后是 methods。

## 基础知识二
### 凡事带v的属性，后面都是js表达式，非字符串
```html
<!-- v-model以 v开头，说明是vue专有属性，被vue封装 names是一个表达式，非字符串，是一个变量 -->
<test-ok v-model="names"></test-ok>
```
### 样式绑定
可通过下面两种方式定义样式。
#### :class
#### :style
#### 二者有对象和数组两种定义方式

### ref
#### 在dom元素中ref指向dom
通过`this.$refs.refName`获取
![](/image/vue/ref1.jpg)
#### 在vue组件中ref指向组件实例
这个实例就是子组件内的this，拥有一切能力：
![](/image/vue/ref2.jpg)

#### props是否带:的区别
给组件test-ok定义props， test值是js表达式，是变量，strtest值是字符串
```
<test-ok :test="names" strtest="names"></test-ok>
```

### 插槽slot
#### slot和默认值
![](/image/vue/slot0.jpg)
#### slot默认值可以是html元素
![](/image/vue/slot-default.jpg)
#### 具名slot
如下，父层定义插槽时，可通过定义name，此时就是具名插槽，可有多个，如果不定义name，那么此插槽则代表父层整个所有插槽，此只有一个。
![](/image/vue/slot.jpg)
#### 不具名插槽只有一个，具名插槽可有多个
参考《具名slot》
#### 作用域插槽(render props模式)
没有用作用域插槽前：
![](/image/vue/slot-pre.jpg)
用之后：
template 与 slot-scope 属于固定写法。这种模式向极了react的render props模式。
![](/image/vue/slot-fn.jpg)

### template组件与v-once
template是vue自带标签，可替换 v-if写法，如下，v-once 用于性能优化，让vue显示隐藏组件时不用卸载，可不用。
![](/image/vue/tep.jpg)
![](/image/vue/slot-pre1.jpg)

### css动画原理
#### vue自带的transition
当元素显示时，将元素放在 transition标签内，vue会给显示当元素，分三个阶段，添加或删除不同的class，以便外部做css动画，这就是动画原理。
如下，是元素显示时，vue给元素添加或删除class的过程：
- 开始时 给元素添加 class fade-enter fade-enter-active，
- 接着 删除 fade-enter， 添加 fade-enter-to class
- 显示到最后，删除class fade-enter-to fade-enter-active

在以上过程中，给不同的class定义不同的css，就可以做动画。
![](/image/vue/css1.jpg)
#### 显示时的过程
参考上面《vue自带的transition》
#### 隐藏时的过程
![](/image/vue/css3.jpg)
#### 自定义class name
classname可以根据 transition的name来定义，如果未定义name，默认为v，也就是v-enter。
![](/image/vue/css2.jpg)
默认class name 以及动画样式处理：
![](/image/vue/css4.jpg)
如下，定义enter-active-class props 可完全重写对应class，如下是结合animate.css库做的动画
![](/image/vue/css5.jpg)

#### transition标签自带的事件
vue给transition标签绑定了一些时间，用于更好的做动画，更多可网上查阅。
参考下面《slot来动画封装》

#### 结合animate.css库做的动画
参考上面的《自定义class name》

#### v-if与v-show效果一样
transition的显示隐藏效果，主要是结合 v-if 或 v-show 来使用（待进一步验证）。
此二者都可以显示隐藏，用在动画上效果一致。

#### 列表增加、删除过渡动画(transition-group)
transition-group 是vue用来做列表添加或删除某条数据时，过渡动画，其原理如下图：
![](/image/vue/css6.jpg)

#### slot来动画封装(render props模式)
使用插槽render props模式，或类似高阶组件，同时用transition自带的绑定事件来写css：
貌似这个动画只在v-if有效，在v-show下无效，原因待研究。
![](/image/vue/css-fn1.jpg)
![](/image/vue/css-fn2.jpg)
## 黑知识
### 列表渲染
#### 操作数组进行列表渲染时，必须用vue指定方法或改变引用
指定的方法有七种，可看vue官网，也可以改变数组的引用。
如果通过下标改变数组，是不会触发重新渲染，估计vue底层也是通过比较两次props是否相同。
#### 占位符
如果列表渲染时，要同时渲染多种情况，又不想在外层加div，可用占位符template
![](/image/vue/template-list.jpg)
#### 可通过对象渲染
可直接通过改变属性内容，更新渲染，可能是数据劫持的运用；
**如果要新增属性，必须改变对象引用**

![](/image/vue/list-obj.jpg)

#### Vue.set 与 vm.$set 设置对象或数组
除上面说的方法外，可通过Vue.set 与 vm.$set来改变数组或对象重新渲染。

### Vue.set 与 vm.$set
二者是一样的，一般，如果Vue提供了某方法，那么vue的实例中，也会有此方法，不过方法名前需要加$。

### Vue中有的在实例中基本也有，名字前加$
Vue中有的方法在实例中基本也有，名字前加$， 如 Vue.set 与 vm.$set

### 用is重命名解决渲染异常
#### 异常描述
下面渲染异常，渲染位置跑跑偏了：
```html
<div id="root">
        <table>
            <tbody>
                <!-- 异常渲染，因为h5规范 要求tbody下面必须是tr标签 -->
                <row></row>
                <row></row>
                <row></row>
            </tbody>
        </table>
    </div>
    <script>
        Vue.component('row', {
            template:'<tr><td>this is wor</td></tr>'
        })
        var vm = new Vue({
            el:"#root"
        })
    </script>
```
![](/image/vue/black.jpg)

#### 用is重命名解决
其他代码不变，改变如下部分，is很类似es6 的 import as 或es6的重命名：
```html
<tbody>
      <tr is="row"></tr>
      <tr is="row"></tr>
      <tr is="row"></tr>
  </tbody>
```
#### ol ul select问题以此类推
异常渲染，因为h5规范 要求tbody下面必须是tr标签，ol ul 后可能也必须使用li，select后必须使用option等等，遇到问题可这样分析。

### 子组件data必须是函数
如下，在根组件上data写成对象是没有问题的，但子组件必须是函数，这是因为子组件可能会被父组件使用很多次，
为了避免对象引用带来的问题，要求data每次都是最新的，因此通过执行函数，每次获得的是新对象，避免了同一个对象引用的问题。
![](/image/vue/black-child.jpg)

### 组件参数校验
#### 单个用字符串
#### 多个类型用数组
![](/image/vue/props1.jpg)
#### 定义required与defaultValue
![](/image/vue/props2.jpg)
#### 自定义验证validator规则
如上面的图片

### props特性与非props特性
在vue中，props不会显示在子组件的dom上。非props会显示在子组件最外层的dom属性上。
非props属性是，定义子组件时定义的属性，但在子组件内没有声明为props的属性，是为非props。
下面content就是非props。
![](/image/vue/noprops.jpg)

### 给组件绑定原生事件
如下，不是原生事件，如何绑定呢，使用`@click.native="handleClick"`
![](/image/vue/event-native.jpg)

### 非父子组件传值
非父子组件传值，可通过vuex，也可以通过面向对象的继承模式，结合事件绑定(观察者模式)来做。
这种做法也叫 bus／总线 传值。

这种方式与window的事件监听也类似，估计用vue自带的事件监听方式，做了很多优化。
![](/image/vue/value-event.jpg)



## vue-cli
### vue-cli的vue文件写法
#### 示例
![](/image/vue/use.jpg)
![](/image/vue/template.jpg)
#### data要写成函数
在vue-cli开发中data需要定义成一个函数。
原来非vue-cli写法是data是对象。
```
data : function() {
    return {
        inputValue: ''
    }
}
```
### 两种创建工程的方法
#### vue create命令
```
vue create hello-world
```
#### vue ui 界面
这是将上面 vue create 命令行操作进行可视化配置的改进。
```
vue ui
```

## router
### 简单示例
index.html:
![](/image/vue/router-index.jpg)
main.js:
![](/image/vue/router-main.jpg)
app.vue:
![](/image/vue/router.jpg)
router.js:
![](/image/vue/router1.jpg)
Info.vue:
![](/image/vue/router2.jpg)
页面展示：
![](/image/vue/router3.jpg)

### 在vue实例中使用router能力
```js
this.$router.push('./home')
```

## vuex
### 简单示例
```js
//一、Vuex全局状态管理定义

import Vue from 'vue'
//1.导入vuex
import Vuex from 'vuex'

//2.use
Vue.use(Vuex)

export default new Vuex.Store({
//3.vuex 状态
  state: {
    count: 0
  },
  //4.只有使用mutations 改变state值
  mutations: {
    increase: function () {
      this.state.count++
    }
  },
  actions: {
  },
  modules: {
  }
})


//二、使用

//1.导入store/index.js
import store from '../store/index.js'
export default {
  name: 'Info',
  //2.引入store
  store,
  data: function () {
    return {
        msg: store.state.count
    }
  },
  methods: {
    add () {
    //3.通过store.commit('mutations内方法名')
      store.commit('increase')
    }
  }
}
```

### vuex的store一般跟computed或watch一起使用？
因为computed或watch会监听变化。
为什么有时候也用在data上呢，todo 待研究。
```js
//1.导入store/index.js
import store from '../store/index.js'
export default {
  name: 'Info',
  //2.引入store
  store,
  computed: {
    msg(){
      return store.state.count
    }
  },
 
}
```








## 定义组件
### 全局组件
![](/image/vue/global.jpg)
### 定义props
#### 在创建组件的地方声明有哪些props
后在创建组件的地方，通过定义props数组，声明使用了哪些prop
#### 组件template内通过插值方式使用props
这个template就是一个组件所有内容方式，每个组件又是一个vue实例，拥有vue所有能力
#### 在调用组件地方:props方式使用和传值
在调用组件地方，通过 :props 传值
#### 每个组件又是一个vue实例，拥有vue所有能力
参考上面

### 定义各种属性的方式
#### 定义普通props用:props
#### 定义自定义事件用@props

### 子组件如何改变父组件值
#### 概述
通过给子组件定义自定义事件，将父组件的方法传给自定义事件，方式与react相同。
![](/image/vue/event.jpg)
#### $emit
使用$emit触发事件。


### 局部组件
![](/image/vue/part.jpg)

### template、dom节点关系、vue实例、组件
每个vue实例都有一个template，
如果此实例没有template，实例会去挂载点找，挂载点内部所有的dom节点就是template。
一般说根vue实例定义了挂载点，所以不用定义template。
组件一般不定义挂载点，而是直接定义template


## 其他
### npm script方式
![](/image/vue/npm.jpg)

### vue调试

#### 定义var，控制台测试
如图，将vue实例定义成一个变量，然后在控制台拿这个变量进行一系列设置值的操作：
![](/image/vue/debug.jpg)

#### mounted 内定义 window.vue=this;
如题，在控制台不用断点，就可以通过window.vue拿到vue实例。















