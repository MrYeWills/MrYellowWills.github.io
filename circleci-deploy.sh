#!/bin/bash

#定义时间
time=`date +%Y-%m-%d\ %H:%M:%S`
remote=$(git config remote.origin.url)

#执行成功
function success(){
   echo "success"
}

#执行失败
function failure(){
   echo "failure"
}

#写在default函数上，默认被执行
function default(){

  echo start::`pwd`
  git clone ${remote} .deploy_git
  cd .deploy_git

  git checkout master
  cd ../

  mv .deploy_git/.git/ ./public/
  cd ./public

cat <<EOF >> README.md
部署状态 | 集成结果 | 参考值
---|---|---
完成时间 | $time | yyyy-mm-dd hh:mm:ss
部署环境 | circleci/node:12.8.0 | window \| linux + stable
部署类型 | $test | push \| pull_request \| api \| cron
启用Sudo | $test | false \| true
仓库地址 | $remote | owner_name/repo_name
提交分支 | blog_code | hash 16位
提交信息 | $test |
EOF

  git init
  git config user.name "yeWills"
  git config user.email "601661706@qq.com"
  git add .
  git commit -m "Update Blog By CircleCI"
  # Github Pages
  git push

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

