---
title: umi系列(六) 配置源码位置
date: 2022/5/24
tags: umi
categories: 
- umi系列
series: 基建
---



记录 各个配置对应的源码位置

## 参考

### 文档

## 待研究


## preset-umi

### 别名 alias

```js
// packages\preset-umi\src\features\configPlugins\configPlugins.ts
 alias: {
      umi: '@@/exports',
      react:...,
    },

memo.alias = {
  ...memo.alias,
  '@': args.paths.absSrcPath,
  '@@': args.paths.absTmpPath,
};
```

###  文件生成
packages\preset-umi\src\features\tmpFiles\tmpFiles.ts