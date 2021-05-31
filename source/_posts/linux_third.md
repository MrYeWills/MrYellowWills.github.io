---
title: linux笔记(下)
date: 2021/5/30
tags: linux
categories: 
- 前端工具
series: linux
---

##  管理服务器和服务

### 守护进程和初始化进程服务

#### 进程
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

 #### 守护进程 (特殊进程)
 linux有些特殊进程 只在后台运行；
 这些父进程的PID为1；
 PID为1的进程只在系统关闭时才会被销毁；
 我们将这类特殊进程称之为 daemon 守护进程；daemon是古希腊神话中的半神半人精灵、守护神；
 因此守护进程也称为 精灵进程；
 守护进程也被称为 service（服务）；
 服务器软件大多都是以守护进程的形式运行的；
 守护进程的名字通常会在最后有一个d，表示 daemon；
 例如 systemd，httpd， smbd 等等；

 #### linux操作系统的开机过程
![](/image/linuxt/ser.png)


 #### 初始化进程服务
centos自从 centos7以来，以systemd命令来设置服务，关键字是 systemctl ：
![](/image/linuxt/ser1.png)
![](/image/linuxt/ser2.png)

### 用systemd管理系统服务

#### systemd

systemd 是几乎所有最新的linux发行版采用的初始化系统；也可以称之为初始化进程服务；
systemd 的 pid 是1；
其他进程都是它的子进程； 

systemd 并不是一个命令，它包含了一组命令，涉及到系统进程管理的方方面面；
systemd 是基于事件的，这使得它拥有更灵活的机制；
systemd 可以使进程并行启动，并非常精致的管理各种依赖关系；
管理任务的计划，系统日志，外设 等；

#### 管理进程的启动和停止

systemd 提供了 systemctl 命令；
使得我们可管理 unit 单元；
对systemd来说，unit泛指它可以操作的任何对象；

unit 可以有不同的类型： 服务(比如 精灵进程)， 挂载（mount）， 外设，等等；
守护进程就属于 service 服务 类型；



   45  yum -y install samba
   46  systemctl start smb
   47  ps -aux | grep smb





