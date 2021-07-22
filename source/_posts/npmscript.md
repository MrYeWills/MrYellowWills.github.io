---
title: npm script
date: 2020/5/1
tags: npm-script
categories: 
- 前端工具
series: 前端工具
---


## 基础知识

### npx node-sass

```s
npx node-sass variables.scss var.css  #被编译的scss文件， 编译后输出的文件
```

## 黑知识

### 关于pre的写法
如果npm script 写法中带有预先 pre，如下面的commit，那么在执行npm run commit 之前就会执行precommit命令？？
存疑，待研究。

```json
"scripts": {
    "precommit": "lint-staged",
    "lint": "npm run lint:js && npm run lint:style && npm run lint:prettier",
    "lint-staged": "lint-staged",
    "lint-staged:js": "eslint --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint --fix --cache --ext .js,.jsx,.ts,.tsx --format=pretty \"./packages/**/src/**\" && npm run lint:style",
    "lint:js": "eslint --cache --ext .js,.jsx,.ts,.tsx --format=pretty \"./packages/**/src/**\"",
    "lint:prettier": "check-prettier lint",
    "lint:style": "stylelint --fix \"**/*.less\" --syntax less",
    "prettier": "prettier -c --write \"**/*\""
  },
```

### npm script、命令行、npx
#### 三者关系
shell能执行的命令，就可以写在npm script 上;
特殊的是，npm script 的bin目录除了全局的外，还有 node_module 内的bin;
如果不使用npm script，直接在命令行执行， 就必须 写 node_module的全命令;

![](/image/npmscript/npx.png)
![](/image/npmscript/run.png)
#### npm script 与 环境变量 path
npm run shell 命令 特殊之处 在于 在命令运行时，会将 node module 的bin 放入环境变量path 中，这样就能直接使用node moduel命令，
npm run 执行完毕 又将此 path 变量 释放。