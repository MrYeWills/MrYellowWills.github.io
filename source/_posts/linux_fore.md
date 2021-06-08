---
title: linux笔记(巽)
date: 2021/6/8
tags: linux
categories: 
- 前端工具
series: linux
---

## 安装 MariaDB 数据库软件
MariaDB是MySQL的一个社区维护版本，开源分支；
几乎完全兼容mysql；
mysql作者以他女儿名字命令的软件；
 
 #mariadb主程序， mariadb-server 服务器程序
 yum install mariadb mariadb-server  
 安装完成后，记得启动程序
 systemctl start mariadb 启动程序
 systemctl status mariadb 查看运行状态
 systemctl enable mariadb 设置开机启动

对 MariaDB 进行初始化操作
安装之后，不要立即使用，先进行初始化操作

[root@localhost ~]# mysql_secure_installation

NOTE: RUNNING ALL PARTS OF THIS SCRIPT IS RECOMMENDED FOR ALL MariaDB
      SERVERS IN PRODUCTION USE!  PLEASE READ EACH STEP CAREFULLY!

In order to log into MariaDB to secure it, we'll need the current
password for the root user.  If you've just installed MariaDB, and
you haven't set the root password yet, the password will be blank,
so you should just press enter here.
请输入数据库root用户的密码，刚安装数据库root密码默认为空，因此不用输入直接回车
Enter current password for root (enter for none):
OK, successfully used password, moving on...

Setting the root password ensures that nobody can log into the MariaDB
root user without the proper authorisation.
是否要设置root密码
Set root password? [Y/n] y
New password:
Re-enter new password:
Password updated successfully!
Reloading privilege tables..
 ... Success!


By default, a MariaDB installation has an anonymous user, allowing anyone
to log into MariaDB without having to have a user account created for
them.  This is intended only for testing, and to make the installation
go a bit smoother.  You should remove them before moving into a
production environment.
是否要删除匿名用户，匿名用户的数据库任何账号都可以访问，因此可以删除
Remove anonymous users? [Y/n] y
 ... Success!

Normally, root should only be allowed to connect from 'localhost'.  This
ensures that someone cannot guess at the root password from the network.
是否禁止远程登陆root用户
Disallow root login remotely? [Y/n] y
 ... Success!

By default, MariaDB comes with a database named 'test' that anyone can
access.  This is also intended only for testing, and should be removed
before moving into a production environment.
是否删除测试数据库和授权
Remove test database and access to it? [Y/n] y
 - Dropping test database...
 ... Success!
 - Removing privileges on test database...
 ... Success!

Reloading the privilege tables will ensure that all changes made so far
will take effect immediately.
是否让刚才设置的立即生效
Reload privilege tables now? [Y/n] y
 ... Success!

Cleaning up...

All done!  If you've completed all of the above steps, your MariaDB
installation should now be secure.

Thanks for using MariaDB!


修改字符编码为 utf8
在 MariaDB 的配置文件 /etc/my.cnf中加入以下两句配置

character_set_server=utf8
init_connect='SET NAMES utf8'

修改完成后，需要重启

 systemctl restart mariadb 启动程序


[root@localhost ~]# mysql
ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: NO)
[root@localhost ~]#  mysql -u root -p
Enter password:
# 进入数据库输入命令时，请以分号结尾，否则命令不执行
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 3
Server version: 5.5.68-MariaDB MariaDB Server

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
# 出现 MariaDB [(none)]> 说明登录成功，进入数据库了：
输入命令注意加分号
MariaDB [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
+--------------------+
3 rows in set (0.00 sec)

查看刚才设置的字符串utf8
MariaDB [(none)]> show variables like '%character_set%';
# character_set_client 客户端 和character_set_server服务器
都是utf8
+--------------------------+----------------------------+
| Variable_name            | Value                      |
+--------------------------+----------------------------+
| character_set_client     | utf8                       |
| character_set_connection | utf8                       |
| character_set_database   | latin1                     |
| character_set_filesystem | binary                     |
| character_set_results    | utf8                       |
| character_set_server     | latin1                     |
| character_set_system     | utf8                       |
| character_sets_dir       | /usr/share/mysql/charsets/ |
+--------------------------+----------------------------+
8 rows in set (0.00 sec)

MariaDB [(none)]>

quit exit 等都可以退出数据库

重新设置 可以远程访问

mysql_secure_installation
改这里就行：
是否禁止远程登陆root用户
Disallow root login remotely? [Y/n] n
设置防火墙，让防火墙放行对数据库程序软件的请求

MariaDB 默认以 3306 端口进行访问

在防火墙策略中，服务端统称为mysql

防火墙放行数据库访问请求

firewall-cmd --zone=public --add-port=3306/tcp --permanent
mysql和MariaDB，对于防火墙而言都一样，在防火墙策略中，服务端统称为mysql，因此这句命令既设置了 mysql，又设置了 MariaDB
firewall-cmd --zone=public --add-service=mysql --permanent
firewall-cmd --reload 需要重载之后，查看已经放行接口
firewall-cmd --list-ports
443/tcp 80/tcp 3306/tcp



安装PHP，搭建 LAMP 架构

静态网站的服务器和客户端的连接
![](/image/linuxf/lamp.png)

动态网站
动态网站的网页编程语言和数据库接口
![](/image/linuxf/say.png)

PHP
在服务端执行的脚本语言，是常用的网站编程语言
php的代码可以直接嵌入html网页中，不需要编辑就可以执行

LAMP架构
Linux + apache + mysql + （mariaDB） + php 的开发架构
经常被用于搭建动态网站
单独的apache只能搭建静态网站

安排 php

php php主程序（包含给apache使用的模块）
php-mysql 使php程序能读取mysql数据库的模块

yum install php
yum install php-mysql
rpm -ql php 查看安装信息
rpm -ql php-mysql 查看安装信息

在apache服务器的web页面放置目录创建文件；
由于我们之前配置apache的时候，将目录配置在了 /home/web

vim /home/web/info.php
<?php
 phpinfo();  
?>

上面 phpinfo 是 php的函数，会显示php所有的配置信息

systemctl restart httpd

页面访问：
http://192.168.1.109/info.php

看到下面说明 搭建 LAMP 架构 完成 
![](/image/linuxf/php.png)
![](/image/linuxf/php1.png)

php的配置
/etc/php.ini PHP的主配置文件
/etc/httpd/conf.d/php.conf php给apache使用的模块的配置
/etc/php.d/mysql.ini  php程序读取mysql数据库的模块配置


LAMP配合wordpress 建站

WordPress
wordpress 是使用php语言开发的博客平台，也是一款 CMS(内容管理系统)，
是全球使用最广泛的博客平台；
很多非博客网站也会使用wordpress 搭建

在客户机电脑中浏览器下载 wordpress 无论 win或mac版本都可以；
比如 [这里下载](http://www.pc6.com/softview/SoftView_14956.html);

使用 scp 进行 ssh 远程拷贝

客户机使用git bash 执行以下命令：
$ scp wordpressv5.7.zip root@192.168.1.109:/root
root@192.168.1.109's password:
wordpressv5.7.zip                             100%   16MB   4.9MB/s   00:03


unzip 解压缩 （安装unzip）

yum install unzip
unzip wordpressv5.7.zip

将wordpress解压包拷贝到apache页面目录下
[root@localhost wordpress]# cp -r wordpress /home/web
[root@localhost wordpress]# cd /home/web/wordpress/
[root@localhost wordpress]# ls
#wp-admin 是配置目录 setup-config.php 是其目录下 安装的一些配置文件
index.php        wp-blog-header.php    wp-includes        wp-settings.php
license.txt      wp-comments-post.php  wp-links-opml.php  wp-signup.php
readme.html      wp-config-sample.php  wp-load.php        wp-trackback.php
wp-activate.php  wp-content            wp-login.php       xmlrpc.php
wp-admin         wp-cron.php           wp-mail.php
[root@localhost wordpress]#


访问出现问题
页面访问刚才的php文件
https://192.168.1.109/wordpress/wp-admin/setup-config.php
![](/image/linuxf/wd.png)

升级 php
[参考这篇博客](https://blog.csdn.net/qq_34829953/article/details/78078790)，从博客中第二个开始执行：



  135  rpm -Uvh https://mirror.webtatic.com/yum/el7/epel-release.rpm
  136  rpm -Uvh https://mirror.webtatic.com/yum/el7/webtatic-release.rpm
  137  yum remove php-common -y
  138  yum install -y php56w php56w-opcache php56w-xml php56w-mcrypt php56w-gd php56w-devel php56w-mysql php56w-intl php56w-mbstring

其实你也没必要安装这么多，你只需安装 php56w 和 php56w-mysql (让php能够读取mysql数据库)

[root@localhost wordpress]# php -v
PHP 5.6.40 (cli) (built: Jan 12 2019 13:11:15)
Copyright (c) 1997-2016 The PHP Group
Zend Engine v2.6.0, Copyright (c) 1998-2016 Zend Technologies
    with Zend OPcache v7.0.6-dev, Copyright (c) 1999-2016, by Zend Technologies
[root@localhost wordpress]# systemctl restart httpd


![](/image/linuxf/wd2.png)
再次刷新页面，显示如下，说明正常了


scp
scp是 secure copy的缩写, scp是linux系统下基于ssh登陆进行安全的远程文件拷贝命令。
[scp命令](https://www.cnblogs.com/pluslius/p/9893340.html)


如上图，其实已经告诉我们如何接下来配置了


[root@localhost wordpress]# mysql -u root -p
Enter password:
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 3
Server version: 5.5.68-MariaDB MariaDB Server

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> create database wordpress; 创建表
Query OK, 1 row affected (0.01 sec)

MariaDB [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| wordpress          |
+--------------------+
4 rows in set (0.01 sec)
GRANT ALL ON wordpress.* 在 wordpress 数据库上开放所有权限 给主机用户'imooc'@'192.168.1.109' ， 密码是123456
MariaDB [(none)]> GRANT ALL ON wordpress.* TO 'imooc'@'192.168.1.109' IDENTIFIED BY '123456';  
Query OK, 0 rows affected (0.00 sec)

[root@localhost wordpress]# pwd
/home/web/wordpress
[root@localhost wordpress]# cp wp-config-sample.php wp-config.php
[root@localhost wordpress]# ls
index.php        wp-blog-header.php    wp-cron.php        wp-mail.php
license.txt      wp-comments-post.php  wp-includes        wp-settings.php
readme.html      wp-config.php         wp-links-opml.php  wp-signup.php
wp-activate.php  wp-config-sample.php  wp-load.php        wp-trackback.php
wp-admin         wp-content            wp-login.php       xmlrpc.php
[root@localhost wordpress]# vim wp-config.php

修改地方如下：

define( 'DB_NAME', 'wordpress' );

/** MySQL database username */
define( 'DB_USER', 'imooc' );

/** MySQL database password */
define( 'DB_PASSWORD', '123456' );

/** MySQL hostname */
define( 'DB_HOST', '192.168.1.109' );


systemctl restart httpd

刷新页面：
https://192.168.1.109/wordpress/wp-admin/setup-config.php
点击下图 的安装：

![](/image/linuxf/wd3.png)

建立数据库时出错：

![](/image/linuxf/wd4.png)


SELinux 的安全策略问题导致的；
getenforce 说明SELinux是开启的
验证下：
setenforce 0


[root@localhost wordpress]# getenforce
Enforcing  说明 SELinux 是开启的
关闭SELinux验证下：
[root@localhost wordpress]# setenforce 0

刷新页面：
https://192.168.1.109/wordpress/wp-admin/setup-config.php
变成下图，说明安装成功了
![](/image/linuxf/wd5.png)


解决 SELinux


[root@localhost wordpress]# setenforce 1 开启 SELinux
[root@localhost wordpress]# getsebool -a | grep httpd 查询 SELinux 的一些布尔值设置
httpd_anon_write --> off
httpd_builtin_scripting --> on
httpd_can_check_spam --> off
httpd_can_connect_ftp --> off
httpd_can_connect_ldap --> off
httpd_can_connect_mythtv --> off
httpd_can_connect_zabbix --> off
httpd_can_network_connect --> off  是否允许apache网络访问数据库
httpd_can_network_connect_cobbler --> off
httpd_can_network_connect_db --> off
....

[root@localhost wordpress]# setsebool -P httpd_can_network_connect=1 开启apache网络访问数据库
[root@localhost wordpress]#

刷新页面：
https://192.168.1.109/wordpress/wp-admin/install.php 或
https://192.168.1.109/wordpress/wp-admin/setup-config.php
变成下图，说明安装成功了，进入了wordpress 5分钟安装程序


配置网站信息，比如网站名，网站管理员，邮箱，这些都可以随便写
![](/image/linuxf/wd6.png)
![](/image/linuxf/wd7.png)
![](/image/linuxf/wd8.png)

登录成功后，
进入网站后台管理系统：
![](/image/linuxf/wd9.png)
![](/image/linuxf/wd10.png)

进入自己的网站主站点：
![](/image/linuxf/wd11.png)
![](/image/linuxf/wd12.png)










