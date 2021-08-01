---
title: ts与react结合使用
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
### react-router

#### 定义props
```js
import React from "react";
import { RouteComponentProps } from "react-router-dom";

interface MatchParams {
  touristRouteId: string;
}

// RouteComponentProps 接收一个泛型 MatchParams， 也可以不用传
export const DetailPage: React.FC<RouteComponentProps<MatchParams>> = (
  props
) => {
//   console.log(props.history);
//   console.log(props.location);
//   console.log(props.match);
  return <h1>路游路线详情页面, 路线ID: {props.match.params.touristRouteId}</h1>;
};
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

#### withRouter
```js
import React from "react";
import { Image, Typography } from "antd";
import { withRouter, RouteComponentProps } from "react-router-dom";

interface PropsType extends RouteComponentProps {
  id: string | number;
  size: "large" | "small";
  imageSrc: string;
  price: number | string;
  title: string;
}

const ProductImageComponent: React.FC<PropsType> = ({
  id,
  size,
  imageSrc,
  price,
  title,
  history,
  location,
  match
}) => {
  // console.log(history)
  // console.log(location)
  // console.log(match)
  return (
    <div onClick={() => history.push(`detail/${id}`) }>
    </div>
  );
};

export const ProductImage = withRouter(ProductImageComponent);

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

### 定义onChange type ： React.ChangeEvent
```ts
import React, { ChangeEvent } from 'react'
export interface InputProps extends Omit<InputHTMLAttributes<HTMLElement>, 'size' > {
  onChange? : (e: ChangeEvent<HTMLInputElement>) => void;
}

//顶一个为 React.ChangeEvent后，  使用的时候，就e.target.value 这些属性
onChange={(e) => {e.target.value}}
```

### 定义键盘事件
```ts
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch(e.keyCode) {
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

## 运用场景

### 从一个对象类型中剔除某些属性 Omit
[Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)

```ts
import React, { FC, ReactElement, InputHTMLAttributes } from 'react'
type InputSize = 'lg' | 'sm'
//react InputHTMLAttributes 中定义了 size，且size类型是number，而我们也要定义size，且size类型为string，
// 因此需要剔除掉 react InputHTMLAttributes 中定义的 size，不然报错
export interface InputProps extends Omit<InputHTMLAttributes<HTMLElement>, 'size' > {
  /**是否禁用 Input */
  disabled?: boolean;
  /**设置 input 大小，支持 lg 或者是 sm */
  size?: InputSize;  
   /**添加后缀 用于配置一些固定组合 */
  append?: string | ReactElement;
} 
```

### 定义react element 
参考上面的 demo  ： React.ReactElement

### 定义Promise 
参考《type 的使用demo》

### 定义ref

以下也是 contains 的经典引用， 用于实现 点击元素之外任何地方 触发事件， 比如关闭弹框。

```ts
import { RefObject, useEffect } from "react";

function useClickOutside(ref: RefObject<HTMLElement>, handler: Function) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      // 值得注意的是 ref.current.contains(event.targe) 可用于判断dom是否包含另外一个dom
      if (!ref.current || ref.current.contains(event.target as HTMLElement)) {
        return
      }
      handler(event)
    }
    document.addEventListener('click', listener)
    return () => {
      document.removeEventListener('click', listener)
    }
  }, [ref, handler])
}

export default useClickOutside
```

#### `TransMenu.Item = MenuItem`类型定义
```ts
import { FC } from 'react'
import Menu, { MenuProps } from './menu'
import SubMenu, { SubMenuProps } from './subMenu'
import MenuItem, { MenuItemProps } from './menuItem'

export type IMenuComponent = FC<MenuProps> & {
  Item: FC<MenuItemProps>,
  SubMenu: FC<SubMenuProps>
}
const TransMenu = Menu as IMenuComponent
// 如果进行 TransMenu 类型定义，就无法export TransMenu.Item
TransMenu.Item = MenuItem
TransMenu.SubMenu = SubMenu

export default TransMenu
```

### 定义file 和 file列表

FileList 与 File 是 ts自带的类型【待进一步考证？】。
```ts
//  FileList 定义多个 file
 const uploadFiles = (files: FileList) => {
  }
  //  File 定义单个 file
  const post = (file: File) => {
  }

```



### type 的使用demo

#### 示例一
```ts
interface DataSourceObject {
  value: string;
}

定义一个类型 DataSourceType 接收一个泛型，此泛型默认值为{} ，返回这个泛型 和 DataSourceObject 的并集 【是否并集待考证？】；
export type DataSourceType<T = {}> = T & DataSourceObject
export interface AutoCompleteProps extends Omit<InputProps, 'onSelect'> {
  // 返回一个 Promise 或 DataSourceType[]类型
  fetchSuggestions: (str: string) => DataSourceType[] | Promise<DataSourceType[]>;
}
```

#### 示例二
参考《`TransMenu.Item = MenuItem`类型定义》


## 调试经验

### 如何找到react元素的类型
![](/image/type-react/debug.png)
