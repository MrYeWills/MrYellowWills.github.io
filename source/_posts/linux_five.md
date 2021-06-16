---
title: linux笔记(坎)
date: 2021/6/16
tags: linux
categories: 
- 前端工具
series: linux
---

## Nginx 服务器

关于 Nginx，[参考博客](https://www.cnblogs.com/wcwnina/p/8728391.html)
摘录博客部分内容：
反向代理：
反向代理，"它代理的是服务端，代服务端接收请求"，主要用于服务器集群分布式部署的情况下，反向代理隐藏了服务器的信息。
![](/image/linuxfi/ng1.png)
正向代理：
正向代理最大的特点是客户端非常明确要访问的服务器地址；服务器只清楚请求来自哪个代理服务器，而不清楚来自哪个具体的客户端；正向代理模式屏蔽或者隐藏了真实客户端信息。
![](/image/linuxfi/ng2.png)


nginx 
高性能、轻量级、功能丰富、配置简单。用c语言写的；
2004年发布第一版
apache、nginx、IIS 并称 服务器三巨头
apache 阻塞型、同步多进程。nginx 异步、非阻塞、事件驱动；

下图时服务器排名：
![](/image/linuxfi/ng3.png)

安装nginx

yum install epel-release  红帽系列额外包，nginx安装依赖此包
yum install nginx
systemctl enable nginx

两种启动方式
方式一：
直接命令行 输入 nginx；
方式二：
systemctl start nginx

启动后访问，这里会出现centos页面，此页面是nginx驱动的页面，可在/usr/share/nginx/html/index.html中配置
http://192.168.1.109/
![](/image/linuxfi/ng4.png)


[root@localhost ~]# rpm -ql nginx  查看nginx相关配置
/etc/nginx/nginx.conf  主配置文件
/usr/share/nginx/html/index.html  上面http://192.168.1.109/浏览器上显示的页面
...



启动nginx失败
当然了，你也可能启动nginx失败，可能的原因是，你的机器同时启动了apache，apache和nginx都是监听80端口，因此失败。

![](/image/linuxfi/ng5.png)

解决之道，可关闭 apache，再次启动nginx：
systemctl stop httpd
systemctl start nginx





配置nginx作为反向代理服务器虚拟主机配置，设置https

修改apache 80 443 端口
vim /etc/httpd/conf/httpd.conf
将原来的
Listen 80
改为
Listen 7080 http



 vim /etc/httpd/conf.d/ssl.conf
将原来的
Listen 443 https
改为
Listen 7443 https

将原来的
<VirtualHost _default_:443>
改为
<VirtualHost _default_:7443>


[root@localhost ~]# systemctl restart httpd
#systemctl status httpd.service 执行此命令查看详细原因
Job for httpd.service failed because the control process exited with error code. See "systemctl status httpd.service" and "journalctl -xe" for details.
[root@localhost ~]# systemctl status httpd.service
● httpd.service - The Apache HTTP Server
   Loaded: loaded (/usr/lib/systemd/system/httpd.service; disabled; vendor preset: disabled)
   Active: failed (Result: exit-code) since Wed 2021-06-16 11:53:40 EDT; 32s ago
     Docs: man:httpd(8)
           man:apachectl(8)
  Process: 2383 ExecStart=/usr/sbin/httpd $OPTIONS -DFOREGROUND (code=exited, status=1/FAILURE)
 Main PID: 2383 (code=exited, status=1/FAILURE)

Jun 16 11:53:40 localhost.localdomain systemd[1]: Starting The Apache HTTP Se...
Jun 16 11:53:40 localhost.localdomain httpd[2383]: AH00558: httpd: Could not ...
Jun 16 11:53:40 localhost.localdomain httpd[2383]: (13)Permission denied: AH0...
Jun 16 11:53:40 localhost.localdomain httpd[2383]: (13)Permission denied: AH0...
Jun 16 11:53:40 localhost.localdomain httpd[2383]: no listening sockets avail...
Jun 16 11:53:40 localhost.localdomain httpd[2383]: AH00015: Unable to open logs
Jun 16 11:53:40 localhost.localdomain systemd[1]: httpd.service: main process...
Jun 16 11:53:40 localhost.localdomain systemd[1]: Failed to start The Apache ...
Jun 16 11:53:40 localhost.localdomain systemd[1]: Unit httpd.service entered ...
Jun 16 11:53:40 localhost.localdomain systemd[1]: httpd.service failed.
Hint: Some lines were ellipsized, use -l to show in full. #有些行被折叠了，命令后加参数 -l 查看所有
[root@localhost ~]# systemctl status httpd.service -l
● httpd.service - The Apache HTTP Server
   Loaded: loaded (/usr/lib/systemd/system/httpd.service; disabled; vendor preset: disabled)
   Active: failed (Result: exit-code) since Wed 2021-06-16 11:53:40 EDT; 1min 0s ago
     Docs: man:httpd(8)
           man:apachectl(8)
  Process: 2383 ExecStart=/usr/sbin/httpd $OPTIONS -DFOREGROUND (code=exited, status=1/FAILURE)
 Main PID: 2383 (code=exited, status=1/FAILURE)

Jun 16 11:53:40 localhost.localdomain systemd[1]: Starting The Apache HTTP Server...
Jun 16 11:53:40 localhost.localdomain httpd[2383]: AH00558: httpd: Could not reliably determine the server's fully qualified domain name, using localhost.localdomain. Set the 'ServerName' directive globally to suppress this message
Jun 16 11:53:40 localhost.localdomain httpd[2383]: (13)Permission denied: AH00072: make_sock: could not bind to address [::]:7080  发现是7080端口限制，是 SElinux 的问题
Jun 16 11:53:40 localhost.localdomain httpd[2383]: (13)Permission denied: AH00072: make_sock: could not bind to address 0.0.0.0:7080
Jun 16 11:53:40 localhost.localdomain httpd[2383]: no listening sockets available, shutting down
Jun 16 11:53:40 localhost.localdomain httpd[2383]: AH00015: Unable to open logs
Jun 16 11:53:40 localhost.localdomain systemd[1]: httpd.service: main process exited, code=exited, status=1/FAILURE
Jun 16 11:53:40 localhost.localdomain systemd[1]: Failed to start The Apache HTTP Server.
Jun 16 11:53:40 localhost.localdomain systemd[1]: Unit httpd.service entered failed state.
Jun 16 11:53:40 localhost.localdomain systemd[1]: httpd.service failed.

 SElinux 增加端口7080 7443
[root@localhost ~]# semanage port -l | grep http 查看SElinux与 http相关的端口
http_cache_port_t              tcp      8080, 8118, 8123, 10001-10010
http_cache_port_t              udp      3130
http_port_t                    tcp      80, 81, 443, 488, 8008, 8009, 8443, 9000  看这里，缺少了 7443 7080
pegasus_http_port_t            tcp      5988
pegasus_https_port_t           tcp      5989
[root@localhost ~]# semanage port -a -t http_port_t -p tcp 7080   semanage给SElinux增加端口  http_port_t对应上面的http_port_t， 增加 7080端口
[root@localhost ~]# semanage port -a -t http_port_t -p tcp 7443
[root@localhost ~]# semanage port -l | grep http
http_cache_port_t              tcp      8080, 8118, 8123, 10001-10010
http_cache_port_t              udp      3130
http_port_t                    tcp      7443, 7080, 80, 81, 443, 488, 8008, 8009, 8443, 9000
pegasus_http_port_t            tcp      5988
pegasus_https_port_t           tcp      5989

 防火墙 增加端口7080 7443
[root@localhost ~]# firewall-cmd --list-ports
443/tcp 80/tcp 3306/tcp 8080/tcp
[root@localhost ~]# firewall-cmd --zone=public --add-port=7080/tcp --permanent
success
[root@localhost ~]# firewall-cmd --zone=public --add-port=7443/tcp --permanent
success
[root@localhost ~]# firewall-cmd --reload
success
[root@localhost ~]# firewall-cmd --list-ports
443/tcp 80/tcp 3306/tcp 8080/tcp 7080/tcp 7443/tcp



访问网站
http://192.168.1.109:7080/
![](/image/linuxfi/apa1.png)
https://192.168.1.109:7443/
![](/image/linuxfi/apa2.png)

访问失败
上面设置后，也可能失败，那就把nginx关闭，再先把 防火墙 和 sss 都关闭，然后重新设置一次
nginx -s stop 立即停止nginx服务
 setenforce 0
 systemctl stop firewalld
 
vim /etc/httpd/conf/httpd.conf
 vim /etc/httpd/conf.d/ssl.conf
 设置完后，立即执行：
 systemctl restart httpd
 然后再打开 防火墙 和 sss ，
 再次访问，结果都可以了
setenforce 1
 systemctl start firewalld
 

配置nginx
[官网文档](http://nginx.org/en/docs/)







