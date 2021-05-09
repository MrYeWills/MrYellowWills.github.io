---
title: eslint笔记
date: 2021/5/9
tags: [eslint]
categories: 
- 前端工程
series: 前端工程
---



## eslint

### eslint 配合 vscode 使用
#### 概述
eslint在vscode生效：
安装eslint插件在vscode中；
如果用到airbnb的，就安装相关的airbnb 的 node_module包即可。
不用设置什么setting。json。
任意打开一个js文件，不能是ts文件哦，看是否生效。

#### 必须要打开vscode的eslit配置
打开vscode，点击下面进行eslint设置，
如下图是设置好的，没有设置好，是禁用，可参考[blog](https://blog.csdn.net/jinlx_/article/details/109381941)
![](/image/blog_flow/pro.jpg)
#### 误区
很多人以为eslint要设置一大堆的vscode插件，其实不然，只需要安装一个eslint插件即可。

### 禁用规则
基本上所有的规则都可以通过设置 值为 0的数组来禁用。
```
"no-unused-expressions": [0]
```

### eslint 不生效
#### 概述
想要vscode的fix all autoFixable problem；配置airbnb后 eslint不生效；
首先eslint除了上面说的 vscode 可能需要安装linter-eslint外，因为用了 airbnb，所有一定要在安装airbnb相关的两个node_module:
```
"eslint-config-airbnb": "^17.0.0",
"eslint-import-resolver-babel-module": "^4.0.0",
```
当然还要安装其他相关的：
```
"babel-eslint": "^8.2.6",

"eslint-plugin-import": "^2.13.0",
"eslint-plugin-jsx-a11y": "^6.1.1",
"eslint-plugin-react": "^7.10.0",
"eslint-plugin-react-hooks": "^3.0.0",
```
之所以在webpack未运行时，eslint能够起作用，估计是eslint默认直接通过 '/node_module/eslint-config-airbnb/index.js'等的方式引用了相关文件，如果这些引用存在，eslint将开启实时监听。
#### 其他情况
注意的是，vscode使用eslint时，必须安装 linter-eslint 插件才能生效，装了插件后才能识别根目录下的eslint配置文件。
#### ts tsx不生效，js生效
如果你的项目中使用了ts，可能对于ts tsx的文件，ts自带的验证规则将优先于eslint，此时eslint可能在js文件中生效，ts文件中不生效。
不过ts文件中有ts自带的验证规则生效。

#### 没有安装prettier
没有安装一下两个依赖是不生效的，用vscode的时候，你如果注意观察vscode给予的错误提示，会发现，错误提示基本上都是prettier报错的，因此相关的包不安装肯定不生效：

```
"eslint-config-prettier": "^4.3.0",
 "eslint-plugin-prettier": "^3.1.4",
```
### .eslintc 配置与package.json联系
```json
//package.json
"eslint": "^5.16.0",
"babel-eslint": "^8.2.3",
"eslint-config-airbnb": "^17.1.0",
"eslint-config-prettier": "^4.3.0",
"eslint-plugin-compat": "^2.2.0",
"eslint-plugin-import": "^2.20.2",
"eslint-plugin-jsx-a11y": "^6.0.3",
"eslint-plugin-prettier": "^3.1.4",
"eslint-plugin-react": "^7.20.0",
```
```json
//.eslintc
{
  "parser": "babel-eslint",
  "plugins": [
    "react", //对应上面 eslint-plugin-react
    "jsx-a11y", //对应上面 eslint-plugin-jsx-a11y
    "import" //对应上面 eslint-plugin-import
  ],
  "extends": [
    "airbnb", //对应上面 eslint-config-airbnb
    "prettier" //对应上面 eslint-config-prettier
  ],
```
### eslint对webpack别名报错
安装插件：
```
 "eslint-import-resolver-webpack": "^0.13.0",
```
在.eslintrc中配置：
```json
 "settings": {
    "import/resolver": {
      "webpack": {
        "config": "./webpack.config.base.js"//这里导入webpack中关于别名的配置
      }
    }
  },
```


### 存疑airbnb
在我用的项目中，貌似不必直接安装 airbnb包，一般都是安装"eslint-config-airbnb"包就可以了。就可以生效eslint了。


## prettier
### 在eslint中生效prettier/prettier

#### 配置eslit
代码格式、美观程度 要配置prettier，要想prettier生效，必须在下面三处配置：
不过eslint一般可以可以通过
```js
  "parser": "babel-eslint",
  "plugins": [
    "react",
    "jsx-a11y",
    "import",
    "prettier"//必须配置
  ],
  "extends": [
    "airbnb",
    "prettier"//必须配置
  ],
  "rules": {
    "prettier/prettier": "error",//必须配置
  }
```
不过eslint一般可以可以通过下面设置 空行控制，缩进设置，因此也可以不设置prettier；
```js
  "parser": "babel-eslint",
  "plugins": [
    "react",
  ],
  "extends": [
    "airbnb",
  ],
  "rules": {
    "indent": ["warn", 2],
    "no-multiple-empty-lines": ["warn", { "max": 2, "maxEOF": 1 }],
  }
```

#### 记得要安装prettier
除了上面的prettier插件，还要记得安装prettier。
