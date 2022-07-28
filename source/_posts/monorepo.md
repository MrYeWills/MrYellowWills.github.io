---
title: monorepo笔记
date: 2022/07/27
tags: [monorepo, lerna]
categories: 
- 前端工具
series: monorepo
---


## lerna笔记

### 学习体会
昨天开始把 lerna官网，全英文的刷了遍，加在一起，不超过8小时，
但解决了很多疑问，
这次本打算，先刷一波相关的视频，然后再看文档，再看官网的，
索性直接刷官网了，
因为之前有使用lerna的基础，从头刷官网，整体刷一遍，感觉收获非常大，已经不需要再刷其他教程，可以直接上手使用learn了。
原本打算至少要花三天或更多时间，最后只用了一天半就搞定。
结合之前 label、webpack、eslint、umi、verdaccio 等经验，确实，学东西，直接去官网刷，可以作为第一选择，
如果之前没有相关经验，那么官网也会有快速示例让你体验，都是由浅及深，
而且官网讲究连续性，只有从头读完，反而理解起来更加容易，如果只看某一部分，很可能看不懂。

### 基础知识


#### 关于^prod 的解释

```js
{
  "namedInputs": {
    "default": ["{projectRoot}/**/*"],
    "prod": ["!{projectRoot}/**/*.spec.tsx"]
  },
  "targetDefaults": {
    "build": {
      "inputs": ["prod", "^prod"]
    },
    "test": {
      "inputs": ["default", "^prod", "{workspaceRoot}/jest.config.ts"]
    }
  }
}
```

>[参考官网](https://lerna.js.org/docs/features/cache-tasks)
With this configuration, the build script will only consider the non-test files of remixapp, header and footer. The test script will consider all the source files for the project under test and only non-test files of its dependencies. The test script will also consider the jest config file at the root of the workspace.

其实就是 ^其实是用来约束 pkg中的 dependencies pkg 的。


#### `--`的两种用法
#### 与lerna exec一起使用

```s
$ lerna exec --scope my-component -- ls -la
```
这个 -- ls -la 中的 -- 是什么意思？

目前知道上面这句话 应该就是 过滤 my-component ，然后执行命令bash命令 ls -la 
[参考](https://github.com/lerna/lerna/tree/main/commands/exec#readme)


#### 与lerna run 一起使用
```s
lerna run --scope my-component test
```
这里有 -- 的解释，其实就是，如果要传条件，就用这个； 
与上面的  lerna exec --scope my-component -- ls -la 中的 -- ，可能意义不一样，
也可能一样

>[参考](https://github.com/lerna/lerna/tree/main/commands/run#readme)
Run an npm script in each package that contains that script. A double-dash (--) is necessary to pass dashed arguments to the script execution.





