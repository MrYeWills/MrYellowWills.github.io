---
title: hexo笔记
date: 2018/10/1
tags: hexo
categories: 
- 工具
series: hexo
---

## hexo 常用知识


### public目录 
根目录执行hexo g 命令，会在根目录下生成一个public/ 文件夹，
hexo g是一个编译源码的命令，编译后的源码，可以直接供GitHub网址生成博客。
因此public/ 文件夹是用来将源码上传到github上，供github生成博客的。

### 常用hexo命令
#### 启动本地服务，看博客效果
```
hexo s
```
#### 发布到GitHub
将git仓库放在public中，每次需要发布时，根目录下执行hexo g，然后在public目录下 git push;
```
hexo g

```
#### 其他命令
hexo d 并不会删除publc目录的.git文件夹，只会增量叠加。 --目前没有用过；
注意，不要执行hexo clean，它会删除public目录

### 写的文章放在哪里与_posts目录
YeWills.github.io/source/_posts/
所有的文章都放置于_posts目录下。

### 创建tag与categories相关事情
二者配置一样，以categories为例：
hexo new page categories
生成目录和文件：
YeWills.github.io/source/categories/index.md
修改index.md元数据
```
---
title: categories
date: {{ date }}
type: "categories"
layout: "categories"
---
```
同时修改
YeWills.github.io/scaffolds/draft.md
```
---
title: {{ title }}
tags: {{ tags }}
---
```
YeWills.github.io/scaffolds/page.md
```
---
title: {{ title }}
date: {{ date }}
---
```
YeWills.github.io/scaffolds/post.md
```
---
title: {{ title }}
date: {{ date }}
tags: {{ tags }}
---
```
如此便可以配置出categories的all或全部 的选项卡内容，如果没有以上步骤，也可以生成categories，但无法生产categories的all或全部 的选项卡内容；
且点击本主题左侧菜单栏categories会报404错误。

这一步的配置内容，可看commit 哈希值 cbb06710ce7a40ade93

### categories、tags两种配置方式
categories:
```
// 推荐使用方法 method one,双横杠方式，可以配置多级，
categories: 
- react
- react读书笔记
```
```
// method two,只能配置一个值
categories: "react"
```

tags:
```
// method one
tags:[react, react读书笔记]
```
```
// method two,只能配置一个值
tags: react
```

### 博客菜单栏左侧内容修改
比如修改qq号码，名字，git地址，都可在这里修改YeWills.github.io/themes/mellow/_config.yml

### 博客菜单栏左侧菜单增减
比如修改qq号码，名字，git地址，都可在这里修改YeWills.github.io/themes/mellow/_config.yml
修改改文件的menu部分：
```
menu:
  home:
    text: HOME
    url: /
    icon: home
  th-list:
    text: CATEGORIES
    url: /categories
    icon: th-list
  tags:
    text: TAGS
    url: /tags
    icon: tags
  archives:
    text: ARCHIVES
    url: /archives
    icon: archives
```
如上，menu.th-list配置的是categories目录

### 本博客定义tag、categories注意
---
title: 再读 typescript 笔记
date: 2021/7/20
tags: [typescript]
categories: 
- typescript
series: typescript
---
如上，由于本博客选择的theme 对子类显示并不友好，
因此无法定义子类，
为此 只定义 categories 一个，比如 umi，本来属于前端工程，
但由于 umi 系列，因此直接将 umi 定义成一个 一级 categories；

另外要规范定义好 tag，这样通过tag就能找到所有相关的博客。

对于博客categories的分类规范参考文末的 《附录 -- 本博客的分类规范》


## hexo 黑知识

### loading三级标题的编译异常
给三级标题名只有单独的 一个 loading 字时，hexo编译出来的目录可能会异常：
```
//这个会异常
### loading
```
解决之道是在标题不定义为单独的loading，加点字就行如：
```
//这个正常
### 有关loading
```


### 如何定义二级categories
```md
---
title: node模块
date: 2019/8/13
tags: [node , nodemon]
categories: 
- 前端工程
- node
---
```
其中
```md
categories: 
- 前端工程
- node
```
会定义成二级 categories
效果如下：
![](/image/img/cat.jpg)
![](/image/img/cat1.jpg)


## 附录

### 本博客的分类规范
```md
框架
- react
    title: React 笔记
    title: react中的表单处理
    title: EnForm动态表单封装
    title: next form 封装
    title: EnForm动态表单的使用
    title: React hooks 笔记
    title: ListBuilder引发的React暗黑思考
    title: react-redux笔记
    title: React Router
- vue
    title: vue笔记
- jquery

ts
    title: typescript 笔记
    title: ts把玩系列(二):类型体操通关秘籍
    title: 再读 typescript 笔记
    title: ts与react结合使用
    title: ts把玩系列(三):温故知新

js
title: js设计模式下
title: js设计模式上(面向对象、闭包、命名空间)
title: js笔记(二)
title: 工具函数


前端
    title: 前端笔记 （浏览器缓存）

html
    title: html笔记

css
    title: css笔记
    title: css知识点汇
    title: css趣事
    title: grid布局
    title: css之布局
    title: css之移动开发
    title: vertical-align、行盒子、baseline

版本管理
- git
    title: git笔记

http
    title: http协议
    title: 再读http协议

github
    title: 我的github demo
    

图形化
    title: canvas demo
    title: canvas笔记

    title: d3笔记
    title: d3的三种模式 及 append、data、selectAll
    title: d3图形、demo讲解、使用经验
    title: svg笔记

私库
    title: verdaccio搭建npm私服(一)：基础知识
    title: verdaccio(三)：要点与学习
    title: verdaccio搭建npm私服(二)：示例

常用ui库
    next框架及项目笔记


前端工程
    - umi系列 
        title: umi系列(八) 文档插件
        title: umi系列(end) 附录、参考
        title: umi系列(五)：pnpm install
        title: umi系列(四)：npm script命令
        title: umi系列(九) 文档插件
        title: umi系列(七) 插件、hooks
        title: umi系列(六) 配置源码位置
        title: umi系列(十) umi项目脚手架、改造umi
        title: umi系列(三)：pnpm与umi-scripts
        title: umi系列(二)：基础知识，如umi dev过程分析
    - webpack
        title: webpack笔记
        title: webpack源码系列(田)：chunk及之后的调试
        title: webpack源码系列(誉)：module调试
        title: webpack笔记新
        title: webpack源码系列(往)
        title: 你不知道的webpack(三)
        title: webpack源码系列(获)：核心概念
        title: webpack源码系列(来)
        title: webpack源码系列(蹇)：loader
    - babel
        title: babel笔记
        title: babel笔记(二)：插件开发
    - ui框架
        title:  ui组件库系列(四):发布、ui项目架构、小结
        title:  ui组件库系列(三):本地编译、启动与调试
        title:  ui组件库系列(二):打包
    设计一个中台项目
    title: 0到1快速构建自己的后台管理系统
    title: eslint笔记
    title: next框架及项目笔记
    title: npm包开发
    title: npm官网笔记
    title: npm script
    title: monorepo笔记
    title: yarn官网笔记
    title: wills-react-pro项目笔记
    title: 博客持续集成的实现

工具
    title: linux笔记(乾)
    title: linux笔记(坎)
    title: linux笔记(巽)
    title: linux笔记(坤)
    title: linux笔记(离)
    title: linux笔记(震)
    title: mac和linux笔记
    title: nginx笔记(有)
    title: 部署、运维及边缘
    title: shell脚本demo
    title: vscode笔记

博客网站
   title: hexo笔记

项目经验
    title: 项目笔记

计算机知识
    计算机基础系列
    title: 计算机基础(二)：wireshark抓包
    title: 硬件

浏览器
    title: 浏览器系列(一)：浏览器基础知识1
    title: 浏览器系列(三)：浏览器插件
    title: 浏览器系列(二)：浏览器基础知识2

node
    title: node笔记
    title: node模块

后端
    title: egg笔记
    title: 后端笔记
    title: 后端demo
    title: koa2笔记
    title: mongoose 与 mongodb笔记

调试
    title: 了解控制台
    title: js调试

技术随笔
    title: 技术箴言
技术之外

    title: 一路美食 一路风景
    title: 医药
    title: 儿童免疫力
    title: 决定房价的因素


```