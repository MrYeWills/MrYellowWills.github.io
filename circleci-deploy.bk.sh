#!/bin/sh
# 开头的这一句是为了标识我是一个shell脚本，按照shell进行执行
# 出现非0错误 终止脚本 
set -e
# 打印当前的工作路径
pwd
# 查看当前目录下的文件信息
ls -la
# 定义远程仓库地址变量
remote=$(git config remote.origin.url)
echo 'remote address is: '$remote

echo `git status`

mkdir _test_cir
cd _test_cir

git clone https://github.com/YeWills/YeWills.github.io.git
git@github.com/YeWills/YeWills.github.io.git

ls

cd YeWills.github.io

echo git branch log --start `git branch`  end--

ls

cd ../../

cp -r _test_cir/YeWills.github.io/.git ./public

cd ./public
ls
git config user.name "yeWills"
git config user.email "601661706@qq.com"
git add .
git commit -m "circle public"
git push



