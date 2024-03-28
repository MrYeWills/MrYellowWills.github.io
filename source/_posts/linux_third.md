---
title: linux笔记(震)
date: 2021/5/30
tags: linux
categories: 
- linux
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
{% img url_for /image/linuxt/ser.png %}


 #### 初始化进程服务
centos自从 centos7以来，以systemd命令来设置服务，关键字是 systemctl ：
{% img url_for /image/linuxt/ser1.png %}
{% img url_for /image/linuxt/ser2.png %}

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
{% img url_for /image/linuxt/tar.png %}

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
{% img url_for /image/linuxt/apa1.png %}
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
{% img url_for /image/linuxt/apa.png %}

```s
#方法二 推荐：
#设置防火墙开放80端口 永久--permanent
firewall-cmd --zone=public --add-port=80/tcp --permanent
#上面设置后，使用此命令使设置立即生效，也可以不用此命令，重启电脑后生效
firewall-cmd reload 
#设置防火墙关闭80端口 永久--permanent
firewall-cmd --zone=public --remove-port=80/tcp --permanent
```

注意的是 每次你的虚拟机如果更换了网络或者网络断开重连后，需要用 `systemctl restart network` 重新更新虚拟机ip配置；


### 配置 Apache服务
#### 下面是Apache服务的配置文件地址
{% img url_for /image/linuxt/apac.png %}

#### 配置文件有以下类型：
{% img url_for /image/linuxt/apac1.png %}
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
{% img url_for /image/linuxt/apac2.png %}

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

{% img url_for /image/linuxt/sel0.png %}

#### 防火墙和 SELinux 的区别

防火墙就像防盗门，用于抵御外部的危险；
SELinux就像保险柜，用于保护内部的资源；
{% img url_for /image/linuxt/sel.png %}


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

### 配置实战 ：修改访问首页内容
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
{% img url_for /image/linuxt/apac3.png %}


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



### DHCP 动态、静态分配IP


#### DHCP: 动态主机配置协议
dynamic host configuration protocol 的缩写；
表示 动态主机配置协议
是一种基于UDP协议且仅限于在局域网内部使用的网络协议；
主要用于局域网环境或者存在较多办公设备的局域网环境中；
主要是为局域网内部的设备或网络供应商自动分配IP地址等参数；
可以自动管理主机的IP地址、子网掩码、网关、DNS地址，等参数；
```s
ifconfig
ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.103  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::82b:eb85:8c19:22d1  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:70:c9:77  txqueuelen 1000  (Ethernet)
        RX packets 740  bytes 76328 (74.5 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 452  bytes 53516 (52.2 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```
DHCP 属于网络配置，配置目录在这里 `/etc/sysconfig/network-scripts/ifcfg-ens33`:
ifcfg-ens33  这里的ens33，就是上面ifconfig执行时 以太网接口的ens33，可能不同机器不同

#### 设置固定虚拟机的IP地址

注意的是，要设置为固定，必须 网络适配器设置为桥接，如下：

{% img url_for /image/linuxt/card.png %}

```s
vim /etc/sysconfig/network-scripts/ifcfg-ens33
#以下原配置
TYPE=Ethernet #设备模式
PROXY_METHOD=none 
BROWSER_ONLY=no 
BOOTPROTO=dhcp #地址分配模式
DEFROUTE=yes 
IPV4_FAILURE_FATAL=no 
IPV6INIT=yes 
IPV6_AUTOCONF=yes 
IPV6_DEFROUTE=yes 
IPV6_FAILURE_FATAL=no 
IPV6_ADDR_GEN_MODE=stable-privacy 
NAME=ens33 #网卡名称
UUID=0b309202-2bc1-41e3-ba5e-f8d356fbebd8 
DEVICE=ens33 
ONBOOT=yes #是否启动, 这个很重要，一定是启动的，不然无法联网

只需改动以下部分
BOOTPROTO=static #修改
IPADDR=192.168.1.109 #IP地址  #设置为静态，必须指定IP地址
NETMASK=255.255.255.0 #子网掩码 #指定IP地址,必须指定子网掩码
PREFIX=24 #24 是 255.255.255.0 二进制表示有24个1，跟上面一个意思；
GATEWAY=192.168.1.1 #网关地址
DNS1=192.168.0.1 #dns服务器


systemctl restart network # 重启，让配置生效；
```

上面的网关地址需要虚拟机所在的 主机window上看，
window查看 默认网关地址，dns地址
```s
ipconfig /all
```
{% img url_for /image/linuxt/ip.png %}

注意的是，不要在客户机设置 ip，不然出现卡顿，最好是在服务器端设置。


### 服务器主机的分类

更多参考 [知乎](https://www.zhihu.com/question/19856629?sort=created)
#### 独立服务器
这台服务器仅提供给用户一个人使用；
用户对服务器硬件配置有完全的控制权；
适合大中型网站；

#### 虚拟主机
虚拟主机的英语是 virtual host
在一台服务器中划分一定的磁盘空间；
仅提供基础的网站访问、数据存放与传输功能；
一般比较便宜，也几乎不需要用户自行维护网站以外的服务；
适合小型网站；

#### VPS
virtual private server 的缩写
表示 虚拟专用服务器
在一台服务器中利用虚拟化技术模拟出多台 主机
每个 主机 都有独立的 IP地址、操作系统；
需要具备一定的维护系统能力
适合小型网站；

#### ECS
elastic compute service 缩写 弹性计算服务
也就是一般说的 云服务器 ，如 阿里云服务器
整合了计算 存储 网络 ，能够做到弹性伸缩的计算服务；
和VPS的差别：云服务器是建立在一组集群服务器中；
每个服务器都会保存一个主机的镜像（备份），安全性和稳定性更高；
分布式架构。适合大中小型网站

### 如何选择服务器主机

#### 适合创业阶段的小站群体的服务器类型
建议选择 云服务器， 价格不贵，性能强劲；

#### 适合创建小型个人网站的服务器类型
建议选中 虚拟主机/vps，或者用 GitHub pages等；


### apache的虚拟主机功能

#### 概述
服务器基于用户请求的不同 IP 地址、主机域名或端口号
能够提供多个网站同时为外部提供访问服务的技术；
用户请求的资源不同，获取到的网页内容也不相同；


#### 基于IP地址；
如果一台服务器有多个IP地址；
每个IP地址与服务器上部署的每个网站一一对应；
这样用户去请求访问不同IP地址的时候，会访问到不同网站的资源；
而且每个网站都有一个独立的IP

#### 基于IP地址配置实战
增加服务器IP的方式（增加两个IP 192.168.1.10  192.168.1.20）：
```s
vim /etc/sysconfig/network-scripts/ifcfg-ens33
# 增加以下内容：
IPADDR1=192.168.1.10
PREFIX1=24
NETMASK1=255.255.255.0

IPADDR2=192.168.1.20
PREFIX2=24
NETMASK2=255.255.255.0

systemctl restart network

# 然后ping下看是否设置成功：
ping 192.168.1.10
ping 192.168.1.20
```
接上面的《配置实战 ：修改访问首页内容》

我们在 `/home/web` 新增两个目录和文件
```s
  mkdir /home/web/10
  mkdir /home/web/20
  echo "ip : 192.168.1.10" >/home/web/10/index.html
  echo "ip : 192.168.1.20" >/home/web/20/index.html
```
`/etc/httpd/conf/httpd.conf`增加以下部分如下：
```conf
<VirtualHost 192.168.1.10>
    DocumentRoot /home/web/10
    ServerName www.linuxabc.com
    <Directory "/home/web">
        AllowOverride None
        # Allow open access:
        Require all granted
    </Directory>
</VirtualHost>

<VirtualHost 192.168.1.20>
    DocumentRoot /home/web/20
    ServerName www.linuxddd.com
    <Directory "/home/web">
        AllowOverride None
        # Allow open access:
        Require all granted
    </Directory>
</VirtualHost>
```
其中上面 ServerName 随便设置；

```s
systemctl reload httpd # 重启，让配置生效
```
在客户机中访问页面，注意关闭防火墙 或其他透出80端口的方法，见《客户机如何访问服务器的Apache服务》：
{% img url_for /image/linuxt/vi1.png %}
{% img url_for /image/linuxt/vi2.png %}

问题，为什么这次设置后，就可以不受 SELinux 安全限制呢，
因为我们在 《配置实战 ：修改访问首页内容》已经对 /home/web 修改文件安全上下文 了，如果换其他目录，请按上面《修改文件安全上下文》修改上下文。



#### 基于主机域名

当你的服务器无法为每个网站分配独立的IP时，
你可以让apache去自动识别用户请求的域名，根据域名传输不同内容给用户；
这种情况，就只需保证服务器中只要有一个IP可用就行了

#### 基于主机域名配置实战
客户机中修改host:
`C:\Windows\System32\drivers\etc`
以管理员身份运行git bash ；
```s
cd /c/Windows/System32/drivers/etc
vi host
```
使用vi 编辑host:

`192.168.1.10 www.linuxabc.com www.linuxddd.com`

```s
  mkdir /home/web/abc
  mkdir /home/web/ddd
  echo "host : www.linuxabc.com" >/home/web/abc/index.html
  echo "ip : www.linuxddd.com" >/home/web/ddd/index.html
```


`/etc/httpd/conf/httpd.conf`增加以下部分如下：
```conf
<VirtualHost 192.168.1.10>
    DocumentRoot /home/web/abc
    ServerName www.linuxabc.com
    <Directory "/home/web/abc">
        AllowOverride None
        # Allow open access:
        Require all granted
    </Directory>
</VirtualHost>

<VirtualHost 192.168.1.10>
    DocumentRoot /home/web/ddd
    ServerName www.linuxddd.com
    <Directory "/home/web/ddd">
        AllowOverride None
        # Allow open access:
        Require all granted
    </Directory>
</VirtualHost>
```
在客户机中访问页面，注意关闭防火墙 或其他透出80端口的方法，见《客户机如何访问服务器的Apache服务》
：
{% img url_for /image/linuxt/vi3.png %}
{% img url_for /image/linuxt/vi4.png %}

注意的是，192.168.1.10 是我们之前 《基于IP地址》创建的，如果没有，你按照此创建；
另外，为了消除影响，可将上面《基于IP地址》中创建的 httpd配置 以及 /home/web/10 20 目录删除；

## https

### 为什么要https
https 可以确保所有经过服务器传输的数据包都是经过加密的；
使得假冒服务器无法冒充真正的服务器

### CA

#### 概述
CA 证书公证权威机构
CA 用于为客户端确认所连接的网站的服务器提供的证书是否合法
数字证书是经过CA认证的公钥，其内容不仅包含公钥，还包含其他内容；

#### 浏览器、服务器、ca证书机构 三者关系
你可以生成私钥，制作出必要的证书数据 并向 ca机构注册，完成注册并生成已注册的证书(公钥)，

浏览器浏览时，浏览器会主动向ca去确认证书是否是合法注册的；如何合法，浏览器将把自己的密钥通过 证书(公钥)加密，发给服务器；
服务器用上面的私钥 解密出 密钥，然后后续的电话都是通过这个密钥进行对称加密。

[read more](https://www.cnblogs.com/hthf/p/4986507.html)

#### 为什么CA能防止冒充真正的服务器
如上，浏览器会主动像ca去确认证书是否是服务器xxxx合法注册的；
此时有人假冒服务器xxx证书，
想假冒的人肯定需要向ca注册证书，但ca机构说服务器xxx已经注册证书了，你又来注册，你是骗子吧；
如果假冒的人不注册ca证书，不好意思，此证书直接无效；
ca会告诉浏览器，服务器xxx注册的证书是另外一个，不是当前这个假冒证书；
那么浏览器就会提示不安全，浏览器也不会后续活动；

#### 浏览器/服务器 对话 对称加密和非对称加密
如上，浏览器与服务器 通过非对称加密，加密 对称加密的密钥，
后续通过使用对称加密。

### Apache 服务器配置HTTPS

#### 防火墙放开443端口安全限制
防火墙放开443端口安全限制后，浏览器端将可以443端口（https默认端口）访问服务器
```s
firewall-cmd --zone=public --add-port=443/tcp --permanent  permanent永久
firewall-cmd --reload  更新配置
firewall-cmd --list-ports 查看已经放行的端口
```
#### 安装apache的SSL支持模块
```s
yum install -y mod_ssl #apache的SSL支持模块 mod_ssl
systemctl restart httpd #因为安装mod_ssl的过程，相当于配置了apache，需重启

```
[PKI 体系概述 : 所有与数字证书相关的各种概念和技术，统称为 PKI](https://www.jianshu.com/p/46a911bd49a7)

```s
[root@localhost ~]# ls /etc/httpd/conf.d/ssl.conf
/etc/httpd/conf.d/ssl.conf #mod_ssl 针对 apache 的 ssl 配置文件
# centos 默认提供ssl机制需要的证书文件和私钥
[root@localhost ~]# ls /etc/pki/tls/private/localhost.key #centos 默认提供ssh私钥,可以用来制作证书
/etc/pki/tls/private/localhost.key
[root@localhost ~]# ls /etc/pki/tls/certs/ #这里是证书的集合目录
ca-bundle.crt        localhost.crt    Makefile
ca-bundle.trust.crt  make-dummy-cert  renew-dummy-cert
[root@localhost ~]# ls /etc/pki/tls/certs/localhost.crt  #加密后证书的文件，也就是签名后的证书
/etc/pki/tls/certs/localhost.crt
```
我们是通过mod_ssl 生成的 因此不是经过第三方认证注册的，所有谷歌浏览器才有以下提示；

#### 请使用服务器主机IP
注意这里用来访问的IP，请使用服务器主机IP，而不要使用虚拟IP，否则可能访问不成功。
{% img url_for /image/linuxt/https1.png %}
{% img url_for /image/linuxt/https2.png %}

{% img url_for /image/linuxt/ca1.png %}
公钥加密方法，使用期限默认一年
{% img url_for /image/linuxt/ca2.png %}


### 使用自签名的证书
使用自签名的证书其实就是自己加密生成 证书(公钥)和私钥
需要用openssl这个软件来生成证书文件；

#### openssl生成私钥
```s
yum install -y openssl
cd /etc/httpd #可以是任意目录，不过一般apache配置相关都放这里
mkdir pki #所有与数字证书相关的各种概念 称之为pki，因此增加目录pki，
#当然你可以命名任意名字
cd pki pki

# 使用 gen rsa 即 rsa 算法来生成私钥，私钥 名字为 server.key ,私钥是2048位
openssl genrsa -out server.key 2048 

```
#### 生成了server.crt证书
CSR 是 证书签名的请求 的意思；
```s

[root@localhost pki]# ls
server.csr  server.key #生成了 server.csr 这样一个证书请求

#x509 类型的自签名证书，是一种标准签名证书
#-days 3650 有效期 10年
# -in server.csr 输入文件是server.csr
# -signkey server.key 用私钥server.key来签名证书
# -out server.crt输出得到的证书
[root@localhost pki]# openssl x509 -req -days 3650 -in server.csr -signkey server.key -out server.crt
Signature ok
subject=/C=CN/ST=ZHEJIANG/L=HANGZHOU/O=ALI/OU=LINU/CN=192.168.1.109/emailAddress=AA.QQ.COM
Getting Private key
[root@localhost pki]#  ls
server.crt  server.csr  server.key
```

#### 修改ssl配置文件
ssl是https加密配置文件
```s
vim conf.d/ssl.conf
```
修改内容如下
```conf
SSLCertificateFile /etc/pki/tls/certs/server.crt #证书
SSLCertificateKeyFile /etc/pki/tls/private/server.key #私钥
```
```s
systemctl restart httpd #重启 Apache服务
```
{% img url_for /image/linuxt/cert1.png %}
{% img url_for /image/linuxt/cert.png %}

#### 为什么可以http访问
值得注意的是，我们依然可以http访问，因为apache服务器中，我们也放开了防火墙80端口的监听
至于为什么我们可以用https访问，是一样的原因，在apache服务器中，我们也放开了防火墙443的监听；
{% img url_for /image/linuxt/cert2.png %}

#### 有些服务器能用http访问，不能用https
我们在调试的时候，有时候用webpack启动一个服务，然后通过http，是可以访问的，但换成https不能访问，
本质原因，就跟我们上面看到的，apache内放开了80端口防火墙时，我们可以http访问；
如果放开了 443 防火墙端口，我们可以通过https访问；
而webpack启动一份服务的时候，估计内部只做了http的80端口开放；没有做443端口开放；

https 是否能访问服务器 ，本质是 看服务器是否放开 80和443端口，并配置相关页面资源。

https 与 http 本质是 80 和 443 端口的不同
这就很好理解了，我们启动一个服务器，我们可能只启动一个80或一个443 是很合理的。






