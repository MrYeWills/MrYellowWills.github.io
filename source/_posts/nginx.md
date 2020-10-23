---
title: nginx代理
date: {{ date }}
tags: nginx
categories: 
- 前端工具
series: nginx
---

## 基础知识
### 启动
[MAC下安装nginx](https://segmentfault.com/a/1190000016020328?utm_source=sf-related)
```
sudo nginx
```
### 重新启动nginx (配置更新后)
```
sudo nginx -s reload
```
### 安装配置目录
```
/usr/local/etc/nginx/
```

### 报错处理
#### 权限不够-使用sudo
```
$ nginx
nginx: [alert] could not open error log file: open() "/usr/local/var/log/nginx/error.log" failed (13: Permission denied)
2020/10/22 11:32:33 [emerg] 29584#0: open() "/usr/local/var/log/nginx/access.log" failed (13: Permission denied)
```
### 杀掉nginx进程
```
$ ps -ef|grep nginx
    0 29678     1   0 11:37上午 ??         0:00.00 nginx: master process nginx
   -2 29679 29678   0 11:37上午 ??         0:00.01 nginx: worker process
  501 32921 32907   0  2:42下午 ttys000    0:00.00 grep nginx
$ sudo Kill -TERM 29678
Password:
$ ps -ef|grep nginx
  501 32936 32907   0  2:42下午 ttys000    0:00.01 grep nginx
```


