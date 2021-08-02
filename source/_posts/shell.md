---
title: shell脚本demo
date: 2021/8/1
tags: shell
categories: 
- 前端工具
series: shell
---


## demo
### 自动npm发布脚本
#### 概述
```sh
#!/usr/bin/env sh
set -e
echo "enter release: "
read VERSION
read -p " release $VERSION - are you sure? (y/n) " -n 1 #-n 1限定输入一个字符
echo 
#貌似变量一定写成 $REPLY
if [[ $REPLY =~ ^[Yy]$ ]]  #$REPLY 是上面输入的  y 或 n 值定义的变量， =~ 启用正则匹配
then
    echo " releasing $VERSION ... "
    # git add -A
    # git commit -m "[build] $VERSION"
    # npm version $VERSION --message "[release] $VERSION"
    # git push origin master

    # npm publish
fi
```
npm script 定义：

```js
  "scripts": {
    "sl": "sh test.sh",
  },
```

#### 注意 $REPLY 的使用
如上
