---
title: linux笔记(巽)
date: 2021/6/8
tags: linux
categories: 
- 前端工具
series: linux
---

## 安装 MariaDB 数据库软件(MySQL)

### MariaDB是免费版的MySQL
MariaDB是MySQL的一个社区维护版本，开源分支；
几乎完全兼容mysql；
mysql作者以他女儿名字命令的软件；
 
### 安装MariaDB

#### 安装
```s
 #mariadb主程序， mariadb-server 服务器程序
 yum install mariadb mariadb-server  
 安装完成后，记得启动程序
 systemctl start mariadb 启动程序
 systemctl status mariadb 查看运行状态
 systemctl enable mariadb 设置开机启动
```
#### MariaDB 进行初始化操作

安装之后，不要立即使用，先进行初始化操作
```s
[root@localhost ~]# mysql_secure_installation

NOTE: RUNNING ALL PARTS OF THIS SCRIPT IS RECOMMENDED FOR ALL MariaDB
      SERVERS IN PRODUCTION USE!  PLEASE READ EACH STEP CAREFULLY!

In order to log into MariaDB to secure it, we'll need the current
password for the root user.  If you've just installed MariaDB, and
you haven't set the root password yet, the password will be blank,
so you should just press enter here.
#请输入数据库root用户的密码，刚安装数据库root密码默认为空，因此不用输入直接回车
Enter current password for root (enter for none):
OK, successfully used password, moving on...

Setting the root password ensures that nobody can log into the MariaDB
root user without the proper authorisation.
#是否要设置root密码
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
#是否要删除匿名用户，匿名用户的数据库任何账号都可以访问，因此可以删除
Remove anonymous users? [Y/n] y
 ... Success!

Normally, root should only be allowed to connect from 'localhost'.  This
ensures that someone cannot guess at the root password from the network.
#是否禁止远程登陆root用户
Disallow root login remotely? [Y/n] y
 ... Success!

By default, MariaDB comes with a database named 'test' that anyone can
access.  This is also intended only for testing, and should be removed
before moving into a production environment.
#是否删除测试数据库和授权
Remove test database and access to it? [Y/n] y
 - Dropping test database...
 ... Success!
 - Removing privileges on test database...
 ... Success!

Reloading the privilege tables will ensure that all changes made so far
will take effect immediately.
#是否让刚才设置的立即生效
Reload privilege tables now? [Y/n] y
 ... Success!

Cleaning up...

All done!  If you've completed all of the above steps, your MariaDB
installation should now be secure.

Thanks for using MariaDB!
```

#### 修改字符编码为 utf8
在 MariaDB 的配置文件 /etc/my.cnf中加入以下两句配置
```s
character_set_server=utf8
init_connect='SET NAMES utf8'
```
#### 修改完成后，需要重启
```s
 systemctl restart mariadb 启动程序
```

### 使用
```s
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

```

#### 重新设置 可以远程访问
```s
mysql_secure_installation
#改这里就行：
#是否禁止远程登陆root用户
Disallow root login remotely? [Y/n] n
```

#### 设置防火墙
设置防火墙，让防火墙放行对数据库程序软件的请求

MariaDB 默认以 3306 端口进行访问

在防火墙策略中，服务端统称为mysql

防火墙放行数据库访问请求
```s
firewall-cmd --zone=public --add-port=3306/tcp --permanent
#mysql和MariaDB，对于防火墙而言都一样，在防火墙策略中，服务端统称为mysql，
#因此这句命令既设置了 mysql，又设置了 MariaDB
firewall-cmd --zone=public --add-service=mysql --permanent
firewall-cmd --reload #需要重载之后，查看已经放行接口
firewall-cmd --list-ports
443/tcp 80/tcp 3306/tcp
```


## 安装PHP，搭建 LAMP 架构

### 静态网站与动态网站
静态网站的服务器和客户端的连接
![](/image/linuxf/lamp.png)

动态网站
动态网站的网页编程语言和数据库接口
![](/image/linuxf/say.png)

### PHP
在服务端执行的脚本语言，是常用的网站编程语言
php的代码可以直接嵌入html网页中，不需要编辑就可以执行

### LAMP架构
Linux + apache + mysql + （mariaDB） + php 的开发架构
经常被用于搭建动态网站
单独的apache只能搭建静态网站

### 安装php

php #主程序（包含给apache使用的模块）
php-mysql #使php程序能读取mysql数据库的模块

```s
yum install php
yum install php-mysql
rpm -ql php #查看安装信息
rpm -ql php-mysql #查看安装信息
```
### 配置apache的web页面目录
在apache服务器的web页面目录创建文件；
之前配置apache的时候，将其web页面目录配置在 `/home/web`
```s
vim /home/web/info.php
<?php
 phpinfo();  
?>

systemctl restart httpd
```
上面 phpinfo 是 php的函数，会显示php所有的配置信息

### apache与php结合成功 
页面访问：
http://192.168.1.109/info.php

看到下面说明 apache与php结合成功
![](/image/linuxf/php.png)
![](/image/linuxf/php1.png)


至此搭建 LAMP 架构还差数据库的连接，此时，我们借用 wordpress 建站，
wordpress 建站中要做数据库连接。


### wordpress 建站(LAMP架构的实践)

#### WordPress
wordpress 是使用php语言开发的博客平台，也是一款 CMS(内容管理系统)，
是全球使用最广泛的博客平台；
很多非博客网站也会使用wordpress 搭建

####  客户机电脑中浏览器下载 wordpress
在客户机电脑中浏览器下载 wordpress 无论 win或mac版本都可以；
比如 [这里下载](http://www.pc6.com/softview/SoftView_14956.html);

#### 使用 scp 进行 ssh 远程拷贝

客户机使用git bash 执行以下命令：
```s
$ scp wordpressv5.7.zip root@192.168.1.109:/root
root@192.168.1.109's password:
wordpressv5.7.zip                             100%   16MB   4.9MB/s   00:03
```

#### unzip 解压缩 （安装unzip）
```s
yum install unzip
unzip wordpressv5.7.zip
```
#### 将wordpress解压包拷贝到apache页面目录下
```s
#将wordpress解压包拷贝到apache页面目录下
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
```

#### 访问wordpress配置页面出现问题
页面访问刚才拷贝到apache web目录下的 `wp-admin/setup-config.php` 是wordpress的启动配置页面，
此页面告诉你如何一步步安装配置wordpress
https://192.168.1.109/wordpress/wp-admin/setup-config.php
![](/image/linuxf/wd.png)

#### 升级 php
[参考这篇博客](https://blog.csdn.net/qq_34829953/article/details/78078790)，从博客中第二个开始执行：

```s
rpm -Uvh https://mirror.webtatic.com/yum/el7/epel-release.rpm
rpm -Uvh https://mirror.webtatic.com/yum/el7/webtatic-release.rpm
yum remove php-common -y
yum install -y php56w php56w-opcache php56w-xml php56w-mcrypt php56w-gd php56w-devel php56w-mysql php56w-intl php56w-mbstring
```
其实你也没必要安装这么多，你只需安装 php56w 和 php56w-mysql (让php能够读取mysql数据库)
```s
[root@localhost wordpress]# php -v
PHP 5.6.40 (cli) (built: Jan 12 2019 13:11:15)
Copyright (c) 1997-2016 The PHP Group
Zend Engine v2.6.0, Copyright (c) 1998-2016 Zend Technologies
    with Zend OPcache v7.0.6-dev, Copyright (c) 1999-2016, by Zend Technologies
[root@localhost wordpress]# systemctl restart httpd
```
#### wordpress配置页面 访问成功
![](/image/linuxf/wd2.png)
再次刷新页面，显示如下，说明正常了


#### 配置mysql数据库
上面的wordpress配置页面，其实已经告诉我们如何接下来配置了
```s
[root@localhost wordpress]# mysql -u root -p
Enter password:
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 3
Server version: 5.5.68-MariaDB MariaDB Server

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> create database wordpress; #创建表
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
GRANT ALL ON wordpress.* #在 wordpress 数据库上开放所有权限 给主机用户'imooc'@'192.168.1.109' ， 密码是123456
MariaDB [(none)]> GRANT ALL ON wordpress.* TO 'imooc'@'192.168.1.109' IDENTIFIED BY '123456';  
Query OK, 0 rows affected (0.00 sec)
```

#### 配置wordpress相关数据库信息
```s
[root@localhost wordpress]# pwd
/home/web/wordpress
#拷贝wp-config-sample.php 命名为wp-config.php
[root@localhost wordpress]# cp wp-config-sample.php wp-config.php
[root@localhost wordpress]# ls
index.php        wp-blog-header.php    wp-cron.php        wp-mail.php
license.txt      wp-comments-post.php  wp-includes        wp-settings.php
readme.html      wp-config.php         wp-links-opml.php  wp-signup.php
wp-activate.php  wp-config-sample.php  wp-load.php        wp-trackback.php
wp-admin         wp-content            wp-login.php       xmlrpc.php
[root@localhost wordpress]# vim wp-config.php

#修改地方如下：

define( 'DB_NAME', 'wordpress' );

/** MySQL database username */
define( 'DB_USER', 'imooc' );

/** MySQL database password */
define( 'DB_PASSWORD', '123456' );

/** MySQL hostname */
define( 'DB_HOST', '192.168.1.109' );


systemctl restart httpd
```

刷新页面：
https://192.168.1.109/wordpress/wp-admin/setup-config.php
点击下图 的安装：

![](/image/linuxf/wd3.png)

#### 建立数据库时出错

![](/image/linuxf/wd4.png)


SELinux 的安全策略问题导致的；

验证下：
```s
[root@localhost wordpress]# getenforce
Enforcing  #说明 SELinux 是开启的
#关闭SELinux验证下：
[root@localhost wordpress]# setenforce 0
```
刷新页面：
https://192.168.1.109/wordpress/wp-admin/setup-config.php
变成下图，说明安装成功了
![](/image/linuxf/wd5.png)


#### 解决 数据库 连接的SELinux问题

```s
[root@localhost wordpress]# setenforce 1 #开启 SELinux
[root@localhost wordpress]# getsebool -a | grep #httpd 查询 SELinux 的一些布尔值设置
httpd_anon_write --> off
httpd_builtin_scripting --> on
httpd_can_check_spam --> off
httpd_can_connect_ftp --> off
httpd_can_connect_ldap --> off
httpd_can_connect_mythtv --> off
httpd_can_connect_zabbix --> off
httpd_can_network_connect --> off  #是否允许apache网络访问数据库
httpd_can_network_connect_cobbler --> off
httpd_can_network_connect_db --> off
....

[root@localhost wordpress]# setsebool -P httpd_can_network_connect=1 #开启apache网络访问数据库
[root@localhost wordpress]#
```

#### 配置成功
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


### 一些说明
#### php的配置的说明
```s
/etc/php.ini PHP的主配置文件
/etc/httpd/conf.d/php.conf php给apache使用的模块的配置
/etc/php.d/mysql.ini  php程序读取mysql数据库的模块配置
```
#### scp 的说明
scp是 secure copy的缩写, scp是linux系统下基于ssh登陆进行安全的远程文件拷贝命令。
[scp命令](https://www.cnblogs.com/pluslius/p/9893340.html)




## java web
### java web 应用的世界

java web 应用的世界 ：
servlet tomcat 和 Jenkins

### Jenkins

#### 概述
是java开发的一种持续集成（CI）工具
CI是 continuous integration 的缩写，表示持续集成；
能够让软件的测试 编译 和部署自动化
通常与版本管理工具 如svn git、 构建工具结合使用；
常用的构建工具有 Ant、 Maven、 Gradle；

还有其他持续集成工具，比如 gitlab CI/CD

#### .war 文件
Jenkins是以servlet形式提供的
它采用扩展名为.war 的二进制文件的形式；
war是web archive的缩写，表示 网络归档文件

### java的web应用程序的世界：
servlet， jsp 等；


### servlet
java中旨在动态生成html代码的应用程序通常采用servlet的形式；
servlet是尊重java servlet api 的java web应用程序；

servlet = service + applet， 表示 小服务程序
service 表示 服务， applet表示 小应用程序

#### Jenkins 与 servlet
Jenkins是以servlet形式提供的

#### servlet 两种方式

创建 servlet 两种方式
- 要么编写纯java代码并编译
- 要么写一个jsp（Java server pages）

#### servlet与jsp
参考上面

#### jsp

jsp 实际上是一个html页面，其中添加了对java代码的调用
jsp 编译器编译jsp，将其转换为 servlet；

### servlet容器

#### 概述
要能够在服务器上运行servlet并将http请求传递给它们；
需要一个servlet容器；
tomcat是apache软件基金会发布的servlet容器

#### tomcat
由几个组件构成： Catalina 、coyote、jasper

Catalina 它本身是servlet的容器，并负责其执行；
coyote 是一个http链接器，因此是一个微型web服务器，它将http请求传输到Catalina；
jasper是tomcat的jsp编译器；

tomcat 默认端口 8080

[apache和tomcat有什么不同](https://blog.csdn.net/u010129985/article/details/80831518)

## Jenkins的运行

### 概述
为了使用Jenkins应用程序，需要安装tomcat服务器
Jenkins也可以独立运行；
因为它自身也包含了名为 winstone 的servlet微型容器；


### Jenkins servlet tomcat (jsp java) 三者关系

servlet是遵守 java servlet api 的java web 应用程序
servlet 可由 纯java代码编写，也可以从jsp页面生成
servlet 由servlet容器执行；
tomcat 是apache软件基金会发布的servlet容器
也可以作为轻量级的web应用服务器
Jenkins是作为servlet提供的Java应用程序；

### 配置java环境并安装tomcat

#### 概述
```s
yum install tomcat #可以直接安装 tomcat 而且附带安装 Java运行时的环境 JRE(用来使java应用运行起来)，但不会安装JDK;
java -version # 安装tomcat时，其实已经把java运行时环境JRE安装上了，因此可以执行java命令,比如查看java版本

systemctl status tomcat  #查看运行状态
systemctl start tomcat #启动tomcat
systemctl enable tomcat #设置开启启动
rpm -ql tomcat #查看tomcat相关目录和配置文件

[root@localhost ~]# rpm -ql tomcat
/etc/logrotate.d/tomcat
/etc/sysconfig/tomcat
/etc/tomcat
/etc/tomcat/conf.d/README
/etc/tomcat/context.xml
/etc/tomcat/log4j.properties
/etc/tomcat/logging.properties
/etc/tomcat/server.xml  #这是tocat配置服务器文件，比如这里可配置tomcat 默认8080端口
/etc/tomcat/tomcat-users.xml #配置用户
/etc/tomcat/tomcat.conf  #主配置文件
/usr/share/tomcat/logs
/usr/share/tomcat/temp
/usr/share/tomcat/webapps #web应用程序相关配置在这里，此文件也是/var/lib/tomcat/webapps的软连接
/usr/share/tomcat/work
/var/lib/tomcat/webapps

[root@localhost ~]# ls -dl /usr/share/tomcat/webapps
#说明 /usr/share/tomcat/webapps 是软连接到  /var/lib/tomcat/webapps 文件的；
lrwxrwxrwx. 1 root tomcat 23 Jun  9 10:46 /usr/share/tomcat/webapps -> /var/lib/tomcat/webapps
[root@localhost ~]#
```

#### openjdk 与 jdk
自动java 被oracle收购后，很多程序就用 openjdk 代替 jdk使用，二者功能一致；
在centos中，使用openjdk代替 jdk使用
```s
[root@localhost ~]# yum search java | grep openjdk  此命令可以查找可安装的 openjdk 版本，
java-1.6.0-openjdk.x86_64 : OpenJDK Runtime Environment
java-1.6.0-openjdk-demo.x86_64 : OpenJDK Demos
java-1.6.0-openjdk-devel.x86_64 : OpenJDK Development Environment
java-1.8.0-openjdk-devel.x86_64 : OpenJDK 8 Development Environment
...
```

如果要安装开发jdk版本可以 安装 
```s
yum install java-1.8.0-openjdk-devel.x86_64
javac # 安装jdk后，可执行此命令，此命令为 java编译器
```

#### 浏览器访问tomcat异常
至此Jenkins的配置安装好了，tomcat 默认端口 8080，因此可以访问：
配置上面的tomcat后，
http://192.168.1.109:8080/
发现无法访问，原来缺少了web应用程序的管理软件包

#### 安装web应用程序的管理软件包
```s
yum install tomcat-webapps tomcat-admin-webapps
yum install tomcat-docs-webapp tomcat-javadoc # 这是参考文档，可以不用安装
systemctl restart tomcat
```

再次访问
http://192.168.1.109:8080/
发现还是无法访问，原来防火墙的原因，执行命令
```s
 systemctl stop firewalld
```
再次访问
http://192.168.1.109:8080/
成功了：
![](/image/linuxf/tom.png)

#### 放开防火墙 8080端口
```s
systemctl start firewalld
firewall-cmd --list-ports
firewall-cmd --zone=public --add-port=8080/tcp --permanent
firewall-cmd --reload  #更新配置
firewall-cmd --list-ports #查看已经放行的端口
```

#### 设置用户
![](/image/linuxf/user.png)
```s
 vim /etc/tomcat/tomcat-users.xml
```
文件中下面注释的部分放开，这是系统配置好的默认测试用户，可以把密码设置简单点，比如123456
```conf
<user name="admin" password="123456" roles="admin,manager,admin-gui,admin-script,manager-gui,manager-script,manager-jmx,manager-status" />
```
```s
systemctl restart tomcat
```

然后点击上图按钮，登录：

![](/image/linuxf/login.png)
![](/image/linuxf/login1.png)
![](/image/linuxf/mana.png)
如图上，红框内，这些应用都在目录：
```s
[root@localhost ~]# ls /var/lib/tomcat/webapps/
docs  examples  host-manager  manager  ROOT  sample
```

### 安装Jenkins持续集成环境

#### Jenkins 是Java写的一个应用程序；
可以单独运行，也可以在servlet容器中运行；
这里我们在tomcat这个servlet容器里安装Jenkins；

#### Jenkins的war文件
war 是 web application archive 意思是 web 的归档文件


#### 在window下，下载文件, 并拷贝移动：
http://mirrors.jenkins.io/war-stable/2.204.1/jenkins.war

scp将文件拷贝至centos
```s
scp jenkins.war root@192.168.0.106:/root
```

#### 执行tomcat命令生成 Jenkins 目录
将上面文件移动至 tomcat的web目录
```s
mv jenkins.war /var/lib/tomcat/webapps #tomcat的web目录
cd /var/lib/tomcat/webapps
systemctl restart tomcat
#只需要把 Jenkins.war 放置在`/var/lib/tomcat/webapps`目录下，执行 `systemctl restart tomcat` ， 
#tomcat就会在该目录下 生成 Jenkins目录，
```
#### wget下载文件和scp拷贝文件区别
不过你执行此命令后，却发现没有生成jenkins目录，
但是，如果我用wget 直接下载  jenkins.war 到 目录 `/var/lib/tomcat/webapps`，
是可以生成目录jenkins；
为什么呢，原来是 wget 下载下来的 文件安全上下文 比 scp过来的好，
此时SELinux就不会阻止，可以生成目录，
你可以通过把 SELinux安装验证关闭 (执行命令 setenforce 0)，再次执行以上命令，就会发现可以生成目录。

#### 解决SELinux 的 scp拷贝问题

- 方法一：
```s
[root@localhost webapps]# cd /var/lib/tomcat/webapps
[root@localhost webapps]# ls
docs  examples  host-manager  jenkins.war  manager  ROOT  sample
[root@localhost webapps]# ls -Zd .  查看当前目录安全上下文
drwxrwxr-x. root tomcat system_u:object_r:tomcat_var_lib_t:s0 .
[root@localhost webapps]# ls -Zd jenkins.war
-rw-r--r--. root root unconfined_u:object_r:admin_home_t:s0 jenkins.war
[root@localhost webapps]# semanage fcontext -a -t tomcat_var_lib_t jenkins.war
[root@localhost webapps]# restorecon -Rv .   重启该目录安全上下文
```

- 方法二：
直接拷贝进去，也可以，此时就避免了安全上下文
```s
cd /var/lib/tomcat/webapps
rm -rf jenkins jenkins.war
```
在客服端执行
```s
scp jenkins.war root@192.168.1.109:/var/lib/tomcat/webapps
```

#### 访问依然报错：
http://192.168.1.109:8080/jenkins

Unable to create the home directory ‘/usr/share/tomcat/.jenkins’. This is most likely a permission problem.

To change the home directory, use JENKINS_HOME environment variable or set the JENKINS_HOME system property. See Container-specific documentation for more details of how to do this.

#### 解决方法：

方法一：推荐
```s
 cd /usr/share/tomcat
  mkdir .jenkins
  chown tomcat:tomcat .jenkins
  systemctl restart tomcat
```

方法一：终极解决方法：
如果还不能解决，就关闭安全校验：
```s
setenforce 0
systemctl restart tomcat
```

再次访问：
http://192.168.1.109:8080/jenkins 
就会跳转到：
![](/image/linuxf/jenk1.png)

复制图片中的地址 
```s
[root@localhost tomcat]# cat /usr/share/tomcat/.jenkins/secrets/initialAdminPassword
41d9a966b9e6470e97a534d4c69ef517
```
将上面的密码复制到上面页面上，点击继续：


#### 修改tomcat的Jenkins 目录
如果你要修改 /usr/share/tomcat/.jenkins 目录，可以这样修改
```s
mkdir /var/lib/jenkins
chown tomcat:tomcat /var/lib/jenkins
vim /etc/tomcat/context.xml
#在 Context 内增加一行
<Context>
    <Environment name="JENKINS_HOME" value="/var/lib/jenkins" type="java.lang.String"/>
</Context>


systemctl restart tomcat
```

http://192.168.1.109:8080/jenkins 
![](/image/linuxf/jenk2.png)
```s
cat /var/lib/jenkins/secrets/initialAdminPassword
a3aba81d552b42238184305d6687a020
```
等待一分钟，出现页面

![](/image/linuxf/jenk3.png)


#### jenkins安装成功

如果顺利，就选择安装推荐插件
![](/image/linuxf/jk1.png)
![](/image/linuxf/jk2.png)
![](/image/linuxf/jk3.png)
出现以下页面，说明Jenkins安装好：
![](/image/linuxf/jk4.png)

查看已经安装好的插件
![](/image/linuxf/jk5.png)
![](/image/linuxf/jk6.png)
![](/image/linuxf/jk7.png)


#### 出现offline(离线)问题的解决方法
此时也可能出现offline 问题， 没有这个问题，可不用管。

![](/image/linuxf/jenk4.png)

这是证书问题，
解决方法：
```s
vim /var/lib/jenkins/hudson.model.UpdateCenter.xml
#将其中
# <url>https://updates.jenkins.io/update-center.json</url>
# 改为 http，即为：
#  <url>http://updates.jenkins.io/update-center.json</url>

systemctl restart tomcat
```
再次刷新
http://192.168.1.109:8080/jenkins 
```s
cat /var/lib/jenkins/secrets/initialAdminPassword
a3aba81d552b42238184305d6687a020
```
密码登录下即可


#### 安装Jenkins不顺利时的解决方法
Jenkins也有可能不顺利
![](/image/linuxf/jenk6.png)

此时就选择，不安装任何插件，把Jenkins安装好再说：
![](/image/linuxf/jenk7.png)
选择none，不安装任何插件
![](/image/linuxf/jenk8.png)
安装完成：
![](/image/linuxf/jenk9.png)



### Jenkins的运行说明
可以直接运行 java -jar jenkins.war
也可以修改端口运行 java -jar jenkins.war --httpPort=8081
或者在tomcat这样的servlet容器里运行(上面演示的过程就是在tomcat容器里运行jenkins)


### tomcat的 coyote web 服务器

#### tomcat的 coyote web 服务器的局限 

coyote 是tomcat自带的轻量级web服务器；
coyote web 服务器不能用于直接服务客户端连接
它在处理静态文件时效率较低
并且本身不支持 https 协议

#### 解决办法
使用功能更强大的web服务器， 比如 apache 或 nginx 作为代理服务器， 将请求转发到 tomcat；
web服务器将管理https连接、访问限制和静态页面；
只有对java应用程序的请求会被转发到tomcat；


#### web服务器和tomcat应用服务器之间的通信方式
- 使用http协议，web服务器将会做一个http重定向到tomcat服务器；
- 使用某些插件，例如仅适用于apache的mod_jk插件，该插件使用特殊协议在apache和tomcat之间进行通信；







































