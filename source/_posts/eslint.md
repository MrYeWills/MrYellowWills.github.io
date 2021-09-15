---
title: eslint笔记
date: 2021/5/9
tags: [eslint]
categories: 
- 前端工程
series: 前端工程
---



## eslint

### 内容
eslint 基础知识
eslint 调试各种不生效
 - 延申 npm 的包知识
 - 为什么eslint总是不生效
eslint 配合 vscode 使用
eslint 与 prettier
eslint 配合 ts
eslint 与 新的 babel parse
eslint 各个重难点配置讲解
eslint extend与插件
eslint 与stylelint
eslint 踩坑
eslint 学习感受


## eslint 学习经验
要多看或直接看各个eslint相关的包的github，因为那里才是最新的，github上讲的可能比博客更全面，更新；


## eslint 与 prettier

### eslint-plugin-prettier 与 eslint-config-prettier 关系
#### eslint-plugin-prettier 依赖 eslint-config-prettier
eslint-plugin-prettier 依赖 eslint-config-prettier ，但 单独安装 eslint-plugin-prettier 又不会 安装eslint-config-prettier，
但 参考 eslint-plugin-prettier 的 package.json 中确实又 eslint-config-prettier：
 
  "devDependencies": {
    "@not-an-aardvark/node-release-script": "^0.1.0",
    "eslint": "^7.0.0",
    "eslint-config-not-an-aardvark": "^2.1.0",
    "eslint-config-prettier": "^6.0.0",
    "eslint-plugin-eslint-plugin": "^2.0.0",
    "eslint-plugin-node": "^8.0.0",
    "eslint-plugin-self": "^1.1.0",
    "mocha": "^6.0.0",
    "prettier": "^1.15.3",
    "vue-eslint-parser": "^6.0.0"
  },
  "peerDependenciesMeta": {
    "eslint-config-prettier": {
      "optional": true
    }
  },

因为放到 devDependencies中不会被安装，但在peerDependenciesMeta声明了，所以eslint-config-prettier是必须的， 因此要记得安装 eslint-config-prettier prettier；

#### 读peerDependenciesMeta很重要
如上，从peerDependenciesMeta可以看到eslint-plugin-prettier的其他必须依赖。
很多包安装上后，不生效，原因都是因为没有安装 peerDependenciesMeta 的包。

#### eslint相关包为什么有更多的peerDependenciesMeta
不是所有的包，比如 react有这么多复杂的依赖关系，你只需要安装react相关包就可以运行，但为什么eslint相关的包有这么多的 peerDependenciesMeta 关系？
因为eslint的包解析 依赖 babel prettier eslint ，而 babel等这些，是项目必备的，项目在没有eslint前，就已经安装babel，
如果 eslint相关包也指定安装babel，容易出现 babel版本不一致导致的冲突，
因此会将这些公共的包放到 eslint中，避免冲突，同时告诉使用者，这些包是必须的，

### 选择的方案
不用prettier格式化项目，只使用集成了prettier的eslint来格式化 js；
css less sass 格式化交给stylelint；
md与json文件的格式化这部分本应该用 prettier，但项目用的不多，可以忽略不管；


## eslint 踩坑

### 无用的  'prettier/react'
无用的  'prettier/react' ，会导致 eslint 无效； 参考 https://github.com/prettier/eslint-config-prettier ， 从8.0 版本后，只需要配置 prettier 即可；




## eslint 配合 vscode 使用
### 必须要打开vscode的eslit配置
打开vscode，点击下面进行eslint设置，
如下图是设置好的，没有设置好，是禁用，可参考[blog](https://blog.csdn.net/jinlx_/article/details/109381941)
![](/image/blog_flow/pro.jpg)
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
