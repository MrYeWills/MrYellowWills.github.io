---
title: next form 封装
date: {{ date }}
tags: [form, react]
categories: 
- react
---


## form拥有的能力

### redux状态 
#### 内部实现 (formStore formDispatch)
formStore是给form封装的，主要用于form内的自定义组件。
form Store 用于较为复杂的form，根据需求是否选用，与form做了分离封装：
```js
//使用
 contextHoc(FormContext, initFormStoreState)(AddCoupon)

//contextHoc
import React from "react";
import Wrap from "./Wrap";
const contextHoc = (FormContext, initialState) => {
  return Comp => {
    return props => {
      return (
        <Wrap FormContext={FormContext} initialState={initialState} {...props}>
          <Comp />
        </Wrap>
      );
    };
  };
};

export default contextHoc;

```
```js
//Wrap
import React, { useReducer } from "react";
function reducer(state, action) {
  console.log(state, action);
  switch (action.type) {
    case "setErrors": {
      const { erros } = state;
      const { preload } = action;
      const updates = preload.reduce((acc, { name, value }) => {
        acc[name] = value;
        return acc;
      }, {});
      return { ...state, errors: { ...erros, ...updates } };
    }
    case "resetErrors":
      return { ...state, errors: {} };
    case "setValues": {
      const { values } = state;
      const { preload } = action;
      const updates = preload.reduce((acc, { name, value }) => {
        acc[name] = value;
        return acc;
      }, {});
      //_isValueChange 用于标识form的store values是否重新被赋值，可用场景有表单编辑的保存按钮，若无变化则禁用
      return { ...state, values: { ...values, _isValueChange: true, ...updates} };
    }
    case "resetValues":
      return { ...state, values: {} };
    case "reset":
      return { ...state, errors: {}, values: {} };
    default:
      throw new Error();
  }
}

function init(initialState) {
  return { values: { ...initialState }, errors: {} };
}

const Wrap = ({ children, FormContext, initialState = {}, ...rest }) => {
  const [formStore, fDispatch] = useReducer(reducer, initialState, init);

  return (
    <FormContext.Provider value={fDispatch}>
      {React.cloneElement(children, {
        ...children.props,
        ...rest,
        formStore,
        action: fDispatch
      })}
    </FormContext.Provider>
  );
};

export default Wrap;
```

#### 发起action的两种方式
在form内，将以上能力注入到每个自定义组件内，如果你不嫌麻烦，你同样可通过context直接获取atcion。
因为form store 就是利用context+reducer实现的一个小型redux。

#### 父组件将获取form store能力
将包含Enform的组件，使用contextHoc(FormContext, initFormStoreState)(AddCoupon)后，AddCoupon将拥有form store的所有能力。

#### 父组件或子组件
form组件内发起action赋值：
```js
 formDispatch({
              type: "setValues",
              preload: [//使用数组
                {
                  name: "orgList",
                  value: storeIdsVal
                },
                {
                  name: "_isValueChange",
                  value: false
                }
              ]
            });
```
#### 其他细节处理
- setValues 使用数组写法，满足一次性需要赋值多个状态的需求
- reset 重置值的能力
- _isValueChange 判断store是否重新赋值能力
- setErrors 作为验证备用的状态，暂时还没遇到需求，大多验证需求可通过 next form 自带的valitor消化
- 以装饰器写法，分离独立能力，可自行选择是否使用form store

### state状态
#### 内部实现 (formValues与Field)
formValues是form自带的value，结合Field使用，非常方便：
```js
//Enform内
this.field = new Field(this, { values: defaultValue });
```
#### 特殊情况下外部使用
一般不建议使用class的ref，特殊情况下，比如引用Enform的外层父组件无法重新设置form值，办法是ref。

### event事件
#### 内部实现(formAcion,与父组件通信桥梁)
```js
//form 的父组件内
  const formAction = type => {
    if (type === "openAddShopDialog") {
      setShop(true);
    }
  };

  <EnForm
    formAction={formAction}
  />

  // form 内的子组件内：
  formAction("openAddShopDialog");

```

### 公共数据
将一些公共的数据以下斜杠的方式注入form values 或 store中，比如`{__common__：row}`以便让整个form公用。

### 判断form value 是否改变
_isValueChange 用于标识form的store values是否重新被赋值，可用场景有表单编辑的保存按钮，若无变化则禁用。
form store 的 value 赋值都在 setValues中：
```js
    case "setValues": {
      const { values } = state;
      const { preload } = action;
      const updates = preload.reduce((acc, { name, value }) => {
        acc[name] = value;
        return acc;
      }, {});
      //_isValueChange 用于标识form的store values是否重新被赋值，可用场景有表单编辑的保存按钮，若无变化则禁用
      return { ...state, values: { ...values, _isValueChange: true, ...updates} };
    }
```

#### 以此类推
写一些大组件或复杂组件的时候，比如Table，可以考虑优先使用class实现，因为class可以对外暴露ref。

## form源码实现
### 两种表单
主要实现 一般表单 与 label列表查询表单。
#### label列表查询表单
单行无label列表查询表单 比如 添加材料 列表查询。
与普通表单不一样的是，单行无label列表查询表单 label为空，样式也有一些差异处理，查询按钮可能内嵌于表单内。
因为适用场景不多，对 单行无label列表查询表单 封装不多，只设计了单行的场景，根据需求可以扩展。

### render props模式
#### 概述
config是Enform的props，render是config内每个field的配置，
render是一种render props模式，
写Enform的时候，有些地方采用了render props模式，
主要是next FormItem 能将其一级child组件集成到form体系内，被form统一封装，拥有value能力。

```js
//FormItem
<FormItem
  required={required}
  labelAlign="left"
  labelCol={{ span: this.getLableColSpan(labelCol) }}
  wrapperCol={{ span: this.getWrapperColSpan(wrapperCol, type) }}
  label={this.getLabel(fieldInfo)}
  className={`${styles.item} ${className}`}
>
  {this.generateField(fieldInfo)}
</FormItem>


//generateField
generateField = fieldInfo => {
  if (render) {
     //render props模式
    return render(fieldInfo, this.field);
  }
  if (CustomField) {
    //组件模式
    return <CustomField field={this.field} />;
  }

//config
    {
      label: "使用门槛",
      name: "conditionType",
      required: true,
      render: Threshold
    },

//Threshold
const Threshold = ({ name, extraProps }, formField) => {
  return (
    <Radio.Group itemDirection="ver" name={name} {...extraProps}>
      <Radio value={none}>无门槛</Radio>
      <Radio value={limit}>
        满&nbsp;&nbsp;
        <FormItem label="">
          <EnNumPicker
            name={conditionValueKey}
            min={1}
            max={9999}
            hasTrigger={false}
            editable={!isDisabled}
            disabled={isDisabled}
          />
        </FormItem>
        <span>&nbsp;&nbsp;可用</span>
      </Radio>
    </Radio.Group>
  );
};
```


### next form使用的技巧
#### form能集成任意组件
自定义组件，只要定义好name，就拥有form内其他如input组件的能力
其实自定义组件有歧义，
在next form 看来，自定义组件与其他如Input组件是一样的并没有不同，只是定义好name，然后组件内对value，onchange进行劫持即可。
#### validator的触发时机
validator默认的触发时机是onchange与submit。
当你在自定义组件，自定义了validator，想在自定义组件内触发validator，
在自定义组件内，执行onChange。
因为validator默认的触发时机是onchange与submit。

### 组件模式
由上面next form使用的技巧可知，任何组件都可以集成到form体系内，拥有统一的form value等

### render props/组件 模式
#### render props使用场景
```jsx
const ValidTerm = ({ name, extraProps }, formField) => {
  const radioValue = String(formField.getValue(name));
  return (
    <Radio.Group
      itemDirection="ver"
      name={name}
      className={styles.validTime}
      {...extraProps}
    >
      <Radio value={absoluteTime}>
        <FormItem label="">
          <DatePicker.RangePicker
            disabled={extraProps?.disabled || isEqual(radioValue, relativeTime)}
            name={dateName}
            onClick={e => {
              //datapicker与radio点击事件冲突，导致时间面板闪现。
              e.preventDefault();
              e.stopPropagation();
            }}
            disabledDate={disabledDate}
          />
        </FormItem>
      </Radio>
      <Radio value={relativeTime}>
        领取后&nbsp;&nbsp;
        <FormItem label="">
          <EnNumPicker
            name={relativeDays}
            min={1}
            max={9999}
            hasTrigger={false}
            disabled={extraProps?.disabled || isEqual(radioValue, absoluteTime)}
          />
        </FormItem>
        <span className={styles.text}>
          &nbsp;&nbsp;天过期
          <div className={styles.tip}>
            (从领取当天算起，超过使用天数后自动失效)
          </div>
        </span>
      </Radio>
    </Radio.Group>
  );
};
```

#### 组件模式使用场景
对一些常用组件，如select，进行了项目业务逻辑的二次封装
```jsx
 case "select": {
      return (
        <EnSelect
          style={style}
          {...fieldInfo}
          formAction={formAction}
          formType={formType}
        />
      );
    }
```
不太推荐，一些业务才有的自定义组件，在config中直接写，如果要这样做，就采取下面的方式：render props内定义自定义组件

#### render props内定义自定义组件
使用render props模式，在render props内return一个自定义组件，这种方式非常灵活：
```js
const getProject = ({ name }, formField, { store, action }) => {
  //name={name} 注入name，就完成了将自定义组件ValidaTerm集成到form
  return <ValidTerm store={store} action={action} name={name} />;
};

```

### 单列和多列布局
单列表单一般为新增表单。
另外一些就是多列表单。
默认根据field的数量，需要展示的列数量，form自动计算一个ColSpan
达到自动分列。
对应优先级如下：
```js
  getColSpan = col => {
    const { columns = 1, colSpan, type } = this.props.config;
    if (col?.span) return col?.span;
    if (colSpan) return colSpan;
    if (type === "singleColumns") return 24;
    return 24 / columns;
  };
```

### 注入能力
每一个config field 注入 store, action, formAction,this.field 能力。

### 切换 详情表单
#### 要切换成详情表单，比较简单：
```js
<EnForm
  formType={"detailForm"}
/>
```
#### form内，统一写了一个详情field：
```js
  if (formType === "detailForm" && isUseDetail(fieldInfo)) {
    return (
      <DetailField
        name={name}
        fieldInfo={fieldInfo}
        formStoreField={formStoreField}
        formAction={formAction}
      />
    );
  }
```
form内的二次封装组件比如EnSelect，也封装了其详情模式：
```js
class EnSelect extends React.Component {
 ...
  render() {
    ....
    if (formType === "detailForm") {
      const opt = options.find(item => isEqual(item.value, rest.value));
      return <div style={{ lineHeight: "32px" }}>{opt?.label || ""}</div>;
    }

    return (
      <Select
        ...
      >
       ...
      </Select>
    );
  }
}
```
#### 对于业务自定义组件，则自行写好详情态渲染模式。
如题。

### form设计为class组件重要
#### 关于form组件本身
- 兼容next
- 兼容Field
- 暴露ref给父亲组件，以便外层获取Enform的instance
#### 关于其他大组件设计注意
以Form组件封装经验来看，其他大组件，如Table组件封装，也推荐使用class，而不是hooks，以便外层获取Enform的instance，
以便在特殊情况，对外暴露Instance。
注意上面说的是大组件，对于小组件，我还是推荐使用hooks。


## config配置

### 自定义validator建议使用deepcustom
因为自定义validator要写在Form.Item上，因此推荐deepcustom。

### extraProps
```js
{
      label: "每人限领",
      name: "takeQuota",
      type: "numberPicker",
      placeholder: "请输入限领数量",
      required: true,
      extraProps: {
        innerAfter: "张",
        min: 1,
        max: 9999,
        hasTrigger: false
      }
    },
```

还有很多其他属性，根据不同的组件，能够定义的属性不一样：
 - wrapperCol: { span: 16 } 这是通用的
 - col: { className: "valid-term" }这是通用的
 -  checkbox 的 getOpts
 ```js
 {
      label: "发布渠道",
      name: "showScene",
      required: true,
      type: "checkbox",
      getOpts: () => {
      }
    },
 ```
 - select 的 post
 ```
 {
      label: "渠道",
      name: "channelCodeList",
      type: "select",
      post: getIssueChannel,
      extraProps: {
        mode: "multiple"
      }
    }
 ```
## 一些思路或待实现
### 显示和隐藏，
#### 简单的显示隐藏
可以定义在config内，通过一个函数，获取form的所有能力，判断显示隐藏或者hidden show；
#### 复杂的显示隐藏
这个考虑下通过config的函数，还是config与jsx(render props)混用
可考虑借鉴 table 的column形式，在render中写cell；
### config与jsx(render props)并行
考虑如何设计，让config配置与手写form item 并行，可借鉴table的cell模式。

## 理念
### 不执念封装
封装带来简便的同时，也带来了定制化弱，灵活度低的特点。
封装一时爽，后期业务叠加需求时，支持度差时，非常麻烦。
所有推荐简单的表单使用封装。
我希望在项目开发时，封装form与next原生from并行使用。
### 封装form与next原生from并行使用
参考上面
### 推荐简单的表单使用封装
参考上面
### 满足百分之七十五的需求
理论上封装的form能够满足百分之百的需求，因为封装的写法与原生的写法，没有根本差别，只是换一种形式。
但满足权衡成本与收益，覆盖率越大，反而还不好。
### 谁掌握了数据，就掌握了所有能力
react的世界，是数据的世界，谁掌握了数据，就掌握了所有能力

## 踩坑
### 集成form时，使用class而不是hooks
from.Item组件在next源码中，引用了子组件的ref，因此最好定义class组件，用hooks组件，将报warning，虽然不影响使用。
不过从另一个角度来看，ref一般用于一些next已知组件的特殊操作，因此自定义组件，使用hooks或class关系不大，至少不会影响使用，只是会报一个丑的warning。
如果实在想写成一个hooks，可用class组件再包一层，转发下。**不要使用Forward.Ref，它与Form.Item无法兼容，和集成。**











