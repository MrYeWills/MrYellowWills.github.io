---
title: 前端工程笔记
date: 2020/09/04
tags: [前端工程]
categories:
- 前端工程
---

## parcel
[官网 react配置](https://zh.parceljs.org/recipes.html)
[官网 博客 react详细配置](https://blog.jakoblind.no/react-parcel/)
[parcel react demo](https://github.com/YeWills/learns/tree/master/parcel)


## 几种mock数据的工具

### GitHub 
https://api.github.com/search/users?q=输入你要搜索的关键字， 此接口可以返回 数组list：
```
https://api.github.com/search/users?q=vue
```
不过GitHub只能做get请求。

配合fetch使用

```js
   return fetch(`https://api.github.com/search/users?q=${query}`)
      .then(res => res.json())
      .then(({ items }) => {
        console.log(items)
        return items.slice(0, 10).map((item: any) => ({ value: item.login, ...item}))
      })
```

### jsonplaceholder
https://jsonplaceholder.typicode.com/ 这个可以做很多不同类型请求，如post 等等，你要的请求，基本它都用，确定是支持大文件上传不友好。

```
<!-- 如访问以下，就可以返回json -->
https://jsonplaceholder.typicode.com/posts/1
```
### mocky
可以在[官网](https://designer.mocky.io/)，设置好 请求类型，返回数据生成 一个 mocky。

而且这个还有一个好处，可以上传大文件。

```js
 axios.post("https://www.mocky.io/v2/5cc8019d300000980a055e76", formData, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data'
      },
      withCredentials,
      onUploadProgress: (e) => {
        let percentage = Math.round((e.loaded * 100) / e.total) || 0;
        if (percentage < 100) {
          updateFileList(_file, { percent: percentage, status: 'uploading'})
          if (onProgress) {
            onProgress(percentage, file)
          }
        }
      }
    }).then(resp => {
     onSuccess(resp.data, file)
    }).catch(err => {
      updateFileList(_file, { status: 'error', error: err})
    })
```
