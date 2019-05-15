---
title: git笔记
date: {{ date }}
tags: [git]
categories: 
- git
series: git
---

一直在用git，也想总结一点git笔记，因此就有了本篇。

### git图形化工具误你一生
使用git图形化工具是使用git的错误开始，使用图形化越深，错的越深。
珍爱git，及早丢弃图形化。

### git init 与 git remote
本地一个文件夹，里面有很多文件，你想从现在开始，对此文件进行版本管理，执行git init即可；
git init后，就可以尽情地对此项目各种版本管理操作；
有一天你想对这个git init项目上传到github上，
在命令窗口执行 git remote，cmd窗口会提示你如何上传到GitHub服务器上。

### 看cmd窗口提示很关键
上面说到了执行git remote cmd窗口会有提示，按照提示，就可以完成想做的事情。
git 提供了强大的提示功能，要重视cmd窗口提示信息，很关键。
git bash 粘贴复制很好用

### 使用git bash，放弃cmd
git bash才是最适合用来管理git的命令窗口，比如 git bash 能时刻显示当前你所处的分支名，能完整保留git的操作，因为cmd超过一定操作会删除以前的操作日志。

### git fetch\git pull\切远程分支
git fetch 将远程分支更新到本地，但不与本地分支合并，下载到本地的分支的名字前面都有origin/,例如origin/master.
git pull 是git fetch与git merge origin/branch 的两步。
#### 拉取新项目时，如何切换到项目的其他分支
执行 git fetch后，git checkout即可

### git checkout
git checkout . 清除所有
git checkout string  ，此string可以是分支名，也可是commitHash

### git rebase

#### PR冲突时，处理冲突
多人开发，在提PR给develop分支时，当github页面提示有冲突时,处理如下：
切到自己的分支(PR到develop的分支)
```
git rebase develop
//这时会显示冲突内容，解决冲突，执行
git add .
git rebase --continue
git push origin -f
```
然后重新PR,这时就不报错了
有人将上一操作过程称为变基。
git rebase 功能类似 git merge，区别在于，git merge时，你的commit 是按先后顺序排列的，merge完成后可能一眼看不到自己的提交。
git rebase则不同，git rebase后，你与develop不同的提交(也就是你修改的)commit将显示在第一条，(注意的是，git rebase冲突修改将不会生成commit，从上面只有git add,没有git commit得到佐证，因为只有git commit 才会生成一条commit):
![](/image/git/git3.png)

以上过程是把git rebase 当git merge来用，git rebase的这种当merge的用法，用的不多，用得最多的就是上面展示的，用来处理PR后的冲突。

#### 将最新修改合并过来，且保证提交的连续性
比如，你在做用户管理功能，同事在做登录功能；
你的用户管理的页面效果写好了，要做接口联调，需要用到同事做的登录功能的用户参数；
注意，
你可以直接merge 同事的代码过来，但弊端是，你自己做的用户管理提交可能无法显示在git log的最前面；
在此推荐用rebase 同事的代码，好处是，既将同事的修改merge过来，又可以将自己的修改显示最上方，保证当前业务功能的commit的连续性和直观性。

#### rebase 与 merge
如上所说，rebase有这么多好处，merge能做到的，rebase都能做到，为什么不都用rebase呢？
因为merge是无害的，不改变commithash值；
而rebase有改变commithash值的风险，这就意味着你做分支的合并时就会出现冲突，如果你有一群小伙伴一起开发，那么这个冲突起来，会让你hold不住，然而这并不妨碍你对rebase的热爱。

因此鉴于merge的无害性，一般情况下分支合并就使用merge；
在特定场景下才使用rebase；

#### 合并commit
这是日常开发必备用法，不会此法，不能说会使用git

```
//正常使用
git rebase -i HEAD~6
按字母i键，进入insert模式(编辑模式)
留一个最上面的pick，
后面的pick全部换成s；
修改好后，按esc键(退出编辑模式)
:wq //保存编辑修改，vim命令
:q! //不保存编辑修改，vim命令
```
如果遇到冲突，除了以上命令，按提示操作，还会执行以下命令
```
//注意的是，执行完git add . 后，不必执行git commit
git add .
git rebase --continue
```
放弃rebase
```
git rebase --abort
```

注意的是以下两种方法都支持，两种方法各有优点：
```
git rebase -i HEAD~6
git rebase -i c9r26r869b8  //c9r26r869b8 此hash值不被合并，此hash以前的所有commit将被合并
```

### git reset
#### 将分支回滚到指定历史版本
```
// --hard 是强制的意思
git reset --hard commitHash
```

#### 放弃所有修改，回到干净的当前仓库版本
```
git reset --hard HEAD
```

#### git reset HEAD~
这个方法非常好用，本意是重新修改上一次提交。
执行这个命令后，将上一次提交的所有文件将至于 not staged 状态, 
然后，你可很直观看到这次提交修改的所有文件，
并且vscode对于not staged状态的文件，会将他们集中显示到源代码管理窗口，
这对于git rebase 很多commit后，然后再次整理或格式化所有的修改内容 是很棒的功能。

#### 回到指定提交后，并重新修改这一次提交内容
```
git reset --hard commitHash
//~ 指的是上一次的意思
git reset HEAD~
```
#### 再次对前几次commit修改的内容修改
我们做一个面包屑菜单功能，可能做了很多次提交，现在想对这么多次的提交所修改的所有内容，重新审阅一遍，以便修改内容或者格式化，解决方案如下：
```
git rebase -i HEAD~6
git reset HEAD~
git add .
git commit -m "面包屑功能"
```
参考《git reset HEAD~》
#### 注意
git reset后，要push时，都需加上-f，强制push

### git reflog
如果你使用git reset,那么git log无法查到当前提交之后的提交日志，此时使用 git reflog

### git cherry-pick
不懂git cherry-pick，说明你还不懂git这位美女的基本套路，必备git操作。
```
git cherry-pick commitHash
```
git cherry-pick 与 git reset 配合使用可以尽情任意穿插回滚修改版本提交，只有此时，你才懂git的美，从此爱不释手，相逢恨晚。

### git branch
```
git branch -D branch //删除本地分支
git branch -a // 查看远程有多少分支
```
### git push 删除远程分支
```
git push origin -d branch
```

### git tag
命令简单，Google下命令即可，git tag很重要也很好用，
tag的好处有，它既像一个branch，保存了当次tag的所有提交，又提供了一个zip包，
很多开源框架的 历史版本API 都是通过tag完成，非常之好用

### gitk
非常好用的查看工具，git自带，此工具太好用，是查历史，凭关键字查提交的一把好手，太重要，用得太频繁，你必需会，
启动方法：
git bash中执行
```
gitk
```
比较好的gitk命令
```
//查询abc.js文件的历史修改记录，比任何插件显示的全
gitk -- **/ abc.js
```
### 工作目录、index、HEAD、object、快照
工作目录、index（暂存区）、HEAD（当前所处commit）、object（文件树）。
快照：可以理解为版本每次提交后，git会给提交拍照，用来记录版本信息。
尤其 工作目录、index、HEAD 这三个概念是git的三驾马车，就好比 action、reducer、selector 是react-redux的三驾马车一样。
要多刷视频和书籍《精通git》了解这仨，了解git一切只是什么指针或快照，虽然我现在也忘得差不多，但一定要了解。
![](/image/git/git1.png)
工作目录，index（暂存区）、HEAD（master分支）、objexts（树）。
index与HEAD都是通过指针指向文件树objects；

### 其他常用命令
```
git stash
git stash apply
git checkout -b branch
git log -n
git commit -amend
git help stash //使用help方式一
git stash --help //使用help方式二
git diff
```

### git 技巧
#### 空格使用
清除多个或merge多个 可使用空格，一次搞定，如
```
git checkout file1.js file2.js
git merge branch1 branch2
```
#### --abort
--abort一般是放弃的意思，如
放弃merge
```
git merge --abort
```
#### --contnue
--abort一般是放弃的意思，如
放弃merge
```
git rebase --contnue
```
#### 字母q
在git log命令出来一堆历史时，按回车或其他键，只会显示更多历史，按字母q可退出。

#### -i
-i表示交互的意思。
```
git rebase -i HEAD~6
```

#### 双点号，三点号的特殊意义
```
git log -p master..origin/master 查看二者区别
```

#### gitk查看历史最可靠
vscode的一些插件(如 Git History)，可以很好地查看历史，不过也会有一些历史被漏掉，如对于一些git rebase -i的历史或者处理冲突的历史 有可能被漏掉不被显示，此时请使用gitk查历史，gitk最可靠，会显示所以提交，巨细无遗。

#### 多程序同时操作一个文件引起的报错
执行复杂操作时，报 permission错误，可能是由于其他程序和git同时操作一个文件引起的，
此时，可以停止npm start或关闭编辑器，只让git一个程序操作项目，解决此问题。

#### merge commitHash
git merge branch，也可以git merge commitHash；
同理估计也可以git rebase commitHash

#### vim命令
需要懂那么点vim 操作知识，如:wq :q! 参考 《git rebase》

#### 手动处理冲突
手动处理冲突其实很简单，而且又做到不依赖插件。

#### ssh可能并没有你想象重要
由于公司原因一直也没设置ssh，各种push什么的，也很少需要输入用户密码，不影响工作，也许ssh没有你现象的高大上。

### 推荐使用vscode
vscode内置了对git的支持，对git支持太友好，vscode自带的显示git版本变化的功能很好用，
配合vscode的一些git插件，能够很好的显示每行代码的历史记录，是甩锅，找坑的必备良器。


### 不会用GitHub就是耍流氓
用git，不会使用GitHub的基本操作，就是耍流氓，既然你跟git感情这么好，干嘛不更好一点，娶了她呢，这不是耍流氓吗。
主要要熟练 github的git workflow (也就是PR代码审核) 和 fork功能，以及看tag。
理解 git workflow的最核心的两大目的:PR代码审核 以及 维护一套测试、稳定和发布分支。
![](/image/git/git2.png)

### git入门阶段不需知道的

#### git rebase -i HEAD后记得合并到test branch
分支PR到develop后，如果在PR前做了合并历史(git rebase -i HEAD)，如果test branch基于develop创建，记得将自己被PR的分支 merge一次到test branch，由于test branch 滞后于develop branch，防止 从develop新建的branch merge到test branch时冲突，


