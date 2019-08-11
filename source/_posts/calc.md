---
title: 算法
date: {{ date }}
tags: 算法
categories: 
- 前端
series: 前端
---

**基础算法篇**
## 电话号码
### 概述
[力扣原题 -- 电话号码的字母组合](https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number/)
给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。
给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。
```
 function calc(str) {
      let map = ['', 1, 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz']
      let num = str.split('')
      let code = []
      num.forEach(item => {
        if (map[item]) {
          code.push(map[item])
        }
      })
      let comb = (arr) => {
        // 临时变量用来保存前两个组合的结果
        let tmp = []
        // 最外层的循环是遍历第一个元素，里层的循环是遍历第二个元素
        for (let i = 0; i < arr[0].length; i++) {
          for (let j = 0; j < arr[1].length; j++) {
            tmp.push(`${arr[0][i]}${arr[1][j]}`)
          }
        }
        arr.splice(0, 2, tmp)
        if (arr.length > 1) {
          comb(arr)
        } else {
          return tmp
        }
        return arr[0]
      }
      return comb(code)
    }

    //calc('32')
```
现在对上面方法进行思路和要点解析
### 两两组合
不管输入多少位数，都让前两位数字进行组合，组合的结果 再跟 第三位数字进行组合，逻辑一样，依次类推。 逻辑一样的部分，则突出了使用递归的需求。
![](/image/calc/phone.jpg)
### 递归
参考上面《两两组合》
### return arr[0] 很需要
咋一看，觉得这一句不需要，以为有 if else，就不会走到 return arr[0]。这也是我误解的，其实下面的comb(arr)递归，执行完后，就会执行后面的return arr[0]。
以上也是我对于递归的误区。
```
 if (arr.length > 1) {
        comb(arr)
    } else {
        return tmp
    }
 
 return arr[0]
```
### 递归完了还会往下执行
参考上面 《return arr[0] 很需要》

## 卡牌分组
### 概述
给定一副牌，每张牌上都写着一个整数。
此时，你需要选定一个数字 X，使我们可以将整副牌按下述规则分成 1 组或更多组：
每组都有 X 张牌。
组内所有的牌上都写着相同的整数。
仅当你可选的 X >= 2 时返回 true。
[力扣原题 -- 卡牌分组](https://leetcode-cn.com/problems/x-of-a-kind-in-a-deck-of-cards)

用白话解释原题：给定一副牌，这副牌可以是1张或1万张，将这副牌分成一组或多组，每组牌的数字都相同，每组牌的个数不少于2.
### 解决方法
#### 代码
```
function calc(arr) {
      // 将卡牌按值排序保证相同的卡牌是挨着的
      let str = arr.sort((a, b) => a - b).join('')
      // 分组(单张或者多张)  \1 在正则中表示连续一样的匹配
      let group = str.match(/(\d)\1+|\d/g)
      // 求两个数的最大公约数
      let gcd = (a, b) => {    
        if(b === 0)  return a;   
        return gcd(b, a % b)
       }
      // 思想：只要所有的分组具有最大公约数(大于1)就满足条件
      // 对所有的分组进行最大公约数验证，相邻两个分组的最大公约数，再与后面的公约数进行验证，以此类推，有一个最大公约数为1就退出
      while (group.length > 1) {
        let a = group.shift().length
        let b = group.shift().length
        let v = gcd(a, b)
        if (v === 1) {
          return false
        } else {
          // 将前两个分组的最大公约数推进数组与下一个分组再次验证是否有最大公约数
          group.unshift('0'.repeat(v))
        }
      }
      // 考虑边界['11']即只有一个分组的时候
      return group.length ? group[0].length > 1 : false
    }
```

### 方法要点
结合上面的《解决方法》代码来说
#### 用递归写最大公约数
```
let gcd = (a, b) => {    
    if(b === 0)  return a;   
    return gcd(b, a % b)
}
```
#### 最大公约数
参考上面
#### 最大公约数除了1值外，其他值都合法

#### shift()方式的 数组内两两比较
```
while (group.length > 1) {
        let a = group.shift().length
        let b = group.shift().length
      ...
      }
```

### 不推荐方法
#### 代码
```
var hasGroupsSizeX = function(deck) {
  let getResult = (a, b) => {    //定义一个寻找公约数的方法
    if(b === 0)  return a;   
    return getResult(b, a % b)
  }
  const hash = deck.reduce((pre, num) => {    //统计出每种数字的数目
    if(!pre[num]) {
      pre[num] = 1
    }else{
      pre[num]++
    }
    return pre
  }, {})
  const numCount = Object.values(hash)     //将hash中的每项数值存入数组，便于后续遍历
  const min = numCount.sort((a, b) => a-b)[0];         //利用数组排序快速获取最小值
  if (min < 2) return false; //根据题意，如果最分组最小数量小于2，直接返回false
  return !numCount.some((item,index) => {
    if(index > 0) return getResult(item, min) === 1
  })
}
```
#### 两种方法的利弊
尽管两种方法都能实现，但是前面说的方法要比不推荐方法节省了一次遍历，当数据量大时，这种性能上的差别就会比较大，所以推荐前一种方法。


## 种花问题
### 概述
假设你有一个很长的花坛，一部分地块种植了花，另一部分却没有。可是，花卉不能种植在相邻的地块上，它们会争夺水源，两者都会死去。
给定一个花坛（表示为一个数组包含0和1，其中0表示没种植花，1表示种植了花），和一个数 n 。能否在不打破种植规则的情况下种入 n 朵花，算出n的最大值。
[力扣原题 -- 种花问题](https://leetcode-cn.com/problems/can-place-flowers)

```
 function calc(arr, n){
      // 计数器
      let max = 0
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === 0) {
          if (i === 0 && arr[1] === 0) {
            max++
            //跳转，这里i++，加上for循环自动也++，所以i实际加了2
            i++
          } else if (arr[i - 1] === 0 && arr[i + 1] === 0) {
            max++
             //跳转，这里i++，加上for循环自动也++，所以i实际加了2
            i++
          }
        }
      }
      return max
    }
```
### 要点分析
```
[1,0,0,0,0,0,0,0,1]
```
其实就是在数组中找000的模型，有000就可以变成010，达到要求。
另外一个要考虑的是边界问题，比如，[0,0,1]，这不符合 000，但依然可以在最左侧加1；
这种问题其实就是在数组中找 000 这种模型，就涉及到用数学建模的思想来解决。
### 数学建模
以后遇到类似的找这种000的形式的东西，就考虑用数学建模。
### 如何跳级忽略某些元素遍历
例如下面的，index位置 1 2 3 符合 000；
2 3 4 也符合 000；
```
[1,0,0,0,0,1]
```
但实际上当遍历了index 123后，下一次只要求遍历index 345；
如何做到呢，可通过在for循环内，i++ :
```
for (let i = 0, len = arr.length - 1; i < len; i++) {
   //跳转，这里i++，加上for循环自动也++，所以i实际加了2
   i++
}
```
### 边界问题
参考《要点分析》
### arr[i-1] 与 arr[i+1] 与 i<arr.length-1 的妙用
因为for循环体内用了arr[i+1]，那么在for的title上能遍历的最大值是 arr.length - 2，也就是i < arr.length - 1；
这个是一个很实用的用法，我们在写for循环时，如果for循环体内有这样的情况，就应该考虑好for的title上最大的i < arr.length值也应响应配合增加或减少。并且这个最大的arr.length值到底多少**与函数体内最大的arr[i+1]有关，而与arr[i-1]无关。**，当然，如果用到arr[i-1]时，**就要考虑边界值的问题**，也就是当i为0时的情况。
```
 for (let i = 0; i < arr.length - 1; i++) {
        ...
          } else if (arr[i - 1] === 0 && arr[i + 1] === 0) {
        ...
        
      }
```
### arr[i-1]时考虑边界值，arr[i-1]时考虑i值最大值
参考《arr[i-1] 与 arr[i+1] 与 i<arr.length-1 的妙用》

## 冒泡排序
### 概述
冒泡排序大白话解释就是，将数组内的最大值，从左到右或右带左地排序，这个过程好像数组内的最大值好像冒泡一样，从水底上浮的过程。
冒泡排序是每次比较左右两个值，每次进行比较交换位置。
如下图，要实现如下的一个渐进的排序过程：
![](/image/calc/bubble.jpg)
![](/image/calc/bubble1.jpg)
![](/image/calc/bubble2.jpg)

解题代码如下：
```
function calc(arr) {
    // 冒泡排序
    for (let i = arr.length - 1; i > 0; i--) {
        for (let j = 0; j < i; j++) {
            if (arr[j] > arr[j + 1]) {
            let c = arr[j];
            arr[j] = arr[j + 1]
            arr[j + 1] = c;
            }
        }
    }
    return arr;
}

calc([1, 9, 5, 3, 4,0,2,999,6]) //[0, 1, 2, 3, 4, 5, 6, 9, 999]
```
### 要点分析
这种排序是典型的需要n*n次的排序，需要在循环体内嵌套再次循环。
排序的关键是，需要一个遍历，逐步将数组的遍历范围逐步减少，为第二个遍历提供最大length；
第二个遍历针对第一个遍历提供的length进行全遍历，将最大值找出并一步步推到数组最右侧；
### 双层遍历
冒泡排序关键点是用了双层排序。
#### 外层遍历限定内层遍历范围；
这里的范围是指，内层遍历，最大遍历次数i值；
#### 外层遍历逐步递减；
#### 内层遍历全遍历；
#### 内层遍历负责位置替换，将最大值冒泡至最右侧；
### 边界值处理
外层遍历 `let i = arr.length - 1; i > 0; i--`;其中i>0,i的最小值不是1而是0；
但是arr[0]又必须遍历，其实已经在内层遍历中被遍历了。

## 选择排序
### 概述
选择排序
是一次次遍历，将最小值遍历到最左侧的过程，选择排序与冒泡排序实现的效果是一样的，思路不一样。
选择排序每次遍历以起始值arr[i]为参照，然后遍历 arr[i+1]到arr[arr.length-1]的范围，发现有值不一样，a[i]与最小值进行值的交换。
所以，选择排序是，一次遍历交换一次位置，冒泡排序是一次比较就交换一次位置，而一次遍历包含很多次比较。
所以选择排序类似定点比较交换，冒泡排序是左右比较交换，这就是二者区别。

如下图，要实现如下的一个渐进的排序过程：
![](/image/calc/select.jpg)
![](/image/calc/select1.jpg)
解题代码如下：
```
function calc(arr) {
      // 选择排序
      for (let i = 0, len = arr.length, min; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          if (arr[j] < arr[i]) {
            let c = arr[i]
            arr[i] = arr[j]
            arr[j] = c
          }
        }
      }
      return arr
    }
```
### 要点解析
选择排序与冒泡排序是两种相反的比较方法，冒泡排序是 i--，选择排序是 i++；
内层遍历范围也是相反的方向，选择排序内层遍历范围是从左到右不断收缩的过程，冒泡排序是右到左不断收缩。
其基本原理与冒泡排序相同；
详细参考《冒泡排序》
### 选择排序与冒泡排序区别
前者是定点比较交换，后者是左右比较交换：
![](/image/calc/select-dubble.jpeg)
### 小技巧
因为定点比较的原因，如果要定点比较的元素为 arr[i],那么内层遍历就从i+1开始遍历，这点也是值得注意和借鉴的地方。

## 最大间距
### 概述
[力扣原题 -- 最大间距](https://leetcode-cn.com/problems/maximum-gap/)
给定一个无序的数组，找出数组在排序之后，相邻元素之间最大的差值。
如果数组元素个数小于 2，则返回 0。
### 推荐方法
#### 介绍
这种题一般通过排序完成，并且在排序的过程中，获取最大值，以下通过 冒泡排序的方式来做，主要利用冒泡的时候，其他已经逐步排序好最大值了，利用这逐步排序好的最大值，逐步求出间距：
```
 function getDistance(a, b, max) {
      const num = a - b;
      if (max < num) {
        max = Math.abs(num);
      }
      return max;
    }
    function calc(arr) {
      let max=0;
      for (let i = arr.length - 1, tmp; i > 0; i--) {
        for (let j = 0; j < i; j++) {
          if (arr[j] > arr[j + 1]) {
            let c = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = c;
          }
        }
        if (i < (arr.length - 1)) {
          max = getDistance(arr[i + 1], arr[i], max);
          if (i === 1) {
            max = getDistance(arr[1], arr[0], max);
          }
        }
      }
      return max;
    }
```
#### 边界处理
当i === (arr.length - 2)与i=1时需要处理不同逻辑。
### 不推荐方法
不推荐理由，利用sort进行了一次遍历，然后又用遍历求最大间距，用了两次遍历，相比上面的推荐方法的一次遍历，这种方法性能不好。
![](/image/calc/max.jpg)

## 数组中的第K个最大元素
[力扣原题 -- 数组中的第K个最大元素](https://leetcode-cn.com/problems/kth-largest-element-in-an-array/)
在未排序的数组中找到第 k 个最大的元素。请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。
示例 1:
输入: [3,2,1,5,6,4] 和 k = 2
输出: 5
示例 2:

输入: [3,2,3,1,2,4,5,5,6] 和 k = 4
输出: 4
说明:

先说不推荐方法
### 不推荐方法
这种方法非常容易理解，但是却有浪费之嫌，因为根本不需要对整个数组先排序再查找，因为一旦找到第k个值，就可以停止程序了。
```
export default (arr, k) => {
  return arr.sort((a, b) => b - a)[k - 1]
}
```
### 推荐方法
利用冒泡排序来做：
```
export default (arr, k) => {
  let len = arr.length - 1
  for (let i = len, tmp; i > len - k; i--) {
    for (let j = 0; j < i; j++) {
      if (arr[j] > arr[j + 1]) {
        tmp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = tmp
      }
    }
  }
  // arr[len+1-k]
  return arr[len - (k - 1)]
}
```
## 对以上排序(题\算法)的小结
以上的排序题中，如`数组中的第K个最大元素`，示例中都使用了冒泡排序的算法来做的，其他也可以使用选择排序，二者都是想通互换的。






