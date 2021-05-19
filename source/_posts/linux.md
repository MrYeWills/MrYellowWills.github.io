---
title: linux笔记
date: {{ date }}
tags: linux
categories: 
- 前端工具
series: linux
---

## 基础知识

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
























 








