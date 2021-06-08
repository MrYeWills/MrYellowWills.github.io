---
title: linux笔记(坤)
date: 2021/5/21
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

### SSH免密码登录

基于密钥的验证
客户机生成密钥对（公钥和私钥），把公钥上传到服务器；
并与服务器的公钥进行比较；
这种验证登录的方法更加安全，也被称之为 “公钥验证登录”

- 在客户机中生成密钥对（公钥和私钥）
ssh-keygen（默认使用RSA非对称加密算法）
执行命令：
```s
# 注意，在非联机服务器时执行此命令
ssh-keygen #此命令会在 `~/.ssh/`目录下，会新生成两个文件：
# id_rsa.pub 公钥；
# id_rsa 私钥；
```

- 把客户机的公钥传送到服务器
```s
ssh-copy-id root@192.168.1.103 #等价于 ssh-copy-id -i ~/.ssh/id_rsa.pub root@192.168.1.103
#其中 -i 是指定文件拷贝
```


下次登录就用命令：
```s
ssh root@192.168.1.103
```

ssh-copy-id 会把客户机的公钥追加到服务器的一个文件：`~/.ssh/authorized_keys`;
你会发现 authorized_keys 的内容与 上面的 id_rsa.pub 是一样的。

上面的ssh-copy-id命令其实就是一个复制命令，你可以不执行此命令，直接把公钥的内容拷贝到authorized_keys文件中。

如果你不想使用免密登录了，可在客户机执行下面命令：
```s
ssh -o  PreferredAuthentications=password -o PubkeyAuthentication=no root@192.168.1.104
```


### 命令集合

#### scp 网间拷贝
scp 是 secure copy 缩写 安全拷贝，可以使我们通过网络，把文件从一台电脑拷贝到另一台。
scp 基于 SSH(Secure SHell)的原理来运作的。
SSH 会在两台网络连接的电脑之间创建一条安全通信的管道
scp 就利用这条管道安全地拷贝文件

scp sourcefile destinationfile 前者是源文件，后者是目标文件 就是拷贝产生的文件；
上面两个文件都可以以 user@ip:file_name 来表示； 其中ip 也可以是 域名。
```s
scp file.txt root@192.168.1.5:/root # 表示从我的电脑中当前文件夹下的file。txt 拷贝到远程电脑。
```

## vim

### 注意点
- vim下输入大写，是按shift+对应字母
- vim有替换模式，参考如下《替换模式》
- vim中 数字+指令 是很通用的方式；下面有相关解释

### vim 的多种模式
vim 的多种模式 ： 交互模式(默认模式，也叫正常模式)、插入模式、命令模式、可视模式(不常用)

####  交互模式：
每次运行vim，就会进入这种模式；
这个模式下，你不能输入文本；
可以让我们在文本间移动，删除一行文本，复制粘贴文本；
可以跳转到指定行，撤销操作等等；

#### 插入模式：
是我们熟悉的文本编辑器的一贯作风，
按i进入这种模式，其他进入这种模式的方法有 I（大写i）、a 和 A、o和O；
退出此模式：按下Esc键

#### 命令(行)模式：
也称为 底线命令模式
这个模式下 可以运行一些命令例如 退出 保存 等等；
也可以用这个模式来激活一些vim配置，例如语法高亮，显示行号 等等；
甚至还可以发送一些命令给终端命令行，例如ls cp 等等；
进入方式：首先处于交互模式下，按下冒号键；
输入命令后，回车将执行此命令，执行命令后，将回到交互模式；
当然了，如果直接按esc键也可以回到交互模式；

![](/image/linuxm/vim.png)


#### 可视模式：
都从交互模式开始,
在交互模式下：
v 字符可视模式；
V 行可视模式；
ctrl + v 块可视模式；

v 字符可视模式：
可使用上下左右光标 选中字符，配合 d实现删除；
V 行可视模式：
行可视模式默认选中光标所在行，配合d实现删除；

ctrl + v 块可视模式；
【win下一定使用 git bash 操作，否则光标选中不一样】
配合 d 和 I 可实现很方便操作：
d键 用于删除选中的内容；
I键 用于插入内容： 进入块可视模式，光标选中相应字符，按I进入insert模式，输入插入的字符，按esc，就会在选中的字符前都插入对应字符非常好用。
![](/image/linuxm/vim1.png)


### vim 基本操作（移动，写入，保存，等等）
 
 【win下一定使用 git bash 操作】

####  保存文件：
:w 保存文件： 需先在交互模式下，按冒号进入命令模式，按w，write的缩写，是写入保存的意思；
如果是新创建的文件，可 :w newfilename ,就是保存新文件
保存文件后，就回到了交互模式，可以进行退出；
:q 退出， 需先在交互模式下，按冒号进入命令模式，按q,就是quit，退出；
文件若已经修改，但未保存，执行退出命令，vim将红色提醒，如果要直接退出，可运行命令 :q！
:wq 保存然后退出：这是两个命令的组合：w和q；
:x 与 :wq 有同样效果。



###  标准操作（复制，粘贴，撤销，等等）
以下都必须处于 **交互模式下**：

#### 删除
x 删除； 先按数字 再按 x；删除指定数字的字符；
dd 删除单词或者行,先按数字 再按 dd；删除指定数字的行 ；
d0 删除从光标到行首
d$ 删除从光标到行末；
以上 d开头的其实是剪切，可以配合粘贴p使用，不过是剪切达到了删除的效果;

#### 复制
yy 复制一行
yw 复制一个单词
y$ 复制到光标到行尾
y0 复制光标到行首

#### 粘贴
p 粘贴
 先按数字 再按 p；表示粘贴几次

#### 替换模式
R 替换模式 ：使用大写的R会进入替换模式，要退出此模式按esc

#### 撤销操作
u 撤销操作，
6 u 撤销之前6次操作；

**vim中 数字+指令 是很通用的方式；**

#### 重做
Ctrl + r 重做
为了取消撤销，也就是重做之前的修改
只需要按下ctrl+r， r是redo 重做

#### 设置配置 :set
:set nu  vim显示行号，nu number；
:set nonu vim不显示行号；





## Shell
### shell 概述
几乎所有unix发展而来的系统都是基于sh开发出来的shell。

shell 有以下几个分类：
![](/image/linuxm/shell0.png)

### 关于bash：
其中bash是非常有名的shell，
是大多数linux发行版的默认shell；
也是苹果的macOS操作系统的默认Shell(据说因为版权问题以后会缓存Zsh)


### shell可以做什么呢？
shell是管理命令行的程序；
记住你之前在终端输入过的命令；
用组合键ctrl+R在终端的历史纪录中搜索执行过的命令；
输入命令后，连续两次tab键 展示所有以此开头的命令；
输入命令后，按一次tab键 补全；
控制命令进程，比如ctrl+z 终止进程；
重定向命令(用到< > | 等符号)
定义别名

如下图，shell好比用户和内核沟通的一个桥梁：
![](/image/linuxm/shell1.png)

### 切换shell
为了切换shell，需要用到以下命令 chsh ，change shell 的缩写；

### 创建脚本文件

### 关于脚本的说明
- vim test.sh
- sh 就是shell的缩写；
- 后缀.sh已经成为一种约定俗成的命名惯例，你也可以不加后缀；
- 写一个shell脚本时，第一要做的就是指定哪种shell来 解析/运行 它；
- 因为sh ksh bash 等等shell的语法不尽相同；

- `#！`被称作sha-bang,或者shebang；指定脚本用哪种shell来运行；
- 你之前学过的命令在shell中都可以使用，比如 ls， cat等等；
- 注释使用 #；
- 给脚本文件添加可执行的权限 `chmod +x test.sh`

编辑test.sh内容如下：
```s
#!/bin/bash   #sha-bang,指定脚本用bash shell来运行
ls
```

#### chmod添加可执行的权限

```s
[hz@localhost ~]$ ls -l
-rw-rw-r--.  1 hz   hz           16 May 29 06:53 test.sh #-rw-rw-r--里没有x，说明没有运行权限；

#添加可执行的权限
[hz@localhost ~]$ chmod +x test.sh
[hz@localhost ~]$ ls -l
-rwxrwxr-x.  1 hz   hz           16 May 29 06:53 test.sh #-rwxrwxr-x有x，说明有运行权限；

#使用 ./test.sh 运行此sh文件
[hz@localhost ~]$ ./test.sh
Documents  htop-2.2.0.tar.gz  	test.sh

```

shell命令相比输入行的优势之一，就是一次性可以输入很多个命令；

#### 以调试模式运行

- 调试一个脚本程序 bash -x test.sh
- 参数 -x表示以调试模式运行
- shell就会把我们的脚本文件运行时的细节打印出来
```s
[hz@localhost ~]$ bash -x test.sh
+ ls # bash -x test.sh 调试模式下，
Desktop    htop-2.2.0	     test.sh
[hz@localhost ~]$ 

```

### 创建属于自己的命令

#### 关于PATH
为什么pwd这些命令直接可以运行，时因为这些命令都在PATH中；
PATH是linux的一个系统变量
这个变量包含了你系统里所有可以被直接执行的程序路径；
可用 echo $PATH可以打印PATH，将创建的sh文件拷贝到PATH中的任意一个目录，即创建成功：
```s
[hz@localhost ~]$ echo $PATH
/usr/local/bin:/usr/local/sbin:/usr/bin:/usr/sbin:/bin:/sbin:/home/hz/.local/bin:/home/hz/bin
[hz@localhost ~]$ sudo cp test.sh /usr/local/sbin #将sh拷贝到PATH里面任意一个目录下，即可在任意地方运行test.sh命令了；
[hz@localhost ~]$ test.sh 
Desktop    htop-2.2.0		test.sh
```


### Shell中的变量
可以用变量在内存中暂时储存信息

#### 定义变量：
```s
#变量名是message,注意=左右不要有空格，加空格将让系统认为message是一个命令
message='hello world' 
# 反斜杠\，也成为转义字符，在变量值中加入单引号，需要用转义符
message='hello ,it\'s me' 
```

#### echo
```s
#注意下面两种方式，打印结果是一样的，不过本质不一样
[hz@localhost ~]$ echo hello world # 向echo传递两个参数，分别为hello 和 world ，因此被打印出来
hello world
[hz@localhost ~]$ echo "hello world" # 用双引号括起来后，相当于一个参数，向echo传递一个参数 ：hello world
hello world
```

#### -e 插入换行符
- 如果要插入换行符，需要用到 -e 参数 :为了使 转义符 发生作用
- 比如换行转义符 \n ,如下
```s
[hz@localhost ~]$ echo -e "hello world\nsecond line"
hello world
second line
```

#### 变量名前加 $
- 显示变量： bash脚本中，如果要显示一个变量，用echo后，必须要在变量名前加 $
```s
# 直接在命令行中定义变量
[hz@localhost ~]$ msg1="888" #定义变量msg1，此变量将被写入系统内存
[hz@localhost ~]$ echo $msg1 #为什么可以读取，因为该变量被写入内存了
888

# 在shell脚本中定义，注意的是，脚本中定义的变量，直接在命令行中无法打印出来
[hz@localhost ~]$ cat test.sh
#!/bin/bash
msg="hello world"
echo $msg

[hz@localhost ~]$ ./test.sh  #运行命令
hello world

[hz@localhost ~]$ echo $msg # 直接在命令行中无法打印出来

```

### 单引号与双引号的区别
定义变量值时，单引号与双引号有区别；
- 单引号
如果变量被包含在单引号里面
那么变量不会被解析
美元符号 $ 保持原样输出,因为单引号忽略被它括起来的所有特殊字符;
- 双引号
双引号也会忽略大多数特殊字符，
不同的是，双引号不会忽略 这些符号：$  反引号(`) 反斜杠
不忽略上面的$符号，在双引号内可进行变量名替换
```s
[hz@localhost ~]$ msg1="888"
[hz@localhost ~]$ echo $msg1
888
[hz@localhost ~]$ echo 'price is $msg1'  #单引号，那么变量不会被解析, 因为单引号忽略被它括起来的所有特殊字符
price is $msg1
[hz@localhost ~]$ echo "price is $msg1"  #双引号，可正常输出变量
price is 888

```

### 反引号 
- 反引号要求shell执行被它括起来的内容(如 命令)，反引号用法广泛
```s
[hz@localhost ~]$ msg=`pwd`  #反引号 msg的值就是shell执行pwd之后的结果
[hz@localhost ~]$ echo "you are in dir $msg"
you are in dir /home/hz
```

### read 请求输入
#### 概述
- read 命令读取到的文本会被立即储存在一个变量里
```s
[hz@localhost ~]$ cat test.sh
#!/bin/bash
read name  #将read读取到的内容 赋值给变量 name
echo "hellow $name !"

[hz@localhost ~]$ ./test.sh
hz   #运行后，光标这里闪烁，提示你输入内容，输入完毕，回车后read读取你输入的内容，执行后续命令
hellow hz !
```

#### 同时给几个变量赋值
read命令一个单词一个单词(单词是用空格分开的)地读取你输入的参数，并把每个参数赋值给对应变量
```s
[hz@localhost ~]$ cat test.sh
#!/bin/bash
read name place #空格分隔变量名
echo "hellow $name , welcome $place !"

[hz@localhost ~]$ ./test.sh
hz chengdu #输入时，以空格分隔
hellow hz , welcome chengdu !
```

#### -p 显示提示信息
read命令的-p参数，p是 prompt，表示提示
```s
[hz@localhost ~]$ cat test.sh
#!/bin/bash
read -p 'please enter your name: ' name #-p 定义提示语
echo "hellow $name !"

[hz@localhost ~]$ ./test.sh
please enter your name: hz #关闭闪烁提示输入时，有上面定义的提示语
hellow hz !
```

#### -n 限制字符数目
用-n参数可以限制用户输入的字符串最大长度(字符数)
```s
[hz@localhost ~]$ cat test.sh
#!/bin/bash
read -p 'please enter your name(5 characters max): ' -n 5 name #-n 定义长度
echo -e "\nhellow $name !"

[hz@localhost ~]$ ./test.sh
please enter your name(5 characters max): huang #当输入上面超过5个字符时，不需要回车，系统直接执行后面命令
hellow huang !
```

#### -t 限制输入时间
用法根上面一样，超过输入时间，就不读取直接执行后续命令

#### -s 隐藏输入内容
用法与上一样，通常用于密码输入，场景有登录root用户时，输入密码是隐藏显示的。


### 数学运算
#### 在bash中，所有的变量都是字符串！
牢记 ：在bash中，所有的变量都是字符串！

#### let命令可以用于赋值
bash本身不会操纵数字，隐藏它也不会做运算
可以用let来达到运算目的，let命令可以用于赋值
```s
[hz@localhost ~]$ cat test.sh
#!/bin/bash
let "a = 5"
let "b = 6"
let "c = a + b"
echo "c =  $c"

[hz@localhost ~]$ ./test.sh
c =  11
```
#### shell支持的运算符：
![](/image/linuxm/calc.png)


### 环境变量
#### shell的查看和使用
shell中，每个脚本内的变量 不能被 其他脚本使用；
不过shell中的环境变量可以被此种shell的任意脚本程序使用
我们有时也把环境变量称之为 全局变量
可以用env命令来显示你目前所有的环境变量
![](/image/linuxm/env.png)
其中重要的变量有：
- SHELL
- PATH : PATH是一系列路径的集合，
只要有可执行程序位于任意一个存在与PATH中的路径，
那么我们就可以直接输入可执行程序名字来执行
- HOME :你的家目录所在路径
- PWD ：你当前所在目录
变量使用时，只需在前加$,比如：`echo $PATH`

#### 自定义环境变量
自定义环境变量 使用 export， 我们一般在rc文件中定义环境变量
```S
[hz@localhost ~]$ cat .bashrc
# .bashrc

# Source global definitions
if [ -f /etc/bashrc ]; then
	. /etc/bashrc
fi

 export EDITOR=nano

```

### 参数变量

#### 概述
可以这样调用我们的脚本文件
./test.sh 参数1 参数2 ...
这些个参数1 参数2 ... 被称之为 "参数变量"

![](/image/linuxm/var.png)
```S
[hz@localhost ~]$ cat test.sh
#!/bin/bash
echo "you have executed $0, there are $# params"
echo "first params is  $1"

[hz@localhost ~]$ ./test.sh money beauti  #输入参数
you have executed ./test.sh, there are 2 params
first params is  money
```

#### shift命令挪移
shift命令来 挪移 参数，一边依次处理；
shift命令常被用在循环中，使得参数一个接一个地被处理


### 数组
如下，
```s
[hz@localhost ~]$ cat test.sh
#!/bin/bash
arr=('value0' 'value1' 'value2') #定义数组，用小括号，每个元素用空格分隔
arr[5]='value5'
echo ${arr[0]}  #使用数组 用 ${}, 可通过下标访问，也可以通过通配符，访问所有
echo ${arr[*]} #也可以通过通配符，访问所有

[hz@localhost ~]$ ./test.sh
value0
value0 value1 value2 value5
```

### 条件语句

#### if
如下中括号两侧都要有空格：
![](/image/linuxm/if.png)
上面图片中， fi是if的反转写法，表示 if语句结束。
另外一种写法，中括号右侧加分号：
![](/image/linuxm/if1.png)

#### 等于号
在shell中，特别是在if条件内，判断是否相等用一个等于号，当然你用两个等于号也是可以的，如下：
```s
[hz@localhost ~]$ cat test.sh
#!/bin/bash
name1="test"
name2="demo"

if [ $name1 = $name2 ]  #判断是否相等用一个等于号
then
    echo "you have the same name"
else 
    echo "you diffrent name"
fi

[hz@localhost ~]$ ./test.sh
you diffrent name
```

#### elif 否则 如果
elif 是 else if 的缩写。
![](/image/linuxm/if2.png)


### 不同的测试类型
![](/image/linuxm/test.png)

#### 字符串判断
在shell中，所有的变量都是字符串：
![](/image/linuxm/test1.png)


#### 数字判断
尽管shell把所有变量都看成字符串，但我们还是可以做数字的条件测试：

![](/image/linuxm/num.png)

#### 文件判断
相比主流变成语言，
shell的一大优势就是可以非常方便地测试文件：
![](/image/linuxm/file.png)
![](/image/linuxm/file1.png)

### && 且的应用
类似的还有 或|| 的应用：
![](/image/linuxm/sum.png)

### case的应用
#### 简单使用
```s
[hz@localhost ~]$ cat test.sh
#!/bin/bash

case $1 in
     "matth")
        echo "hello matth"
        ;;  #两个分号 类似js 的break
     "mark") #也可以用通配符加上字符串
        echo "hello mark"
        ;;
     *)  #通配符
        echo "sorry,i do not know you"
      ;;
esac #case的结束符号
[hz@localhost ~]$ ./test.sh mark
hello mark
[hz@localhost ~]$ ./test.sh hz
sorry,i do not know you
```
#### 使用单|而不是||测试或
```s
[hz@localhost ~]$ cat test.sh
#!/bin/bash

case $1 in
     "matth" | "lucy" | "jim") #case内使用或时，不能用双||,而要用单|
        echo "hello matth"
        ;;
     *mark) #通配符加上字符串,此时要去掉双引号
        echo "hello mark"
        ;;
     *)
        echo "sorry,i do not know you"
      ;;
esac
[hz@localhost ~]$ ./test.sh jim
hello matth
[hz@localhost ~]$ ./test.sh supermark
hello mark
[hz@localhost ~]$ ./test.sh liuxijun
sorry,i do not know you
```


### shell循环语句

#### while
![](/image/linuxm/while1.png)
![](/image/linuxm/while2.png)
![](/image/linuxm/while3.png)

```s
[hz@localhost ~]$ vim test.sh
[hz@localhost ~]$ cat test.sh
#!/bin/bash

while [ -z $response ] || [ $response != 'yes' ] #若变量输入为空 或 非 yes，则一直让你循环输入
do
    read -p 'say yes: ' response
done
[hz@localhost ~]$ ./test.sh
say yes: 
say yes: d
say yes: yes
[hz@localhost ~]$ 
```
#### until
与while相反的 是until，用法一样。

#### for循环
```s
[hz@localhost ~]$ cat test.sh
#!/bin/bash
for file in `ls *.sh`  #使用反引号，列出目录下所有sh文件，赋值给变量file
do
    cp $file $file-copy #将变量file的所有文件copy一份
done
[hz@localhost ~]$ ls *.sh
test.sh
[hz@localhost ~]$ ./test.sh
[hz@localhost ~]$ ls *.sh
test.sh
[hz@localhost ~]$ ls *.sh-copy
test.sh-copy
```

#### seq 配合 for使用
seq是sequence 序列的意思：
```s
[hz@localhost ~]$ cat test.sh
#!/bin/bash

for i in `seq 1 5` #产生1到5的序列值
do 
    echo $i
done
[hz@localhost ~]$ ./test.sh
1
2
3
4
5


[hz@localhost ~]$ vim test.sh
[hz@localhost ~]$ cat test.sh
#!/bin/bash

for i in `seq 1 2 5` #产生1到5的序列值,中间间隔2
do 
    echo $i
done
[hz@localhost ~]$ ./test.sh
1
3
5
```

### 函数

#### 两种定义方式
![](/image/linuxm/fun.png)
![](/image/linuxm/fun1.png)
```s
[hz@localhost ~]$ cat test.sh
#!/bin/bash
print (){
 echo hello $1
}
print   # 调用函数，无传参
print lucy # 调用函数，并传参
[hz@localhost ~]$ ./test.sh
hello
hello lucy
```

#### 函数返回方式一：return 与 $?

```s
[hz@localhost ~]$ cat test.sh
#!/bin/bash
print () {
  echo hello $1
  return 1
}
print lily

echo return value of previous funtion is $? # $?代表 上一次函数的返回值
[hz@localhost ~]$ ./test.sh
hello lily
return value of previous funtion is 1 
```

#### 函数返回方式二：用命令(如cat)代替return
```s
[hz@localhost ~]$ cat test.sh
#!/bin/bash

getlines () {
  cat $1 | wc -l  #$1 getlines函数的入参 ；此外cat也起到了上面return的作用
}

linenum=$(getlines $1)  #$1 作为test.sh 命令的入参； 使用$() 包含，说明是一个表达式；

echo the files $1 has $linenum lines.
[hz@localhost ~]$ ./test.sh bb.txt
the files bb.txt has 8 lines.
```

#### 变量作用范围
默认来说，一个变量是全局的，
要定义一个局部变量， 需要用local关键字
![](/image/linuxm/fun2.png)
![](/image/linuxm/fun3.png)

#### 重载命令
我们可以用函数来实现命令的重载；
也就是说把函数的名字取成与我们通常在命令行用的命令相同的名字：
如下，我们想重载ls这个命令，此时可以用 command，注意如果不用command，会让程序无限循环执行。
```s
[hz@localhost ~]$ cat test.sh
#!/bin/bash
ls (){
  command ls -lh
}

ls
```

### 示例

#### 生成缩略图并html展示
[代码和必要的素材在这里](https://github.com/YeWills/linux-test/tree/master/code/shell/6)
注意，要安装缩略图插件：
```s
 yum install ImageMagick
```

```s
#!/bin/bash

# 如果命令参数为空(-z zero)，就用默认的gallery.html
if [ -z $1 ]
then
    output='gallery.html'
else
    output=$1
fi

# 使用空字符串替换文件内容  >输出重定向
echo '' > $output

if [ ! -e thumbnails ]  # 如果不存在thumbnails目录
then
    mkdir thumbnails
fi

# Beginning of HTML（HTML 文件的开头）
echo '<!DOCTYPE html>
<html>
  <head>
    <title>My Gallery</title>
  </head>
  <body>
    <p>' >> $output  #`>>` 重定向文件末尾

#  `2>` 将错误信息输出重定向到文件中， /dev/null是黑洞目录，完全丢弃
for image in `ls *.jpg *.png *.jpeg *.gif 2>/dev/null` 
do
    convert $image -thumbnail '200x200>' thumbnails/$image  #压缩的图片放置thumbnails/目录下
    echo '      <a href="'$image'"><img src="thumbnails/'$image'" alt=""/></a>' >> $output
done

# End of HTML（HTML 文件的结尾）
echo '    </p>
  </body>
</html>' >> $output

```

```s
执行上面的命令：
./gallery.sh test.html
```


#### 统计文本内字符出现的次数

##### 概述 
[代码和素材](https://github.com/YeWills/linux-test/tree/master/code/shell/7)
本命令是要统计words.txt 文件内英文字母 a-z 出现的次数，并且以如下方式展示：
```
A - 276526
B - 27652699
C - 27652699
...
```

```s
if [ -z $1 ] # 如果命令参数为空(-z zero)
then
    echo "Please enter the file of dictionary !"
    exit  # 退出程序
fi

if [ ! -e $1 ] # if判断文件是否存在的命令 -e exist
then
    echo "Please make sure that the file of dictionary exists !"
    exit
fi

# Definition of function
# 函数定义
statistics () {
  for char in {a..z}  # 遍历 a 到 z 字符
  do
    # "$char - `grep -io "$char" $1`"  在文件中查找字符如a，-i 忽略大小写， -o 寻找出所有字符，如果不加，
    #一行中若有多个字符匹配也只认为是找到一行
    # wc -l 统计行数 (-l line)
    # tr /a-z/ /A-Z/  tr是转换， 将小写 a-z 转换 为 A-Z 大写；
    # >> tmp.txt 追加到一个临时用于存储的文件，创造此文件，在于后面能配合sort使用
    echo "$char - `grep -io "$char" $1 | wc -l`" | tr /a-z/ /A-Z/ >> tmp.txt
  done
  # -r 倒序排列， -n 用于对数字排序 ， -k 2 指定 第2列排序 ， -t  - 指定列之间以-作为分隔符
  sort -rn -k 2 -t - tmp.txt
  rm tmp.txt #统计完后，tmp.txt就不需要了，删除掉
}

# Use of function
# 函数使用
statistics $1


```

##### 使用
```s
执行上面的命令：
./statistics.sh words.txt
```














 








