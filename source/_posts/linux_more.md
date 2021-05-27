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

### vim

vim下输入大写，是按shift+对应字母

vim 的多种模式 ： 交互模式(默认模式，也叫正常模式)、插入模式、命令模式、可视模式(不常用)

交互模式：
每次运行vim，就会进入这种模式；
这个模式下，你不能输入文本；
可以让我们在文本间移动，删除一行文本，复制粘贴文本；
可以跳转到指定行，撤销操作等等；

插入模式：
是我们熟悉的文本编辑器的一贯作风，
按i进入这种模式，其他进入这种模式的方法有 I（大写i）、a 和 A、o和O；
退出此模式：按下Esc键

命令(行)模式：
也称为 底线命令模式
这个模式下 可以运行一些命令例如 退出 保存 等等；
也可以用这个模式来激活一些vim配置，例如语法高亮，显示行号 等等；
甚至还可以发送一些命令给终端命令行，例如ls cp 等等；
进入方式：首先处于交互模式下，按下冒号键；
输入命令后，回车将执行此命令，执行命令后，将回到交互模式；
当然了，如果直接按esc键也可以回到交互模式；

![](/image/linux/vim.png)


vim 基本操作（移动，写入，保存，等等）
 
 【win下一定使用 git bash 操作】

保存文件：
:w 保存文件： 需先在交互模式下，按冒号进入命令模式，按w，write的缩写，是写入保存的意思；
如果是新创建的文件，可 :w newfilename ,就是保存新文件
保存文件后，就回到了交互模式，可以进行退出；
:q 退出， 需先在交互模式下，按冒号进入命令模式，按q,就是quit，退出；
文件若已经修改，但未保存，执行退出命令，vim将红色提醒，如果要直接退出，可运行命令 :q！
:wq 保存然后退出：这是两个命令的组合：w和q；
:x 与 :wq 有同样效果。



标准操作（复制，粘贴，撤销，等等）

交互模式下：
x 删除； 先按数字 再按 x；删除指定数字的字符；
dd 删除单词或者行,先按数字 再按 dd；删除指定数字的行 ；
d0 删除从光标到行首
d$ 删除从光标到行末；
以上 d开头的其实是剪切，可以配合粘贴p使用，不过是剪切达到了删除的效果;

yy 复制一行
yw 复制一个单词
y$ 复制到光标到行尾
y0 复制光标到行首

p 粘贴
 先按数字 再按 p；表示粘贴几次


R 替换模式 ：使用大写的R会进入替换模式，要退出此模式按esc

u 撤销操作，
6 u 撤销之前6次操作；

vim中 数字+指令 是很通用的方式；

Ctrl + r 重做
为了取消撤销，也就是重做之前的修改
只需要按下ctrl+r， r是redo 重做

:set nu  vim显示行号，nu number；
:set nonu vim不显示行号；


可视模式：都从交互模式开始
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
![](/image/linux/vim1.png)


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










 








