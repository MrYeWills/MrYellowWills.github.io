---
title: vscode笔记
date: 2020/8/19
tags: [vscode]
categories: 
- [前端工具]
series: vscode
---

## vscode调试
### 普通调试
#### 普通文件
```json
{
    // workspaceFolder 其实就是项目根目录
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "nodemon启动",
            "runtimeExecutable": "nodemon",
            "program": "${workspaceFolder}/src/app.js",
            "restart": true,
            "console": "integratedTerminal",
            "internalConsoleOptions": "neverOpen"
        },
        {
            "type": "node",
            "request": "launch",
            "name": "node启动",
            "program": "${workspaceFolder}/src/app.js"
        },
        {
            "type": "node",
            "request": "launch",
            "name": "调试当前文件",
            "program": "${file}"
        }
    ]
}
```
配置好后，debugge 界面会变成：
![](/image/node/pre.jpg)
项目目录：
![](/image/node/deb.jpg)
#### node调试
参考上面
#### nodemon调试
参考上面
### inspertor方式
另外也可以使用跟移动端调试一样的一种方式，就是inspertor 谷歌控制台方式，详细参考慕课网中的node调试入门的课程。
### 参考
[慕课 node调试入门]()
[Node.js+Koa2+MySQL打造前后端分离精品项目《旧岛》 - vscode+nodemon调试配置](https://coding.imooc.com/class/chapter/342.html#Anchor)
