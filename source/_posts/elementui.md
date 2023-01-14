---
title: 玩转element ui
date: 2022/11/25
tags: [vue, element ui]
categories: 
- vue

---


## 一个react老油条

一个react老油条，由以前的辅助写vue，变成vue react 双线共同发展，这感觉还是很奇妙的。
不过说实话，如果你会react 以及全套react生态，另外如果你对基建编译有过深入研究，那么写vue 以及玩转vue生态，就是砍瓜切菜，全程就是把玩。

以前以vue为辅助，没有太多需求深入了解vue，不过目前经过十来天的vue主线项目洗礼，结合自己对react专家级别的开发经验，
**确实觉得对于项目开发而言，vue开发速度更佳，对使用者要求的js资深程度更低，未来vue应该会比react更加普及。**
而react主要能说道说道的，就是react的框架的颗粒度更小，是单纯的ui框架，这是一把双刃剑，让react更加灵活，可追溯性更好，同时让开发便捷性有所降低。

- 之前不愿使用vue，最主要的是vue通过this绑定了非常多的能力，然后让追溯更难。
>但懂得了套路，其追溯也不难。

- 觉得vue封装过度，失去了灵活性，是不是不利于大型复杂工程或组件的研发， 目前为止，还没感觉到有这个问题。
>个人觉得项目使用的话，不是组件库级别要求的高拓展性，所以vue完全为项目而生，做项目根本不用担心这个问题，另外觉得vue将所有能力都已经封装到this上，
可能更加复杂变态的组件，使用vue都能实现，只是牺牲了可读性、可维护性。

奈何react就是一个散装的毛坯房 以及齐全的的物料，你可以按你的想法天马行空的设计你的房子，前提是你要有设计师的能力。
vue就是一个精装修的房子，拎包即住，你不需要懂任何房屋设计能力，只需开发即可。

从react和vue的维护而言，
vue一直是尤大维护，这是他的创业产品，集成了所有的心血，其作者的唯一性，有连续性的传承性。
react 作者在更替，而且自从16版本后，再无创新更改，也就是从2018年至今，没有大版本改动，说明了一个它稳定，也说明了它更新缓慢，创新力不足。












## 文档建设
```s
 "dev": "npm run build:file && cross-env NODE_ENV=development webpack-dev-server --config build/webpack.demo.js & node build/bin/template.js",
```

### npm run build:file

#### build/bin/iconInit.js 

根据 packages/theme-chalk/src/icon.scss 里面的节点
生成一个 json ，处理字体图标


#### build/bin/build-entry.js

在项目的最外层，写一个 组件map的json，
使用模版，将所有的组件集成进去，组装出文件入口文件。

文件目录在这里 src/index.js



#### build/bin/i18n.js

根据模版生成国际化的vue文件
文件目录在这里 examples/pages/zh-CN/index.vue



  






### build/bin/version.js
生成 examples/versions.json 版本文件




