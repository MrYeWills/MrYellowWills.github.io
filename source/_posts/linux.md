---
title: linux笔记(乾)
date: 2021/5/1
tags: linux
categories: 
- 前端工具
series: linux
---


## 黑知识

### 命令中双引号的妙用
例如：
```s
 grep eslint  eslint.md
```
当如果要搜索 eslint 的使用 中间有空格时，加上双引号就行：
```s
 grep "eslint 的使用"  eslint.md
```
在linux中，双引号可用于带有空格内容的操作。

### 查找命令的安装包
我们没有安装某命令，但又向用，不知道安装哪个安装包：

```s
[root@localhost ~]# rpm -qf /usr/bin/htpasswd
httpd-tools-2.4.6-97.el7.centos.x86_64
[root@localhost ~]# yum install httpd-tools -y
```

### 查找命令的安装包
我们没有安装某命令，但又向用，不知道安装哪个安装包：

```s
[root@localhost ~]# rpm -qf /usr/bin/htpasswd
httpd-tools-2.4.6-97.el7.centos.x86_64
[root@localhost ~]# yum install httpd-tools -y
```

### 实用命令

#### 查找占用的接口
```s
[root@localhost ~]# netstat -luntp
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State                      PID/Program name
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN                     1148/master
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN                     1269/nginx: master
tcp        0      0 0.0.0.0:8080            0.0.0.0:*               LISTEN                     1269/nginx: master
tcp        0      0 0.0.0.0:8082            0.0.0.0:*               LISTEN                     1269/nginx: master
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN                     986/sshd
tcp6       0      0 ::1:25                  :::*                    LISTEN                     1148/master
tcp6       0      0 :::22                   :::*                    LISTEN                     986/sshd
udp        0      0 127.0.0.1:323           0.0.0.0:*                                          663/chronyd
udp6       0      0 ::1:323                 :::*                                               663/chronyd
[root@localhost ~]# netstat -luntp | grep 80
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN                     1269/nginx: master
tcp        0      0 0.0.0.0:8080            0.0.0.0:*               LISTEN                     1269/nginx: master
tcp        0      0 0.0.0.0:8082            0.0.0.0:*               LISTEN                     1269/nginx: master

```

#### 查看程序运行的所有pid
以 nginx为例子。
```s
[root@localhost ~]# ps -aux | grep nginx
nginx      1270  0.0  0.2  57312  2528 ?        S    Jul03   0:00 nginx: worker process
nginx      1271  0.0  0.1  57092  1784 ?        S    Jul03   0:00 nginx: cache manager process
root       1390  0.0  0.0 112812   972 pts/0    R+   00:54   0:00 grep --color=auto nginx
[root@localhost ~]# kill -9 1270 1271
[root@localhost ~]# ps -aux | grep nginx
root       1393  0.0  0.0 112812   972 pts/0    R+   00:54   0:00 grep --color=auto nginx

```

## 基础知识一

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

### 命令行技巧

#### 概述

- Ctrl + r 查找使用过的命令
- Ctrl + a 回到命令首字符
- Ctrl + e 回到命令结尾

#### 常用命令


- pwd 命令 ： 显示当前目录
- which 命令接受一个参数，可打印出此参数命令对应的程序安装目录
```s
$ which git
/mingw64/bin/git

$ which node
/c/Program Files/nodejs/node

```

- history 列出之前使用过的所有命令， 此时输入` ! + index(数字)` 可以执行对应命令
- ls -a 显示所有文件和目录，-a包括隐藏的

- cd 命令
```s
# 回到父节点
cd ..
# 上面的点表示目录， 第一个点表示当前目录，第二个表示父亲目录，当要平移多个目录时，需要用/分割
cd ../.. #回退两个目录
```

- du -ah 查看当前目录下所有文件大小

#### 用于显示文件的命令
- cat 和 less 都可显示文件内容
 cat 一次性终端中显示文件所有内容， 适合显示小文件
 ```s
  cat source/_posts/linux.md
  cat source/_posts/linux.md -n # -n 显示内容时，加上行号
 ```
强大的 less 查看命令
less 分页显示文件内容；
按空格查看下一个屏幕
按回车健查看下一行
按u键查看前进半个屏幕
按q退出
按 = 查看当前情况如下：
```s
#目前处于 1-14行的位置，文件内容总共238行； 目前占的字符175，总字符6686，当前页占整个内容3%；
source/_posts/linux.md lines 1-14/238 byte 175/6686 3%  (press RETURN)
```
按h键，查看less的帮助文档；
按/进入搜索模式

- head 显示文件开头
- tail 显示文件最后
```s
#-n 5 显示最后5行；
$ tail -n 5 less source/_posts/linux.md
``` 
tail另外一个强大地方是配合 -f 一起使用，实时监听文件最新修改：
```s
#-n 5 显示最后5行；tail默认每过1秒检查文件是否有新内容，
$ tail -f  less source/_posts/linux.md
#-n 5 显示最后5行；每隔4秒监听一次
$ tail -f -s 4  less source/_posts/linux.md
``` 

#### 其他命令

- touch 如果文件不存在就创建一个空白文件，如果存在，就不创建
如何创建一个包含空格文件名的文件，使用 双引号：
```s
$ touch new_fule  #推荐
$ touch "new file"  #不推荐带空格的文件名
``` 

- mkdir 创建目录
可使用 -p 递归创建目录结构，注意window下的linux工具，不支持-p。
```s
$ mkdir aa/cc -p
``` 

- cp 拷贝文件或目录
```s
$ cp file file_copy #拷贝file，重命令为file_copy
$ cp file aa/file_copy #拷贝file，到目录aa下，命令为file_copy
$ cp -r one one_copy #拷贝目录要加 -r， 拷贝目录one，得到目录one_copy，里面所有文件都被拷贝
``` 
配合 通配符 * 使用，大大提高拷贝效率
```s
$ cp *.txt one 把当前目录下所有txt文件拷贝到one目录下
$ cp ha* one 把当前目录以ha开头的文件都拷贝到one目录中
``` 

- mv 移动文件/目录(也可用于重命名)
用法与cp相似，不同的是，mv操作目录时，不需要用额外的 -f参数
```s
$ mv newfile one 将newfile文件移动到one目录，原先的newfile将不存在于先前目录
$ mv one twp 将one 目录 移到 twp目录下
$ mv *.txt one 把当前目录下所有txt文件移动到one目录下
# 得益于mv的移动机制，因此mv也可以用于重命名
$ mv one twp 将one 目录 重命名 为 twp (前提是twp不存在，如果存在，就是移动了)
``` 

- rm 删除文件和目录
 - 删除文件：
```s
$ rm newfile 直接删除文件
$ rm -i  newfile  删除之前会询问是否删除
$ rm -f  newfile  强制删除
``` 
 - 删除目录及其内的一切文件：
```s
$ rm -r  one  # 删除one目录，删除目录需要带-r
``` 
危险的操作
```s
$ rm -rf  one   强制删除one目录
``` 
毁灭地球的命令
```s
$ rm -rf  /* 或 $ rm -rf  / #直接删除你/根目录下的整个系统；
#作为一种保护机制，一般linux系统，只有超级管理员才拥有此命令权限
``` 

- ln命令 创建文件/目录链接
一种是物理链接和硬链接；
一种是符号链接或软链接(类似新建文件快捷方式)
创建硬链接 直接用ln命令，不加任何参数
```s
C:\Users\Administrator\Desktop\test
λ ln abc.txt aaa.txt

C:\Users\Administrator\Desktop\test
λ ls -i #-i可以查看文件inode码
2533274790510393 aaa.txt  1970324837089091 cc/
2533274790510393 abc.txt
#2533274790510393 是inode码
```
建立硬链接时，修改两个文件任何一个文件，两个文件就会同时改变
一旦两个文件间有了硬链接，你修改任意一个文件，修改的时相同的一块内容，
硬链接有个缺陷，只能创建文件硬链接，不能创建目录的，（当然也可以通过复杂设置，来建立目录硬链接）
类似js中的对象引用，对象名可以不一样，但只要this指针指向同一个对象，修改任意一个引用，内容都同时改变。
![](/image/linux/link.jpg)

软链接 可以指向文件和目录，对于目录，一般都用软链接。
软链接才真正像我们window下的快捷方式，原理很相似；
创建硬链接时，ln不带任何参数，创建软链接时需要带上 -s 参数， s时symbolic符号的缩写。
```s
λ ln -s abc.txt ff.txt #创建abc.txt 的 软链接 ff.txt
```
![](/image/linux/link2.jpg)

#### 用户和权限命令
- sudo 暂时使用超级用户权限(针对此命令)
- sudo su 一直使用超级用户权限， 退出超级用户，使用exit命令；
- su - 命令可以直接进入root的家目录；
超级用户有以下权力命令：
- useradd 用于添加新用户
- passwd 用于修改用户密码
- userdel 用于删除用户
userdel username --remove 或 userdel username -r  删除用户并且删除对应用户家目录；

#### 文件权限
可通过 ls -l 查看文件列表详情包含权限信息：
```s
ls -l file
-rw-rw-r--
从左往右解释：
-说明是文件，如果是d就是目录，如果是l就是link；
rw- 文件的所有者对文件有读r、写w权限，-没有运行权限（-说明没有相关权限）；
没有运行权限也好理解，普通文件，默认没有可执行属性；
rw- 表面文件所在的群组的其他用户，对文件有读写权限，没有运行权限；
r-- 表示其他用户(除去文件所在用户群组的用户)只有读此文件权限；
```
![](/image/linux/ah.jpg)
![](/image/linux/ah1.jpg)
![](/image/linux/ah2.jpg)

- chmod change mode 的缩写，改变文件权限命令。

### linux 与 windows
#### 一切皆文件
这是Linux与Windows最大区别；

#### 万有之源，斜杠青年
linux有且只有一个根目录，就是 / 斜杠，根目录就是Linux最顶层的目录。

#### window反斜杠/与linux斜杆
- window 文件目录以反斜杠：
![](/image/linux/unsame.jpg)

- linux 文件目录以斜杠：
linux中用斜杠/来标明目录的层级与包含关系
![](/image/linux/unsame1.jpg)

#### 根目录直属子目录
- window
![](/image/linux/win.jpg)

- linux
见《根目录直属子目录》

### linux根目录直属子目录
#### 通过命令查看目录
[更多详细参考这里](https://linuxtoy.org/archives/linux-file-structure.html)

```s
# ls / 是查看 根目录
[hz@localhost ~]$ ls /
bin   dev  home  lib64  mnt  proc  run   srv  tmp  var
boot  etc  lib   media  opt  root  sbin  sys  usr
```

#### bin
- bin 英语binary的缩写，表示 “二进制文件”
- 我们知道可执行文件是二进制的
- bin目录包含了会被所有用户使用的可执行程序

#### boot
- 英语boot表示 “启动”
- 目录包含与linux启动密切相关的文件

#### dev
- 英语 device缩写，表示 设备
- 包含外设，它里面的子目录，每一个对应一个外设
- 比如代表我们的光盘驱动器的文件就会出现在这个目录下面

#### etc

- 有点不能顾名思义了，etc是法语 et cetera的缩写
- 翻译成英语就是 and so on， 表示 等等；
- etc 目录包含系统的配置文件

为什么在/etc下面存放配置文件
- 按照原始的unix说法，这下面放的都是一堆零零碎碎的东西，就叫etc好了，是历史遗留因素，所以叫etc。
目前，大多全局的配置都是放在 etc下，如 /etc/hosts文件等等；


#### home
- 英语home表示 家， 用户的私人目录；
- 在home目录中，我们放置私人的文件；
- 类似Windows中的documents文件夹，也叫 “我的文档”
- linux 中的每个用户都在home目录下有一个私人目录
- (除了大管家用户root)
- root用户拥有所有权限，比较任性，根普通用户不住在一起
- 假如我的用户名是oscar，那么我的私人目录就是 `/home/oscar`
- 假如另外一个用户叫john，那么他的私人目录就是 `/home/john`
#### lib
- 英语library的缩写，表示 库
- 目录包含被程序所调用的库文件，例如.so结尾的文件
- Windows 下这样的库文件则是以.dll结尾

#### media
- 英语 media 表示 媒体
- 可移动的外设（USB盘，SD卡，DVD,光盘 等等）插入电脑时
- linux可以让我们通过media的子目录来访问这些外设中的内容

#### mnt
- mount的缩写，表示 挂载
- 有点类似 media目录，但一般用于临时挂载一些装置

#### opt
- 可选的应用软件包
- 用于安装多数第三方软件和插件
#### root
- 根 的意思
- 超级用户 root 的家目录
- 一般的用户的家目录位于 /home下，root用户是个例外

#### sbin
- system binary的缩写，表示 系统二进制文件
- 比bin目录多了一个前缀 system
- sbin目录包含系统级的重要可执行程序

#### srv
- service 的缩写，表示 服务
- 包含一些网络服务启动之后所需取用的数据

#### tmp
- 临时的，普通用户和程序存放临时文件的地方

#### usr
- 英语 Unix Software Resource 的缩写，表示 Unix操作系统软件资源(类似etc，也是历史遗留的命名)
- 是最庞大的目录之一
- 类似Windows中的`C:\windows` 和 `C:\Program Files` 这两个文件夹的集合
- usr目录里安装了大部分用户要调用的程序

#### var
- variable 的缩写，表示 动态的 可变的
- 通常包含程序的数据，比如log日志文件


#### 类Unix操作系统是类似的
以上目录列表形式，在类Unix操作系统是类似的，如macOS的目录结构也是从根目录/开始的。









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

### 软件与安装

#### 软件包
Windows下的安装程序，在centos 下称之为 软件包， 英语 package；
一个软件包其实是软件的所有文件的压缩包；
为二进制形式，包含了安装软件的所有指令；
在 red hat 一族里，软件包的后缀是 .rpm;
rpm 是 red hat package manager 的缩写，表示红帽软件包管理器；
centos 作为 red hat 一族的一员，也是用 .rpm 的软件包；

类似的 Debian 家族的软件包 后缀为 .deb 。

linux 安装程序的特点，linux 创建一个集中存放软件的地方；

#### 切换软件仓库

centos 系统使用的软件仓库的列表是记录在一个文件中：
`/etc/yum.repos.d/CentOS-Base.repo`;
这个文件是系统文件，只能被root用户修改；

centos官方的源列表：
https://www.centos.org/download/mirrors/

切换源的步骤参考这篇博客：
[详细可参考](https://blog.csdn.net/inslow/article/details/54177191)；

```s
#从http://mirrors.aliyun.com/repo/Centos-5.repo下载文件，放到/etc/yum.repos.d/目录下，把该文件重命名为CentOS-Base.repo
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-5.repo
```
#### 安装软件有三种方式：
- 通过图形界面：
![](/image/linux/app.jpg)
- 通过命令终端安装，此时用到yum安装(推荐)

yum是centos中的默认包管理工具，也用于red hat 一族；
yum 常用命令：
```s
yum update 用于 更新软件包；
yum update xxx;
yum search xxx;
yum install xxx 
yum remove xxx 
```

- 下载 本地.rpm 软件包，可以用rpm命令来安装；
```s
sudo rpm -i *.rpm  用于安装；
sudo rpm -e 包名 用于卸载；
 本地.rpm 软件包，也可以用yum来安装
 sudo yum localinstall *.rpm  用于安装；
 sudo yum remove 包名 用于卸载；
```

### RTFM 阅读那该死的手册

RTFM ：read the fucking manual 缩写；

#### man 命令
man 命令 manual 缩写
后接你想要显示使用手册的命令，函数 等等；
此命令用于查看系统中自带的各种参考手册；
具体可查命令如下：
- 可执行程序或shell命令
- 系统调用（linux 内核提供的函数）
- 库调用（程序库中的函数）
- 文件（例如 /etc/passwd）
- 特殊文件（通常在/dev下）
- 杂项（比如man（7），groff（7））
- 系统管理命令（通常只能被root用户使用）
- 内核子程序

#### 安装man命令
```s
sudo yum install -y man-pages
```
手册不全，更新man数据库
```s
sudo mandb
```

#### man命令使用
输入 man 数字 命令/函数 ， 可以查到相关的命令和函数；
如果不加数字，man默认从数字较小的手册中寻找相关命令和函数；
```s
man rand
man 3 rand
random()
```
#### 手册中搜索
/键 ： 实现搜索，和之前在less命令中功能类似；

在谷歌或百度 直接搜索 man ls 也可以出来手册的内容；

#### apropos 查找命令
可通过 apropos sound 查找相关命令 如 amixer 音量调节器；

#### whatis 命令(man精简版)

```s
whatis ls
```
或者用：
-h 或 --help

### 查找文件
#### locate 命令
对于刚创建不久的文件，因为它们还没被收录进文件数据库，因此用locate命令就找不到其索引，自然就不会返回任何结果。
linux系统一般每天会更新一次文件数据库，只要你相隔24小时再用locate查找，就能找到刚创建的文件。

#### sudo updated
可使用 sudo updated 更新文件数据库

#### find命令
find的区别：
find 查找磁盘
locate 查找文件数据库

find 何处 何物 做什么
find 默认查找当前目录及其子目录，也可以指定 查找目录 如 /home
```s
find /var/log -name "newfile"
find /var/log -name "newfile*"
find /var -size +10M #查找超过10M的文件 M是兆，也就是10的6次方
find -name "*.txt"-atime -7 #查找最近7天内修改过的txt文件
```

type 类型
-type d : 只查找目录类型。 d是 directory 目录；
-type f : 只查找文件类型；
```s
find . -name "newfile" -type d #.是当前目录，
```
#### find进行操作

```s
find -name "*.jpg" -delete #删除所有查找到的jpg文件，
```

#### -exec与 -ok
```s
find one -name "*.txt" -exec chmod 600 {} \; #对于每个找到的txt文件，都进行-exec参数指定操作，如给txt文件设置600权限；
find one -name "*.txt" -ok chmod 600 {} \; #ok跟 exec 一样， 只是ok操作时，会询问是否继续；
```

### 查找内容

#### grep 命令 筛选数据

- grep 时 globally search a regular expression and print 的缩写
- 意思是 全局搜索一个正则表达式，并且打印
- grep 的功能简单说是在文件中查找关键字，并显示关键字所在的行
```s
 grep eslint  eslint.md #搜索文件内关键字eslint
```
- -i 忽略大小写
- -n 显示行号
- -v 只显示搜索文本不在的行， v时invert缩写
- -r 在目录和所有子文件中查找，后面跟搜索目录而不是文件，r是recursive的缩写，表示递归。
- E 使用正则表达式搜索 
```s
 grep -E ^eslint  eslint.md #搜索文件内关键字eslint
```

#### sort命令 为文件排序

- -o  output缩写，将排序后的内容写入新文件
```s
 sort -o 用于输出新文件.txt 原文件.txt
```
- -r参数 倒序排列 reverse的缩写。

#### wc命令 文件统计

- wc word count缩写，用于统计单词数，行数，字符数，字节数等；
```s
  wc eslint.md
 152  238 4712 eslint.md # 依次顺序分别为： 行数 单词数(此命令的单词数以空格split计算) 字节数
```
关于wc如何计算单词数，可以通过 `man wc`来查看相关解释

### cut命令 剪切文件的一部分内容
- cut用于对文件的每一行进行剪切处理
#### -c 根据字符数来剪切
c 是character缩写，表示字符
```s
cut -c 2-4 name.txt #剪切每一行的第二到第四个字符
```
#### 其他命令

- -d 参数， delimiter的缩写，是英语分隔符的意思；
用于指定用什么分隔符（比如逗号 分号 双引号等等）
- -f 表示剪切下用分隔符的哪一块(通过索引index标识)或哪几块；
```s
  cut -d , -f 1 notes.csv # 文件内容以逗号分隔，剪切分隔后index 为 1的那块内容； 注意命令后都要带空格
  cut -d , -f 1,2 notes.csv # 文件内容以逗号分隔，剪切分隔后index 为 1和2的那块内容； 注意命令后都要带空格
  cut -d , -f 2- notes.csv # 文件内容以逗号分隔，剪切分隔后index 为 2之后的所有块内容； 注意命令后都要带空格

  #第一条命令执行如下：
  C:\Users\Administrator\Desktop\linux
    λ cat test.csv
    mark, 95 / 100 , 很不错
    mttt, 9 / 100 , 很好
    gree, 5 / 100 , 不错
    lucy, 6 / 100 , 很不错
    jim, 5 / 100 , 错
    david, 17 / 100 , 不错

    C:\Users\Administrator\Desktop\linux
    λ cut -d , -f 1 test.csv
    mark
    mttt
    gree
    lucy
    jim
    david
    C:\Users\Administrator\Desktop\linux
```

## 基础知识二
### 输出重定向
- `>` 重定向到新的文件， 可以将命令的输出结果重定向到你选择的文件中
```s
 λ cut -d , -f 1 test.csv > cmd.csv #将原本显示在终端的内容，创建一个cmd.csv文件，显示到这个文件中来， 
 #此文件执行后，电脑中会创建一个cmd.csv文件
```
注意的是，使用`>`，创建的文件，如果原文件存在，将直接覆盖原文件的内容，若不存在，就创建。

为了解决`>`直接覆盖文件，有了另外一个命令 `>>`

-  `>>` 重定向文件末尾， 它跟  `>` 功能一样，不同的是， 如果原文件存在， `>>`只会在文件内容末尾追加，而不是覆盖

-  `2>` 将错误信息输出重定向到文件中，当命令执行出错时，错误信息重定向文件中可使用此命令，而不能使用 `>>`命令，因为`>>`只能在命令执行不出错时重定向
```s
 λ cut -d , -f 1 test.csv >> cmd.csv  2> err.log #将原本显示在终端的内容，显示在cmd.csv中，
 #如果出错，想错误信息显示在文件 err.log中
```
-  `2>>` 将错误信息输出重定向到文件的末尾，理解与 `>` 和 `>>`一样


-  `2>&1` 合并输出，有时候，我们想正常输出与上面说的错误输出合并输出到一个文件，就用这个命令。
```s
 λ cut -d , -f 1 test.csv >> result.txt  2>&1 #将原本显示在终端的内容，显示在cmd.csv中,无论错误还是正常输出内容，
```

上面重定向都是以cut为例子，你也可以用ls，或其他任何命令在终端有输出内容的，都可以输出到文件中。
```s
C:\Users\Administrator\Desktop\linux
λ ls > uu.txt

C:\Users\Administrator\Desktop\linux
λ cat uu.txt
abc.txt
end.md
eslint.md
font_end.md
git.md
he.txt
test.csv
tt.csv
uu.txt
```

### 黑洞文件 /dev/null
这是Linux系统中专有的一个黑洞文件，是特殊文件，不是一个目录，任何内容或数据写入其中，就好比被丢失，可用于执行命令时，不做任何输出，即 既不想在终端输出显示，也不想重定向到文件输出，此时可用到它。
```s
 λ cut -d , -f 1 test.csv > /dev.null #将原本显示在终端的内容，直接扔掉，不做任何显示
```

### 输入重定向
![](/image/linux/cut.png)

- `<` 用于指定命令的输入为文件输入；
```s
#下面两个命令执行结果表现一样，但有区别
 λ cat notes.csv #cat命令接受的输入是notes.csv这个文本界面； 它要先打开notes.csv文件，然后打印文件内容
 λ cat < notes.csv #cat命令接受的输入直接是notes.csv这个文件的内容； cat命令只负责将其内容打印；打开文件并将文件内容传递给cat命令的工作则交给终端完成；
```

- `<<` 用于指定命令的输入为键盘输入: 从键盘读取，将键盘的输入重定向为某个命令的输入.
```s
#END下面的END你可以取任何名字都可以
 λ sort -n << END #输入这条命令后，按下回车，终端就进入键盘输入模式；输入字符串，输入完一行就按回车，编辑下一行；输入完毕，就输入 上面的END;sort就会对你刚才输入的东西进行排序；
```

#### 综合练习输入输出重定向
![](/image/linux/red.png)

### 管道

管道符号 `|`，其作用是建立命令管道，也算是重定向流的一种。
![](/image/linux/pop2.png)
管道原理
将两个命令连成管道，简单说就是将一个命令的输出作为另一个命令的输入。
![](/image/linux/pop.png)

```s
[hz@localhost red]$ cat test.csv
mark, 95 / 100 , 很不错
mttt, 9 / 100 , 很好
gree, 5 / 100 , 不错
lucy, 6 / 100 , 很不错
jim, 5 / 100 , 错
david, 17 / 100 , 不错
[hz@localhost red]$ cut -d , -f 1 test.csv | sort > sorted_names.txt # 从test.csv剪切内容作为sort的排序输入内容，将最终排序的内容创建为sorted_names.txt
[hz@localhost red]$ cat sorted_names.txt
david
gree
jim
lucy
mark
mttt
[hz@localhost red]$ 

```

综合练习
```s
#grep a -Ir /home/hz/red 从目录中找出所有包含 a 这个关键字的行， -I 用于排除二进制文件， -r 用于递归遍历(因为grep遍历目录必须带-r)
#cut -d : -f 1 以分号分隔上面的输出内容，获取第一个index，其实就是文件名
#sort 排序
#uniq 去重
grep a -Ir /home/hz/red | cut -d : -f 1 | sort | uniq
```

![](/image/linux/pop1.png)

 ### 进程和系统监测
 
#### ps 进程的静态列表
ps 显示当前系统中的进程，只显示命令输入时的命令

#### top 进程的动态列表
top 动态显示当时的进程。

#### glances iftop htop软件
```s
#-y 带上-y后，执行命令时将不再询问你是否yes，直接执行。
yum install epel* -y
```
[CentOS7 安装系统监控软件 glances iftop htop](https://blog.csdn.net/ba__lu/article/details/80557947)


### 停止进程

ctrl+C 和 kill 命令

在终端中，拷贝和粘贴 时 ctrl + shift + c 或 v； ctrl + c 是停止终端中正在运行的进程。

- ctrl + c 只能作用于当前终端中正在运行的程序。


- kill 加pid进程号停止进程。
```s
kill 1125 6629
kill -9 7291 # -9 配合kill使用，可强制立即结束进程。
```

### 其他命令
```s
sudo halt #关闭系统 - 关机
sudo reboot #重启系统
#前面两个命令都是调用 shutdown 命令
poweroff #立即关机
```

### 延时执行的命令

#### at命令 延时执行一个程序，只能让程序执行一次
如果没有此命令，可以通过 `sudo yum install at`;

```s
at 20:10
> touch test.txt
# ctrl + D 组合键，at会显示<EOT>,是结束英文的缩写
```

可以使用 atq atrm命令列出和删除正在等待执行at任务；

#### sleep 命令 休息一会
```s
# 创建文件，等待15分钟，然后删除文件；
touch file.txt; sleep 14m; rm file.txt 
```

#### crontab 程序
![](/image/linux/chk.png)
![](/image/linux/cro1.png)
![](/image/linux/cro2.png)

配置linux终端默认使用 nano 编辑器：
```s
# .bashrc 是bash shell 的配置文件
echo "export EDITOR=nano" >> ~/.bashrc
```

### && 、 || 还有 分号
&& 前一个命令执行成功 再执行后一个程序；
|| 前一个命令执行失败，才执行后一个程序；
; 分号 不论分号前的命令执行成功与否，都执行分号后的命令


### 文件的解压与压缩

#### tar命令， gzip和bzip2命令的使用

- 首先 用tar将多个文件归档为一个总的文件，称为 archive；
- 然后 用gzip或bzip2命令将archive压缩为更小的文件；
![](/image/linux/tar.png)


### 文件解压与压缩

#### 在虚拟机上的centos上找到共享的文件
可通过命令
```s
# .bashrc 是bash shell 的配置文件
sudo find / -name "你共享文件的名字"
```
当以上方法找不到共享文件夹时，可以通过以下方法，[详细参考](https://blog.csdn.net/leacas/article/details/114678676)
```s
[root@localhost hz]#  vmware-hgfsclient  #命令查看当前有哪些共享的目录，这里我只使用了shared文件夹 
vmshare1
#命令挂载该共享文件夹(注意：带.号的哦)，其中.host:/Documents是共享名，只需把Documents换成 
[root@localhost hz]# sudo vmhgfs-fuse .host:/vmshare1 /mnt/hgfs
[root@localhost hz]# ls  /mnt/hgfs 成功找到获取到共享文件夹
6        git.md  htop-2.2.0.tar.gz  test.csv  tyyyu.txt
aa.txty  he.txt  ok.rar             tt.csv    uu.txt
```
你也可以将上面写成一个shell：
```js
[root@localhost Desktop]# cat share.sh
get_share_dirname(){
  echo `vmware-hgfsclient`
}
vmhgfs-fuse ".host:/$(get_share_dirname)" /mnt/hgfs
```
到此为止是可以使用该共享文件夹了，但每次都得重复mount一次，所以需要设置为随机启动后自动挂载 ,
编辑 /etc/fstab，添加下面一行,不过以下方式存在问题，且放这里做一个参考，不建议执行
```s 
.host:/vmshare1 /mnt/hgfs vmhgfs defaults 0 0
```

#### 修改共享文件权限为普通用户
共享文件一般在root下，比如：`/mnt/hgfs/vmshare/`
```s
# 共享文件在root下，所有是root超级管理权限，我们要改为普通用户权限
[hz@localhost ~]$ ls -l /mnt/hgfs/vmshare/
total 16
-rwxrwxrwx. 1 root root 14214 May 15 01:01 git.md
-rwxrwxrwx. 1 root root    38 May 20 17:40 he.txt
-rwxrwxrwx. 1 root root   143 May 22 04:03 test.csv
-rwxrwxrwx. 1 root root    14 May 22 03:38 tt.csv
-rwxrwxrwx. 1 root root    74 May 22 04:39 uu.txt
# 把共享目录内所有内容复制到 用户目录下的 /home/hz/tartest
[hz@localhost ~]$ sudo cp -r /mnt/hgfs/vmshare/ /home/hz/tartest
# 打印文件权限，发现是root权限
[hz@localhost ~]$ ls -l /home/hz/tartest
total 32
-rwxr-xr-x. 1 root root 14214 May 22 21:18 git.md
-rwxr-xr-x. 1 root root    38 May 22 21:18 he.txt
-rwxr-xr-x. 1 root root   143 May 22 21:18 test.csv
-rwxr-xr-x. 1 root root    14 May 22 21:18 tt.csv
-rwxr-xr-x. 1 root root    74 May 22 21:18 uu.txt
# -R 用于修改目录， 修改目录的权限为 hz:hz，前一个hz是群组，后一个hz是用户；
[hz@localhost ~]$ sudo chown -R hz:hz /home/hz/tartest
# -R 再次查看，发现权限已经变成普通用户
[hz@localhost ~]$ ls -l /home/hz/tartest
total 32
-rwxr-xr-x. 1 hz hz 14214 May 22 21:18 git.md
-rwxr-xr-x. 1 hz hz    38 May 22 21:18 he.txt
-rwxr-xr-x. 1 hz hz   143 May 22 21:18 test.csv
-rwxr-xr-x. 1 hz hz    14 May 22 21:18 tt.csv
-rwxr-xr-x. 1 hz hz    74 May 22 21:18 uu.txt
[hz@localhost ~]$ 

```

#### 压缩
```s
# -cvf 中 c表示创建， v表示显示细节， f表示指定归档文件 
[hz@localhost ~]$ tar -cvf sorting.tar tartest/
tartest/
tartest/git.md
tartest/he.txt
tartest/test.csv
tartest/tt.csv
tartest/uu.txt
[hz@localhost ~]$ ls
sorting.tar tartest  
```

```s
#上面是针对目录压缩，我们也可以针对文件压缩
[hz@localhost ~]$ tar -cvf sorting.tar tartest/git.md tartest/he.txt
```

```s
# -rvf追加文件到归档， 将git.md这个文件添加到 sorting.tar归档中；
$ tar -rvf sorting.tar tartest/git.md

# -xvf解开归档，x是extract缩写，取出的意思；
$ tar -xvf sorting.tar
```

#### gzip和bzip2命令，压缩归档

gzip比bzip2常用，效率更高，所有用的多；

- .tar.gz 用gzip命令压缩后的文件后缀名
- .tar.bz2 用bzip2命令压缩后的文件后缀名

```s
$ gzip sorting.tar
$ bzip2 sorting.tar
```

#### gunzip 和 bunzip2 命令 解压
```s
$ gunzip sorting.tar.gz
```

#### 一步到位压缩与解压
```s
# 在-cvf前加z，z就是gzip的意思，合并起来就是 -zcvf
$ tar -zcvf sorting.tar.gz sorting
# 在-xvf 前加z，z就是gzip的意思，合并起来就是 -zxvf
$ tar -zxvf sorting.tar.gz
```

#### zcat bzcat 显示压缩文件 
```s
$ zcat sorting.tar.gz
$ bzcat sorting.tar.bz2
```

#### zip/unzip 压缩/解压 zip 文件
一般linux可能需要安装这个命令
```s
sudo yum install zip #red hat 一族的安装方式；
sudo yum install unzip #red hat 一族的安装方式；

unzip -l ab.zip  #查看ab.zip文件，但不解压
zip -r sorting.zip sorting/  #压缩sorting目录为 sorting.zip文件； -r用于压缩目录
```

### 编译安装软件
下面都是基于red hat 一族的linux发行版，包括centos；其他非红帽linux发行版大同小异。
 ![](/image/linux/stl.png)

#### alien软件
alien 外星人的意思， 可以将deb安装包和rpm安装包互相转换

- 安装alien软件；
```s
$ sudo yum install alien
```

- 将 deb 转换为rpm
```s
$ sudo alien -r xxx.deb #转换为rpm，此过程可能耗时较长。
$ rpm -i xxx.rpm #使用rpm命令安装rpm包
```
值得注意的是，通过deb等方式转换过来的rpm包，可能安装不成功，因此最好是能够直接下载到rpm包。

- 实在找不到rpm安装包，可以获取软件的源代码，可以自行编译

#### htop编译安装

编译安装，编译就是将 程序的源代码 转换成 可执行文件 的过程。

ls /usr/bin 下都是可执行文件；

- [去htop下载源码](https://hisham.hm/htop/releases/2.2.0/),选择其中的gz包；

```s
# 下面命令请使用超级用户权限：

[root]# cp /mnt/hgfs/vmshare/htop-2.2.0.tar.gz . # 将共享文件拷贝到当前目录；
[root]# chown hz:hz htop-2.2.0.tar.gz # 修改压缩包文件权限
[root]# tar -zxvf htop-2.2.0.tar.gz # 解压缩
[root]# cd ./htop-2.2.0
[root]# ls # 发现里面有 configure可执行程序，以及编译的说明文件  Makefile 此文件对下面要用的make命令进行说明； 
     # 其中configure文件用于编译前的配置工作， Makefile对应编译的配置说明；
[root]# ./configure 执行此命令，做编译前的配置设置工作
configure: error: You may want to use --disable-unicode or install libncursesw. 
        # 发现报错，提示我们可以用 ./configure --disable-unicode 命令 或者 安装libncursesw

[root]# ./configure --disable-unicode # 还是报错，因此需要安装libncursesw 
        #  这里我们安装 libncursesw lib[ncursesw] 的开发版本 ncurses-devel
[root]#  yum -y install ncurses-devel # -y 表示不用经过我同意直接执行命令
[root]# ./configure # 再次执行编译前设置
[root]# make # 此命令对于上面的Makefile说明文件，执行此命令相当于安装，安装的内容为Makefile写的
[root]# make install # 将编译好的安装包进行安装
[root]# ls /usr/local/bin # 因为是本地自己编译安装，所以 安装好后，
        # 会默认将可执行文件放置于local/bin下，不过也可能在 /usr/bin，可以注意下。
htop
[root]# /usr/local/bin/htop # 因为htop是一个可执行文件，因此直接通过路径文件可直接运行命令，
        # 如果在/usr/bin/下有htop，估计可直接执行 htop
```
![](/image/linux/htop.png)


#### rar编译安装

- 在[官网](https://www.rarlab.com/)下，找到 安装包
```s
# 下面命令请使用超级用户权限：

[root]# wget https://www.rarlab.com/rar/rarlinux-x64-6.0.1.tar.gz
[root]# tar -zxvf rarlinux-x64-6.0.1.tar.gz
[root]# ls # 发现里面有已经有编译好的rar 和 unrar 可执行程序，因此不需要编译，直接安装即可 ； 
```
![](/image/linux/rar.png)
```s
[root]# make # 此命令对于上面的Makefile说明文件，执行此命令相当于安装，安装的内容为Makefile写的
```

- 修改环境变量
我们自己编译安装的程序，默认放置在  /usr/local/bin 下，需要配置环境变量 才方便使用安装的程序，

```s
# nano ~/.bash_profile
PATH=$PATH:/usr/local/php5/bin
export PATH
#  source /etc/profile 或执行点命令 ./profile 使其修改生效。
#  关闭终端，重新打开新的终端，即可使用安装的命令
```

- 压缩、解压文件
```s
rar a sort.rar sort/  # a 是add缩写，添加
unrar e sort.rar  # e 是extract 缩写 提取 取出
unrar l sort.rar  # 不解开，直接看内容
```

#### 修改环境变量
见《rar编译安装》


### 安装centos 服务器
这里选用 CentOS-7-x86_64-Minimal-2009 版本；
下面箭头部分是设置磁盘，点击进去，，按照默认选中下，然后点击done 即可，其他设置安装默认来：
这个页面还可设置其他配置，不过一般默认就行了，这里列举下可以设置什么：

![](/image/linux/ser.png)
![](/image/linux/ser1.png)

因为是服务器，所有这里只需设置root即可，不需要设置其他用户。

下面就是等待安装了，安装好后，使用root登录：
![](/image/linux/ser2.png)

#### 网络设置及其相关命令
查看ip信息的两个命令
ifconfig  比较旧的命令 net-tools中命令
ip addr 比较新的命令 iproute2中的命令
[关于ifconfig与ip addr](https://www.jianshu.com/p/6fff29bd42b3)

设置网络为桥接模式，方便其他虚拟机centos访问到这台虚拟机：
[VirtualBox中有4中网络连接方式](https://www.cnblogs.com/jpfss/p/8616613.html)
[enp0s3 与 ens33](https://www.jianshu.com/p/5fc492060e70)

![](/image/linux/ip.png)

注意的是，虚拟机链接网络时，需要设置下图 ONBOOT = yes,然后重启电脑，否则无法链接网络
![](/image/linux/ser3.png)

如果要使用ifconfig，需要安排 net-tools，
安装：`yum install net-tools`，然后一路yes就行；

这里可以查看 net-tools iproute2 下都有哪些命令
![](/image/linuxm/lan3.png)

查看 ifconfig 命令是哪个安装包：
使用rpm -qf 来查看 安装模块。
```s
[hz@localhost ~]$ which ifconfig
/usr/sbin/ifconfig
[hz@localhost ~]$ rpm -qf /usr/sbin/ifconfig
net-tools-2.0-0.25.20131004git.el7.x86_64 #说明是net-tools安装模板
[hz@localhost ~]$ 

```

### 解读ifconfig

#### 旧版
如下命令行执行此命令后，会显示三个接口：

- eth0 对应有限连接，对应你的有线网卡，一般是RJ45网线，eth是 Ethernet 的缩写，表示以太网，有些电脑可能有几条网线连着，此时会有eth1，eth2.
- lo 本地回环 local loopback 缩写，对应虚拟网卡，对应ip 127.0.0.1,一般用于访问自己；
![](/image/linux/lo.png)
- wlan0 对应wi-fi 无线连接，对应你的无线网卡，wlan 是 wireless Local Area Network 的缩写，表示无线局域网，若你有几个无线网卡，就有wlan1 wlan2...

关于下图的解析：
红框框出的， 无线没有发包和收包， 本地回环有包的发送，这是正常的； 最多的发包数量是有线连接，所以判定有线连接。
![](/image/linuxm/lan1.png)

#### 新版
- enp0s3 en 代表以太网卡，是Ethernet的缩写， p0s3 代表PCI接口的物理地址为（0，3），
  其中横坐标代表bug总线，纵坐标代表slot 槽、插口

还有一个虚拟接口，可以不用管，这里就不列出了。
![](/image/linuxm/lan2.png)


















 








