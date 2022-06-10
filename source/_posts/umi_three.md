---
title: umi系列(三)：pnpm与umi-scripts
date: 2022/5/13
tags: umi
categories: 
- 前端工具
series: 基建
---



## 参考

### 文档

- [Node.js v16.15.0 文档  -  child_process.html](http://nodejs.cn/api-v16/child_process.html)

## 细节

### 发布npm的scope包
只要不发布私包，不需要钱，[参考](http://www.javashuo.com/article/p-dcxlagwa-gp.html)


### pnpm与workspace
创建文件`pnpm-workspace.yaml`：
```yaml
packages:
  - 'scripts'

```

```js
// package.json
 "devDependencies": {
    "umi-scripts": "workspace:*"
  },
```
然后在 scripts 目录下，新建 umi-scripts 包，

执行 pnpm install,
执行完后，会生成 pnpm-lock.yaml ，
并且为 scripts 下的  umi-scripts 包源码目录 创建一个软链接，
将此目录映射到 node_modules 下，
如果 umi-scripts 有bin命令，pnpm 也会为它生成一个.bin 目录的相关命令配置。
一切做好后， 你在项目中就可以愉快的使用 umi-scripts包了，
因为其本质是将源码目录全部放置到 node modules 下，与真正的npm install 无异，用起来一样。
更妙的是，它还可以创建了软链接，一旦修改，node modules 也会是最新的修改。


### node 的 stdout 和 stderr
node 的 stdout和stderr 对应 node.js 标准/错误输出
另外一个 stdin 用于输入。
```js
var cp = require('child_process');
  //spawn
  var ls = cp.spawn('mkdir'/*command*/, ['dd22d12']/*args*/, {}/*options, [optional]*/);
  ls.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  ls.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  ls.on('exit', function (code) {
    console.log('child process exited with code ' + code);
  });
```
默认情况下， child_process.spawn， 会在父 Node.js 进程和衍生的子进程之间建立 stdin、stdout 和 stderr 的管道。[参考](http://nodejs.cn/api-v16/child_process.html#child_processspawncommand-args-options)


另外一个例子，比如 stdin 输入：
```js
process.stdout.write('nihao')
process.stdin.on('data',function(data){
  process.stdout.write(`----${data}`)
  if(data==1){
    process.exit(0)
  }
})
process.on('exit', function(data){
  process.stdout.write(`exit----${data}`)
})

```

### bin执行文件npm命令的特殊性
```js
{
  "name": "umi-scripts",
  "version": "1.0.0",
  "private": true,
  "bin": {
    "umi-scripts": "bin/umi-scripts.js"
  }
}

```

```js
#!/usr/bin/env node

const { join } = require('path')
const { existsSync } = require('fs')
const { sync } = require('@umijs/utils/compiled/cross-spawn')

const argv = process.argv.slice(2)
const name = argv[0]
const scriptsPath = join(__dirname, `../${name}.ts`)

// 此 esno 为 esno 包 局部安装后的npx 命令， 用于node环境执行ts文件。
const spawn = sync(
  'esno',
  [scriptsPath, ...argv.slice(1)],
  {
    env: process.env,
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true
  }
)

```

注意的是，凡事npm包的 bin 文件，虽然也是js文件，但此为特殊js文件，
比如上面的 esno ， 本来需要使用 npx esno 来执行的，
因为它是 npx 的bin 文件，因此 只需要 esno 即可，不需要加npx esno

这是观察到现象，是否正确待进一步考证。

可以以 `D:\git\umi\umi-next\scripts\bin\umi-scripts.js` 为例子研究。

