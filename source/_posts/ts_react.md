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

### style
```ts
const wrapperStyle: React.CSSProperties = {
  padding: '20px 40px'
}

const storyWrapper = (stroyFn: any) => (
  <div style={wrapperStyle}>
    <h3>组件演示</h3>
    {stroyFn()}
  </div>
)
```

### createContext

```ts
import React, { FC, useState, createContext, CSSProperties } from 'react'

interface IMenuContext {
  index: string;
  onSelect?: (selectedIndex: string) => void;
  mode?: MenuMode;
  defaultOpenSubMenus?: string[];  
}

//createContext  可以接收一个泛型 IMenuContext
export const MenuContext = createContext<IMenuContext>({index: '0'})
```


### click event ： React.MouseEvent

```ts
 const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(!menuOpen)
  }
```



## props

### 按钮的props定义demo
#### demo
```ts
export type ButtonSize = 'lg' | 'sm'
export type ButtonType = 'primary' | 'default' | 'danger' | 'link'

interface BaseButtonProps {
  className?: string;
  /**设置 Button 的禁用 */
  disabled?: boolean;
  /**设置 Button 的尺寸 */
  size?: ButtonSize;
  /**设置 Button 的类型 */
  btnType?: ButtonType;
  children: React.ReactNode;
  href?: string;
}
// ButtonHTMLAttributes 这是react写的一个按钮的props，包含了 onClick 等等 button应该具备的所有属性的 接口。
// AnchorHTMLAttributes 这是react写的一个锚点的props。
// NativeButtonProps 具备了 BaseButtonProps 与 ButtonHTMLAttributes 共同的属性
type NativeButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLElement>
type AnchorButtonProps = BaseButtonProps & AnchorHTMLAttributes<HTMLElement>
// Partial 是 ts 的关键字 ，将所有 props 属性 变为可选；
// & 是 两个对象的合集，类似 js 的 Object.assign
// 为什么要ButtonProps可选，因为不用可选，NativeButtonProps 等这些属性都是必填的，
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>

export const Button: FC<ButtonProps> = (props) => {

```

#### 按钮props

ButtonHTMLAttributes , 参考demo
#### 锚点props

AnchorHTMLAttributes , 参考demo

#### ts 的 Partial 
参考demo