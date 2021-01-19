---
title: 代理 跨域 host代理
date: 2021/01/19
tags: [代理, 跨域, host代理]
categories: 
- 前端工具
series: webpack
---

## webpack代理
### 同域名且同端口才会被匹配
场景，使用第三方组件，第三方组件用了自己一套ajax，且内置了自己的网址做请求，不过对外暴露了host处理，此时为避免跨域，将第三方组件host配置为'a.test360.com:8080'，与webpack启动的域名端口相同。
此时就会被webpack捕获：
```js
new MediaUp({
        browse_button : 'pickfiles',
        filters : {
            mime_types : [
                    { title : "Video files", extensions : "wmv,avi,mpg,mpeg,3gp,mov,mp4,flv,f4v,m4v,m2t,mts,rmvb,vob,mkv"}
                ],
            max_file_size : '30mb'
        },
        snaps:8,//0表示不获取
        host:'a.test360.com:8080'
    });
```
```js
 devServer: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api/proxy': {//第三方组件的请求会被捕获 ： http://a.test360.com:8080/api/proxy/blockAbc.json
        target: 'http://upload.media.test.com:3000',
        changeOrigin: true,
        secure: false,
      }, 
```

### proxy只要任意一处匹配到即可
如下`/proxy`既能匹配到 `/proxy` 还能匹配到 `/api/proxy/` 等等:
```js
 devServer: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/proxy': {//被匹配的有 ： http://a.test360.com:8080/api/proxy/blockAbc.json  与 http://a.test360.com:8080/proxy/blockAbc.json
        target: 'http://upload.media.test.com:3000',
        changeOrigin: true,
        secure: false,
      }, 
```
### 给webpack代理到的域名配置host代理
如上
```js
 devServer: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/proxy': {
        target: 'http://upload.media.test.com:3000',
        changeOrigin: true,
        secure: false,
      }, 
```
host配置如下：
```
127.0.0.1 upload.media.test.com
```
 页面中访问 `http://a.test360.com:8080/api/proxy/blockAbc.json` 时其实相当于访问 `http://127.0.0.1:3000/api/proxy/blockAbc.json`












