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















