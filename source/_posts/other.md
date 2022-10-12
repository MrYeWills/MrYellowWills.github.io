---
title: 部署、运维及边缘
date: 2020/5/1
tags: [jenkens, docker, nginx]
categories: 
- 工具
series: 边缘
---


这篇笔记暂时随便写下，后期会修改或删除。
## 腾讯云
### 通过iterm登陆腾讯云
### 安装docker
#### 概述
[linux安装docker](https://www.jianshu.com/p/2dae7b13ce2f)
#### 加速器配上很重要
下面是腾讯云的加速器地址，加速器对腾讯云中加载资源很重要，否则龟速。
```
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://mirror.ccs.tencentyun.com"]
}
EOF
```
#### 注意启动docker
### 安装portainer
portainer是docker可视化的一个工具。安装好后，浏览器启动：
`http://81.70.51.148:9000/#/containers`
```
docker volume create portainer_data
docker run -d -p 9000:9000 -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer
```
### 安装 jenkins
```
docker pull jenkins/jenkins
docker run -d -v jenkins_home:/var/jenkins_home -p 8080:8080 -p 50000:50000 jenkins/jenkins
```

### 安装nginx
```
docker run --name nginx-hz -p 8090:80 -d nginx
```

### 写入脚本
```
echo [INFO] 开始构建
npm install
hexo g

echo [INFO] 编译并部署结束!
```

