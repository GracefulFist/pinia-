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
// 这时 count 为 ref() 包裹起来的对象，使用xxx.value
const { count } = storeToRefs(store)
console.log(count, count.value)
```

 
