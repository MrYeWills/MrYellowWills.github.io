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