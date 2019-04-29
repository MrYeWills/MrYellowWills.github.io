---
title: html笔记
date: {{ date }}
tags: [html5, html]
categories: 
- html
series: html
---

## html知识
### html语义化
#### 概念
js有语义化，html也有语义化，
HTML的语义化强调不要都使用div，建议使用header\footer\nav\section\input num\input email.....
#### 意义
##### 利于阅读；
##### 利于seo
##### 响应不同移动端弹框键盘
移动设备会根据不同的input 如何number、email、text、password；弹出不同的键盘，这是很多移动开发使用input语义化编写的重要原因。

## 标签
### input与form
#### name 与 form 结合
name配合submit，再结合form的action使用。
点击下面的submit后，浏览器跳转url到 /submit.action?firstname=Mickey&lastname=Mouse
```
   <form action="/submit.action">
        <input type="text" name="firstname" value="Mickey">
        <input type="text" name="lastname" value="Mouse">
        <input type="submit" value="Submit">
    </form>
```

## HTML5属性
### tabindex
tabindex 是html5属性 ，非常好用， 指示其元素是否可以聚焦,
在html4中，不是每个标签都拥有focus属性，在html5中，通过tabindex，每个标签都可以定义focus属性。
比如input text，可直接在input元素定义onfocus，在任意的div中，要想使用onfocus等，定义tabindex就可使用。
```
<div tabindex="0">Tabbable due to tabindex.</div>
```
### FormData 与 FileReader
FormData 将数据表单序列化以便得到可以作为请求的参数;
FileReader 读取文件，比如实现图片预览；
详细参考《文件上传-file和drap拖拽两种方式》

### blob
blob想象起来复制，其实也简单，目前对于blob无非就是文件下载或者是图片展示两种运用。
[参考demo](https://github.com/YeWills/koa-demo/tree/response-file)

#### blob 与 FileReader
FileReader是能够操作blob的两种方式之一
#### blob 与 window.URL.createObjectURL
window.URL是能够操作blob的两种方式之一


## 应用demo
### 文件上传-file和drap拖拽两种方式
[详细参考demo](https://github.com/YeWills/file-upload)
#### type=text input 获取file的三种方式：
```
//dom元素直接获取
 document.getElementById("chooseFile").files[0];
```
```
//change事件
  var file = document.querySelector('#file');
  file.addEventListener('change', previewImage, false);
  function previewImage(event) {
      event.target.files[0]
    }
```
```
//formData 方式
<form enctype="multipart/form-data" method="post" name="fileinfo">
  <input type="file" name="fileName" required />
</form>
var form = document.forms.namedItem("fileinfo");
var oData = new FormData(form);
var file = oData.get('fileName')
```

#### drag 获取file方式：
参考：drap_file\dragInfo.html
```
evt.dataTransfer.files
```
#### 上传过程：
选择文件、预览、上传到服务器、服务器上传进度、服务器上传成功
#### FormData与文件上传
文件上传必须要使用FormData对文件流进行表单序列化，这样才可以被服务器端解析。
下面是三种服务器端上传图片的示例，每种示例都使用了formData进行文件流表格序列化：
```
 var formData = new FormData();
 formData.append('test-upload', file.files[0]);
 xhr.upload.onprogress = setProgress;
```
```
let file = document.getElementById("chooseFile").files[0];
let formData = new FormData();
formData.append("avatar", file);
$.ajax({
    type: 'POST',
    url: '/profile',
    data: formData,
    async: false,
    cache: false,
    contentType: false,
    processData: false,
    success: function (data) {
        $(".newImg").attr("src", data.filePath);
    },
    error: function (err) {
        console.log(err.message);
    }
})
```
```
 <form method='post' action='/profile' enctype='multipart/form-data'>
    选择图片：<input name="avatar" id='upfile' type='file'/>
    <input type='submit' value='提交'/>
 </form>
```
#### multer与文件上传
express，收到前台的上传请求后，因为上传文件的请求时一个多类型文件数据(multipart/form-data)请求，
必须通过require('multer')才能正常处理这样的请求。
multer就是为了 处理多文件接口而生。
#### 上传技术说明
FileReader 实现图片预览
通过FormData将file表格序列化，这样才能被post框架接收为参数，传给后台，并被后台识别；
上传的进度条和成功处理通过post框架的相关事件做：
以原生为例：
```
xhr.onload = uploadSuccess; //成功处理
xhr.upload.onprogress = setProgress;  //进度处理
```
后台express，收到前台的上传请求后，通过中间件multer处理后，通过fs读取数据，并将上传的文件存到指定文件夹(/uploads)，整个上传过程结束。
#### 其他技术点
```
dragenter
dragover
dragleave
drop
```