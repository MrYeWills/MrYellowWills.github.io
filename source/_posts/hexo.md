---
title: hexo笔记
date: {{ date }}
tags: hexo
categories: 
- 前端工具
series: 前端工具
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

