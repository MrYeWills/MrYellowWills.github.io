---
title: mac和linux笔记
date: 2020/5/1
tags: mac
categories: 
- mac
series: mac
---

### 显示用户目录
MAC电脑默认隐藏了你的用户目录，所以才找不到。
在finder的偏好设置中选择“边栏”选中个人收藏下“房子的图标”，这样就用户目录，然后在边栏就可以看到用户目录，然后就可以找到目录了

### 切换大写
长按 caps lock 直至灯亮就是大写，短按变小写。

### 有关echo
echo类似console.log，日志打印
```
echo $ PATH
```

### linux下关键字
#### whoami
我是谁
#### date
系统日期
```
jsdeiMac:~ xhkj$ date
2019年 5月19日 星期日 23时50分00秒 CST
jsdeiMac:~ xhkj$ whoami
xhkj
```

#### sudo
sudo是linux下的一个使用最高权限执行命令的关键字，
此命令需要输入用户密码

### mac常用
#### 打开usr目录
打开finder，快捷键 command+shift+G，输入 `/usr`回车即可。
#### ps aux | grep mysql 
查看

#### mysql安装
参考 [文档](https://jingyan.baidu.com/article/fa4125ac0e3c2928ac709204.html)
#### 微信能网络，浏览器网络很慢
是dns出现了问题，解决方法很简单，在dns服务器中增加 114.114.114.114即可。
114.114.114.114 是与谷歌dns 8.8.8.8 一样的利于dns解析的配置，
配置后，可让你浏览器上网dns解析快速。
解决qq能上网，但浏览器无法上网的困扰。


