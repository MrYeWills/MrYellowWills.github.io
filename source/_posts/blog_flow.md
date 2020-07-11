---
title: 博客持续集成的实现
date: {{ date }}
tags: travis
categories: 
- 前端工具
series: 前端工具
---

## 持续集成的需求
基于github的博客持续集成，在博客分支下，以master作为发布分支；
blog_code作为开发分支；
当监听到blog_code提交commit时，将触发travis工具，执行 `hexo g`的编译，并将编译后的代码合并到master分支的过程。

## github token
创建token，路径如下：
```
settings / Developer settings / Personal access tokens 
```
任意定义一个token 的名字，如果没有特殊要求，可先全部勾选所有权限：
![](/image/blog_flow/token.jpg)
token类似一个秘钥，授权其他的应用来操作github的权限，比如创建、切换、提交分支的权限。

## travis-cli
### 选择要操作的branch
操作地址https://travis-ci.org/account/repositories，
选择要操作的branch，点击滑动开关
![](/image/blog_flow/branch.jpg)
### 填写github token
点击旁边的setting，设置setting，将gitbuh token填写上就行，其他默认。
![](/image/blog_flow/setting.jpg)
至此，travis-cli设置完毕，在首页将看到如下：
![](/image/blog_flow/view.jpg)

## _travis.sh
.sh文件是linux命令文件。
```sh
#!/bin/bash

#定义时间
time=`date +%Y-%m-%d\ %H:%M:%S`

#执行成功
function success(){
   echo "success"
}

#执行失败
function failure(){
   echo "failure"
}

#默认执行
function default(){

  git clone https://${GH_REF} .deploy_git
  cd .deploy_git

  git checkout master
  cd ../

  mv .deploy_git/.git/ ./public/
  cd ./public

cat <<EOF >> README.md
部署状态 | 集成结果 | 参考值
---|---|---
完成时间 | $time | yyyy-mm-dd hh:mm:ss
部署环境 | $TRAVIS_OS_NAME + $TRAVIS_NODE_VERSION | window \| linux + stable
部署类型 | $TRAVIS_EVENT_TYPE | push \| pull_request \| api \| cron
启用Sudo | $TRAVIS_SUDO | false \| true
仓库地址 | $TRAVIS_REPO_SLUG | owner_name/repo_name
提交分支 | $TRAVIS_COMMIT | hash 16位
提交信息 | $TRAVIS_COMMIT_MESSAGE |
Job ID   | $TRAVIS_JOB_ID |
Job NUM  | $TRAVIS_JOB_NUMBER |
EOF

  git init
  git config user.name "yeWills"
  git config user.email "xxxx@qq.com"
  git add .
  git commit -m "Update Blog By TravisCI With Build $TRAVIS_BUILD_NUMBER"
  # Github Pages
  git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:master

  # Create Tag
  git tag v1.2.$TRAVIS_BUILD_NUMBER -a -m "Auto Taged By TravisCI With Build $TRAVIS_BUILD_NUMBER"
  # Github Pages
  git push --quiet "https://${GH_TOKEN}@${GH_REF}" master:master --tags
}

case $1 in
    "success")
	     success
       ;;
    "failure")
	     failure
	     ;;
	         *)
       default
esac
```

## .travis.yml
描述文件 yml
```yml
language: node_js
# 虚拟环境下安装 11.12.0版本node
node_js:
    - "11.12.0"

sudo: false

#cache
cache:
  directories:
    - "node_modules"

notifications:
  # 邮件发送部署结果通知
  email:
    recipients:
      - xxxx@qq.com
    on_success: change
    on_failure: always

# S: Build Lifecycle
before_install:
  - sudo apt-get install libnotify-bin

install:
  - npm install
#  - gem install travis
#  - travis login --pro --github-token ${GH_TOKEN}

before_script:
  - export TZ='Asia/Shanghai'
  - npm install hexo-cli -g
  - chmod +x _travis.sh

script:
  # - hexo clean && hexo g
  - hexo g

after_success:
 # - LAST_BUILD_NUMBER=68
 # - for i in $(seq 1 $LAST_BUILD_NUMBER ); do  travis logs $i --delete --force ; done

after_script:
  - ./_travis.sh

# E: Build LifeCycle

branches:
  only:
    - blog_code
env:
 global:
   - GH_REF: github.com/YeWills/YeWills.github.io.git
```
