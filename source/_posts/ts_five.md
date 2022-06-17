---
title: ts把玩系列(二):类型体操通关秘籍
date: 2022/6/14
tags: [typescript]
categories: 
- typescript
series: typescript
---

## 待研究
《in 与 in keyof 区别》
《ts类型运算与js执行的差异》
《联合类型转交叉》

## 基本知识

### unknown 与 any 区别示例

[套路一：模式匹配做提取 - GetReturnType](https://juejin.cn/book/7047524421182947366/section/7048281581428932619)

```ts
type GetReturnType<Func extends Function> = 
    Func extends (...args: any[]) => infer ReturnType 
        ? ReturnType : never;
```
Func 和模式类型做匹配，提取返回值到通过 infer 声明的局部变量 ReturnType 里返回。

参数类型可以是任意类型，也就是 any[]（注意，这里不能用 unknown，因为参数类型是要赋值给别的类型的，而 unknown 只能用来接收类型，所以用 any）。

### in 与 in keyof 区别
[详细参考 - Record](https://juejin.cn/book/7047524421182947366/section/7048282176701333508)
TypeScript 提供了内置的高级类型 Record 来创建索引类型：
```js
type Record<K extends string | number | symbol, T> = { [P in K]: T; }
```
指定索引和值的类型分别为 K 和 T，就可以创建一个对应的索引类型。

上面的索引类型的约束我们用的 object，其实更语义化一点我推荐用 `Record<string, object>`：
```js
type UppercaseKey<Obj extends Record<string, any>> = { 
    [Key in keyof Obj as Uppercase<Key & string>]: Obj[Key]
}
```
也就是约束类型参数 Obj 为 key 为 string，值为任意类型的索引类型。

### as
在映射类型里的 as 叫重映射，是用于对索引做过滤和修改的。
[详细参考 - FilterByValueType](https://juejin.cn/book/7047524421182947366/section/7048282176701333508)
```js
type FilterByValueType<
    Obj extends Record<string, any>, 
    ValueType
> = {
    [Key in keyof Obj 
        as Obj[Key] extends ValueType ? Key : never]
        : Obj[Key]
}
```
通过as一个具体的值或never,相当于给这个索引重新赋值，从而得到了新的索引，进行修改索引或过滤(never)的作用
```ts
type Person1 = {
    name: string;
    age: number;
}

type test<Obj> = {
    [Key in keyof Obj 
        as "testname"]
        : Obj[Key]
}

type testResult = test<Person1>;

// 打印如下：
type testResult = {
    testname: string | number;
}
```

### Obj extends never ? never 或 Obj extends any
[摘录自这里](https://juejin.cn/book/7047524421182947366/section/7048282249464119307)
这个不会触发计算：
```ts
type DeepReadonly<Obj extends Record<string, any>> = {
    readonly [Key in keyof Obj]:
        Obj[Key] extends object
            ? Obj[Key] extends Function
                ? Obj[Key] 
                : DeepReadonly<Obj[Key]>
            : Obj[Key]
}
```
因为 ts 只有类型被用到的时候才会做类型计算。
所以可以在前面加上一段 Obj extends never ? never 或者 Obj extends any 等，让它触发计算：
```ts
type DeepReadonly<Obj extends Record<string, any>> =
    Obj extends any
        ? {
            readonly [Key in keyof Obj]:
                Obj[Key] extends object
                    ? Obj[Key] extends Function
                        ? Obj[Key] 
                        : DeepReadonly<Obj[Key]>
                    : Obj[Key]
        }
        : never;
```


### ts类型运算与js执行的差异
[详细参考 套路三：递归复用做循环](https://juejin.cn/book/7047524421182947366/section/7048282249464119307)
```ts
const fn1 = (t) => t;
const fn2 = (t) => t;
const fn3 = (t) => t;
const fn4 = (t) => t;
var cc = fn1(fn2(fn3(fn4())));
```

上述js执行时，先执行 fn4() ，然后依次执行 fn3()、fn2()、fn1()；
可以看出，js执行时，先执行fn4,最后才是执行fn1；

```ts
type DeepPromiseValueType<P extends Promise<unknown>> =
    P extends Promise<infer ValueType> 
        ? ValueType extends Promise<unknown>
            ? DeepPromiseValueType<ValueType>
            : ValueType
        : never;
type DeepPromiseResult = DeepPromiseValueType<Promise<Promise<Record<string, any>>>>;
```
而在ts的类型运算中，貌似不这样，如果把DeepPromiseValueType比作一个js的函数的话，它却没有先执行DeepPromiseValueType函数的入参`（Promise<Promise<Record<string, any>>>）`，
而是先执行 DeepPromiseValueType 的运算逻辑，然后再利用其递归逻辑，一层层获取最终的 `Record<string, any> `；

请问有以上现象解释的相关资料吗


### 联合类型的自动循环调用
[详细参考 套路五：联合分散可简化](https://juejin.cn/book/7047524421182947366/section/7048282387825819687)

以下两种情况会触发 联合类型自动循环调用或单独计算：
- 分布式条件类型，会每个元素单独传入计算;
当类型参数为联合类型，并且在条件类型左边直接引用该类型参数的时候，TypeScript 会把每一个元素单独传入来做类型运算，最后再合并成联合类型，这种语法叫做分布式条件类型。**一定注意 触发分布式条件类型，必须是以 类型参数（泛型）的方式使用才行**
以下方式是不行的：
```ts
type union1 = "union" | "age" | "name";
type text<T> = T extends "union" ? string : false;
type m = text<union1>
```

- 字符串类型中遇到联合类型的时候，会每个元素单独传入计算;

明白了以上两点，再理解：
```ts
type Combination<A extends string, B extends string> =
| A
| B
| `${A}${B}`
| `${B}${A}`;

type test = Combination<'A', 'B' | 'C'>; //"A" | "B" | "C" | "AB" | "AC" | "BA" | "CA"
```
然后再去理解：
```ts
type AllCombinations<A extends string, B extends string = A> = 
    A extends A
        ? Combination<A, AllCombinations<Exclude<B, A>>>
        : never;
```
type Combination 其实就是【2. 字符串类型中遇到联合类型的时候，会每个元素单独传入计算】的运用；

type AllCombinations 的主体逻辑其实就是 【1. 分布式条件类型，会每个元素单独传入计算;】的运用；

这样去理解 AllCombinations 就是豁然开朗了。

一开始 去理解AllCombinations 快一个小时，无法理解，然后从头再次阅读本节后，总结出上面两点，然后再动手试了下上面的 `【type test //"A" | "B" | "C" | "AB" | "AC" | "BA" | "CA"】`
才知道Combination 也是会触发单独计算， 才瞬间理解了type AllCombinations 。


### 只读的数组
```ts
type len = [1,2,3]['length'];

type len2 = number[]['length']

type IsTuple<T> = 
// 只读数组
    T extends readonly [...params: infer Eles] 
        ? NotEqual<Eles['length'], number> 
        : false;

type NotEqual<A, B> = 
    (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
    ? false : true;


type IsTupleResult = IsTuple<[1, 2, 3]>;

type IsTupleResult2 = IsTuple<number[]>;
```

### 联合类型转交叉

[详细参考 套路六：特殊特性要记清](https://juejin.cn/book/7047524421182947366/section/7048282437238915110)

函数参数的逆变性质一般就联合类型转交叉类型会用，记住就行。

```ts
type UnionToIntersection<U> = 
    (U extends U ? (x: U) => unknown : never) extends (x: infer R) => unknown
        ? R
        : never

type UnionToIntersectionResult = UnionToIntersection<{ guang: 1 } | { dong: 2 }>;

// UnionToIntersectionResult 打印如下：
type UnionToIntersectionResult = {
    guang: 1;
} & {
    dong: 2;
}

// 疑问：为什么不是：
// UnionToIntersectionResult 打印如下：
type UnionToIntersectionResult = {
    guang: 1;
} | {
    dong: 2;
}
```


### 接口与type的区别
```js
type Person1 = {
    name: string;
}

interface Person2 {
    name: string;
}

type test<Obj> = {
    [Key in keyof Obj 
        as "testname"]
        : Obj[Key]
}

type testResult1 = test<Person1>;
type testResult2 = test<Person2>;


```
最后发现 testResult1 与 testResult2 是一样的, 得出的结论 接口与type 其实一样，但type更加灵活
[可以在这里试试](https://www.typescriptlang.org/play?ssl=48&ssc=34&pln=33&pc=1#code/C4TwDgpgBAYglgG2BATgIRANQIYIK4QAq4EAPAPIBGAVlBAB7IB2AJgM5QBKEAxgPYoWpNsBRwmAcwA0UbExAA+GTnxESCqAF4oAbwBQUQ1ADaAaQggo4qAGsLfAGZQqtA0ffYOAIiZyIXgF03d0MALmcaMwsggF89PVBIWERkdCxcAmJIACYKGjpGCFYObn5BYVFxaVl5JSgVTPUtXWCTc0trOxBHCNcQo09eqJAAguZ2eoy1JIB+KHaocKYIADdUIP6wofbY+MToeCRUDAbpiABGPNoGcZLeASERMUkZOUVlKayIDW19d2GrExbPYnC4oK0PBxTl8xkUJi5hqM5gslqt1hCjOEETs9HF4vFxKkHNgeNAAAqoNh8IF-Iy+AC2EHCTyqAG5WtgJEyoEw8PTKKh2e4ABZ8SiUEDMyqSYwBdl4hIkZJHFDcNh4JDNQ6pE6fEikCkoKlMGQsyRQAA+PL5ApQCnZ+P2UENxvOzVphgZ3LNEnlBKYRJJ5Mp1OyLXcXqlz19uL2SuQIiuP3DRgBnRBvXBm1k3gTwC9gQxW2x0VjiqSebVGuAbu0eYNIaY53t5eglYg6qQYbrHeADaNoZbeiAA)