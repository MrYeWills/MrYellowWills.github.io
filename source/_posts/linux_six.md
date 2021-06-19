---
title: linux笔记(离)
date: 2021/6/19
tags: linux
categories: 
- 前端工具
series: linux
---


<!-- ![](/image/linuxs/tao.png) -->
## docker
dock 表示码头，docker是 码头工人的意思
docker 是一个容器(container)引擎


### 容器和虚拟机的区别

如下图，其中 app a 好比虚拟机centos中 yum install 各种软件 如httpd， squid
![](/image/linuxs/vir.png)
还可以参考[Docker与VM虚拟机的区别以及Docker的特点](https://blog.csdn.net/jingzhunbiancheng/article/details/80994909)
还可以参考[docker容器与虚拟机有什么区别？](https://www.zhihu.com/question/48174633)

### 版本
docker 企业版是收费的
docker-ce 是社区版，免费的，一般用 docker-ce社区版。
![](/image/linuxs/sim.png)
### centos的docker安装和使用

#### 安装
下面安装步骤和使用全部[参考官网](https://docs.docker.com/engine/install/centos/)

 sudo yum install -y yum-utils
 设置稳定仓库
 sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

![](/image/linuxs/ins.png)

yum install docker-ce docker-ce-cli containerd.io  docker-ce是免费版本

至此安装完毕

#### 使用一： hello-world
安装好后，直接看文档这里
![](/image/linuxs/start.png)
![](/image/linuxs/start1.png)

#### 使用二：安装和使用centos
涉及到比较多，单独列出说明:《安装和使用centos》



#### 异常
[root@localhost ~]# docker run -it centos bash
Unable to find image 'centos:latest' locally
docker: Error response from daemon: Get https://registry-1.docker.io/v2/: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers).
See 'docker run --help'.

如果遇到这样的异常，请多尝试几次



### 安装和使用centos
#### 安装和使用
`docker run -it centos bash` 这个命令是使用docker进入 centos 的bash终端；
docker会首先从本地查看是否有centos，如果无，就会自动安装centos；
然后进入centos 的bash终端
[root@localhost ~]# docker run -it centos bash
Unable to find image 'centos:latest' locally
latest: Pulling from library/centos
7a0437f04f83: Pull complete
Digest: sha256:5528e8b1b1719d34604c87e11dcd1c0a20bedf46e83b5632cdeac91b8c04efc1
Status: Downloaded newer image for centos:latest
注意这里以及变成root@30c93c21d6d0 与上一步centos主机root@localhost
这说明安装完后，默认进入centos终端，且使用root用户 
[root@30c93c21d6d0 /]# ls  
bin  dev  etc  home  lib  lib64  lost+found  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
[root@30c93c21d6d0 /]# pwd
/
[root@30c93c21d6d0 /]# exit 退出docker centos系统，进入主机centos系统终端
exit
[root@localhost ~]# pwd
/root
退出docker centos系统后，仍然可以使用docker使用docker centos系统内的可运行程序，
比如 docker centos系统内的echo 程序输出语句
[root@localhost ~]# docker run -it centos /bin/echo "hollo docker.."
hollo docker..
[root@localhost ~]#

#### 退出docker centos系统后仍可使用
退出docker centos系统后，仍然可以使用docker使用docker centos系统内的可运行程序，见上面《安装和使用》的命令行


### 其他介绍
[root@localhost ~]# docker images  #docker安装的镜像
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
hello-world   latest    d1165f221234   3 months ago   13.3kB
centos        latest    300e315adb2f   6 months ago   209MB
[root@localhost ~]# docker ps   #docker目前在运行的进程，下面显示是没有
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
[root@localhost ~]# docker ps -a  #-a表示docker刚才运行的进程
CONTAINER ID   IMAGE         COMMAND                  CREATED          STATUS                      PORTS     NAMES
fdc92c41c363   centos        "/bin/echo 'hollo do…"   8 minutes ago    Exited (0) 7 minutes ago              optimistic_volhard
30c93c21d6d0   centos        "bash"                   16 minutes ago   Exited (0) 15 minutes ago             busy_jang
889899077b9c   hello-world   "/hello"                 32 minutes ago   Exited (0) 32 minutes ago             clever_dirac
[root@localhost ~]# docker ps --help

Usage:  docker ps [OPTIONS]

List containers

Options:
  -a, --all             Show all containers (default shows just running)
  -f, --filter filter   Filter output based on conditions provided
      --format string   Pretty-print containers using a Go template
  -n, --last int        Show n last created containers (includes all states) (default -1)
  -l, --latest          Show the latest created container (includes all states)
      --no-trunc        Don't truncate output
  -q, --quiet           Only display container IDs
  -s, --size            Display total file sizes
[root@localhost ~]#







