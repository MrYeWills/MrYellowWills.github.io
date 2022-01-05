---
title: 递归及其他
date: 2020/9/3
tags: [recursion]
categories: 
- js
series: recursion
---

主要是递归专项练习笔记，另外附带其他算法练习。

## 有关tree树的数据处理
### 需求：
#### 需求
```js
const list = [
  {
    "id": 19,
    "parentId": 0,
  },
  {
    "id": 18,
    "parentId": 16,
  },
  {
    "id": 17,
    "parentId": 16,
  },
  {
    "id": 16,
    "parentId": 0,
  }
];
// 转化为:
const tree = {
  "id": 0,
  "children": [
    {
      "id": 19,
      "parentId": 0
    },
    {
      "id": 16,
      "parentId": 0,
      "children": [
        {
          "id": 18,
          "parentId": 16
        },
        {
          "id": 17,
          "parentId": 16
        }
      ]
    }
  ]
}
```
#### 方案
```js

const idInfoMap = list.reduce((acc,item)=>{
    acc[item['id']]=item;
    return acc;
}, {})

console.log('idInfoMap..', idInfoMap)

const idChildsMap = list.reduce((acc,item)=>{
    const {id, parentId} = item;
    acc[parentId] = [...(acc[parentId]??[]), id]
    return acc;
  },{})
  console.log('idChildsMap..', idChildsMap)
const getTree = (id, parentId)=>{
    const model = {
        id,
        parentId
    }
    const childs = idChildsMap[id];
    if(childs){
        model.children=childs.map((childId)=>{
            if(idChildsMap[childId]){
                return getTree(idInfoMap[childId].id, idInfoMap[childId].parentId)
            }
            return idInfoMap[childId]
        })
    }
    return model;
}

const treeDatas = getTree(0)
console.log('treeDatas..',treeDatas)
```


## 方法二

```js
  var data = [
  {id: 1, pid: 0},
  {id: 2, pid: 0},
  {id: 3, pid: 0},
  {id: 4, pid: 1},
  {id: 5, pid: 1},
  {id: 6, pid: 2},
  {id: 7, pid: 3},
  {id: 8, pid: 3},
  {id: 9, pid: 4},
  {id: 10, pid: 1}
]
var isSuperPid = (id)=> id === 0
var flat2tree = flatLs => {
  flatLs.forEach(item => {
    if (!isSuperPid(item.pid)) {
      var index = flatLs.findIndex(item1 => item1.id === item.pid)
      if (index !== -1) {
        flatLs[index].children = flatLs[index].children || []
        flatLs[index].children.push(item)
      }
    }
  })
  return flatLs.filter(item => isSuperPid(item.pid))
}


flat2tree(data)



```







