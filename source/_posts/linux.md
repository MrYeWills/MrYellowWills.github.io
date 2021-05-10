---
title: linux笔记
date: {{ date }}
tags: linux
categories: 
- 前端工具
series: linux
---

## 基础知识

### 虚拟机安装centos

#### 注意事项
![](/image/linux/instal.jpg)

### 调出终端方法

有两种终端，可以认为是一样的，一种是terminal，一种是tty。
tty是 真正的终端，没有图形界面，只有黑底白字的全屏幕的终端，只能通过键盘输入，也可以称为console (控制台)；

Terminal 是图形模式的终端，一般在centOS等Linux发行版下日常使用
#### Terminal(推荐)
Activities Overview  系统搜索工具，搜索Terminal。
![](/image/linux/terminal1.jpg)
#### tty终端
![](/image/linux/terminal2.jpg)


### [oscar@oscar-laptop ~ ] $ 什么意思

#### 概述
![](/image/linux/name1.jpg)
![](/image/linux/name2.jpg)
![](/image/linux/name3.jpg)

### 命令行提示符中表示权限的字符
`$` 表示普通用户，有权限的限制；
`#` 表示超级用户， 也就是root；
```sh
[hz@localhost ~]$ su
Password: S
[root@localhost hz]# exit
exit
[hz@localhost ~]$
```
执行su进入超级用户；
执行exit退出超级用户。

### 其他

#### 启动电脑过程
![](/image/linux/start.png)

#### GNU与linux
linux的官方称谓应该是“GNU/Linux”，一般简称Linux；
GNU项目+Linux（系统内核）= GNU/Linux 完整的操作系统
![](/image/linux/op.jpg)

#### 三大操作系统的关系
![](/image/linux/line.jpg)
![](/image/linux/line1.jpg)

#### 不同的Linux发行版
![](/image/linux/version.jpg)
![](/image/linux/version1.jpg)
![](/image/linux/version2.jpg)

### 命令行参数赋值
短参数赋值，通常是这样的： command -p 10

长参数赋值， 通常是这样的：  command --parameter=10




