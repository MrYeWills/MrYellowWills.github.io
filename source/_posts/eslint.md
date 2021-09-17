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
    eslint 插件
eslint 与 prettier
eslint 配合 ts
eslint 与 新的 babel parse
eslint 各个重难点配置讲解
eslint extend与插件
eslint 与stylelint
eslint 踩坑
eslint 学习感受
 - 建议配置成 .eslintrc.js 配置；
 - 使用eslint --init 初始化一个测试eslint项目，会直接生效；

## eslint 学习经验
要多看或直接看各个eslint相关的包的github，因为那里才是最新的，github上讲的可能比博客更全面，更新；
eslint的命令 的解释可以参考eslint官网，eslint官网内容不多，花点时间多将官网内容多刷几遍。

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

### plugin:prettier/recommended的实质
参考eslint-plugin-prettier源码， plugin:prettier/recommended的实质是：
```js
 configs: {
    recommended: {
      extends: ['prettier'],
      plugins: ['prettier'],
      rules: {
        'prettier/prettier': 'error',
        'arrow-body-style': 'off',
        'prefer-arrow-callback': 'off'
      }
    }
  },
```
  plugin:prettier/recommended 是用 eslint-config-prettier关闭所有与eslint 冲突规则，然后使用eslint-plugin-prettier定义的规则(`'prettier/prettier': 'error'`)， 避免prettier之后又会因为不符合eslint规则，被eslint报错。

### prettier配合eslint配置套路
如`plugin:prettier/recommended`展示的，先使用eslint-config-prettier关闭 eslint冲突规则，然后在rules中定义 `'prettier/prettier': 'error'` 这里的 前一个 prettier 代指 eslint-plugin-prettier, 开启 prettier规则。

### 需配合.prettierrc.js使用(解决逗号等问题)
除了在.eslintrc.js中配置相关的 eslint-plugin-prettier 规则外，还要在.prettierrc.js额外定义一些配置，以解决诸如 单引号、行尾是否需为LF、CRLF 等问题。
eslint-plugin-prettier 都是基于prettier包的，此prettier包会读取.prettierrc.js配置。

### 选择的方案
不用prettier格式化项目，只使用集成了prettier的eslint来格式化 js；
css less sass 格式化交给stylelint；
md与json文件的格式化这部分本应该用 prettier，但项目用的不多，可以忽略不管；


## airbnb
### eslint-config-airbnb-base 与 eslint-config-airbnb
参考GitHub官网：
Our default export contains all of our ESLint rules, including ECMAScript 6+ and React. It requires eslint, eslint-plugin-import, eslint-plugin-react, eslint-plugin-react-hooks, and eslint-plugin-jsx-a11y. If you don't need React, see eslint-config-airbnb-base.

### eslint-plugin-jsx-a11y 与 eslint-config-airbnb

如上，eslint-config-airbnb 包含了 eslint-plugin-jsx-a11y 的规则。

### 如果不用React，请用eslint-config-airbnb-base
参考上面

### 自定义规则通常结合eslint-config-airbnb-base

自定义规则通常结合eslint-config-airbnb-base而非eslint-config-airbnb,
然后自行引入 react、hooks 规则
参考 https://github.com/umijs/fabric

### npm info "eslint-config-airbnb@latest" peerDependencies
此命令同 `npm view "eslint-config-airbnb@latest" peerDependencies`
参考官网 https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb，
使用此命令查看eslint-config-airbnb所有的安装依赖 

### npx install-peerdeps --dev eslint-config-airbnb
如果你是 npm install eslint-config-airbnb 只会安装 eslint-config-airbnb 本身，不会安装eslint-config-airbnb还依赖的其他包。
此时用 npx install-peerdeps 可以安装eslint-config-airbnb包本身，以及他要sheng

## eslint 调试 - 专治各种不生效

### npx eslint --fix src/app.js
之前一直习惯使用 vscode的插件使用eslint，总是遇到eslint不生效的问题，
也不知道原因。
此时运行命令 `npx eslint --fix src/app.js` ,就会告诉你不生效的原因。


### peerDependencies
比如使用airbnb不生效，可以去github官网查询 airbnb 的peerDependencies是否都安装了，
参考上面的《eslint 与 prettier》有关 peerDependenciesMeta 的讲解。

### 版本要一致
各种包我都安装了，依然不生效，此时就要看版本是否一致了，可以去各个包的GitHub上看readme，上面会记录版本变动带来的使用方式的改变。
比如 eslint-config-prettier ,8.0版本以前使用方法：
```js
extends: ['prettier', 'prettier/react']
```
8.0版本后，合并了'prettier/react'，只需要配置如下即可， 参考https://github.com/prettier/eslint-config-prettier：
```js
extends: ['prettier']
```
假如还是像以前一样配置成`['prettier', 'prettier/react']` eslint将不生效，
但这种不生效最隐蔽，因为通过`npx eslint --fix src/app.js`并不会告诉你哪里出错了，然后凭借以前prettier的使用习惯，又不会认为有问题，
最后可能要花费很多时间排查到原因。
### 配置语法错误
定义不存在的错误配置或错误的plugin会导致eslint不生效。
这种不生效，可能运行 `npx eslint --fix src/app.js` 也不会提示，
在试了eslint不生效的各种方法后，还未找到原因的，可以试试把rules的配置一个个删除，调试下。
```js
{
  rules: {
    //iAmErrorRulesxxxx 和 iAmErrorRulesxxxxPlugin 是不存在的rules。
    'iAmErrorRulesxxxx': 'error',
    'iAmErrorRulesxxxxPlugin/gogo': 'error',
    }
}
```

这一条适用于 stylelint ；

### vscode调试eslint注意点
安装了eslint相关包后，vscode的eslint插件可能不会对最新的eslint立即生效。
可以通过以下方式查看最新的eslint生效情况：
- 注释和解注释 .eslintrc.js 的 extends，达到让eslintrc.js配置onChange的效果，vscode的插件可能监听了.eslintrc.js的变化, 但此方法是否生效有一定的概率性。
- 终端运行`npx eslint --fix src/app.js`，命令行始终能查看到最新的生效情况

- 重启vscode，这是终极解决方法，把把灵光


## 重难点配置讲解

### parserOptions.babelOptions
parserOptions 是用来给 parser 配置的。
babelOptions 的解释参考 @babel/eslint-parser github，是 @babel/eslint-parser 这个自定义parser的独有配置，
如果没有配置，或未定义 babelOptions ，@babel/eslint-parser 将不解析很多实验性或很新的es语法。
@babel/eslint-parser 是自定义parser，每个自定义parser有自己独有的parserOptions配置，比如babelOptions是@babel/eslint-parser的配置，
但@typescript-eslint/parser 就没有parserOptions.babelOptions配置，
parserOptions.project 是@typescript-eslint/parser独有配置


## eslint 踩坑

### 无用的  'prettier/react'
无用的  'prettier/react' ，会导致 eslint 无效； 参考 https://github.com/prettier/eslint-config-prettier ， 从8.0 版本后，只需要配置 prettier 即可；

## eslint 小技巧

### --format=pretty 用来美化控制台信息的输出
 `--format=pretty`用来格式化控制台信息的输出，控制台看起来更加美观；
```s
   npx eslint --format=pretty ./src/app.js    
```
详细参考https://eslint.org/docs/user-guide/formatters/#eslint-formatters

### import/resolver解决eslint识别webpack别名
import/resolver其实就是eslint-import-resolver-webpack。
配置如下：
```js
//.eslintrc.js
  "settings": {
    "import/resolver": {
      "webpack": {
        "config": "./webpack.config.base.js"
      }
    }
  },
```

### 使用命令行生成eslint测试demo
若有玩玩eslint的配置，可以在你的工程下，执行命令,会生成基础eslint配置和与之匹配的eslint版本，保证测试demo eslint一定生效：
```
npx eslint --init
```

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



## stylelint笔记

### stylelint调试

参考《eslint 调试 - 专治各种不生效》中的 《配置语法错误》

## 待做

vscode 自带的format功能 与eslint插件修复功能，区别是什么？？
有空研究一下 vscode 的 save fix 的配置，配合 eslint stylelint 的使用；几种save fix的区别。 
  
```js
  "editor.codeActionsOnSave": {
        "source.fixAll": true
      }

  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": true
  }
  
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.fixAll.stylelint": false
  }
  
  "[html]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.stylelint": false
    }
  }
  
```

beta 版本 是否不被下载； beta的作用用于线上测试， 如果是beta版本，是否不会被npm 自动安装上，这样就进行线上测试了？；