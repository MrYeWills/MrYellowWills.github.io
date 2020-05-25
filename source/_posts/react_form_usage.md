---
title: EnForm动态表单的使用
date: {{ date }}
tags: [form, react]
categories: 
- react
---

## 前言
这些年做react，深受form使用麻烦的苦，最后发现动态配置化表单是form使用的正确姿势，高效，易读，易维护。
结合自己的工作经验，花了一个多星期手写了一版 form的二次封装。
二次封装最难的是方案设计和实现，样式是最简单的了，每个公司样式需求各不同，本次封装就不涉及样式了，只专注功能实现。
核心源码行数不多，如果有兴趣，直接去github上，下载源码看看，下面有连接。

## 默认用法
这种用法使用enform提供的默认样式。
默认从上到下排列。默认表单超过8个field会进行分栏；你也可以自定设置每列显示的field数目。
在config.js中设置好：
```js
  <EnForm
      title="动态表单"
      config={formConfig}
      onSubmit={onSubmit}
    />
```
```js
//config.js
import CustomInput from './component/CustomInput';
const formConfig = {
  fields: [
    {
      name: 'editname',
      defaultValue: 'test',
      title: 'edit user name',
      //支持自定义field
      Render: CustomInput,
      //支持自定义验证规则
      validate: [
        [(value, formValue) => {
          if (String(value).length > String(formValue.region).length) {
            return 'hellow region';
          }
          return '';
          //支持自定义验证规则映射功能
        }, ['region']]
      ],
      //支持自定义验证规则error信息
      required: 'this is required'
    },
    { name: 'region',
      title: 'region',
      type: 'input',
      defaultValue: '',
      required: true
    }
  ],
};

export default formConfig;
```
[点击查看详细demo](https://github.com/YeWills/react-redux-hooks-demo/tree/form-demo)

## 自由排列
如果你既想配置化生成表单，又想自由排列field的位置，又想在form表单中插入任意内容，也是非常方便的，
这也是Enform的亮点了,
`EnForm.EnField`中定义的name 要与 config.js中的name一致从而保持一种映射关系。
同时定义`layoutMode="custom"`。

```js
  <EnForm
      title="登录"
      config={formConfig}
      onSubmit={onSubmit}
      layoutMode="custom"
    >
      <div >
        <div>
          <div>
            随意排列,任意写入内容
          </div>
          <div>
          <EnForm.EnField className="form-cell" name="editname" />
          </div>
        </div>
      </div>
      <p>hellow world</p>
      <EnForm.EnField className="form-cell" name="useName" />
      <div className="region">
        <div>任意位置</div>
        <EnForm.EnField className="form-cell" name="region" />
        <div>自由放置</div>
        <EnForm.EnField className="form-cell" name="passWord" />
      </div>
      <EnForm.EnField className="form-cell" name="select" />
    </EnForm>
```
```js
//config.js
//与上面《默认用法》的config.js一样
```

[点击查看详细demo](https://github.com/YeWills/react-redux-hooks-demo/tree/context-form)


## 延伸

[设计方案博客 - EnForm动态表单封装 ](https://yewills.github.io/2020/05/25/react_form_design/)
[源码/demo github ](https://github.com/YeWills/react-redux-hooks-demo/tree/context-form)




