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

popup ： 插件启用时，固定在 地址栏右侧时，点击插件，就会弹出一个插件弹出页面，
前提是要配置，否则不会出现，**开发模式下查看需要右键插件**，点击【审查弹出页面】：
```json
  "action": {
    "default_title": "Default Title",
    "default_popup": "popups/popup.html",
    "default_icon": {
      "32": "icons/32.png",
      "72": "icons/72.png",
      "128": "icons/128.png",
      "512": "icons/512.png"
    }
  },
```
## 插件调试

### 好用的调试工具
[参考chromium的npm 工具调试 demo](https://github.com/mmktomato/chrome-extension-manifest-v3-declarativeNetRequest-sample/tree/master/static)
[参考web-ext](https://github.com/mozilla/web-ext)
```s
web-ext run -s src --target chromium --start-url 'https://www.baidu.com/'
```

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


## 插件能力
打印、网络请求（cookie、header 等）、标签页、处理页面内容、浏览器右键、浏览器下载、浏览器代理、vpn、获取电脑系统、电池信息、电脑桌面截屏、操作电脑文件；


## 参考与demo

### 自己开发的谷歌插件
[跨域Cookie转发 v3](https://github.com/YeWills/chrome-extensions)
可结合koa写的一个后台来测试cookie：
配合[后台demo - koa-demo 的 verdaccio-login 分支](https://github.com/YeWills/koa-demo.git)

### 其他
[官网](https://developer.chrome.com/docs/extensions/reference/)
[非常好【干货】Chrome插件(扩展)开发全攻略](http://blog.haoji.me/chrome-plugin-develop.html)
[chrome extension 开发入门指南](https://juejin.cn/post/7106758827520819236)
[官网示例 Chrome Extensions samples](https://github.com/GoogleChrome/chrome-extensions-samples)

[chrome浏览器插件开发视频教程](https://www.bilibili.com/video/BV1a64y187QR?spm_id_from=333.337.search-card.all.click)

[插件示例 - chrome-cookie-extence cookie携带 v2](https://github.com/chirpmonster/chrome-cookie-extence)

[插件示例 - chrome-extension-cookie cookie转发 v3](https://github.com/aMiing/chrome-extension-cookie)


[chrome-extension-cookie 一键搞定 cookie 跨域访问](https://www.jianshu.com/p/1b9639506728?u_atoken=05a3fe03-43e6-49f5-980a-0f27260a2914&u_asession=01SgGo7R_-nx3-sFM42Lr6v_DK_w82fkkvT935DecQjlkOzzSv6yRGEGtKjxsszuCZX0KNBwm7Lovlpxjd_P_q4JsKWYrT3W_NKPr8w6oU7K-PYd16O80yZLgUpuQXbm51p5RU6UlCZRD0CDVEtyq5OmBkFo3NEHBv0PZUm6pbxQU&u_asig=05bUYiDdyLnVZo90Knh5nAHMzwczUZhl586FMLh_Nggm3jfLp7h5u9z5cZZeDscVikUHF94E5R3jEggXgL9tgfMPp9K012d0NkNi2oANeRPsiWNdzalJYBylm9SCbAphlQRxmInA2niE1p5UKuLGJeTYvqNPWRRPHXtlAGOVWBXJH9JS7q8ZD7Xtz2Ly-b0kmuyAKRFSVJkkdwVUnyHAIJzVoJN2_YxVmpIh_TonA5n1xg6qhtPFV9-9xBkcNspRflO21gpjNe9akLVIO763CEMe3h9VXwMyh6PgyDIVSG1W-ma2sDGtl-YIWcpGzGsr3oyks0NmwmEEqbQaAo11Q_aeE1r4sWaf6bfYOh5XU1BzaN9q0bGxRapmSuxiYnwW6zmWspDxyAEEo4kbsryBKb9Q&u_aref=ClvQgIkmwIYYuyz9oNevRHlBeAw%3D)


[百度翻译开放平台](https://api.fanyi.baidu.com/doc/21)
[chrome extension 开发入门指南](https://juejin.cn/post/7106758827520819236)

[参考chromium的npm 工具调试 demo](https://github.com/mmktomato/chrome-extension-manifest-v3-declarativeNetRequest-sample/tree/master/static)
[参考web-ext](https://github.com/mozilla/web-ext)





