---
title: linux笔记(中)
date: {{ date }}
tags: linux
categories: 
- 前端工具
series: linux
---


## 基础知识

### SSH相关及其登录

#### SSH概述
客户机，把连接到服务器的机器称之为客户机。

SSH协议是英语 Secure SHell的缩写， 表示“安全的shell”， shell 是英语 “壳”的意思。

#### SSH加密方式
对称加密， 也叫对称密钥加密； 致命缺陷，会话开始前 传递的密钥 可能会被截取， 从而变成相当于明文传输。

非对称 公钥加密 私钥解密；


SSH 结合使用非对称加密和对称加密两种方法；
首先 使用非对称加密，安全地传输对称加密的密钥；
之后，就一直使用对称加密的密钥来作为加密 和 解密的手段。

#### 服务器安装SSH服务
centos 服务器版本 默认安装 SSH服务，
安装SSH: yum install openssh-server 
启动： systemctl start(或 restart) sshd
设置开启启动： systemctl enable sshd
```s
#查看是否运行
ps -ef | grep ssh

#查看是否系统开机启动
systemctl list-unit-files | grep enabled
```
#### 客户端安装ssh工具

windows： 安装 putty，xshell， secureCRT， 这三款都是ssh的一个客户端，用于连接ssh服务器端；
linux： yum install openssh-clients
macOS 默认已经安装了ssh客户端；

ssh默认的端口是22,下面是putty安装：
推出连接：exit
![](/image/linux/put.png)

centos和macOS中连接是一样的：
```s
ssh root@172.20.10.2
```

查看 sshd 运行情况
```s
systemctl status sshd
```
![](/image/linux/run.png)


#### 配置SSH
在man 查找命令后，输入 `/`进行搜索。
man sshd_config

全局config文件有两个
ssh客户端配置： /etc/ssh/ssh_config (全局) 或 ~/.ssh/config (个人目录)) 
ssh服务端配置： /etc/ssh/sshd_config
查看使用手册：
```s
man sshd_config (ssh客户端)
man ssh_config (ssh客户端)
```
服务端config常用配置参数
PermitRootLogin 是否允许root用户身份登录
PasswordAuthentication 是否允许密码验证登录
PubkeyAuthentication 是否允许公钥登录
PermiEmptyPasswords 是否运行空密码登录

修改配置后，重启sshd服务立即生效
```s
sudo systemctl restart sshd 
```

#### 生成.ssh目录
root用户的家目录下，如果没有.ssh目录
使用以下命令生成： 
```s
ssh localhost
```

![](/image/linux/host.png)
![](/image/linux/host1.png)


#### 客户端配置登录
客户端配置.ssh config
局部的客户端config文件在用户家目录的.ssh隐藏目录中
```s
~/.ssh/config #(个人目录)) 
```
此文件一般默认没有创建，可以手动创建；
```s
ls -al
cd .ssh
touch config
chmod 600 config #修改权限，最好修改下，也可不修改
ls -l
nano config
Host rootali
    HostName 192.168.1.103
    Port 22
    User root
# 重新在客户端登录：
ssh rootali #rootali上面配置的别名
#输入密码可以登录了
```
    


 








