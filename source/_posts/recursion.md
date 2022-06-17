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


## 二元一次方程计算 Fibonacci 数列的初始值

```ts
// 1、1、2、3、5、8、13、21、34

type FibonacciLoop<
    PrevArr extends unknown[],
    CurrentArr extends unknown[],
    IndexArr extends unknown[] = [],
    Num extends number = 1
> = IndexArr['length'] extends Num
    ? CurrentArr['length']
    : FibonacciLoop<CurrentArr, [...PrevArr, ...CurrentArr], [...IndexArr, unknown], Num>

type Fibonacci<Num extends number> = FibonacciLoop<[1], [], [], Num>;
```

```js
function acc(pre, current, index = 0, num) {
  if (index === num) {
    return current;
  }
  if (index < num) {
    return acc(current, pre + current, index + 1, num);
  }
}
// 要求：
acc(preValue, preCurrent, 0, 1);
acc(preValue, preCurrent, 0, 2);
// 问preValue 、 preCurrent 的值为多少？

// //解：
// 根据上面的函数逻辑，得出两个公式(二元一次方程)：
// preValue + preCurrent = 1 ；
// preValue + 2*preCurrent = 1 ；

// //求得：
// 用第二个等式 减去 第一个等式 得：
// preValue + 2*preCurrent - preValue + preCurrent = 1-1
// 等式经过计算后得：
// preCurrent = 0 ；
// 由于 preCurrent 为 0 ，
// 由上面等式 得出
// preValue=1 ；

// 测试：
acc(1, 0, 0, 1); // 1
acc(1, 0, 0, 2); // 1
acc(1, 0, 0, 3); // 2
acc(1, 0, 0, 4); // 3
acc(1, 0, 0, 5); // 5

```

延申下，函数求出指定长度的 Fibonacci 数列：

```js
function acc(pre, current, arr=[], num) {
    if (arr.length === num) {
      return arr;
    }
    if (arr.length < num) {
      return acc(current, pre + current, [...arr, pre + current], num);
    }
  }

  acc(1, 0, [], 10);//[1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
```



