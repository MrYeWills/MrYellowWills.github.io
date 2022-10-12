---
title: npm官网笔记
date: 2022/8/6
tags: npm
categories: 
- 前端工程
---

## 黑知识

### 由install预安装了解npm生命周期命令
#### node-gyp
[参考 package-json](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#default-values)
>If there is a binding.gyp file in the root of your package and you have not defined an install or preinstall script, npm will default the install command to compile using node-gyp.

#### preinstall, install, and postinstall
[参考 foreground-scripts](https://docs.npmjs.com/cli/v8/using-npm/config#foreground-scripts)
Run all build scripts (ie, preinstall, install, and postinstall) scripts for installed packages in the foreground process, sharing standard input, output, and error with the main npm process.

#### 了解npm生命周期命令
npm 执行不同命令时，会相应执行对应的生命周期命令，详细查看：
[参考 life-cycle-scripts](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts)

### 别名 Aliases

[参考 npm install <alias>@npm:<name>](https://docs.npmjs.com/cli/v8/commands/npm-install#description)
[参考 aliases](https://docs.npmjs.com/cli/v8/using-npm/package-spec#aliases)
```
semver:@npm:@npmcli/semver-with-patch
semver:@npm:semver@7.2.2

比如执行命令：
  npm install jquery2@npm:jquery@2
  npm install jquery3@npm:jquery@3
  npm install lodash@npm:lodash-es

就会在package.json中写入：
```

  "dependencies": {
    "jquery2": "npm:jquery@^2.2.4",
    "jquery3": "npm:jquery@^3.6.0",
    "lodash": "npm:lodash-es@^4.17.21"
  }

以上说明npm别名使用的场景：
- 当需要在项目中使用多个版本的npm包时，比如上述的 使用jquery2 和 jquery3；
- 老项目中已经大量使用lodash，我不想修改老项目的引用，但我想将lodash更换我一个加强版但lodash；
[参考 npm install <alias>@npm:<name>](https://docs.npmjs.com/cli/v8/commands/npm-install#description)
>Install a package under a custom alias. Allows multiple versions of a same-name package side-by-side, more convenient import names for packages with otherwise long ones, and using git forks replacements or forked npm packages as replacements. Aliasing works only on your project and does not rename packages in transitive dependencies. Aliases should follow the naming conventions stated in validate-npm-package-name.


### scope命名带@与不带@
不带@，就是github仓库的用户名+仓库地址
[参考 Installing scoped packages](https://docs.npmjs.com/cli/v8/using-npm/scope#installing-scoped-packages)
Note that if the @ symbol is omitted, in either case, npm will instead attempt to install from GitHub; see npm install.


### npm config set 可简写为 npm set
[参考 Sub-commands](https://docs.npmjs.com/cli/v8/commands/npm-config#sub-commands)
```s
npm config set key=value [key=value...]
npm set key=value [key=value...]
```


### workspaces的原理小探

[官网 defining-workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces#defining-workspaces)对一个例子做如下说明：
>The expected result once running npm install in this current working directory . is that the folder packages/a will get symlinked to the node_modules folder of the current working dir.

这其实说明了 workspaces 的本质，就是让npm install的时候，将pkg通过软链接的形式，放到 node_modules 中：
```
.
+-- node_modules
|  `-- a -> ../packages/a
+-- package-lock.json
+-- package.json
`-- packages
   +-- a
   |   `-- package.json

```
这样，结合node js引擎原理，任何使用 requiry 的表达式，都会从根目录下的 node_modules 寻找引用包。

以上就是 workspaces 软链接原理。

workspaces 实现了 软链接 与 批量执行 npm 命令的 lerna 三个特性之二。
不过没有实现 lerna 第三个特性，就是批量管理 npm publish时，处理git与pkg版本号管理。

就最小原则来讲，基建的事应该交给 lerna做， 包管理器就做包管理的问题，
所以lerna工具还是有存在的道理的。

#### workspaces软链接与npm link 区别
前者详情参考上面，后者是先将代码软链接一份到全局的用户npm安装目录上，然后从全局的目录上 复制一个软链接到 消费者项目的node module中。
简言之，npm link 会对全局环境造成污染。















## 好用的npm cli
npm login
npm whoami  查看登陆名；
npm config list 可以查看当前的配置信息，包括登陆的token信息；



## 好用的npm cli
npm help adduser --viewer=browser   浏览器中打开 npm adduser 的说明文档；
npm find-dupes --dry-run  找出被重复引用的包；
npm why react 查看npm包被哪些包或项目引用，why 是 explain 的别名；
npm search umi  找出源中所有umi相关的包
npm help-search x  如果你对某一个npm 命令 或其他 有困惑，可以用这个命令，比如 x 是 npm exec 的别名，它就会列出相关的，其中exec就会列出来
npx npm-packlist 查看npm publish 会包含要上传的文件；
npm repo eslint  打开eslint的github
npm docs eslint  打开eslint的官网文档
npm bin --global  找出global npm 命令bin所在目录；
npm root -g 可以获取全局的npm install -g 安装的npm包位置：
```s
$ npm root -g
/usr/local/lib/node_modules
```

意想不到的 别名

npm adduser 别名为 npm login


高级：
npm deprecate my-thing@"< 0.2.3" "critical bug fixed in v0.2.3"  
>This command will update the npm registry entry for a package, providing a deprecation warning to all who attempt to install it.


可以通过这个例子来看出 npm 中 -- 的使用技巧 [官网](https://docs.npmjs.com/cli/v8/commands/npm-exec)
```s
npm exec -- <pkg>[@<version>] [args...]
npm exec --package=<pkg>[@<version>] -- <cmd> [args...]
npm exec -c '<cmd> [args...]'
npm exec --package=foo -c '<cmd> [args...]'

alias: x
```

