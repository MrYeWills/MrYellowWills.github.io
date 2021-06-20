---
title: html笔记
date: 2020/5/1
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
### input元素为什么用自闭合的写法
因为input不能再嵌套其他元素，所以用自闭合的写法，同样的元素有 img br hr meta link。
### HTML4 XML HTML5的关系
XML其实就是xhtml。
html4的写法是一种比较宽松的写法，容错性高，你怎么写，基本上浏览器都不报错，约束性不强；
社区为了对html约束性更强，因此产生了xhtml，xhtml的约束性很强，但是对开发者不友好；
由于xml约束性太强对开发者写法要求高，不友好，因此逐渐被社区抛弃，重新回到html4，并因此产生了新对标准 html5.

因此html4和html5一样，只是5的标签和js api更丰富。
xml则与html差别较大，约束强，现在逐渐没有被使用了。
### 值得使用元素
section article header footer
### 语义化意义
- 开发者容易理解
- 机器容易理解结构，如搜索和毒屏软件；
- 利于seo
### html和Dom的关系
Dom是由浏览器解析html解析而来的。
### form的作用
- 可直接进行GET POST 方式 提交表单
- 可使用submit ／ reset按钮 提交表单
- 第三方库可整体提取form值，如jq。
- 第三方库只能通过form进行表单验证，例如angular 只能验证form标签的表单。


## html element
由于标签非html5新标签，但其属性可能是html5新属性，因此标签不分开成html与html5讲。

### a
#### download属性
属于html5特性，除ie不兼容外，其他浏览器都可兼容。
配置download时，告诉浏览器，表明a不是一个导航url，而是一个下载按钮

#### href="#top" 与 href="#"
属于html5属性，返回页面顶部。

#### mailto :创建一个email链接
这是常见的创建按钮或链接，将用户的电子邮件程序打开，让他们发送新邮件。这是通过使用一个**mailto**链接完成的
```
<a href="mailto:nowhere@mozilla.org">Send email to nowhere</a>
```
#### tel :创建电话链接
这是通过使用一个**tel**链接完成的
提供电话链接有助于用户查看连接到手机的网络文档和笔记本电脑。
```
<a href="tel:+491570156">+49 157 0156</a>
```
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
### base
`<base> `元素 指定用于一个文档中包含的所有相对 URL 的根 URL。一份中只能有一个` <base> `元素。

### meta
`<meta> `元素表示那些不能由其它HTML**元**相关元素 (`<base>, <link>, <script>, <style> 或 <title>`) 之一表示的任何元数据信息.

### caption
根table一起使用，caption用来显示表格的标题

### del 与 ins
del标签表示一些被从文档中删除的文字内容
ins元素定义已经被插入文档中的文本(文字下划线效果)。
![](/image/html/del_ins.jpg)
```
del,
ins {
    display: block;
    text-decoration: none;
    position: relative;
}
del {
    background-color: #fbb;
}
ins {
    background-color: #d4fcbc;
}
del::before,
ins::before {
    position: absolute;
    left: .5rem;
    font-family: monospace;
}
del::before {
    content: '−';
}
ins::before {
    content: '+';
}
p {
    margin: 0 1.8rem 0;
    font-family: Georgia, serif;
    font-size: 1rem;
}


<p>“You're late!”</p>
<del>
    <p>“I apologize for the delay.”</p>
</del>
<ins cite="../howtobeawizard.html" datetime="2018-05">
    <p>“A wizard is never late …”</p>
</ins>
```



### fieldset 与 legend
元素通常用来对表单中的控制元素进行分组，二者需配合使用，可以放在form下面，也可以二者配合单独使用。
```
<form action="#">
  <fieldset>
    <legend>Simple fieldset</legend>
    <input type="radio" id="radio">
    <label for="radio">Spirit of radio</label>
  </fieldset>
</form>
```
![](/image/html/fieldset.jpg)

### hr
可以来做分割线，也可以做双层分割线。
![](/image/html/hr.jpg)
```
<p>
  This is the first paragraph of text.
</p>
<hr>
<p>
  This is the second paragraph of text.
</p>
```

### i
`<i>`用于表现因某些原因需要区分普通文本的一系列文本。例如技术术语、外文短语或是小说中人物的思想活动等，它的内容通常以斜体显示。
在html5 标准中，i 元素更多被用于表示icon。

### optgroup
与 select配合使用，可创建带分组的option选项，十分好用，optgroup有两个属性：label和disabled。
```
<select>
  <optgroup label="Group 1">
    <option>Option 1.1</option>
  </optgroup> 
  <optgroup label="Group 2">
    <option>Option 2.1</option>
    <option>Option 2.2</option>
  </optgroup>
  <optgroup label="Group 3" disabled>
    <option>Option 3.1</option>
    <option>Option 3.2</option>
    <option>Option 3.3</option>
  </optgroup>
</select>
```
### option
`<option> ` 用于定义在`<select>,  <optgroup> 或<datalist> `元素中包含的项.
属性有：
- disabled
- label
- selected
- value

### pre
可以将字符间的空格都能完整保留，非常不错
```
 <pre>rrrrr iiii     </pre>
```
### small
將使文本的字体变小一号

## html5 elemnt
### datalist :做可选值的输入框
**此element 除移动端的安卓不支持（ios是支持的），pc完美支持**
input配合datalist 以及 option使用，可做出原生的可选值输入框，非常棒。
```
<label for="ice-cream-choice">Choose a flavor:</label>
<input list="ice-cream-flavors" id="ice-cream-choice" name="ice-cream-choice" />
<datalist id="ice-cream-flavors">
    <option value="Chocolate">
    <option value="Coconut">
    <option value="Vanilla">
</datalist>
```
### details 与 summary :创建挂件
**除ie外，其他都支持**
二者需配合使用才可达到创建挂件toggle的效果
```
<details>
    <summary>Details</summary>
    Something small enough to escape casual notice.
</details>
```

### progress
**全部兼容。**
可用来显示进度条。与 下面的meter相比，前者是圆角形状，后者是无圆角的长方条，相比之下，progress更适合进度条。
```
<progress value="70" max="100">70 %</progress>
```
![](/image/html/progress.jpg)

### meter
**除ie外，其他都支持(包含edge)**
可用来显示进度条。
![](/image/html/meter.jpg)
```
<meter id="fuel" name="fuel"
       min="0" max="100"
       low="33" high="66" optimum="80"
       value="81">
    at 50/100
</meter>
```
### output
**除ie外，其他都支持(包含edge)**
output主要作用在于不用js，自动计算多个input的值，并显示。
output 必须配合form使用，以下代码要点：
定义output的name为result
在form中定义事件oninput，并定义result.value
```
<form oninput="result.value=parseInt(a.value)+parseInt(b.value)">
  <input type="range" name="b" value="50" /> +
  <input type="number" name="a" value="10" /> =
  <output name="result">60</output>
</form>
```
![](/image/html/meter.jpg)

### input range
**所有浏览器兼容，ie支持到10**
定义划块。
```
<input type="range" id="cowbell" name="cowbell" 
         min="0" max="100" value="90" step="10">
```

### s
**全部兼容。**
与`<del>`一样，都是表示删除的划线效果，只是表示单纯的删除时可用`<s>`，但是表示编辑（有删除和添加时）推荐用del和ins
```
<s>There will be a few tickets available at the box office tonight.</s>
```

### sub sup
**兼容所有浏览器**
分别代表上标和下标。
```
<p>Almost every developer's favorite molecule is
  C<sub>8</sub>H<sub>10</sub>N<sub>4</sub>O<sub>2</sub>UU<sup>2</sup>, also known as "caffeine."</p>
```
![](/image/html/sub.jpg)

## HTML属性
以下讲的都是全局属性：
### contenteditable
表示元素是否可被用户编辑。 如果可以，浏览器会修改元素的部件以允许编辑。
该属性是一个枚举属性，而非布尔属性。
这意味着必须显式设置其值为 true、false 或空字符串中的一个，并且不允许简写为 `<label contenteditable>Example Label</label>`正确的用法是 `<label contenteditable="true">Example Label</label>`。

### title
可用于tooltip。

### data-* 
是一类被称为自定义数据属性的属性，它赋予我们在所有 HTML 元素上嵌入自定义数据属性的能力，并可以通过脚本(一般指JavaScript：例如通过 HTMLElement.dataset获取属性值) 与 HTML 之间进行专有数据的交换。
#### HTMLElement.dataset
```
<img class="spaceship cruiserX3" src="shipX3.png"
  data-ship-id="324" data-weapons="laserI laserII" data-shields="72%"
  data-x="414354" data-y="85160" data-z="31940"
  onclick="spaceships[this.dataset.shipId].blasted()">
</img>
```
#### css 伪元素 content：data（）
```
attr(data-abc);
```
### dir
是一个指示元素中文本方向的枚举属性

### lang
这个语言是不可编辑元素写入的语言，或者可编辑元素应该写入的语言。
设置lang语言时，在文字开始位置会有一个对应语言的国旗logo

## HTML5属性
### tabindex
tabindex 是html5属性 ，非常好用， 指示其元素是否可以聚焦,
在html4中，不是每个标签都拥有focus属性，在html5中，通过tabindex，每个标签都可以定义focus属性。
比如input text，可直接在input元素定义onfocus，在任意的div中，要想使用onfocus等，定义tabindex就可使用。
```
<div tabindex="0">Tabbable due to tabindex.</div>
```
### draggable
是一个枚举类型的属性，用于标识元素是否允许使用 拖放操作API 拖动。

## HTML5 API
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

## GlobalEventHandlers
这里的浏览器主要指：ie edge 谷歌 火狐，注意 ie 和edge是分开讨论。下面说到所有浏览器时，指的就是这里的四个浏览器。
### 右击 oncontextmenu
ie不支持外，不过edge支持，且其他浏览器都支持
```
//在下面div右击时，就会执行console.log
 <div onclick="dd()" oncontextmenu="console.log(123)" class="aa left">111</div>
```
### 双击 ondblclick
ie不支持外，其他都支持。

### 错误 onerror
ie edge 支持存疑，其他支持
可以收集节点元素的错误信息（几乎所有类型错误都能收集），通常用于window.onerror()，来收集错误报告，比较有用：
```
window.onerror = function (msg, url, lineNo, columnNo, error) {
    var string = msg.toLowerCase();
    var substring = "script error";
    if (string.indexOf(substring) > -1){
   ...
};
```

```
window.onerror = function(message, source, lineno, colno, error) { ... }
函数参数：
message：错误信息（字符串）。可用于HTML onerror=""处理程序中的event。
source：发生错误的脚本URL（字符串）
lineno：发生错误的行号（数字）
colno：发生错误的列号（数字）

```

### 按键down onkeydown
除ie存疑外，其他都支持。
可以捕获按键
```
const input = document.querySelector('input');
input.onkeydown = logKey;
function logKey(e) {
  console.log(e);
}
```
### 按键up onkeyup
除ie存疑外，其他都支持。
可以捕获按键 用法同上面的 onkeydown

### onload
所有浏览器全部支持
用于处理Window, XMLHttpRequest, <img> 等元素的加载事件，当资源已加载时被触发。
注意，不仅可用于dom的onload，还可以用于ajax，img的加载。
```
window.onload = function() {
  init();
  doSomethingElse();
};

<element onload="myScript">

object.onload = function(){myScript};

object.addEventListener("load", myScript);

<img src="w3javascript.gif" onload="loadImage()" width="100" height="132">

var img = new Image();
img.onload = function () {
   alert("image is loaded");
}
img.src = "img.jpg";
```
在文档装载完成后会触发  load 事件。此时，在文档中的所有对象都在DOM中，所有图片，脚本，链接以及子框都完成了装载。 
同时也会有 Gecko-指定 DOM事件，如 DOMContentLoaded 和 DOMFrameContentLoaded (它们可以使用 EventTarget.addEventListener() 来处理 ) ， 这些事件在页面DOM构建起来后就会触发，而不会等到其他的资源都装载完成。 

### onloadstart
浏览器全部兼容，不过谷歌中的img标签不支持unloadstart事件。
```
<img src="myImage.jpg">
image.addEventListener('load', function(e) {
  console.log('Image loaded');
});
image.addEventListener('loadstart', function(e) {
  console.log('Image load started');
});
image.addEventListener('loadend', function(e) {
  console.log('Image load finished');
});
```
### 鼠标事件 onmousedown onmouseenter onmouseleave onmousemove onmouseout onmouseover onmouseup
#### 介绍
浏览器全兼容。
鼠标 按下、松开、划过、划出、划动、离开等等，各种鼠标动作，应有尽有。
能做出的效果：
如模拟 hover，但做出比hover更高级效果；
[图片按住显示（onmousedown onmousemove onmouseup 示例）](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onmousedown)
图片鼠标选中后，放大显示；
[跟随鼠标，实时显示](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onmousemove)

#### onmouseleave 与  onmouseout 区别
onmouseleave 事件类似于 onmouseout 事件。 唯一的区别是 onmouseleave 事件不支持冒泡 ，更多说明参考[菜鸟教程](https://www.runoob.com/jsref/event-onmouseleave.html)

#### onmouseenter  与 onmouseove 区别
二者区别同 《onmouseleave 与  onmouseout 区别》，请参考[菜鸟教程](https://www.runoob.com/jsref/event-onmouseleave.html)。

更多示例 [跟随鼠标，实时显示](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onmousemove)
示例中的方案应该可以实现淘宝页面中的 图片鼠标划动，放大显示；

#### 区别使用onmouseleave与onmouseout很重要
二者表达意思虽一样，但leave只触发一次，out会触发多次，因此一定要区别使用，避免代码多余执行。
onmouseenter  与 onmouseove同理。
详见 [菜鸟教程](https://www.runoob.com/jsref/event-onmouseleave.html)中的例子。
### onscroll
ie存疑外，其他都支持
```
const textarea = document.querySelector('textarea');
const log = document.getElementById('log');
textarea.onscroll = logScroll;
function logScroll(e) {
  log.textContent = `Scroll position: ${e.target.scrollTop}`;
}
```
### onselect
ie存疑外，其他都支持
只有在文本框和文本域内选择文本才会触发select事件.
非常好用的事件，[demo](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onselect)；
在输入框内选中一段文字，会将这段文字捕获作为参数。

### 表单事件 onreset onsubmit
表单重置、表单提交。

### onwheel
所有浏览器全部支持；
onwheel 特性指向当前元素的滑轮滑动事件函数 EventHandler。
当双指划动时，会触发onwheel：
[双指缩放显示 demo](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onwheel)

### 拖拽事件 ondrag ondragend ondrop ondragstart ondragover ondragleave ondragexit
所有浏览器都支持
#### 介绍
参考[拖放 API](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API)
```
drag	ondrag	当拖动元素或选中的文本时触发。
dragend	ondragend	当拖拽操作结束时触发 (比如松开鼠标按键或敲“Esc”键). (见结束拖拽)
dragenter	ondragenter	当拖动元素或选中的文本到一个可释放目标时触发（见 指定释放目标）。
dragexit	ondragexit	当元素变得不再是拖动操作的选中目标时触发。
dragleave	ondragleave	当拖动元素或选中的文本离开一个可释放目标时触发。
dragover	ondragover	当元素或选中的文本被拖到一个可释放目标上时触发（每100毫秒触发一次）。
dragstart	ondragstart	当用户开始拖动一个元素或选中的文本时触发（见开始拖动操作）。
drop	ondrop	当元素或选中的文本在可释放目标上被释放时触发（见执行释放）。
```

[直接看mdn demo,对应api都有demo](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/ondrag)
#### drap与mouse
drap相关事件与上面的mouse事件相似；
只不过，mouse事件是将鼠标光标移动到element区域触发；drap是将拖拽的element移动到element区域触发；
将拖拽的element看成是光标，那么drap与mouse理解起来就差不多一样了。
#### drap 与 event.dataTransfer.setData
非常好的数据传输方法，drap事件的event对象都有dataTransfer API。
```
function dragstart_handler(ev) {
 console.log("dragStart");
 ev.dataTransfer.setData("text", ev.target.id);
}

function drop_handler(ev) {
 console.log("Drop");
 ev.currentTarget.style.background = "lightyellow";

 ev.preventDefault();
 var data = ev.dataTransfer.getData("text");
 ev.target.appendChild(document.getElementById(data));
}

```
[直接看mdn demo,对应api都有demo](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/ondrag)

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