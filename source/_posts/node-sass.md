---
title: node-sass、M2芯片、Homebrew、nvm、node 问题
date: 2023/02/11
tags: [node-sass, node]
categories: 
- 前端工程
---

本文主要是m芯片安装的一些问题分析，其中关于 node，其他系统安装可以借鉴。
## node-sass失败
可能是 node-sass与node版本不一致导致。

## nvm install失败问题

M2芯片 安装node 12 版本；
node 16版本之前的版本，没有适配 m芯片，可以通过提示：
[Mac M1 nvm install失败问题](https://blog.csdn.net/gongch0604/article/details/126117575) 
```js
➜  sales_app git:(carDetail) nvm install 12.22.12
Downloading and installing node v12.22.12...
Downloading https://nodejs.org/dist/v12.22.12/node-v12.22.12-darwin-arm64.tar.xz...
-#O=-#      #        #                                                                                                                                                                                                        
curl: (22) The requested URL returned error: 404 
```
M芯片会默认带上 arm64 这个m芯片标识后缀，但node16版本之前没有，解决方法参考上面。
解决问题，可以充分阅读终端输出。


技巧：
通过 node 的淘宝源，查看node对应版本所有的node包文件：
https://registry.npmmirror.com/binary.html?path=node/v14.18.2/


[NVM 快速安装教程](https://zhuanlan.zhihu.com/p/549133769)
[nvm 设置国内镜像](https://juejin.cn/post/7095318124433506341)



## Homebrew安装失败的解决

参考 http://www.daqizhe.cn/blog/119.html?tangsiqi130/article/details/130249316

关于`arch -x86_64 zsh`的解释：
>其实，注意到在任何命令前增加 arch -x86_64，就可以以 X86 模式运行该命令。因此，运行：
arch -x86_64 $SHELL
就可以启动一个 X86 模式终端，使得之后运行的命令都在 X86 模式下运行。






## M芯片安装 node-sass
比如 M芯片，安装 node-sass 4.12 版本前的，都会报错，
原因是安装的时候会拼接地址：
```js

> node-sass@4.7.2 install /Users/yewills/Documents/workplace/bk/xxxx/node_modules/node-sass
> node scripts/install.js

// 注意 这个 https://npmmirror.com/mirrors/node-sass/v4.7.2/darwin-x64-72_binding.node 地址将无法访问，
// 将转发到 https://registry.npmmirror.com/binary.html?path=node-sass/v4.7.2/
Downloading binary from https://npmmirror.com/mirrors/node-sass/v4.7.2/darwin-x64-72_binding.node
Cannot download "https://npmmirror.com/mirrors/node-sass/v4.7.2/darwin-x64-72_binding.node": 

HTTP error 404 Not Found

Hint: If github.com is not accessible in your location
      try setting a proxy via HTTP_PROXY, e.g. 

      export HTTP_PROXY=http://example.com:1234

or configure npm proxy via

      npm config set proxy http://example.com:8080

> node-sass@4.7.2 postinstall /Users/yewills/Documents/workplace/bk/xxxx/node_modules/node-sass
> node scripts/build.js
```

去淘宝源，查看node-sass里面的资料文件，发现没有 darwin-x64-72_binding.node，_72 以下的有：
`https://npmmirror.com/mirrors/node-sass/` 将转发到 `https://registry.npmmirror.com/binary.html?path=node-sass/v4.7.2/`

逐个提高版本，最终在v4.12.0的版本找到了 `darwin-x64-72_binding.node`。
所以，M芯片，最多只能支持到 v4.12.0。


### 安装 node-sass 与设置 sass_binary_site的关系

```sh
# .npmrc
sass_binary_site=https://npmmirror.com/mirrors/node-sass/
```

通过这个，很容易找到下载的node-sass，让下载顺利进行。



### 如果下载不到就会报错 gyp的，而并不是真的 python的问题

如题

