---
title: React 笔记
date: {{ date }}
tags: react
categories: 
- react
series: 前端框架
---


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
![](/image/react/hoc2.jpg)
![](/image/react/hoc1.jpg)

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

## hooks
![](/image/react/h1.png)
![](/image/react/h2.png)
![](/image/react/h3.png)
![](/image/react/h4.png)
![](/image/react/h5.png)
![](/image/react/h6.png)
![](/image/react/h7.png)
