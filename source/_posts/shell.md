---
title: shell脚本demo
date: 2021/8/1
tags: shell
categories: 
- 工具
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

### 命令行输出过多重定向到文本显示

```s
  npm list > test.txt
```

### 批量读取目录下所有文件内容
```sh
#!/bin/bash
# 批量读取文件目录下，所有文件，拿出所有文件的指定内容
# 注意目录路径要加一个*
for file in /Users/js/Desktop/git/YeWills.github.io/source/_posts/*
do
if [ -d "$file" ]
then 
  echo "$file is directory"
# -f 如果是文件，且文件存在，
elif [ -f "$file" ]
then
# 获取文件内容，写入到a.txt
  cat $file | grep title: >> a.txt
fi
done

```

关于 -f  [参考](https://blog.csdn.net/weixin_43025071/article/details/122337013)

#### 目录路径要加一个*
参考上面

#### 写入内容不用 echo
```sh
# 直接就可以写入到 a.txt;
cat $file | grep title: >> a.txt
```

正常可能需要 
```sh
echo "1" >> a.txt
```