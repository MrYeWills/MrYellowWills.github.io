---
title: 正则表达式
date: {{ date }}
tags: [正则]
categories: 
- 前端
series: 前端
---

用正则久矣，一直想出一篇这方面的笔记，用来记录**重难点**。
博客重度参考慕课教程[JavaScript正则表达式](https://www.imooc.com/coursescore/706)

### regexper.com
这是一个很好的正则网址，此网不会用，可能显得不上档次？[regexper.com](https://regexper.com/)，这个网址如果受外网限制不好访问的话，也可通过npm安装到本地访问，具体谷歌或看上面的慕课教程。
![](/image/regex/com.jpg)

### m 多行搜索
#### 修饰符
正则有如下修饰符
```
g:global 全文搜索 不添加只搜索第一个匹配即停止
i : ignore case 忽略大小写 默认是大小写敏感
m: multiple lines  多行搜索
```
#### demo
使用多行修饰符后，就可以匹配每一行的^开头字符。
![](/image/regex/mult.jpg)

### 元字符
#### \t tab
此符号，在mac下按下一个tab键，使用下面表达式不成立，在有些电脑上又可以，目前尚不知原因。
```
/\t/.test('    ')
```
### 字符类 的概念
- 我们可以使用元字符[]来构建一个简单类；
- 所谓类是指符合某些特性的对象，一个泛指，而不是特指某个字符
- 表达式[abc]把字符a或b或c归为一类，表达式可以匹配这类字符。

### 字符类取反
- 使用元字符^创建 反向类／负向类
- 反向类的意思是不属于某类的内容
- 表达式[^abc]表示 不是字符a或b或c的内容；

### - 与 范围类
#### 常见范围类 [a-zA-Z]
如上，它们通过-来拼接一个范围类；
下面的形式通常可以表示一个范围类：
```
字符-字符
```
假如前后字符为 0、9，a、z；那么就被识别，构成一个常见的范围类；
因此当-位于两个字符之间时，如果两个字符可以被识别，那么此-具有特殊意义，表示范围类的意思；
如果不是位于两个字符之间，-匹配自身-；
#### -位于两个字符之间时的特殊意义
见上面的说明。

### 预定义类
既然[0-9]表示范围类，正则使用预定义类来预先规定好逻辑直接表示这个范围类，下面是常见预定义类：
![](/image/regex/before.jpg)

### 贪婪\非贪婪模式
#### 贪婪模式(默认)
如下，正则可以匹配3到6个，默认情况下正则匹配最大数6，是为贪婪模式。
```
'12345678'.replace(/\d{3,6}/g,'X') //X78
```
#### 量词后加？变成非贪婪模式
非贪婪模式指可以匹配3到6个时，指匹配最小值3，{3,6}是量词：
```
'12345678'.replace(/\d{3,6}?/g,'X') //XX78
```

### 分组与或
#### 概述
![](/image/regex/group2.jpg)
#### 忽略分组 (?:)
![](/image/regex/group3.jpg)
#### 或与分组 
![](/image/regex/group1.jpg)

### 前瞻
#### 概述
![](/image/regex/above.jpg)

```js
'a2*aa'.replace(/\w(?=\d)/,'H')    //正向前瞻 "H2*aa"单词字符后面是数字的

'dd4sfc'.replace(/\w(?!\d)/,'G');    //负向前瞻 "Gd4sfc"单词字符后面不是数字的
```
#### 断言
如上图片里面的 assert就是断言，断言是一个表达式，可运用与 正向前瞻和后向前瞻。

#### 正向与负向的难理解性
刚开始听到正向负向会理解成其他意思，其实就是后面匹配断言assert与匹配相反的断言assert；
也可以说成是后面匹配断言的正向表达意思，和匹配 断言的负向（相反方向）的表达意思；

#### 正向前瞻?=
参考上面概述
#### 负向前瞻?!
参考上面概述

### 正则式的对象性
每一个正则式都是一个对象（ new RegExp() ）,因此都具有如下属性。
- global：是否全文搜索，默认false
- ignore case：是否大小写敏感，默认是false
- multiline：多行搜索，默认值是false
- lastIndex：当前表达式匹配内容的最后一个字符的下一个位置
- source：正则表达式的文本字符串
![](/image/regex/attr.jpg)


### 子表达式
子表达式为正则内的分组，如下有两个子表达式(\w)与(abc)
```
var reg4 = /\d(\w)(abc)\d/g;
```

### lastIndex让你怀疑人生
#### test的现象
```
//每次执行下面代码都是对的
/\w/g.test('a')
```
```
//每次执行下面代码都是对的
var reg = /\w/g;
reg.test('a') //true
reg.test('a') //false
reg.test('a') //true
reg.test('a') //false
```
#### 每次test后正则式的lastIndex改变
如下，reg不仅是正则式，而且是对象，每执行完一次test，都会让reg的lastIndex发生变化，从而在下次匹配时有所不同，产生了不同结果。
每一次匹配成功后lastIndex会得到一个非零值，当匹配失败后，lastIndex值将置为零。
```
//每次执行下面代码都是对的
var reg = /\w/g;  //reg.lastIndex=0
reg.test('a') //true //reg.lastIndex=1
reg.test('a') //false //reg.lastIndex=1 --> reg.lastIndex=0
reg.test('a') //true //reg.lastIndex=1
reg.test('a') //false //reg.lastIndex=1 --> reg.lastIndex=0
```
#### 目前只发现在全局g的正则存在此现象
如上，目前只存在于g的正则式，非全局尚未发现此现象。因为非全局的lastIndex值都是0，而0有两成意思：第一 从0位置开始匹配；第二 lastIndex无效；所以在非全局下lastIndex可能无效(待考证)
#### 非全局下lastIndex无效？
参考上面分析。

#### exec也有此现象
exec也有此现象，其他方法可能还有此现象，原因同test方法一样分析：
```
//每次exec执行的结果不一样
var reg4 = /\d(\w)(\w)\d/g;
var str = "$1az2bb3cy4dd5ee";
reg4.exec(str) //["1az2", "a", "z"] //index: 1
reg4.exec(str) //["3cy4", "c", "y"] //index: 7
```
#### 解决方法
每次匹配前，手动地把lastIndex属性重置为0。

#### lastIndex为0的双重意思
参考《目前只发现在全局g的正则存在此现象》

### exec
#### 概述
![](/image/regex/exec.jpg)
在非全局匹配模式下，此函数的作用和match()函数是一样的，只能够在字符串中匹配一次，如果没有找到匹配的字符串，那么返回null，否则将返回一个数组。
#### 子表达式
参考《子表达式》
#### 返回数组内容
- 数组的第0个元素存储的是匹配字符串
- 第1个元素存放的是第一个引用型分组(子表达式)匹配的字符串，
- 第2个元素存放的是第二个引用型分组(子表达式)匹配的字符串，依次类推。
#### 返回数组属性
返回数组还包括两个对象属性，
- index属性声明的是匹配字符串的起始字符在要匹配的完整字符串中的位置，
- input属性声明的是对要匹配的完整字符串的引用。

### match
#### 是否全局影响很大
match（）方法将检索字符串，以找到一个或多个与regexp匹配的文本
regexp是否具有标志g对结果影响很大
#### 非全局模式
如果regexp没有标志g，那么match（）方法就只能在字符串中执行一次匹配，没找到任何匹配文本将返回null，否则将返回一个数组，数组存放了与它找到的匹配文本有关的信息
返回数组内容与exec的一致，请参考《exec -- 返回数组内容》《exec -- 返回数组属性》
```
var reg4 = /\d(\w)(\w)\d/;
var str = "$1az2bb3cy4dd5ee";
str.match(reg3) //["1az2", "a", "z"] //index: 1 input: "$1az2bb3cy4dd5ee"
```
#### 全局模式
如果regexp具有标志g则match（）方法将执行全局检索，找到字符串中的所有匹配子字符串：没有找到任何匹配的子穿，则返回null，
否则返回一个数组，数组元素中存放的是字符串中所有匹配子串，而且也没有index属性或input属性
```
var reg4 = /\d(\w)(\w)\d/g;
var str = "$1az2bb3cy4dd5ee";
str.match(reg3) //["1az2", "3cy4"]
```

### match与exec异同
#### 在非全局下 二者结果相同
```
var reg4 = /\d(\w)(\w)\d/;
var str = "$1az2bb3cy4dd5ee";
reg4.exec(str) //["1az2", "a", "z", index: 1, input: "$1az2bb3cy4dd5ee", groups: undefined]
str.match(reg4) //["1az2", "a", "z", index: 1, input: "$1az2bb3cy4dd5ee", groups: undefined]
```
#### 在全局下，有差别
全局下，exec返回的结果格式与非全局下一样；但match却只返回匹配的文本，不再返回子表达式信息。

### 其他
#### \s匹配空白而不仅仅空格
以下都成立：
```js
/\s/.test('\n')
/\s/.test('\r') //回车
/\s/.test(' ')
/\s/.test('\xA0') //\xA0就是&nbsp;
```
#### 常见元字符
[点击mdn查看](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)

#### split(reg)
除了字符串，也可以使用正则来split。
```
'1b3c4d'.split(/\d/) //["", "b", "c", "d"]
```

### 参考
[mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)




