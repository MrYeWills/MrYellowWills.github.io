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
扁平数据 转为 树形数据， **需要知道顶级节点 isSuperPid**
```js
      function getData(data){
      var isSuperPid = (id)=> id === "129371"
      var tree = []
      var flat2tree = flatLs => {
        flatLs.forEach(item => {
          if (isSuperPid(item.deptNo)) {
            tree.push(item)
          } else {
            var index = flatLs.findIndex(item1 => item1.deptNo === item.parentDeptNo)
            if (index !== -1) {
              flatLs[index].children = flatLs[index].children || []
              flatLs[index].children.push(item)
            }
          }
        })
      }

      flat2tree(data)
      return tree;

    }


var list = [{"deptName":"运维一组","parentDeptNo":"129371","deptNo":"101921"},{"deptName":"运维二组","parentDeptNo":"129371","deptNo":"101931"},{"deptName":"运维","parentDeptNo":"06041","deptNo":"129371"}]

getData(list)



```


## 方法三 树形数据转key字段
树形数据的key值转换
```js

// treeData是否保留原来的数据
// maps是否保留原来的数据
// isOrigin是否保留原来的数据
[['label', 'name'],['value', 'id'],['key', 'id'], 'empNo]

formatTreeData({data, childrenName:'children', maps:[['label','deptName'], ['value','deptNo'], ['id','deptNo']]})
function formatTreeData({data, childrenName='children', maps, isOrigin}) {
  return data.map((item) => {
    let children = item[childrenName];
    if (children && children.length) {
      children = formatTreeData(children, maps, isOrigin);
    }
    const newItem = maps.reduce((acc, keys)=>{
      if(Array.isArray(keys)){
        acc[keys[0]] = item[keys[1]]
        return acc;
      }
      acc[keys] = item[keys]
      return acc
    }, {})
    if(isOrigin){
      return { ...rest, ...newItem, children };
    }
    return { ...newItem, children};
  });
}
```





