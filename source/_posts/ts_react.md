---
title: ts与react
date: 2021/7/22
tags: [typescript, react]
categories: 
- typescript
series: typescript
---
## 示例

### useRef

#### HTMLInputElement 待研究 todo
```ts
import React, { useState, useEffect, useRef, useContext } from 'react'
const LikeButton: React.FC = () => {
  const likeRef = useRef(0) //这个不用加类型，传入初始值是0，默认为number类型
  const domRef = useRef<HTMLInputElement>(null) //null 无法让ts猜测类型，因此要定义类型
  useEffect(() => {
    if (domRef && domRef.current) {
      domRef.current.focus()
    }
  })
  return (
    <>
    <input type="text" ref={domRef} />
    </>
  )
}
export default LikeButton
```

点击`useRef<HTMLInputElement>(null)`中的`useRef` ，跳转声明文件
```js
 interface RefObject<T> {
        readonly current: T | null;
    }
  
 function useRef<T>(initialValue: T|null): RefObject<T>;
 ```

### 对象Object

#### 定义key类型，value类型
 ```js
 interface IThemeProps {
  [key: string]: {color: string; background: string;}
}
const themes: IThemeProps = {
 'light': {
   color: '#000',
   background: '#eee',
 },
 'dark': {
    color: '#fff',
    background: '#222',
  }
}
```

### state
解决 this.state.like 报错 `Property 'like' does not exist on type 'Readonly<{}>'`
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
