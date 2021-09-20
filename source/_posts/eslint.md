---
title: eslint笔记
date: 2021/5/9
tags: [eslint]
categories: 
- 前端工程
series: 前端工程
---


## 前言
*本文讲解的都基于vscode作为项目ide*
eslint 学习之难 不在于eslint学习本身,主要在于eslint的关联性太广。
eslint本身的知识 如各种规则、配置、命令行之外，还需对eslint 的 plugin 和 extends的开发机制有所了解 这二者缺一不可。
除此之外，还需了解 babel、webpack、prettier、stylelint、vscode插件和配置、ts、npm(scripts、peerDependencies)。
eslint虽小，内有乾坤。

## prettier

### eslint-plugin-prettier 与 eslint-config-prettier 关系

这里基于二者源码中package.json的peerDependencies分析关系，目的是引导大家阅读eslint相关包的peerDependencies。
#### eslint-plugin-prettier 依赖 eslint-config-prettier
eslint-plugin-prettier 依赖 eslint-config-prettier ，但 单独安装 eslint-plugin-prettier 又不会 安装eslint-config-prettier。
参考 eslint-plugin-prettier 的 package.json 中确实有 eslint-config-prettier：
 
```json
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
```

因为放到 devDependencies中不会被安装，但在peerDependenciesMeta声明了，所以eslint-config-prettier是必须的， 因此要记得安装 eslint-config-prettier prettier；

#### 读peerDependenciesMeta很重要
如上，从peerDependenciesMeta可以看到eslint-plugin-prettier dependencies之外必须的依赖。
很多包安装上后，不生效，原因都是因为没有安装 peerDependenciesMeta 定义的包。

#### eslint包为什么容易出现peerDependenciesMeta
eslint相关的包，如上面的eslint-config-prettier，为什么容易出现peerDependencies(Meta)?
因为eslint的包解析 依赖 babel prettier eslint ，而 babel这些，是项目必备的，项目在没有eslint前，就已经安装babel，
如果 eslint相关包也指定安装babel，容易出现 babel版本不一致导致的冲突，
因此会将这些公共的包放到 peerDependencies(Meta)中，避免冲突，同时告诉使用者，这些包是必须的。

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
  `plugin:prettier/recommended` 是用 eslint-config-prettier关闭所有prettier与eslint 冲突的规则，然后使用并打开eslint-plugin-prettier定义的规则(`'prettier/prettier': 'error'`)。
  以此避免代码prettier之后，又会因为不符合eslint规则，被eslint报错。

### prettier配合eslint配置套路
如`plugin:prettier/recommended`展示的，先使用eslint-config-prettier关闭 eslint冲突规则，然后在rules中定义 `'prettier/prettier': 'error'` 这里的 前一个 prettier 代指 eslint-plugin-prettier, 开启 prettier规则。

### 需配合.prettierrc.js使用(解决逗号等问题)
除了在.eslintrc.js中配置相关的 eslint-plugin-prettier 规则外，还要在.prettierrc.js额外定义一些配置，以解决诸如 单引号、行尾是否需为LF、CRLF 等问题。
eslint-plugin-prettier 都是基于prettier包的，此prettier包会读取.prettierrc.js配置。

### 选择的方案
js jsx ts tsx 文件使用eslint格式化，不用prettier格式化，只使用集成了prettier的eslint来格式化；
css less sass 格式化交给stylelint；
md、json文件的格式化使用prettier, 如果项目这部分文件用的少，也可以忽略处理；

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
[参考官网](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)
使用此命令查看eslint-config-airbnb所有的安装依赖 

### npx install-peerdeps --dev eslint-config-airbnb
如果你是 npm install eslint-config-airbnb 只会安装 eslint-config-airbnb 本身，不会安装eslint-config-airbnb依赖的其他包。
此时用 npx install-peerdeps 可一键安装eslint-config-airbnb包本身及它所有依赖的包。
[参考官网](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)

## eslint 调试 - 专治各种不生效

下面列举eslint的调试方式以及不生效的原因。
### npx eslint src/app.js
之前一直习惯结合 vscode的插件使用eslint，很少使用eslint命令行，遇到eslint不生效的问题，也不知道原因，全程只靠猜和经验。
后面才发现eslint也是有调试方法的，就是我们熟悉的eslint命令行，
一旦运行命令 `npx eslint src/app.js` ,就会告诉你eslint不生效的原因。


### peerDependencies
比如使用airbnb不生效，可以去github官网查询 airbnb 的peerDependencies是否都安装了，
参考上面的《eslint-plugin-prettier 与 eslint-config-prettier 关系》有关 peerDependenciesMeta 的讲解。

### 版本要一致
各种包我都安装了，依然不生效，此时就要看版本是否一致了，可以去各个包的GitHub上看readme，上面会记录版本变动带来的使用方式的改变。
比如 eslint-config-prettier ,8.0版本以前使用方法：
```js
extends: ['prettier', 'prettier/react']
```
8.0版本后，合并了'prettier/react'，只需要配置如下即可， [参考](https://github.com/prettier/eslint-config-prettier)：
```js
extends: ['prettier']
```
假如还是像以前一样配置成`['prettier', 'prettier/react']` eslint将不生效，
但这种不生效最隐蔽，因为通过`npx eslint --fix src/app.js`并不会告诉你哪里出错了，然后凭借以前prettier的使用习惯，又不会认为有问题，
最后可能要花费很多时间排查到原因。
### 配置语法错误
定义不存在的错误配置或错误的plugin会导致eslint不生效。
这种不生效，可能运行 `npx eslint --fix src/app.js` 也不会提示，导致排查问题困难。
在试了eslint不生效的各种方法后还未找到原因的，可以试试把rules的配置一个个删除，再调试下。
```js
{
  rules: {
    //iAmErrorRulesxxxx 和 iAmErrorRulesxxxxPlugin 是不存在的rules。
    'iAmErrorRulesxxxx': 'error',
    'iAmErrorRulesxxxxPlugin/gogo': 'error',
    }
}
```

这一条适用于 stylelint ，这种报错的排查在stylelint中非常隐蔽，因为不会有任何提示。

### vscode调试eslint注意点
安装了eslint相关包后，vscode的eslint插件可能不会对最新的eslint立即生效。
可以通过以下方式查看最新的eslint生效情况：
- 注释和解注释 .eslintrc.js 的 extends，达到让eslintrc.js配置onChange的效果，vscode的插件可能监听了.eslintrc.js的变化, 但此方法是否生效有一定的概率性。
- 终端运行`npx eslint --fix src/app.js`，命令行始终能查看到最新的生效情况

- 重启vscode，这是终极解决方法，把把灵光

## vscode
### 使用eslint插件
下图的灯泡和错误红线高亮提示，都是vscode的eslint插件作用的效果。
![](/image/eslint/vs.png)

eslint插件安装只是前提条件，
还要求项目中的eslint的是生效的，因此需要项目配置好eslint的相关npm包，以及正确的eslint配置，
满足以上条件后才有上面图片中的效果。

### vscode的三种setting.json
下面是打开 vscode的三种setting.json的方式, 充分认识这三种json的作用和区别是vscode使用者的必备技能，可网上查阅相关知识。
![](/image/eslint/set1.png)
点击后，跳出下面的输入框，输入 setting.json 打开三种setting.json。
分别为 用户目录下、项目目录下、defaultsetting，作用范围分别为 电脑用户下所有的项目、工程目录下、默认setting
![](/image/eslint/set2.png)
![](/image/eslint/set3.png)
![](/image/eslint/set4.png)
![](/image/eslint/set5.png)

### 设置vscode保存后自动修复
设置工程目录下的setting.json如下,保存后，vscode会修复所有lint相关的报错，包括eslint、stylelint。
有两个前提： 
- 项目下的eslint是生效的 (安装好eslint相关的npm包和配置好相关配置);
- 安装好(vscode的)eslint插件
```js
{
    "editor.codeActionsOnSave": {
        "source.fixAll": true
      }
}
```

## stylelint

### 配置
配置情况参考 https://github.com/umijs/fabric

### 保存后自动修复

保存后自动修复参考 《vscode - 设置vscode保存后自动修复》

### stylelint调试(踩坑)

参考《eslint 调试 - 专治各种不生效》中的 《配置语法错误》



## 重难点配置讲解

### parserOptions.babelOptions
parserOptions 是用来给 eslint.parser 配置选项的。
babelOptions 的解释参考 [@babel/eslint-parser github](https://github.com/babel/babel/tree/main/eslint/babel-eslint-parser)，是 @babel/eslint-parser 这个自定义parser的独有配置。
如果没有配置或未定义 babelOptions ，@babel/eslint-parser 将不解析很多实验性或很新的es语法。

@babel/eslint-parser 是自定义parser，每个自定义parser有自己独有的parserOptions配置，比如babelOptions是@babel/eslint-parser的配置，
但@typescript-eslint/parser 就没有parserOptions.babelOptions配置，
而parserOptions.project 是@typescript-eslint/parser独有配置。

理解parserOptions.babelOptions的关键在于，要理解@babel/eslint-parser 是自定义eslint parser，有别于eslint默认parser：
[参考官网](https://eslint.bootcss.com/docs/user-guide/configuring#specifying-parser)
[参考 ESLint 的 parser 是个什么东西](https://zhuanlan.zhihu.com/p/295291463)
```
注意，在使用自定义解析器时，为了让 ESLint 在处理非 ECMAScript 5 特性时正常工作，配置属性 parserOptions 仍然是必须的。解析器会被传入 parserOptions，但是不一定会使用它们来决定功能特性的开关。
```


### 其他配置
参考官网 https://eslint.bootcss.com/docs/user-guide/configuring


## eslint 踩坑
### 无用的  'prettier/react'
无用的  'prettier/react' ，会导致 eslint 无效； 参考 https://github.com/prettier/eslint-config-prettier ， 从8.0 版本后，只需要配置 prettier 即可；
其他参考本文《eslint 调试 - 专治各种不生效  -  版本要一致》的讲解。

### eslint.extends的隐蔽报错
依然分析上面《无用的  'prettier/react'》。
eslint-config-prettier 8.0版本之后，继续配置：
```js
extends: ['prettier', 'prettier/react']
```
将导致eslint不生效，而且各种调试方式下，都不会有提示，为什么？
因为我们已经安装了 eslint-config-prettier，
因此错误配置'prettier/react'并不会报找不到 eslint-config-prettier，导致排查原因非常难。

这种场景适用于 extends配置了带 `/` 的 eslint-config-* 或eslint-plugin-* 。


## eslint解决方案和小技巧
这里记录eslint如何解决一些如别名等的方案，以及eslint使用小技巧


### 定义配置文件为 .eslintrc.js

eslint配置文件可以为多种文件，[参考](https://eslint.bootcss.com/docs/user-guide/configuring#configuration-file-formats)。
不过推荐定义为.eslintrc.js，因为这是js语法，扩展性更强。


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
[讲解参考这里：](https://www.jb51.net/article/153167.htm)
 这里传入webpack并不是import插件能识别webpack，而且通过npm安装了「eslint-import-resolver-webpack」，
「import」插件通过「eslint-import-resolver-」+「webpack」找到该插件并使用，就能解析webpack配置项。使用里面的参数。
 主要是使用以下这些参数，共享给import规则，让其正确识别import路径

### 使用`eslint --init`生成eslint测试demo
若要玩玩eslint的配置，可以在你的工程下，执行命令,会生成基础eslint配置和与之匹配的eslint版本，保证测试demo eslint一定生效：
```
npx eslint --init
```

## eslint 学习经验
- 将eslint官网全部刷几遍，做到一定程度的理解，一定要全部刷几遍，这样才对eslint有立体认识。[点击查看官网](https://eslint.bootcss.com/docs/user-guide/configuring)

- 要多看或直接看各个eslint相关的包的github，因为那里才是最新的，github上讲的比博客更全面更新：
有些博客将的使用方法，可能已经过时了，在不生效的情况下，应该要去GitHub上看readme。

## 参考

### 理论篇
- [官网](https://eslint.bootcss.com/docs/user-guide/configuring)
- [ESLint配置文件plugins、extends、rules的区别](https://segmentfault.com/a/1190000040160724?utm_source=sf-similar-article)
- [Eslint中plugins和extends的区别](https://juejin.cn/post/6859291468138774535)
- [ESLint 的 parser 是个什么东西](https://zhuanlan.zhihu.com/p/295291463)
- [vue中eslintrc.js配置最详细介绍](https://www.jb51.net/article/153167.htm)
- [贴心的 eslint 各配置项详解](https://www.jianshu.com/p/18b27d97a5e7)
- [从零搭建一个react-hooks项目（六）-- 自动保存](https://juejin.cn/post/6926080675623731214)
- [EditorConfig for VS Code 插件](https://juejin.cn/post/6993642069201780743)

### 可用于综合测试eslint的项目demo
- [Webpack从零配置React的运行环境上篇——搭建基本环境](https://segmentfault.com/a/1190000021464216)
- [Webpack从零配置React的运行环境下篇——优化打包策略](https://segmentfault.com/a/1190000021492350)

- [最全的Eslint配置模板，从此统一团队的编程习惯](https://juejin.cn/post/6844903859488292871)
- [最全的Eslint配置模板，从此统一团队的编程习惯 demo](https://github.com/linxiaowu66/eslint-config-templates)

### umijs/fabric
- [umijs/fabric](https://github.com/umijs/fabric)

## 彩蛋

### 找@babel/eslint-parser github仓库的方法
![](/image/eslint/p1.png)
![](/image/eslint/p2.png)
![](/image/eslint/p3.png)
地址如下：
https://github.com/babel/babel/tree/main/eslint/babel-eslint-parser

### 找@babel/core github仓库的方法
方法与之前一样，差异部分如下：
![](/image/eslint/b1.png)
![](/image/eslint/b2.png)



### 找eslint-config-airbnb-base github仓库的方法
#### 步骤
![](/image/eslint/a1.png)
![](/image/eslint/a2.png)
![](/image/eslint/a3.png)

#### 秘密都在package.json中
为什么是在根目录的packages下，可以从package.json看出，
所以面对一个github仓库管理多个npm包源码时，要多看package.json：
![](/image/eslint/a4.png)











