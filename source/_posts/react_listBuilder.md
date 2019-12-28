---
title: ListBuilder引发的React暗黑思考
date: {{ date }}
tags: react
categories: 
- react
series: 前端框架
---


## edit与search的无法调和是一切暗黑的源头
### 需求：edit 与 search 功能
场景为：edit 功能只能定义在业务组建内，且 edit 功能每次都要setState ListBuilder的data。
**search功能必须放在ListBuilder内**，search功能每次也要改变ListBuilder的data。

### 为什么无法调和
二者无法调和是在于，edit与search要求同时都完全控制state，但edit必须位于组件外层，search必须位于组件内层，
由于edit位于外层，你必须将listBuilder组件做成完全受控组件，要求组件内部使用props渲染；
由于search位于内层，且要求完全操控数据，因为组件必须做成state方式，不能响应外层props数据变动；
解决方法（也是下面的 **终极方案**）：
- 将组件做成完全受控，完成edit功能；
- 将组件的数据做成对象方式，search时，实时改动对象，利用对象引用特征，改动完后 使用forceUpdate，渲染组件，在render上每次 function重新组件props数据；

这样组件就可以同时响应edit和search的变动。

### 方案一(否定)
search和edit都放在业务组建内写，此时就不会有问题，但是明显违背了上面说的 **search功能必须放在ListBuilder内**。此方案不行。
### 方案二(否定)
在ListBuilder内部维护state，同时用 getDerivedStateFromProps 让ListBuilder组件完全受控：
```js
static getDerivedStateFromProps(props,state){    
    if(props.value !== state.value){      
        return {        
            value:props.value      
        }    
    }    
    return null
}
```
如上，我们通过edit 来维护props，用search 维护自身的state，这样说起来，貌似完美解决来问题。
但你注意看上面的代码，你会发现，这种模式有一下弊端：
- 我们希望是当有props改动的时候，state值为props；state自身改动时，state值响应为自身state；但上面的getDerivedStateFromProps代码实际上只响应props，state完全响应props的变化，自身state的值无法注入给自己。
- 就算通过各种if else 让组件能够达到同时响应props和state，这个过程痛苦不说，也会有很多弊端，其中之一就是，父层如何实时知道ListBuilder最新渲染的data值。
- 这种写出来的组件，后期扩展时同时要测试 getDerivedStateFromProps，麻烦不说，还容易出现意想不到的bug。
### 终极方案--forceUpdate+实时生成render最新props+对象引用
已知，data为下面的形式：
```js
const data = [
    {name: 'row1', value: 'r1'},
    {name: 'row2', value: 'r3'},
]
```
以上方案都不行，还有什么方法了，没办法，只能开启暗黑方式了：
- 我们可以在 edit 时还是setState ListBuilder的data，
- 然后在ListBuilder组件内部，search功能时，我们给data的每条数据`{name: 'row1', value: 'r1'}`，添加一个 visable属性，按条件重置为true或false，
```js
const data = [
    {name: 'row1', value: 'r1', visable: true},
    {name: 'row2', value: 'r3', visable: false},
]
```
- search完后，在ListBuilder内部，执行一次，此时ListBuilder内部render函数就会执行。
```js
this.forceUpdate()
```
- 然后在ListBuilder的内部render方法内定义一个function，过滤掉false的，只留下 `visable: true`;
- 由于search操作的是data内的每条数据，而每条数据又是一个对象，利用对象的引用类型特性，一处改变，其他地方都会改变，因此根本不需要setState，在render使用data放在function上过滤时，就已经有visable属性了。
- 这样给render内的组件如(grid 或 TreeList)传的值就达到预期要求。

这一种方案太妙了，因为其功能的强大性，用起来很爽，但又是一种反模式运用，让用起来的时候很由于，故称暗黑。

这种方案，关键在于利用了对象引用特征，在修改完数据后，使用forceUpdate，触发render，然后在render中 实时生成props.

### 完全受控组件如何自己改变状态
上面的《终极方案--forceUpdate+实时生成render最新props+对象引用》为我们提供了一种思路，当我们面临 像上面需求一样，
父层要实时操控一个完全受控的子组件，而完全受控的子组件同时又想在内部自己改变状态。
此时我们可以像上面一样，利用引用类型特性，render时每次生成最新状态的方案。
### 如何让父组件和子组件同时可以改变子组件的state
其实我们也可以这样描述上面的需要，如何让父组件和子组件同时可以改变子组件的state。
### setState之外的setState方案
我们可以将上面 《终极方案--forceUpdate+实时生成render最新props+对象引用》称之为 setState之外的setState方案，毕竟它让ListBuilder内部实现了一次setState，而又不通过任何setState方法。
### 如果data的每条数据是一个字符串
如下，如题，此时，我们可以将data在使用之前使用一个方法将data转化为一个每条数据为对象的data结构，然后就可以使用上面的方案了。
```js
const data = ['row1', 'row2']
```
## listRow
### 需求：内容可以是TreeList 与 Grid
由 《edit与search的无法调和是一切暗黑的源头》决定了 demo采用 《终极方案--forceUpdate+实时生成render最新props+对象引用》的方式。
接着考虑下面的需求：ListBuilder内的组件可以是 TreeList 与 Grid，且 ListBuilder要将向左向右移动的公共逻辑抽象出来。
### TreeList与Grid数据结构不一样
此时我们面临着一个问题，TreeList与Grid的数据结构是不一样的：
```js

const gridData = [
    {name: 'row1', value: 'r1', visable: ture},
    {name: 'row2', value: 'r3', visable: false},
]
const treeData = [
    {isBranch: true, name: 'branch-name', children: ['tree-cell1']},
    {isBranch: false, name: 'tree-cell1'},
]
```
### ListBuilder向左\右移动逻辑不需关心数据结构
不过另外一个方面，向左，向右但移动逻辑根本不需要关心TreeList与Grid所用的数据结构，我们是不是可以新建一种专门用于左右移动的数据结构呢。在ListBuilder内使用ListRow数据的state进行左右移动，在给具体TreeList、Grid时，在Render函数内，将ListRow转换为上面格式的gridData、treeData。
基于此想法，我们创建了ListRow这种数据结构。

### 创建ListRow的data
```js
class ListRow{
    constructor(key, row){
        this.dataRow= row;
        this._id_ = key;
        this.visable = false;
    }
}

data = data.map(row=>{
    const newRow = new ListRow(row);
    newRow.visable = true;
    return newRow;
})
```
### 标记删除而不直接删除 - 左右移动
由于我们在render的时候总是通过function 读取 data，重新生成 grid等真正使用的data，所以，我们并不需要直接删除data，而只需给data内的ListRow加一个visable属性，来标记删除。
### visable可用于search、左右移动。
见上面的分析。
### 必须配合render时实时重新生成props
由上面分析可知，专门创建一个ListRow数据来做左右移动，然后在render的时候，必须同时使用function重新生成Grid或TreeList需要的数据，以传给它们。

### ListRow的好处
#### 隔绝了业务逻辑影响
创建一个listRow后，ListBuilder组件不需要关心业务当中到底是Grid或TreeList。
#### ListBuilder可凭ListRow专心抽象公共逻辑
ListRow是专门为了search、左右移动而创建的数据结构，ListBuilder可以因此专心抽象这部分的公共逻辑。
#### 注意，必须配合render时实时重新生成props
这不是listRow的好处，但此时再次提醒，说明了创建ListRow的代价也好，使用特点也好，都render具体组件时，都需要render函数内实时重新生成props。
![](/image/react/list_row.jpg)
### 使用特点与弊端
参考 《ListRow的好处 --- 注意，必须配合render时实时重新生成props》，render函数内实时重新生成props是一种反模式运用。可能也是一个弊端，但当前浏览器对于同步代码执行效率太好，感觉总是谈性能的，就好像一个伪命题一样
## 组件的模版设计
### 组件模版设计图
![](/image/react/comp.jpg)
### 暴露给外层的设计
如上图，因为ListBuilder在内部会封装左右移动，所以外层使用的时候，只需定义业务组件的grid等等这些左右两边面板。
### ListBuilder本身设计
此处抽象左右移动的公共逻辑
### listPanel设计
#### 介绍
面板的渲染统统在ListPanel组件内，不同的业务组件，如Grid、TreeList，在render函数内，在此使用一个function 生成对应的props，
#### render实时重新生成props的好处
listPanel组件内可以非常方便地获取ListBuilder所有的信息，在实时生成props时，比如生成双击事件的props时，可以将ListBuilder所有的信息可以非常方便的传给双击事件这个props属性。
#### 业务代码通过function config注入
Grid、TreeList组件的特定props(业务层面逻辑)可在此通过config配置的方式注入，由render 时，每次执行function(config)注入。
```js
//ListPanel
render(){
  const allProps = Fn(config)
  return (
    <div>
      <SearchBox />
      <Grid {...allProps} />
    </div>
  )
}
```

## React.cloneElement
### cloneElement让模版设计成为可能
#### 只要传组件进来，我就能给你组装
无论你通过什么方式将组件传给ListBuilder，通过props也好，还是child也好，在ListBuilder内部都可以通过React.cloneElement将组件再次组装，重新render。
#### cloneElement再次组装props非常方便
这是cloneElement的特性。
### cloneElement的其他好处
#### 很方便地给props增加其他组件的数据
比如可以很方便地将父层的function，state，props，注入到被组装的组件中。

## 小技巧
### props同时为function和string
比如给一个ListRow指定一个唯一Id，假如有identity 这个props，定义identity为 str时， id为 `ListRow[identity]`,当为function时，id为identity(ListRow).
我们在设置props属性时，一般希望此属性最好是一种类型，不要设置多种，但是可以function是一个例外，可以给props设置多一个function属性，因为很function让程序**更灵活，扩展性强**。
```
const {identity} = this.props;
typeof identity === 'function' ? identity(ListRow) : ListRow[identity]
```
### map的使用
如果左右两边的数据有映射关系，要关注下map的方式来做数据映射信息存储。

## 小结
listBuilder最精彩的运用之一在于：
- 通过render实时生成最新props代替setState，
- 通过创建一个全新的数据结构ListRow 来隔离业务逻辑，专心公共逻辑的抽象
- React.cloneElement精彩运用
- 不要认为render实时生成最新props会影响性能，要想功能丰富，可以考虑此方案。
  诚然，这样写，会导致多次渲染和不必要计算，貌似会影响性能，但相比高效的浏览器来，静态代码的执行，可能是一个伪命题。


