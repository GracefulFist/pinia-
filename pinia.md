# pinia

# 如何创建一个 store？

​	在学习 pinia 之前，我们先要了解一个如何去创建一个 store 的实例，这有助于我们了解 store 如何在项目中使用。

> store 中现在只包含 state、getters、actions 三个属性。

创建一个 store

	1. 首先我们要使用 pinia 提供的方法 defineStore() ，并且要求我们用一个唯一的名称（类似于id）作为它的第一个参数，而它的第二个参数，可以是一个 Options Object（Option API） 或者 Setup 函数

```js
import { defineStore } from 'pinia'

export const useStore = defineStore( 'main' , {
    // option API 或 composition API
} )
```

对于 store 的实例的命名习惯，一般使用 use... 作为开头。推荐的命名写法：use...Store 。

那第二个参数如果是 Option API 的话，写法如下：

```js
import { defineStore } from 'pinia'

export const useCounter = defineStore( 'counter' , {
    state : () => {
        return {
            count : 0,
            name : '小张'
        }
    },
    getters : {
        doubleCounte( state ){
            return state.count * 2
        }
    },
    actions : {
        increment(){
            this.count++ 
        }
    }
} )
```

也可以使用 composition API ：

```js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounter = defineStore('counter', () => {
  const count = ref(0)
  const name = ref('小张')
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
  return { count, name, doubleCount, increment }
})
```

其中，ref() 包裹起来的元素就可以当作 state；computed() 包裹起来的元素相当于 getters ；function() 包裹起来的元素相当于 actions 。

对于上述两种语法的选择，完全看个人的喜好度，如果不知道选择哪一个的话，优先选择 Option API。

在项目中如何引用 store  的实例呢？

​	从前面的文档中我们可以了解到，好像store 的实例不在使用嵌套了，全部都属于平级了。就是你想调用哪一个 store 实例，直接去找到它的实例，而不是通过 store.xxx 的方式。

在项目中引用 store 实例：

```js
import { useCounterStore } from '/src/store/index.js'

// 这时你会发现，defineStore() 的返回值是一个函数
const store = useCounterStore()

console.log(store.count)
// 调用 store中的 actions 中的方法
store.increment()
console.log(store.count, store.name)
```

注意：当我们 store 一旦具体化的时候，我们就可以直接访问它的 state 、getters 、actions。我们可以通过：

```js
store.xxx 的方式进行访问
// 不能使用解构的语法，这样得到的数据会失去响应式，因为 store 是被 reactive() 包裹的一个对象
const { count , name } = store
```

 但如果你只想使用 store 中的 state 的话，使用 解构 语法的话，这时可以借助函数 storeToRefs() 。这样的话我们就可以只使用 state 中的变量了。

```js
import { useCounterStore } from '/src/store/index.js'
import { storeToRefs } from 'pinia'

const store = useCounterStore()
// 这时 count 为 ref() 包裹起来的对象，使用 xxx.value
const { count } = storeToRefs(store)
console.log(count, count.value)
```

#  1.state 的详解

​	state 概念是 store 中的一个重要的组成部分，大部分来说，人们都是以定义 state 为开始在使用 store 的时候。

定义一个关于个人喜好的 store（我们现在主要关注 state）：

```js
import { defineStore } from 'pinia'

export const usePersonInStore = defineStore('person', {
  state() {
    return {
      // 介绍个人信息
      name: '小松',
      age: 23,
      height: 178,
      hobby: ['打羽毛球', '爱吃甜食', '喜欢洗脚'],
      family: {
        father: '大松',
        mather: '大木',
        sister: '二松',
      },
    }
  },
})
```

在项目中，如何访问 store 中的 state 的值？并改变它的值（在 setup 中）：

```js
import {} from 'vue'
import { usePersonStore } from '/src/store'

const personStore = usePersonStore()

// 直接读取/修改 state 的值
console.log('personStore.name', personStore.name)
personStore.name = '松'
console.log('改变personStore.name的值的结果：', personStore.name)
```

修改 store 中的 state 的值：

先来介绍一下错误示例：

```js
// 当我们需要同时改变 personStore 中的多个属性的时候，我们不能直接的赋予 personStore 一个新的对象
personStore = {
  // 这是不被允许的，将会触发一个报错，如果想要重新定义 personStore，我们将在下面做介绍
  name: '小红',
  age: 14,
  height: '135cm',
}
```

正确做法：

方式一：一个一个的通过语句改变

```js
// 正确的做法是：我们可以对原先对象中的属性做修改
// 方式一：
personStore.name = '小红'
personStore.age = 14
personStore.height = '135cm'
// 提示：store 是被 reactive（）包裹的一个对象
console.log('多次改变改变personStore的结果：', personStore)
```

方式二：同时改变局部对象

```js
// 如果你不想一个个改变，可以通过 $patch() 方法
// 方式二：
personStore.$patch({
  name: '小红',
  age: 14,
  height: '135cm',
  // 这个属性的定义明显重复
  hobby: ['打羽毛球', '爱吃甜食', '喜欢洗脚', '吃红薯'],
})
// 提示：store 是被 reactive（）包裹的一个对象
console.log('多次改变改变personStore的结果：', personStore)
// 但这种方式明显的满足不了日常的开发，如果想要操作的更复杂一点，比如对数组的增删（这时必须要返回新的值）
// 需要借助 语句 来帮我们处理，我们可以让 $patch() 接收一个 function
personStore.$patch((state) => {
  state.name = '小红'
  state.age = 14
  state.height = '135cm'
  state.hobby.push('吃红薯')
})
```

修改的方法到这里就算结束了。

修改的方案：

```js
 'direct' | 'patch object' | 'patch function'
```

然后，你想还原到回到 store 中的 state 初始值，我们可以通过：

```js
personStore.$reset()
```

state 在 Options API 中的用法：

只读的话，我们可以借助 mapState()：

```js
import { mapState } from 'pinia'
import { usePersonStore } from '/src/store'

// 这个要注意，mapState 是使用在 computed 中的
computed: {
    // 第一个参数：创造 store 实例的方法
    // 第二个参数：state 对象中的属性
    // 在 options API 中使用的时候，就可以直接通过 this.xxx 访问
    ...mapState(usePersonStore, ['name', 'age', 'height', 'hobby', 'family']),
  },
  mounted() {
    console.log({
      name: this.name,
      age: this.age,
      height: this.height,
      hobby: this.hobby,
      family: this.family,
    })
  },
```

在上述的代码中，我们发现我们是直接使用的是 store 中 state 的属性名，如果想要避免重名的话，可以让 mapState 第二个参数接收一个对象

```js
// 对于需要改变其变量名的时候，我们可以通过接收一个对象
    ...mapState(usePersonStore, {
      myName: 'name',
      // 属性还可以接收一个 function 用来计算,参数为整个 store 的实例
      doubleAge: (store) => store.age * 2,
      magicAge(store) {
        return this.age + this.doubleAge
      },
    }),
```

注意，上述的 mapState() 操作出来的结果只能用于**只读**，不能修改他们的值，类似与这样（当然在 setup 中不存在这个，因为他压根也不用mapState）:

```js
this.myName = '小布'
// 报错信息
// [Vue warn]: Write operation failed: computed property "myName" is readonly.
```

如果想要变为可读可写的状态，请使用 mapWritableState () :

```js
import { mapWritableState } from 'pinia'
import { usePersonStore } from '/src/store'

computed: {
    ...mapWritableState(usePersonStore, ['name']),
  },
  mounted() {
    // 可以改变读取到的 state 的值
    this.name = '小布'
    console.log({
      name: this.name,
    })
  },
```

提示：

> 使用 mapState() 函数所有的变量只为可读，不允许改变。但是如果 state.xxx 是一个 collection，like Array。我们可以改变其中的值，但是不能使用 state.xxx = []。其实，完全和 const 的用法相似，可以说一样。

注意，当我们使用了 mapWritableState() 函数的第二个参数去接收一个对象的时候，我们可以使用片假名另换一个变量名。这时我们就可以随意改变当前的值，也就不需要在这个对象中做任何的计算了，就不提供任何的一个类似于 mapState 中属性接收一个 function 用于计算了。

```js
computed: {
    ...mapWritableState(usePersonStore, {
      myName: 'name',
      myAge: 'age',
    }),
  },
  mounted() {
    console.log({
      name: this.myName,
      age: this.myAge,
    })
  },
```

不太理解这个用法：

## Replacing the `state`[#](https://pinia.vuejs.org/core-concepts/state.html#replacing-the-state)

You **cannot exactly replace** the state of a store as that would break reactivity. You can however *patch it*:

```
// this doesn't actually replace `$state`
store.$state = { count: 24 }
// it internally calls `$patch()`:
store.$patch({ count: 24 })
```

state 的订阅模式

可以观察当前的 state 的变化过程，而且只会触发一个：

```js
cartStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type // 'direct' | 'patch object' | 'patch function'
  // same as cartStore.$id
  mutation.storeId // 'cart'
  // only available with mutation.type === 'patch object'
  mutation.payload // patch object passed to cartStore.$patch()

  // persist the whole state to the local storage whenever it changes
  localStorage.setItem('cart', JSON.stringify(state))
})
```

```vue
<script setup>
import { watch } from 'vue'
import { usePersonStore } from '/src/store'

const person = usePersonStore()

person.$subscribe((mutations, state) => {
  console.log(mutations.type, mutations.storeId, mutations)
})
setTimeout(() => {
  person.$patch({
    name: '小布',
    age: 12,
  })
}, 3000)
setTimeout(() => {
  person.$patch({
    name: '小',
    age: 122,
  })
}, 6000)
watch(person, (cur, old) => {
  console.log({ cur })
})
</script>
```

By default, *state subscriptions* are bound to the component where they are added (if the store is inside a component's `setup()`). Meaning, they will be automatically removed when the component is unmounted. If you also want to keep them after the component is unmounted, pass `{ detached: true }` as the second argument to *detach* the *state subscription* from the current component:

```
export default {
  setup() {
    const someStore = useSomeStore()

    // this subscription will be kept even after the component is unmounted
    someStore.$subscribe(callback, { detached: true })

    // ...
  },
}
```

# 2.getters 的详解

getters 的定义？如何去书写 getters？

在 Options API 中：

```js
import { defineStore } from 'pinia'

export const usePersonStore = defineStore( 'person' , {
    state(){
        return {
            age: 23
        }
    },
    getters:{
        doubleAge : (state) => state.age * 2
    }
} )
```

在 composition API 中：

```js
import { defineStore } from 'pinia'
import { ref , computed } from 'vue'

export const usePersonStore = defineStore( 'person' , ()=>{
    const age = ref(23)
    const doubleAge = computed( () => age.value * 2 )
    return {
        age,
        doubleAge
    }
})
```

大部分的时候，在 getters 中，我们一般只使用 state 中的属性即可满足我们的工作需求，但我们也可以会遇到使用 getters 中其它的属性（在 options 中写法可能会复杂一些，但在 composition API 中写法可能更加的灵活一些）。

在 Options API 中，在 getters 中访问其它 getters 的话需要借助 this，并且 getters 的不能是一个 箭头函数(arrow function)：

```js
import { defineStore } from 'pinia'

export const usePersonStore = defineStore('person', {
  state: () => {
    return {
      name: '小张',
      clickCount: 23,
    }
  },
  getters: {
    doubleClickCount: (state) => state.clickCount * 2,
    getClickInfo(state) {
      // 此时的 this 为 当前的 store 实例
      return console.log(
        `${this.name}一共点击了${state.clickCount},双击了${this.doubleClickCount}`
      )
    },
  },
})
```

getters 在组件中的使用，跟直接使用 state 无异。

```vue
<script>
    import { usePersonStore } from '/src/store'

    const person = usePersonStore()
    person.getClickInfo
</script>
<template>
    <p>Double count is {{ store.doubleCount }}</p>
</tempale>
```

## Accessing other getters[#](https://pinia.vuejs.org/core-concepts/getters.html#accessing-other-getters)

As with computed properties, you can combine multiple getters. Access any other getter via `this`. Even if you are not using TypeScript, you can hint your IDE for types with the [JSDoc](https://jsdoc.app/tags-returns.html):

```vue
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  getters: {
    // type is automatically inferred because we are not using `this`
    doubleCount: (state) => state.count * 2,
    // here we need to add the type ourselves (using JSDoc in JS). We can also
    // use this to document the getter
    /**
     * Returns the count value times two plus one.
     *
     * @returns {number}
     */
    doubleCountPlusOne() {
      // autocompletion ✨
      return this.doubleCount + 1
    },
  },
})
```

向 getters 中传入参数

​	getters 是一个计算属性，所以不可能向 getters 中传递任何的参数，但是我们可以向 getters 中 return 中书写一个函数，这就可以使getters 接收参数了

```js
export const useStore = defineStore('main', {
  getters: {
    getUserById: (state) => {
      return (userId) => state.users.find((user) => user.id === userId)
    },
  },
})
```

其它的语法：

参考链接：https://pinia.vuejs.org/core-concepts/getters.html#without-setup
