---
title: 表单开发的自我修养
date: 2022/1/14
tags: 表单开发
categories: 
- 前端
---


## 由一个问题想到的

在表单开发中，状态设计非常重要，状态设计的好，后期可扩展性 可维护性非常之妙。
状态设计是否得当，对后期维护的成本将产生极大影响。
经常看到一些页面，因为状态设计失败，导致后期出现 多源控制一个组件，或者一个状态使用多个雷同意义的变量。

### 多源控制一个组件
一个组件既通过内部state控制，又通过外部props控制，如果这二者设计非常好，(比如使用defaultProps+state方式，这种严格来说还是单一state形式)，组件倒是用起来稍显麻烦而已；
如果 state 和props设计不好，用了大量的 if else ，组件会出现很多bug，通过大量的补丁修复一个问题，导致组件难以维护，不得不重构；


### 一个状态使用多个雷同意义的变量表示

#### 组件使用state控制值
比如一个组件A，使用state来控制这个组件的值，
```js
 <el-select
    v-model="formVals.selectA"
    filterable
    remote
    placeholder="请输入"
    class="w400"
  >
    <el-option
      v-for="item in datalist"
    >
    ....
    </el-option>
  </el-select>
```

#### 外部需要使用组件A值
此时一个外部组件B【组件B处于组件A的父组件平级】，需要使用该组件A的状态，于是，通过onChange将值反射出去，
```js
<el-select
    v-model="formVals.selectA"
    filterable
    remote
    placeholder="请输入"
    @change="handleSelect"
    class="w400"
  >
    <el-option
      v-for="item in datalist"
    >
    ....
    </el-option>
  </el-select>

     handleSelect(item) {
      // 反射给外部组件 设置 this.aValue 值；
      this.$emit('update-valueA', item)
    },
```
这里又出来一个问题，编辑详情的时候，不会触发onChange，于是在详情接口得写这样写：
```js
//在组件A的父级的父级组件【外部B组件与组件A组件父组件共同所在的组件中】，已知详情接口就在此组件触发

//此值给到A组件父亲组件，用于设置A组件的值；
this.formVals = {selectA: res.selectval};
//用于初始化 需要反射出来的 a组件的值，就是上面的 this.$emit('update-valueA', item)
this.aValue = res.selectval;
```
显然 this.formVals 与 this.aValue 都能代表 组件A的值，完全不需要用两个，而因为使用了两个，后期维护这个组件时要分析两遍状态，
既要分析 formVals.selectA 又要分析 this.aValue，后期维护成本 `x2` 。
但由于错误的状态设置，导致不得不这样做。

#### 又来一个紧急需求
又有一个人在后期维护这个页面时，接到一个紧急的需求，要给一个外部组件C做联动，此联动需要同时用到组件A的状态，又要同时用到其他几个组件的状态。
虽然时间紧迫，但开发人员觉得能否使用以前反射出来的 this.aValue 作为 A组件的值。
可惜的是，this.aValue 这个变量写的有点混乱，要验证 this.aValue 是否时刻与 组件A的值同步，或者this.aValue 就是组件A的所见即所得的值，
需要时间验证一下，
又不巧的是，老板在群里发话，该需求十万火急，客户使用现有页面已经造成了资产损失。
开发人员这下一激灵，还有啥说的，用最快的速度给我上需求，于是他也没时间去验证 this.aValue 是否能代表 A组件的值了，
又考虑到 外部组件C 联动时要同时用到多个其他组件状态，
按照所见即所得的标准，快速创建了一个对象(包含组件A等状态的变量)：
```js
<el-select
    v-model="formVals.selectA"
    filterable
    remote
    placeholder="请输入"
    @change="handleSelect"
    class="w400"
  >
    <el-option
      v-for="item in datalist"
    >
    ....
    </el-option>
  </el-select>

     handleSelect(item) {
      this.$emit('update-valueA', item)
      this.$emit('update-compound-value', {
        aValue: item,
        dValue: this.formVals.inputD,
        eValue: this.formVals.inputE,
      })
    },
```
然后在编辑详情的时候，在详情接口初始化值：
```js
this.formVals = {selectA: res.selectval};
this.aValue = res.selectval;

//初始化集成了组件A等等多个组件值的变量
this.compoundValue = {
        aValue: res.selectval,
        dValue: res.selectval.inputD,
        eValue: res.selectval.inputE,
      };
```
后期维护这个组件时需要同时分析 `this.formVals` `formVals.selectA` `this.compoundValue.aValue` 三个变量，后期维护成本 `x3` 

这就是 一个状态使用多个雷同意义的变量表示，组件A的状态，使用了多个雷同意义的变量 `this.formVals` `formVals.selectA` `this.compoundValue.aValue` 表示。

### 维护成本并非简单的递增
可惜的是，多一个变量分析，往往不是对维护成本的递增，不是多增加一个变量，维护成本增加一倍 这样的递增，更多的是指数增长，
例如，要分析两个变量时，维护成本是 2*2=4倍；
要分析三个变量时，维护成本是 2*2*2=8倍；
因为当只有一个变量时，分析问题，可能都用不上验证，盲改就行，很快就将问题解决；
当出现两个变量时，为了充分考虑两个变量的用途，你得熟悉下业务，将项目启动起来，然后多种情况测试，并且断点调试，然后申请测试过来测下；
当出现三个变量时，除了上述工作的递增，为了保证代码的正确性，需要测试更多情况进行测试；

这里的指数增长是夸张了点，但肯定的是，组件(状态)设计不合理，后期需求开发成本(维护成本)绝对不是简单的递增。

### 二者关系
`多源控制一个组件`表现的是，对组件的value控制，有多个形式，多个渠道，比如常见的 state与props结合；
`一个状态使用多个雷同意义的变量表示`表现的是，组件的value渲染出来后，使用了多个变量来存储该value值。


### 保存提交时获取表单状态
经过以上设计，获取状态的方式。
考虑到保存的按钮在外部【组件A的祖父组件】，于是点击保存的时候，获取组件A的状态有两种方式：
- 通过ref : this.ref.A.state
- 给组件A 传一个函数props，然后在组件A中的装载生命周期函数内，将一个获取内部状态的函数作为入参，执行该props，外部可通过执行作为入参的函数，获取状态。

以上两种方式，都很不好。


>状态设计是表单开发前，必须要思考并且写好框架的，这个框架不铺好，急忙忙开发，是能满足短期的需求，
但后期需求变动，如果当前状态设计不匹配需求，哪怕是一个简单的需求，都要下几倍的功夫，甚至要重构状态设计或重构组件，这就是所谓的技术债务。

## 状态设计
{% img url_for /image/form/ui.jpg %}
开发上面一个表单，
简单一点，那就直接在一个页面把所有的内容写上去就行，所有的表单控件都处于同一个父组件内，此时因为所有内容都在一个大组件内，无所谓状态设计。
每个输入框组件的值的来源与表现都唯一，这是最理想的状态，非常利于后期维护开发。
不过有一个弊端是，这里数起来，输入框有二十个，有些人想把这些输入框组件，按ui的内容类别进行划分，
写成三个组件：货币信息组件、交易配置组件、收益配置组件。

此时就需要用到状态设计了，
这里推荐进行状态提升设计，将上述三个组件的状态提升到父组件进行维护，然后通过props方式传给三个组件用于渲染ui值:
```js
// 这里以react举例，react与vue实现不一样，状态设计理念应该一致

const FormPage = () => {
  const [formVals, setFormVals] = useState({});
  const onFieldChange = (val, key) => {
    setFormVals({ ...formVals, [key]: val });
  };
  return (
    <div>
      <h3>货币配置</h3>
      <Currency value={formVals} onFieldChange={onFieldChange} />
      <h3>交易配置</h3>
      <Trade value={formVals} onFieldChange={onFieldChange} />
      <h3>收益配置</h3>
      <Profit value={formVals} onFieldChange={onFieldChange} />
      <div><Button>保存</Button></div>
    </div>
  );
};

const Currency = ({ value, onFieldChange }) => (<>
  <FormItem label="币种">
    <Input
      value={value.moneyType}
      onChange={(val) => {
        onFieldChange(val, 'moneyType');
      }}
    />
  </FormItem>
   ...
    </>);
```
以上设置时，input组件的渲染是完全受控的，value.moneyType 代表了input组件所见即所得，非常棒。
就算交易和收益配置组件需要使用货币组件内部输入框的值，都十分方便，因为所有的input值，全部来源于 formVals ，具有值的来源唯一性。
于是我们可以说上述写法有的好处：
- 状态提升到父组件后，任何子孙组件都能非常方便的拿到其他兄弟组件值
- 状态提升后，所有组件的值，来源具有唯一性，都是formVals

这种状态设置后，任何需求，我们都能很方便的实现，
- 因为所有的状态都能很方便从父组件拿到，
- 同时子组件渲染的值，具备了所见即所得，又具备了唯一性，从而让逻辑非常简单性，后期维护的时候，不必考虑其他因素，直接盲改。

### 为什么状态提升如此重要
react的redux，其实就是将页面所有的状态，都提升至页面最顶层的组件，所有项目内的页面都是该组件的子组件。
于是所有页面都能共享到这个 redux数据。
所以 redux 就是一个加强版的状态提升的工具。

vue中也同样有vuex，其大致思路，也同样是将状态存储在一个唯一的地方，所有的组件都能访问和设置这个状态。
所以 vuex 也是一个加强版的状态提升工具。

### 状态提升与redux、vuex的关系
参考《为什么状态提升如此重要》
### 状态提升与数据存储唯一性
状态提升后，其天然就会让数据的存储具备了唯一性。
比如上面的《由一个问题想到的》《状态设计》中举出的正反两个例子，
如果一个组件使用state为维护其值的时候，为了让外部能够影响到组件的值，我们通常使用 state+defaultProps 来确定组件的值。
假如我们将状态提升，那么大可只使用一个 props.formVals 来维护组件的值，于是值的来源具备了唯一性，纯粹性，逻辑简单性；

### 状态提升与简便性的妥协
我们在页面开发的时候，有很大时候都是不会用到redux这种加强版的状态提升，
因为状态提升，越顶层，意味着增加了代码量，又要分拆到多个文件编写，确实让开发不方便，虽然扩展性非常强。
于是我们在写页面是，如果考虑到后期其他页面不会公用此状态，一般都是使用state 而非redux。

### react与vue的组件设计建议
考虑开发成本性价比，就个人工作经验而言：
react而言，为了组件扩张性，推荐设计成受控组件，状态提升至父组件控制，虽然增加了代码量，带来一点麻烦，但保证了逻辑理解的简单性(可读性),可扩展性；
vue而言，也进行类似的状态提升设计；
对于要共享出去的状态，无论是react还是vue，都要使用状态提升设计模式。


### 技术给你开一个玩笑
有一些人觉得，所有内容写到一个文件，修改起来更加方便，不用跳来跳去去找其他文件，有个两三千行代码，也能忍受。
这不能说不对，有时候，确实带来的方便，对于这点，我也不置可否，仁者见仁智者见智吧。
>以前见过一个表单页面有三千行代码，然后一个状态使用了 data 作为名字，又有很多内部函数也使用data作为行参，
于是想追踪data的来龙去脉时，一搜索文件，居然匹配到了一百多个data，分析起来头炸。

我习惯代码控制在600行内，逻辑确实复杂，保证一千行左右。
如果将所有内容写到一个文件，那么就是不分拆组件，也就不存在所谓的状态设计。
因此后期迭代需求的时候，其开发成本，肯定比错误的状态设计进行组件分离的情况，要小很多成本。

所以我在想，如果对react、vue 不够熟练的初学者，不写组件，未尝不是一件坏事，全部内容搞里头，
这就是技术给你开个玩笑。


除了状态设计，
## 父级组件做的事情
这里的父级组件，就是指一个表单页面的根组件、顶级组件，我们页面的所有内容或组件都放在这个组件(子孙)内部，
下面是一个典型的父组件结构。
 ```js
 const MyPage() => {
  // 表单数据
  const [formVals, setFormVals] = useState({})

  // 接口数据回填表单
  useEffect(()=>{
    const [{dataObj }] = useGetPageData();
    const { originFormVals, } = responseToFormData({dataObj})
    setFormVals(originFormVals)
  }, [])

  // 保存
  const onSave =()=>{
    // 请求表单接口
    excuteSave({
      // 验证表单
      validateForm,
      // 将表单数据转化为接口数据
      getParmas,
      // 表单数据
      formVals,
    })
  }
  return (
    <div>
      <Form value={formVals}>
        <Form.Item>....</Form.Item>
        <Form.Item>....</Form.Item>
        <Form.Item>....</Form.Item>
      </Form>
      <div onClick={onSave}>保存</div>
    </div>
  )
}
 ```
从上述父组件结构看出，其主要聚焦以下事情，这样做的好处是，保存父组件业务代码的纯粹性 简单些 易读性：
### 状态提升后的状态控制器
状态提升后的状态控制器： formVals 与 setFormVals
上述已经说了，这里不再叙述。

### 详情接口回填表单
这个其实可通过统一的函数工具处理
### 表单数据转接口入参
这个其实可通过统一的函数工具处理
### 表单校验
这个其实可通过统一的函数工具处理

### 表单的保存逻辑
保存的接口请求

### 帮助工具函数文件
如果这部分的逻辑比较独立，可以将 详情接口回填表单 表单数据转接口入参 表单校验 三部分内容写到一个专门的helper.js中，
写到一个js上的好处是，一些工具函数会被同样用于这三部分，
而且这三部分逻辑相似，集中到一个文件，后期改动比较方便



## 联动的设计
{% img url_for /image/form/select.jpg %}
### 通过响应实现
通过响应 `币种` 的变化，来清空 `交易产品` 的值：
```js
const Currency = ({ defalutVals }) => {
  const [moneyType, setType] = useState(defalutVals.moneyType);
  const [tradeProduct, setTradeProduct] = useState(defalutVals.tradeProduct);
  useEffect(() => {
    setTradeProduct('');
  }, [moneyType]);

  return (
  <>
    <FormItem label="币种">
      <Input
        value={moneyType}
        onChange={(val) => {
          setType(val);
        }}
      />
    </FormItem>
    <FormItem label="交易产品">
      <Input
        value={tradeProduct}
        onChange={(val) => {
          setTradeProduct(val);
        }}
      />
    </FormItem>
      </>);
};
```
但这种有一个天然的缺陷，
当表单接口详情返回数据时，因为上面的useEffect总是响应 `币种` 的变化，
详情接口数据回填时，`交易产品`的值总被清空。
于是解决方案来了：

```js
const CurrencyWrap = () => {
  const [vals, setVals] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    fetch(url).then((res) => {
      setVals(res);
      // 必须要在setVals之后执行，这样Currency组件加载时，数据是最新的
      setRefreshKey(pre=> pre+1)
    });
  }, []);

  return <Currency key={refreshKey} defaultVals={vals} />;
};
```
这种解决方案利用的是key改变后，重新加载组件，一些简单的组件可以这样写，不过不太推荐这样写。


### 通过onChange实现

我们要做联动，首先要理解联动的本质，
为什么上面通过 useEffect 响应无法解决联动的问题，最后还得通过 CurrencyWrap 打一层补丁。
```js
 useEffect(() => {
    setTradeProduct('');
  }, [moneyType]);
```

因为我们被误导了，以为 `交易产品` 的清空的必然强联系就是 `币种` 的值改变。
其实不然，`交易产品` 的清空与否，只与动作有关。
**这里说到了一个设计本质，我们在设计联动的时候，联动的触发开关是动作，而非对值的响应**。
`交易产品` 的清空联动，其实只会出现在 `币种` 值的输入下改变的值，就会要求联动清空 `交易产品` 的值，
其他情况下，例如接口详情请求导致的 `币种`的值的变化，不要求情况 `交易产品`的值。

于是我们可以理解为，联动的开关：
第一必须是先有动作，
然后就是动作产生了影响或变化后，
基于影响和变化做出联动。

理解了联动的本质，那么我们设计上述联动，可以这样写：
```js
const Currency = ({ defalutVals }) => {
  const [moneyType, setType] = useState(defalutVals.moneyType);
  const [tradeProduct, setTradeProduct] = useState(defalutVals.tradeProduct);
  return (
  <>
    <FormItem label="币种">
      <Input
        value={moneyType}
        onChange={(val) => {
          setType(val);
          // 只需增加一行，作为联动
          // 同样的如果`交易产品`是下拉框，需要联动改变枚举值，也是同样的方式，在此onChange下改变
          setTradeProduct('')
        }}
      />
    </FormItem>
    <FormItem label="`交易产品`">
      <Input
        value={tradeProduct}
        onChange={(val) => {
          setTradeProduct(val);
        }}
      />
    </FormItem>
      </>);
};
```

### 设计本质
我们在设计联动的时候，联动的触发开关是动作，而非对值的响应，这样设计后，后期会避免很多麻烦。

### 为什么要说联动
可能在jquery时代，没有响应hooks存在，做联动只能通过 onChange，于是不会有错误。
但因为 react、vue 基于数据响应的，在做联动时，有些人被联动表象所误导，会通过 数据响应去实现，这种实现方式对后期扩展非常不利。


## 其他开发细节
### 尽量避免会被雷同的变量名
比如使用date，form 这样搜索改变量时，能匹配到很多，追踪问题不太方便。
参考《技术给你开一个玩笑》

### 所见即所得
开发组件时,有些人为了图方便，直接在 onChange时，把该组件值的接口入参一并写好。
parmasMoneyType 其实就是 moneyType，但特殊的空值情况下，parmasMoneyType设置为0。
这个 parmasMoneyType 充分体现了所见非所得，放在这里误导人。
```js
 <Input
        value={moneyType}
        onChange={(val) => {
          setType(val);

          if(!val){
            parmasMoneyType = 0
            return 
          }
           parmasMoneyType = val
        }}
      />
```
建议的写法：
```js
 <Input
        value={moneyType}
        onChange={(val) => {
          setType(val);
        }}
      />
```
在保存的逻辑中写好表单转入参
```js
let parmasMoneyType = moneyType;
if(!parmasMoneyType) parmasMoneyType = 0
fetch(url, {
  moneyType: parmasMoneyType
})
```
这样保证了 input 组件的清爽，同时也么有冗余的逻辑：
组件内部只写与渲染有关的内容，不要写业务逻辑，什么是业务逻辑，比如表单提交接口的入参转换等等；

### 组件内部不要冗余业务逻辑
参考上面的《所见即所得》


### 更多细节
关注 另外一篇中关于表单的内容





