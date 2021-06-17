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
/usr/lib/systemd/system/nginx.service  决定了 可使用systemctl start nginx 启动
/usr/sbin/nginx 决定了 可使用nginx 直接启动

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

 vim /etc/nginx/nginx.conf  主配置文件
 
## nginx配置
### 语法
#### 全局变量
没有用花括号包含的，就是全局变量，比如下面就是全局变量：
user nginx;  
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

#### 花括号(局部变量 和 区块)
如下，events的相关区块信息都定义在花括号内，花括号内定义的变量是局部变量：
events {
    worker_connections 1024;
}

#### 定义一个名字
如下 
http {
  #log_format定义了日志的格式以 右侧一长串字符串格式形式，
  #因为access_log也要用到这串长字符串，因此log_format给字符串定义了一个名字 main
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;   #main代表了上面的长字符串
}

#### include 导入
相当于import，在配置中导入其他配置文件
include /etc/nginx/conf.d/*.conf;

#### 以分号结尾
代码行以分号结尾，如：
worker_connections 1024;

### 含义

#### server (虚拟主机 和 端口服务等)
nginx 的 server 相当于 apache的虚拟主机：

  server {
        listen       80 default_server;
        listen       [::]:80 default_server;
        server_name  _;
        root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
        }

        error_page 404 /404.html;
        location = /404.html {
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
        }
    }

#### 全局变量含义介绍
user nginx;  说明用户是nginx
worker_processes auto; nginx 的cpu 核心数设置，单核或多核 ，可设置值为 auto ，也可为 1，2，3等
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

events { nginx是基于事件的
    worker_connections 1024; 对应上面的worker_processes的，每个work进程可以有多少个连接
}

http {} 这里配置一些http协议


#### nginx主配置文件
以下是主配置文件，这里注释一些上面没有解释到的内容，
```conf
[root@localhost nginx]# cat /etc/nginx/nginx.conf
# For more information on configuration, see:
#   * Official English Documentation: http://nginx.org/en/docs/
#   * Official Russian Documentation: http://nginx.org/ru/docs/

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    server {
        listen       80 default_server;  #nginx默认使用80端口,这是针对 ipv4
        listen       [::]:80 default_server; #nginx默认使用80端口,这是针对 ipv6
        server_name  _;
        root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
        }

        error_page 404 /404.html;
        location = /404.html {
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
        }
    }

# Settings for a TLS enabled server.   #nginx定义https
#
#    server {
#        listen       443 ssl http2 default_server;
#        listen       [::]:443 ssl http2 default_server;
#        server_name  _;
#        root         /usr/share/nginx/html;
#
#        ssl_certificate "/etc/pki/nginx/server.crt";
#        ssl_certificate_key "/etc/pki/nginx/private/server.key";
#        ssl_session_cache shared:SSL:1m;
#        ssl_session_timeout  10m;
#        ssl_ciphers HIGH:!aNULL:!MD5;
#        ssl_prefer_server_ciphers on;
#
#        # Load configuration files for the default server block.
#        include /etc/nginx/default.d/*.conf;
#
#        location / {
#        }
#
#        error_page 404 /404.html;
#        location = /404.html {
#        }
#
#        error_page 500 502 503 504 /50x.html;
#        location = /50x.html {
#        }
#    }

}
```

### 配置https

[root@localhost nginx]# nginx  启动nginx
[root@localhost nginx]# systemctl start tomcat 启动jenkins

页面即可访问：
http://192.168.1.109/   nginx驱动页面
http://192.168.1.109:8080/jenkins/  jenkins驱动页面

vim /etc/nginx/nginx.conf 

在http区块内，增加如下代码：

  upstream backend-apache {   upstream上游的意思，定义apache服务器后端， 注意定义名字不要用下斜杠，可能会有问题，也可能没有，backend_apache 这样是不好的
      server 127.0.0.1:7080;
  }

 upstream backend-jenkins { 定义jenkins服务器后端
        server 127.0.0.1:8080;
    }

修改http区块内的server区块，修改如下代码：
  server {
            server_name  www.linuxcoreaqq.com linuxcoreapp.com; 设置域名 ，使用空格隔开 可设置多个域名
            location / {  location是域名后接的path，/ 代表 www.linuxcoreaqq.com 将重定向转接到 apache服务器
                    proxy_pass http://backend-apache;   #proxy_pass proxy是代理 pass是转接，代理到上面定义的backend_apache apache服务器
            }

            location /jenkins {   /jenkins 代表 www.linuxcoreaqq.com/jenkins 将重定向转接到jenkins服务器
                    proxy_pass http://backend-jenkins;   #代理到上面定义的backend_jenkins  jenkins服务器
            }
        }


配置重载报错
[root@localhost ~]# nginx -s reload 报错
nginx: [error] open() "/run/nginx.pid" failed (2: No such file or directory)
[root@localhost ~]# systemctl restart nginx 也失败报错
[root@localhost ~]# nginx 报错
nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)

其实以上问题，都是一个原因，就是80端口被占用，因此当务之急就是杀掉所有 80端口占用的程序，包括 nginx自己；

netstat -anp |grep 80  查看所有占用80端口的pid进程
kill -9 1796 1797  kill -9 是固定写法，后面跟pid
nginx  成功了，不报错了
nginx -s reload  成功了，不报错了

http://192.168.1.109/
![](/image/linuxfi/proxy1.png)
http://192.168.1.109/jenkins
![](/image/linuxfi/proxy2.png)

客户机配置好 host后，也可通过域名访问，如
http://www.linuxcoreaqq.com/jenkins



nginx 配置https
将所有的http请求，重定向到https请求；

生成 证书和私钥
[root@localhost ~]# ls /etc/httpd/pki/  在配置apache https时，我们生成过两个公钥 私钥，以此配置nginx；
server.crt  server.csr  server.key
[root@localhost ~]# cd /etc/nginx/
[root@localhost nginx]# mkdir pki
[root@localhost nginx]# cd pki
[root@localhost pki]# cp /etc/httpd/pki/server.crt /etc/httpd/pki/server.key .   将apache配置的公钥 私钥放到 此目录
[root@localhost pki]# ls
server.crt  server.key
[root@localhost pki]# pwd
/etc/nginx/pki

配置 443端口
[root@localhost pki]# vim /etc/nginx/nginx.conf

https 在主配置文件中已经配置好，只是注释了，我们要做的就是放开注释；
然后做以下修改：

ssl_certificate "/etc/nginx/pki/server.crt";
ssl_certificate_key "/etc/nginx/pki/server.key";

在80 端口 区块中定义：
所有
return 301 https://$host$request_uri;  301重定向  $host$request_uri 是nginx的两个变量，分别代表 主机地址 和url后的路径

并将配置 从 80 区块 移动至 443端口区块
location / {
            proxy_pass http://backend-apache;
    }

    location /jenkins {
            proxy_pass http://backend-jenkins;
    }


完整的配置
```s
[root@localhost pki]# cat /etc/nginx/nginx.conf
# For more information on configuration, see:
#   * Official English Documentation: http://nginx.org/en/docs/
#   * Official Russian Documentation: http://nginx.org/ru/docs/

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

  upstream backend-apache {
      server 127.0.0.1:7080;
  }
 upstream backend-jenkins {
        server 127.0.0.1:8080;
    }
    server {
        listen       80 default_server;
        listen       [::]:80 default_server;
        server_name  www.linuxcoreaqq.com linuxcoreapp.com;
        root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        #location / {
       # }

       return 301 https://$host$request_uri;

        error_page 404 /404.html;
        location = /404.html {
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
        }
    }

# Settings for a TLS enabled server.
#
    server {
        listen       443 ssl http2 default_server;
        listen       [::]:443 ssl http2 default_server;
        server_name  _;
        root         /usr/share/nginx/html;

        ssl_certificate "/etc/nginx/pki/server.crt";
        ssl_certificate_key "/etc/nginx/pki/server.key";
        ssl_session_cache shared:SSL:1m;
        ssl_session_timeout  10m;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;
        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

         location / {
                proxy_pass http://backend-apache;
        }

        location /jenkins {
                proxy_pass http://backend-jenkins;
        }
        error_page 404 /404.html;
        location = /404.html {
        }

        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
        }
    }

}

```

浏览器访问http 会 自动转 https
http://www.linuxcoreaqq.com/jenkins 将被重定向到https：
https://www.linuxcoreaqq.com/jenkins

![](/image/linuxfi/https.png)


### 过程分析
#### 过程描述
上面首先利用 nginx 代理了所有的http请求，301重定向到 https；
从此 客户端 发往服务端的请求 都是https；
nginx 监听 443请求，接收客户端的https请求；
然后将客户端以http形式转发给 对应的服务端(Jenkins 或 apache)
#### nginx 拦截了所有 客户端http请求，并响应301
如上nginx拦截了所有http请求，并给它们重定向了 https， 此时nginx 相当于服务器；

#### nginx 监听了所有请求https，并代理转发 (反向代理)
如上 nginx 监听了所有https请求，并将它们的请求转发代理到 对应的 Jenkins 或 apache 服务器上。

#### 优点
当所有访问都通过反向代理并且阻止对后端的直接访问时
安全性得到了增强。
如本例中， 客户端不直接访问后端，而是先与 nginx 之间进行https通信，增加了安全性；
再由nginx与后端 进行http 访问，不会被抓包。
