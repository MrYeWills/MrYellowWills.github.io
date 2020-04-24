---
title: react中的表单处理
date: {{ date }}
tags: [form, react]
categories: 
- react
---


## 不封装form可以吗
很多人第一印象觉得有UI框架如ant-design，或者bootstrap，就不需要二次封装form了，其实不然。
如果不封装form，你只有一个UI库给你，你引入input select 等组件后，
需要自己做以下事情：
- 每个filed写value onChange
- 要写validate
- 要写样式
- 要写 submit 逻辑，如果是pop，还要写hide close；

上面这些，就算你咬着牙写完了一个表单，下一个表单你一切还得重新来，因此为项目二次封装抽象这些公共逻辑势在必行。
说得直白点，你还要抽象form的一些公共逻辑，封装得越好，项目开发起来就越爽，越快。
要想抽象form的公共逻辑，那么你必须要深刻认识form。

## 认识form很重要
### 每个filed都有value onchange
在form中，input，select，checkbox，等等，都包含了 value onchange 熟悉；
因此，可以为每个filed抽象出value、onchange逻辑；
### validate
一般表单验证都是即时验证，也就是输入框实时输入时就要验证；
有些还要加一个提交时再验证，做一个双保险。
### validate的error信息显示
这个跟validate基本属于同一个问题。
### 实时form值
要有一个公共的form值，实时反应各个field的值。
### reset
大多form都有一个reset功能

## 设计模式很重要
每次field改变后，如何让form响应变动渲染最新的值呢。
一般有两种模式：将form定义为完全受控组件；让form存储自己的状态；
### 将form定义为完全受控组件
这种设计模式是最直观的，给form定义一个value和onchange，form内任何一个filed改变时都触发这个onchange，这个onchange改变整个form值。
这种模式有个特点，它的value值是整个form值，因此是一个对象。
### 让form存储自己的状态(推荐)
#### 如何在父层获取form的state
这种设计模式要求form维护自己的状态，首先我们想到的是，设置一个state，这个state包含了各个filed的值。但这样但花就有个问题在于在form的父层无法实时获取form值。
#### 改变state的同时，修改存储store
解决之道在于定义一个公共的store，每次filed改变state值的时候，同时改变store。
form渲染使用state，外层提交使用store，而这个store由父层构造而来，那么内部渲染和外部数据使用都兼顾了。
## 方案的实施
### 选定方案--让form存储自己的状态
我们一般选用上面的《让form存储自己的状态(推荐)》这种模式。**下面的讲解都以此模式展开**，
**本实施方案，参考博客[ React 实现高度简洁的 Form 组件 ](https://zhuanlan.zhihu.com/p/57820186)**，以下如有疑问，可查阅此博客
### 设计filed
filed都由一个value 和 onchange，还有一个errortip，而value和errortip都是由onchange触发生成。
此时我们给filed传递一个预设的store，在store中有一个filed onchange 方法，我们叫做store.set，此方法每次都改变value和errortip值，同时将这些值存储到store中。
### 即时验证
见《设计filed》
### 生成error tip
见《设计filed》
### 预设store
上面说到了预设的store，在这个store中我们的主要任务是，实时改变store的value和error值，并暴露出相关API给上面的《设计filed》使用。由此可见，我们将validate 实时存储的逻辑抽象到了store中。
### 如何传递store
上面看到了filed用到了store，如何将store传给filed呢，我们的做法是，在父层new 一个store，让这个store作为props传递给form，form拿到这个store设置为contex，form下面的所有组件都可以使用此context
### 天花板式的第三方包与功能
我们先分析下(让form存储自己的状态)的模式：
- 为了让父层拿到实时的form值，我们必须在父层给构造一个store对象，用于存储form值；--天花板
- store与from进行互动，以便存储值(把store对象传递给form，form在与store沟通时，将值顺利存储到store)；--第三方包与程序
上面的第一步，我们要在父层定义store，父层就是天花板，这个store就类似一个d3.js第三方包，form值的获取就好比用d3框架画出的各式各样的绘图，form必须遵守d3的API才能正确画图，这画出来的图就是做出来的功能。
(让form存储自己的状态)的模式他的设计思想 跟 天花板式的第三方包与功能及其相似。
你开发一个form框架，然后在filed中使用这个框架。
### 为什么不把 store与filed直接结合一起
为什么不把 store与filed直接结合一起，或者store集成到filed上，不用在父层传递store。
原因就是刚才说到的：为了让父层拿到实时的form值，我们必须在父层给构造一个store对象，用于存储form值。
### 各个元素如何排版布局
每个filed的html如下，因为html是固定的，因此可以统一制定好样式：
```html
 <div className="form">
      <label className="form__label">{label}</label>
      <div className="form__content">
        <div className="form__control">{child}</div>
        <div className="form__message">{error}</div>
      </div>
    </div>
```
### 注入验证规则
```js
new FormStore({/* 初始值 */, {
  username: (val) => !!val.trim() || '用户名不能为空',
  password: (val) => !!(val.length > 6 && val.length < 18) || '密码长度必须大于6个字符，小于18个字符',
  passwordAgain: (val, vals) => val === vals.password || '两次输入密码不一致'
}})
```
### 未说细节
将filed的onchange逻辑使用一个替身listen代替，采用（取消）订阅方式，执行此onchange等一系列动作。详见博客[React 实现高度简洁的 Form 组件 ](https://zhuanlan.zhihu.com/p/57820186)。

### 小结与代码
封装这个表单：
- 要封装一个store，这一部分是纯js逻辑处理；
- 要封装一个公共的filed，以便抽取filed公共的逻辑到filed，这一部分采用组合模式设计；
- 要封装一个form，这个form要配合filed和父层的引用；
具体代码如下：
```js
//store
class FormStore {
  // constructor ...
  // subscribe ...
  // notify ...
  // 获取表单值
  get(name) {
    // 如果传入name，返回对应的表单值，否则返回整个表单的值
    return name === undefined ? this.values : this.values[name];
  }
  // 设置表单值
  set(name, value) {
    //如果指定了name
    if (typeof name === "string") {
      // 设置name对应的值
      this.values[name] = value;
      // 执行表单校验，见下
      this.validate(name);
      // 通知表单变动
      this.notify(name);
    }

    // 批量设置表单值
    else if (name) {
      const values = name;
      Object.keys(values).forEach(key => this.set(key, values[key]));
    }
  }
  // 重置表单值
  reset() {
    // 清空错误信息
    this.errors = {};
    // 重置默认值
    this.values = deepCopy(this.defaultValues);
    // 执行通知
    this.notify("*");
  }
}
```
```js
//filed
function getValueFromEvent(e) {
  return e && e.target
    ? e.target.type === "checkbox"
      ? e.target.checked
      : e.target.value
    : e;
}

function Field(props) {
  const { label, name, children } = props;

  // 拿到Form传下来的FormStore实例
  const store = React.useContext(FormStoreContext);

  // 组件内部状态，用于触发组件的重新渲染
  const [value, setValue] = React.useState(
    name && store ? store.get(name) : undefined
  );
  const [error, setError] = React.useState(
    name && store ? store.error(name) : undefined
  );

  // 表单组件onChange事件，用于从事件中取得表单值
  const onChange = React.useCallback(
    (...args) => name && store && store.set(name, valueGetter(...args)),
    [name, store]
  );

  // 订阅表单数据变动
  React.useEffect(() => {
    if (!name || !store) return;

    return store.subscribe(n => {
      // 当前name的数据发生了变动，获取数据并重新渲染
      if (n === name || n === "*") {
        setValue(store.get(name));
        setError(store.error(name));
      }
    });
  }, [name, store]);

  let child = children;

  // 如果children是一个合法的组件，传入value和onChange
  if (name && store && React.isValidElement(child)) {
    const childProps = { value, onChange };
    child = React.cloneElement(child, childProps);
  }

  // 表单结构，具体的样式就不贴出来了
  return (
    <div className="form">
      <label className="form__label">{label}</label>
      <div className="form__content">
        <div className="form__control">{child}</div>
        <div className="form__message">{error}</div>
      </div>
    </div>
  );
}
```
```js
//form
const FormStoreContext = React.createContext(undefined);
function Form(props) {
  const { store, children, onSubmit } = props;
  return (
    <FormStoreContext.Provider value={store}>
      <form onSubmit={onSubmit}>{children}</form>
    </FormStoreContext.Provider>
  );
}
```

使用：
```js
class App extends React.Component {
  constructor(props) {
    super(props);

    this.store = new FormStore();
  }

  onSubmit = () => {
    const data = this.store.get();
    // ...
  };

  render() {
    return (
      <Form store={this.store} onSubmit={this.onSubmit}>
        <Field name="username">
          <input />
        </Field>
        <Field name="password">
          <input type="password" />
        </Field>
        <button>Submit</button>
      </Form>
    );
  }
}
```
### 优化与不足
本方案实施主要是针对 [React 实现高度简洁的 Form 组件 ](https://zhuanlan.zhihu.com/p/57820186) 博客的解读。
我觉得这里有几块可以优化的，
#### 动态生成表单
上面博客中，使用如下：
```jsx
<Field name="password" label="密码">
    <input type="password" />
</Field>
```
在filed中转化为：
```jsx
  return (
    <div className="form">
      <label className="form__label">{label}</label>
      <div className="form__content">
        <div className="form__control">{child}</div>
        <div className="form__message">{error}</div>
      </div>
    </div>
  );
```
因此filed只需要知道 name type label这三个信息，因此完全可以以json的方式传递给form，动态生成表单。
#### 联动、自定义 设计不足
通篇博客读下来，没看到对联动做的逻辑封装。

## 动态表单
### 概述
无论是传统的html方式使用form，还是配置化的生成表单方式，都是基于以上设计模式上的扩展。动态表单的优点在于，快捷生成表单，就好像使用json通过模版引擎批量生成表单一样，非常爽。
但是动态表单在设计上都有一个痛点在于 如何联动与自定义需求。
### 联动与自定义需求














