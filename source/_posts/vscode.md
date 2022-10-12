---
title: vscode笔记
date: 2020/8/19
tags: [vscode]
categories: 
- [工具]
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


## ts源码调试想到的

```js
{
    "configurations": [
        // 方式一
         {
            "name": "调试 ts 命令行",
            "program": "${workspaceFolder}/built/local/tsc.js",
            "request": "launch",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "args": [
                "./input.ts"
            ],
            "stopOnEntry": true,
            "type": "node",
        },
          // 方式二
        {
            "name": "调试 ts 源码",
            "program": "${workspaceFolder}/test.js",
            "request": "launch",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "args": [
                "./input.ts"
            ],
            "stopOnEntry": true,
            "type": "node",
        }
    ]
}
```
其中：
```js
// test.js
const ts = require("./built/local/typescript");

const filename = "./input.ts";
const program = ts.createProgram([filename], {
    allowJs: false
});
const sourceFile = program.getSourceFile(filename);
const typeChecker = program.getTypeChecker();

function visitNode(node) {
    if (node.kind === ts.SyntaxKind.TypeReference)  {
        const type = typeChecker.getTypeFromTypeNode(node);

        // debugger;
    }

    node.forEachChild(child =>
        visitNode(child)
    );
}

visitNode(sourceFile);
```



含义如下：
- name： 调试配置的名字
- program：调试的目标程序的地址
- request：有 launch 和 attch 两个取值，代表启动新的还是连上已有的
- skipFiles：调试的时候跳过一些文件，这里配置的是跳过 node 内部的那些文件，调用栈会更简洁
- args：命令行参数
- stopOnEntry：是否在首行加个断点
- type：调试的类型，这里是用 node 来跑

以上调试方式相当于在 vscode 终端里面的那个调试一样的道理，
方式一 在vscode终端实现方式：
```s
node ./built/local/tsc.js input.ts
```

方式二 在vscode终端实现方式：
```s
node ./test.js
```
