# @bigmogician/vue

## 概述

vue 部分的 ts 支持还没有合入 master

Vue 部分的 ts 写法和 js 的标准写法保持一致，所有的 js 写法都可以直接转到 ts，但是要更合理地使用类型提示，class 风格可以带来明显改进，所以我引入了 vue-class-component 组件。

下面的定义辅助基本上可以直接用在类 js 的写法之上，但使用 class 会更佳。

#### vue-class-component 使用原则:

- 诸如 filters、methods、computed 等部分，直接写在 Vue.extend({...})里，并被 class 直接继承；
- class 内部直接进行属性访问器(get; set;)、类成员字段(class-fields)和函数(prototype.method)定义；
- 不需要再用 data(){...},因为意义不大，所有 class fields 都会被 vue 追踪，检查并在必要的时候更新视图；
- 不要写这样的表达式：“public data: string = undefined;”，而应该写:"public data: string | null = null"，因为 undefined 不会被 vue 跟踪，无法自适应刷新视图；

#### 不使用 vue-class-component:

- 按照 js 语法书写就可以了，如果需要部分类型感知，使用语法：export default Vue.extend({...});

### Vue 的 client 部分定义：

- 类型帮助函数
- vue-router 定义补偿
- vuex 定义补偿

## 1.类型帮助函数

> src/vue.ts

#### 1）interface VueProps\<T>

> 「global」全局类型，用来描述 vue 组件的 props 类型

用法：...

#### 2）function classic\<T extends Vue>(component: Constructor\<T>, extend?: ComponentOptions\<T>): T;

> 「export」导出函数，用于不想用装饰器的同学或者 js 文件（没 babel-decorators）

用法：...

## 2.vue-router 定义补偿

> src/vue.ts

针对 vue-router 包定义的蜜汁设计，我包装了一个支持定义 query 和 params 的辅助函数来让 vue-router 变得更香

#### 1）namespace RouterVue

> 「export」「namespace」定义的名称空间，里面有多个类型定义

#### 2）interface VueRouterRef\<T>

> 「global」用来声明一个 router 组件的 query、params 和 meta 的解构，用法参加下面的`function RouterVue()`

#### 3）function RouterVue(...args: any[]): Vue;

> 「export」和名称空间相同的函数，用来替换 Vue.extend 支持 router 定义

用法：...

## 3.vuex 定义补偿

> src/vuex.ts

vuex 的定义支持非常的垃圾，不吐槽了，我做了帮助函数来确保 store 的定义在和 component 配合时，不会发生类型断裂。

#### 1）namespace VUEX

> 「export」「namespace」vuex 辅助名称空间，承载了多个类型和接口

用法：...

#### 2）function VUEX.bindState\<S>(state: S): VUEX.IVuexStateHelper\<S>;

> VUEX 名称空间暴露的唯一一个可调用函数，用来定义 state 信息；函数执行返回 VUEX.IVuexStateHelper\<S>，顺次调用方法完成 getters、mutations 和 actions 信息的登记，最终执行 createStore 完成 store 组装

用法：...

#### 3）interface VUEX.IVuexStateHelper\<S, IG = {}, IM = {}, IA = {}>

> 定义了 getters、mutations 和 actions 信息的登记函数，和最终执行函数 createStore；

> 定义了多个 map 函数，辅助完成 mapState 等场景的类型推导；

用法：...

##### 1）绑定 getters

##### 2）绑定 mutations

- state、getters 类型别定义错，mutations 的参数类型不要定义错误，不然 gg（编译不过，很严格

##### 3）绑定 actions

- commit、dispatch 具有类型感知，请确保 mutations 和 actions 的接受参数定义正确，不然 gg（编译不过

##### 4）完成 store

##### 5）帮助函数

- 完成所有绑定之后，生产 store 之前，actions 对象上所有的帮助函数定义支持已经完备，已经可以使用。

###### 1.mapState

> 等同 vuex.mapState，增强了类型推导能力

###### 2.mapGetters

> 等同 vuex.mapGetters，增强了类型推导能力

###### 3.mapMutations

> 等同 vuex.mapMutations，增强了类型推导能力

###### 4.mapActions

> 等同 vuex.mapActions，增强了类型推导能力

###### 5.createComputed

> 作用等同 vuex.mapState 和 vuex.mapGetters 的聚合，增强了类型推导能力

###### 6.createMethods

> 作用等同 vuex.mapMutations 和 vuex.mapActions 的聚合，增强了类型推导能力
