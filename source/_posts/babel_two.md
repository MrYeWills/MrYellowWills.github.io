---
title: babel笔记(二)：插件开发
date: 2022/6/28
tags: [babel]
categories: 
- 前端工程
---




## 基础知识

### visitor 与其属性方法
```js

const { join, dirname } = require('path');
const fs = require('fs');

const cwd = process.cwd();

function replacePath(path) {
  if (path.node.source && /\/lib\//.test(path.node.source.value)) {
    const esModule = path.node.source.value.replace('/lib/', '/es/');
    const d = join(cwd, `node_modules/${esModule}`);
    const esPath = dirname(d);
    if (fs.existsSync(esPath)) {
      console.log(`[es build] replace ${path.node.source.value} with ${esModule}`);
      path.node.source.value = esModule;
    }
  }
}

// 本组件是为了将源码中 类似 import cc from "./lib/aaa.js" 改成 import cc from "./es/aaa.js"
// ImportDeclaration 与 ExportNamedDeclaration 属于ast的api，只有遇到 import 或 export 关键字时触发；
function replaceLib() {
  return {
    visitor: {
      ImportDeclaration: replacePath,
      ExportNamedDeclaration: replacePath,
    },
  };
}

module.exports = replaceLib;

```

又如：
```js
const { declare } = require('@babel/helper-plugin-utils');

const targetCalleeName = ['log', 'info', 'error', 'debug'].map(item => `console.${item}`);

const parametersInsertPlugin = ({ types, template }, options, dirname) => {
    return {
        visitor: {
          // CallExpression 只会在遇到 关键字 console 才会 触发
            CallExpression(path, state) {
                if (path.node.isNew) {
                    return;
                }
                const calleeName = path.get('callee').toString();
                 if (targetCalleeName.includes(calleeName)) {
                    const { line, column } = path.node.loc.start;
                    const newNode = template.expression(`console.log("${state.filename || 'unkown filename'}: (${line}, ${column})")`)();
                    newNode.isNew = true;

                    if (path.findParent(path => path.isJSXElement())) {
                        path.replaceWith(types.arrayExpression([newNode, path.node]))
                        path.skip();
                    } else {
                        path.insertBefore(newNode);
                    }
                }
            }
        }
    }
}
module.exports = parametersInsertPlugin;

```
又如：
```js
// 此babel 插件用于 将所有的 import 语句中 有关 less 结尾的，转成 css 结尾的；
function transformImportLess2Css() {
  return {
      name: 'transform-import-less-to-css',
      visitor: {
        // ImportDeclaration 与 ExportNamedDeclaration 属于ast的api，只有遇到 import 关键字时触发；
          ImportDeclaration(path, source) {
              const re = /\.less$/;
              if(re.test(path.node.source.value)){
                path.node.source.value = path.node.source.value.replace(re, '.css');
              }
          }
      }
  }
}

```

综合以上的示例，就可以知道，visitor 下的属性方法，何时触发，完全取决于，属性方法代表的含义，
而这些属性方法时 ast语法的api，

有一个最简单的方法知道 什么关键字对应ast哪些方法，可通过网站：

{% img url_for /image/babel/vi1.jpg %}
{% img url_for /image/babel/vi2.jpg %}

上述相关插件demo，可以[去这里 -- babel-webpack](https://github.com/YeWills/babel-plugin-exercize/tree/babel-webpack/exercize-parameters-insert)，通过关键字查询
关于上述插件demo更多说明 [参考](https://juejin.cn/book/6946117847848321055/section/6945997926376144899)

关于 [visitor 更多说明](https://www.babeljs.cn/docs/plugins#%E6%8F%92%E4%BB%B6%E5%BC%80%E5%8F%91)

## demo
[去这里 -- babel-webpack](https://github.com/YeWills/babel-plugin-exercize/tree/babel-webpack/exercize-parameters-insert)