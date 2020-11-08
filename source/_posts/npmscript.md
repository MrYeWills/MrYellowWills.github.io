---
title: npm script
date: {{ date }}
tags: npm-script
categories: 
- 前端工具
series: 前端工具
---

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
