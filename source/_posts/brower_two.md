---
title: 浏览器系列(一)：浏览器插件
date: 2022/8/28
tags: [浏览器, 浏览器插件]
categories: 
- 工具
series: 浏览器
---

浏览器插件是一个单独进程，拥有很多电脑操作底层的能力，这是渲染进程所不能有的底层操作能力，这是插件的一切魅力源泉！
因此浏览器插件能做到很多页面业务js所无法做到的能力。

## 核心概念
popup，options，background，content_scripts

background 是后台，相当于进程，没有dom，不具备浏览器特性，所以很多浏览器api用不了，类似于 node 进程；
content_scripts 相当于页面上的js，可以直接操作页面；

## 插件调试

### 以百度翻译demo说明
#### demo地址
[demo地址](todo)

#### 调试background
插件popup，options，background，content_scripts4个内容的不同调试方法

打开谷歌扩张程序界面，找到该浏览器插件，点击浏览器插件 中间的 server workder 等等字样，
此时浏览器会跳出一个控制台，此控制台可以调试 ：
```js
  "background":{
        "service_worker":"js/bg-wrapper.js"
    },
```

[更多参考](https://www.bilibili.com/video/BV1ML4y1z7ba?spm_id_from=333.999.0.0)

#### 调试content
打开要翻译的页面控制台，找到 source，
source 子目录下，找到 Content scripts 就可以找到 content了。

#### 调试小技巧
如果你不知道如何找到调试入口，可以在js中，写入 console.log 代码，当控制台出现此log后，
点击此log，就可以找到 js 在 source 中的位置。

#### 此demo调试要点
此插件断点后，程序走完后，一定要再回到当初要翻译句子的页面，才会弹出alert；

插件刚加载到浏览器上时，可能不报错，后面用着用着，可能就报错了，有些报错并不影响使用，你可以清除旧的报错，重新查看新的报错。

移除、重新加载插件时，在旧的页面翻译时，在以前就打开的页面翻译时，或在以前就翻译过的页面时，可能会出现问题，重新打开一个新的页面进行翻译即可。

#### demo讲解
```js
{
    "manifest_version": 3,
    "name": "bdtranslate",
    "version": "1.0",
    "description": "百度翻译插件",
    "icons":{
        "128":"img/icon.png",
        "48":"img/icon.png",
        "16":"img/icon.png"
    },
    "background":{
        "service_worker":"js/bg-wrapper.js"
    },
    "permissions":[
        "contextMenus",
        "tabs"
    ],
    // 百度翻译时需要请求 百度翻译网关，跨域发送请求,解除限制
    "host_permissions": [
        "http://api.fanyi.baidu.com/"
      ],
    "content_scripts":[
        {
            "matches":["<all_urls>"],
            // 相当于作用于目标页面的js
            "js":["js/content.js"]
        }
    ]
}
```


## 黑知识
### background 无法使用jquery
因为background是一个后台进程，类似node，没有dom，因此不能使用jquery。
当然也不能使用ajax，因为只有浏览器 ajax XMLHttpRequest 是 浏览器属性。





