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
守护进程就属于 service 服务 类型，是上面unit的一种；

```s
yum -y install samba  #smb命令需要安装samba
systemctl start smb
ps -aux | grep smb
systemctl status smb
systemctl stop smb
systemctl #不传参数相当于 systemctl list-units
systemctl list-units --type=service #查看unit type 为 service的 进程
```

target名称：
```s
systemctl list-units --type=target --all
```
![](/image/linuxt/tar.png)

#### 其他命令

可以通过 journalctl 命令来管理系统日志；
可以通过 systemd-analyze 命令来查看启动耗时；

#### 参考
更多Systemd知识，参考这篇博客：
[Systemd 入门教程](http://ruanyifeng.com/blog/2016/03/systemd-tutorial-commands.html)

## Apache
### httpd 与 Apache
Apache 是目前试错占有率很高的web服务程序
跨平台 Windows、linux、 macOS、Unix
```s
sudo yum install httpd
```
在centos等 red hat 一族中， apache 程序的名字叫 httpd ，因此安装 Apache 就是 安装 httpd；
httpd，后面有d，说明是一个精灵进程，后台一直运行。 
在Ubuntu 等 linux发行版中，依然叫 Apache；

### systemctl 管理 httpd
```s
systemctl start httpd #启动Apache服务
systemctl stop httpd #停止Apache服务
systemctl restart httpd #重启 Apache服务
systemctl reload httpd #重载Apache服务的配置文件，使配置生效
systemctl status httpd #查看状态
systemctl enable httpd #设置开机自动启动 Apache服务
systemctl disable httpd #设置开机不启动 Apache服务
systemctl is-enabled httpd #查看Apache服务是否开机启动 
```

### 服务器ip在 客户机访问Apache首页
Apache服务如果安装成功，那么可以通过服务器ip在 客户机访问，
但因为有防火墙的缘故访问不了，因为防火墙没有开放此端口号，
![](/image/linuxt/apa1.png)
可以通过命令来查看服务器开放的端口：
```s
firewall-cmd --list-ports
```

### 客户机如何访问服务器的Apache服务

```s
#方法一：
#可以通过关闭服务器防火墙来访问：

systemctl stop firewalld

```
然后在客户机上访问，出现下面页面说明成功：
![](/image/linuxt/apa1.png)

```s
#方法二 推荐：
#设置防火墙开放80端口 永久--permanent
firewall-cmd --zone=public --add-port=80/tcp --permanent
#上面设置后，使用此命令使设置立即生效，也可以不用此命令，重启电脑后生效
firewall-cmd reload 
#设置防火墙关闭80端口 永久--permanent
firewall-cmd --zone=public --remove-port=80/tcp --permanent
```

注意的是 每次你的虚拟机如果更换了网络，需要用 `systemctl restart network` 重新更新虚拟机ip配置；


### 配置 Apache服务
#### 下面是Apache服务的配置文件地址
![](/image/linuxt/apac.png)

```s
 vi /etc/httpd/conf/httpd.conf
```

#### 配置文件有以下类型：
![](/image/linuxt/apac1.png)
 全局配置，如下不用 `<Directory>` 包起来，比如 LogLevel warn 等等;
 区域配置，如下区域配置一般用 `<Directory>` 包起来;

#### 下面是配置文件部分示例

```conf
DocumentRoot "/var/www/html"  #  全局配置 
LogLevel warn # 全局配置

<Directory />  # 区域配置
    AllowOverride none
    Require all denied
</Directory>

# 说明针对 "/var/www" 的区域设置
<Directory "/var/www"> 
    AllowOverride None
    # Allow open access:
    Require all granted
</Directory>
```

#### 配置文件中常用的 httpd参数,
下面参数中，有些是全局配置，有些是区域配置参数
![](/image/linuxt/apac2.png)

如上图 Directory 是配置网站数据目录的权限，如下

```conf
<Directory /> #  配置根目录/
    AllowOverride none
    Require all denied
</Directory>

# 配置目录/var/www
<Directory "/var/www"> 
    AllowOverride None
    # Allow open access:
    Require all granted
</Directory>
```

### SELinux 安全子系统

#### 概述
SELinux 是 security-enhanced linux 缩写，表示 安全增强型 linux；

![](/image/linuxt/sel0.png)

#### 防火墙和 SELinux 的区别

防火墙就像防盗门，用于抵御外部的危险；
SELinux就像保险柜，用于保护内部的资源；
![](/image/linuxt/sel.png)


#### sestatus
sestatus  selinux status 缩写；此命令用于查看selinux状态
```s
[root@localhost ~]# sestatus  
SELinux status:                 enabled  # 是否启动
SELinuxfs mount:                /sys/fs/selinux
SELinux root directory:         /etc/selinux  # SELinux 主目录
Loaded policy name:             targeted
Current mode:                   enforcing  #  模式
Mode from config file:          enforcing
Policy MLS status:              enabled
Policy deny_unknown status:     allowed
Max kernel policy version:      31
```

### 设置apache配置实战之设置访问首页内容
#### 步骤如下
```s
[root@localhost /]# cd /
[root@localhost /]# mkdir /home
[root@localhost /]# cd /home
[root@localhost /]# mkdir /web
[root@localhost /]# pwd
/home/web
[root@localhost /]# echo "hellow world apache" >./index.html
[root@localhost /]# vim /etc/httpd/conf/httpd.conf
```

`/etc/httpd/conf/httpd.conf`修改部分如下：
```conf
DocumentRoot "/home/web"

<Directory "/home/web">
    AllowOverride None
    # Allow open access:
    Require all granted
</Directory>

```

```s
[root@localhost /]# systemctl reload httpd  重载apache，让配置立即生效
```

#### 配置的首页不生效
在客户机中访问服务器ip，发现还是原来的内容，没有显示自己设置的内容，
这是由于上面的SELinux安全限制的原因，由于 SELinux 的限制，让服务器继续显示之前的页面；

#### 配置SELinux
通过以下命令，可访问正确的页面；
```s
[root@localhost /]# setenforce 0  可使用下面命令暂时停掉 SELinux 服务，
# setenforce是暂时设置，系统重启后用原来的配置
# setenforce 1 是暂时设置为强制安全模式

[root@localhost /]# getenforce  查看 SELinux 的配置，发现是Permissive不限制的；
Permissive
```
再次访问可以显示正确页面：
![](/image/linuxt/apac3.png)


#### 配置不生效的本质原因
如下 `/var/www/html` 是 httpd 默认的原首页内容显示目录；
`/home/web`是 httpd 目前首页内容显示目录；
二者的安全上下文不同，从而触发了SELinux的安全策略，因此无法正常显示 设置后的页面内容。
解决之法，就是设置 安全上下文 根 `/var/www/html` 一样

```s
[root@localhost /]# ls -Zd /var/www/html #-Z 是显示目录的 权限 群组 安全上下文 等等 -d是不显示目录内容，只显示目录本身
# drwxr-xr-x. 权限 ； 用户和群组 root root ；  
#  system_u:object_r:httpd_sys_content_t:s0 安全上下文 ；
# 安全上下文 以冒号分隔，内容分别为 用户:角色:类型:其他信息
# system_u 代表系统进程
# object_r 文件目录角色
# httpd_sys_content_t 网站服务的系统文件
drwxr-xr-x. root root system_u:object_r:httpd_sys_content_t:s0 /var/www/html
[root@localhost /]# ls -Zd /home/web
drwxr-xr-x. root root unconfined_u:object_r:home_root_t:s0 /home/web
```

### 修改文件安全上下文

#### semanage 命令
semanage 是 SELinux manage 的缩写

semanage 的常用参数
-  -l 查询
-  -a 添加
-  -m 修改
-  -d 删除

运行 semanage命令，发现没有安装，
#### yun provides semanage 命令
可通过 yun provides semanage 找到如何安装,或找到 semanage 的安装依赖包名

```s
[root@localhost /]# yum provides semanage
Loaded plugins: fastestmirror
Loading mirror speeds from cached hostfile
 * base: mirrors.ustc.edu.cn
 * extras: mirrors.ustc.edu.cn
 * updates: mirrors.ustc.edu.cn

base/7/x86_64/filelists_db                               | 7.2 MB     00:01
extras/7/x86_64/filelists_db                             | 231 kB     00:00
updates/7/x86_64/filelists_db                            | 4.7 MB     00:00
# SELinux policy core python utilities 说明依赖包是policycoreutils-python
policycoreutils-python-2.5-34.el7.x86_64 : SELinux policy core python utilities 
Repo        : base
Matched from:
Filename    : /usr/sbin/semanage
```

进行安装
```s
 yum install policycoreutils-python
```


 #### semanage 修改上下文

```s
[root@localhost /]# setenforce 1 #暂时设置SELinux为强制安全模式，以便演示
#fcontext 上下文， 给/home/web 添加上下文 
#httpd_sys_content_t,这个就是上面 /var/www/html 的上下文
[root@localhost /]# semanage fcontext -a -t httpd_sys_content_t /home/web
#加*，给目录下所有文件 加上下文
[root@localhost /]# semanage fcontext -a -t httpd_sys_content_t /home/web/*
# restorecon 是restore content 缩写，让/home/web 下刚才设置的上下文生效
[root@localhost /]# restorecon -Rv /home/web
restorecon reset /home/web context unconfined_u:object_r:home_root_t:s0->unconfined_u:object_r:httpd_sys_content_t:s0
restorecon reset /home/web/index.html context unconfined_u:object_r:home_root_t:s0->unconfined_u:object_r:httpd_sys_content_t:s0
```
经过上面一顿操作后，重新访问，发现能正常访问新页面了










