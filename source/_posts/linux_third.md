---
title: linux笔记(下)
date: {{ date }}
tags: linux
categories: 
- 前端工具
series: linux
---

##  管理服务器和服务

守护进程和初始化进程服务

一个运行起来的程序被称之为 进程
 
 ```s
[root@localhost h2]# ps -o ppid,pid,tty,cmd # -o 是指定显示什么内容列 PPID 父进程id， pid 自己id， tt就是tty窗口 cmd 什么进程
  PPID    PID TT       CMD
  2697  16107 pts/0    sudo su
 16107  16109 pts/0    su
 16109  16112 pts/0    bash
 16112  28766 pts/0    ps -o ppid,pid,tty,cmd
[root@localhost h2]# 
 ```

 守护进程 (特殊进程)
 linux有些特殊进程 只在后台运行；
 这些父进程的PID为1；
 PID为1的进程只在系统关闭时才会被销毁；
 我们将这类特殊进程称之为 daemon 守护进程；daemon是古希腊神话中的半神半人精灵、守护神；
 因此守护进程也称为 精灵进程；
 守护进程也被称为 service（服务）；
 服务器软件大多都是以守护进程的形式运行的；
 守护进程的名字通常会在最后有一个d，表示 daemon；
 例如 systemd，httpd， smbd 等等；

linux操作系统的开机过程
![](/image/linuxt/ser.png)


初始化进程服务
centos自从 centos7以来，以systemd命令来设置服务，关键字是 systemctl ：
![](/image/linuxt/ser1.png)
![](/image/linuxt/ser2.png)

