---
title: EnForm动态表单封装
date: {{ date }}
tags: [form, react]
categories: 
- react
---

## 前言
这次封装，利用的是工作之余，时间难免宝贵，主要注重功能实现，细节或代码风格没有太注重，请忽略之。

## 状态提升的运用
市面上的form封装，基本套路都是，field设置为完全受控组件，将field状态提升至form。
这是form封装方案设计的关键第一步，如果将field设置为非受控组件，后期很多功能实现起来将比较麻烦。

很多人认为，这个状态提升，就应该是提升到form的state中，其实不然，这里又很多套路，自然也就有几种方案：

### 方案一：
#### 概述
状态提升，状态全部存储于form的this内。而非form内的state。
每次field onchange时候，使用form的this，进行 this.forceupdate 或者 this.setState({});
方案代表 是阿里的的 [fusion field](https://github.com/alibaba-fusion/field)，源码不多，有兴趣可以去看看。
我倒是觉得 他们取field这个名字是有歧义的，看fiel的源码，你会发现，这个field更像一个form层面 的 store+field。

这种方案有些人或许会感觉比较怪，其实不然，react-redux 其实是这种方案的最佳实践着，有兴趣可以看看react-redux 源码中connect实现。
在connect中其实也是将状态存储于this中，而非state中，然后通过setState一个空值，触发render。


另外 对于 form封装时，设计一个form store 是一种普遍的设计方式。

#### 经典逻辑抽象分离的实践
[fusion field](https://github.com/alibaba-fusion/field)是经典的逻辑抽象分离实践，以后遇到逻辑抽离的时候，可以参考此源码的实现。
源码主要是订阅模式的一种经典实践。

### 方案二：
状态提升，将状态存储于this中，另外为了让form内的field能够取到状态，在form内设置了context，并将this内的state放置于context中，让所有的子元素包括field都能通过context获取状态。
核心源码不多，有兴趣可以看看。里面对
[alibaba-fusion/next/form](https://github.com/alibaba-fusion/next/tree/master/src/form)
里面用到了对于ReactFragment的判断这点还是挺好，可能是历史原因， fusion／form 必须要配合 上面的 fusion field使用，为了实现自由排列，源码当中大量使用了React.cloneElement来做props注入，在form内使用一次，在field内又使用一次，而且是遍历性质，React.cloneElement固然是一个非常棒的API，前后两次大量使用，感觉每次 field的onchange消耗还是挺多。
```js
const getNewChildren = (children, props) => {
//...
    return React.Children.map(children, child => {
      //对于ReactFragment的判断
        if (obj.isReactFragment(child)) {
            return getNewChildren(child.props.children, props);
        }

        if (
            child &&
            typeof child.type === 'function' &&
            child.type._typeMark === 'form_item'
        ) {
     // ...
            return React.cloneElement(child, pickerDefined(childrenProps));
        }
        return child;
    });
};

```

### 方案三：(EnForm使用方案)
状态提升，将状态存储于state内，为了兼容自由排列，当form使用自由排列模式时，对form做context，将form的state放置于context中传递给field。
这是我本次form封装的方案，因为一开始就是这样设计的，所有就按这样的方式封装了，
后面了解到了上面的方案一、方案二，所以，如果重新来过，我可能会尝试将状态放置于this中，设计一次。

另外上面两种方案的代表框架 fusion field 与 alibaba-fusion/next/form 之所以没能够实现配置化生成表单，主要是他们无法从业务层面对form内的各种type field 比如input select 进行二次封装。
而我这次封装form的同时，也封装了EnInput， EnSelect，所以支持了配置化生成表单。

### 状态提升存于this 配合forceUpdate
这种方式是 方案一和方案二使用的，也是react-redux，这些有名开源框架使用的，所以以后在开发的时候，设计复杂组件时，这种方式不失为一种选择。应该熟练运用好这种方式。


下面是form介绍一些form功能的细节分析与实现：

## form的三个state
没有封装form前，可能以为form有很多七七八八的状态，其实，form就三个状态需要维护，就可以基本覆盖form绝大部分功能点，
这就是上面所说的状态提升后的三个状态：
- errMsgs -- 用来控制错误信息
- formValue  -- 用来控制form value值
- formDisplay  -- 用来控制field的显示、隐藏、删除、readonly、disabled，之所以把这个显示信息的状态
由field提升到form上，因为提升到form后，所有的filed都能共享这一信息，并且修改；

## 认识表单中的元素

### 操作form数据的
这类field会改变form value值，包含常规与自定义 field。
#### 常规field
#### 自定义field
### 依赖form数据做操作的
比如需要根据最新form value ，进行发送请求的field。
这部分元素 不会改变form值，但需要知道form的值做操作。
这类可以定义为自定义field。使用config的Render实现。

### 与form无数据交互
比如form的title，或者一些提示语句，分割线，icon 等等。
这类元素，根据情况，可以定义为自定义field，也可以使用自由排列模式下form实现。

## 单独提取Field
无论是常规field还是自定义field，可能做的事情，都与与上面的form的三个状态有关：

### 常规field做的事情
- 设置form的新的value值；
- 设置form的新的验证error信息；

### 自定义field做的事情
#### 概述
- 设置form的新的value值；
- 设置form的新的验证error信息；
- 隐藏(删除)／显示field， readonly／disable field；

#### 关于验证的思考
由于验证是以value的参考标准的，不会考虑该组件是否为自定义或标准组件，所以自定义组件的验证，基本上不用重新设计，套用整体的验证即可；

### 每个field的name唯一性

## validate
### filed 的rule可能有多个
因为有多个，所以每个field的validate应该是遍历的方式去验证每个rule。
### validate 增加相关联映射 filed 检测
目前觉得最优解方案是定义自定义validate的时候，写明依赖的组件；
两个相互依赖检测的组件，都按常规定义好验证方法和依赖组件，虽然验证方法可能是互斥；
但考虑到依赖的关系可能并非两个field的关系，可能是三个field，这个时候，验证方法可能不会是互斥关系；
此时就需要最后按常规每个field下都定义好验证方法。
而且这种自定义方式不会出现很多，所以没必要做一层互斥优化。
相关方法为源码中的：
```js
class ValidateHelper{
    constructor(formConfig){
            this.relateFieldMaps = this.getRelateFieldMap(formConfig);
        }
        return ValidateHelper.instance;
    }
    getRelateFieldMap = (formConfig)=>{
  
    }
}
```
自定义规则写法：
```js
{   name: 'region',
    title: 'region',
    type: 'select',
    defaultValue:'',
    validate:[
        [
            (value,formValue)=>{
                if(String(value).length< String(formValue['useName']).length){
                  return 'no small useName';
                }
            return ''
            }, 
            //希望同时验证 useName 的验证规则
            ['useName']
         ]
    ],
```

### validate form 与 field的不同
validate form的时候，是对所有field的全量验证，不需要考虑每个field验证的依赖映射关系；
单个field onchange 验证的时候，考虑性能，不对整个form进行检测，而只检测当前field的规则 和 与field验证有关联映射关系的field的验证。

### 验证触发策略
#### 即时验证 (EnForm使用的策略)
当form没有submit时候，不验证，submit后，开始验证，然后以后每次field onchange都验证。

#### 失焦验证
如题。
#### 开启验证的开关
这个根据项目需求来定，有些项目是上面说的即时验证，没有submit前，不进行验证。
有些项目不易submit为准，当表单打开时不验证，当光标focus 一个field，然后触发onblur的时候，就进行验证，无论submit与否。
简单的说，有些以submit开启验证，有些直接以onlbur开启验证。

可以根据项目需求，定制验证触发机制。

## field type组件二次封装
如上面《状态提升的运用  --  方案三》分析的，这是实现config 配置化的临门一脚 不可或缺一步。

## 默认排版样式
默认排版的设计，结合了一些工作经验，当超过8个field时，会加一列实现。
```js
export const getColumnLength = (length, rows)=>{
  const columnLength = length/rows;
  const num = length%rows;
  if(num === 0) return columnLength;
  if(length > rows*columnLength) return columnLength+1;
  return columnLength;
}

// eslint-disable-next-line import/prefer-default-export
export const getLayout = (fields, rowsLength)=>{
  const columnLength = getColumnLength(fields.length, rowsLength);
  const layouts = [];
  let index = 0;
  while(index < columnLength){
    const lastIndex = rowsLength*(index+1)-1;
    if(index === columnLength -1 ) lastIndex = fields.length-1;
    layouts.push(
      <section className="column" key={index}>
        {fields.slice(rowsLength*index, lastIndex)}
      </section>
    )
    index++;
  }
  return layouts;
}
```

## 源码与demo

[github EnForm源码](https://github.com/YeWills/react-redux-hooks-demo/tree/context-form/src/components/EnForm)

[github demo](https://github.com/YeWills/react-redux-hooks-demo/tree/context-form)


## 放弃的方案
为了实现又能配置化，又能自由排列，想了很多方案，刚开始用的 React.cloneElement 方案，也可以达到这一目的，不过局限性比较多，这个方案的亮点在于，
不仅通过 React.cloneElement 改变了当前元素的props，而且找到了一种通过React.cloneElement改变当前元素的子元素的props的方法，以下是这一方案的一些分析，权当灵感式的头脑风暴：

### 有限度的自由排列布局
#### field最多只能在在第二层
如果要使用form自带（含自定义）的field，就必须使用将field放在最多第二层级上，
否则form内将不识别；
```js
      <div >
          <EnForm.Field className="form-cell" enfield name="editname" />
        </div>
        <p>天若有情天亦老</p>
        <EnForm.Field className="form-cell" enfield name="useName" />
        <div className="region">
          <div>test</div>
          <EnForm.Field className="form-cell" enfield name="region" />
          <div>test</div>
          <EnForm.Field className="form-cell" enfield name="passWord" />
        </div>
        <EnForm.Field className="form-cell" enfield name="select" />
```
逻辑实现如下：
```js
content = children.map((cell, index)=>{
    if(cell.props.enfield){
      return React.cloneElement(cell,  getProps(cell.props))
    }
    const cellChilds = toArray(cell.props.children);
    if(!cellChilds.find(t=> _.get(t,'props.enfield'))) return cell;
    const newChildren = cellChilds.map((t)=>{
      if(_.get(t,'props.enfield')){
        return React.cloneElement(t,  getProps(t.props))
      }
      return t;
    })
    return React.cloneElement(cell, {...cell.props, children:newChildren, key:index});
  })
```

#### 为什么不要超过两层
这个思路就跟react hooks，必须定义在顶层一样，
太多递归遍历是消耗性能的，而且定义在两层，基本上达到了百分之九十以上的自由排列field的需求。
剩下百分之十不到的，就不用管了。

#### 可以超过两层定义field吗
原则上是可以的，但是会导致深度copy的问题，可能就会消耗性能，这样就没有必要了，
此时不如手写一版form。

### 无限度的自由排列布局
将任意想排列的样子定义在自定义field内，再配合有限度自由排列的方案，
可轻易达到大部分的自由排列需求。

### 源码
[github](https://github.com/YeWills/react-redux-hooks-demo/tree/blog-form)
