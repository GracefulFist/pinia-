import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// export const useCounter = defineStore('counter', {
//   state: () => {
//     return {
//       count: 0,
//       name: 'Xiao Zhang',
//     }
//   },
//   getters: {
//     // 这个基本没有发生变化
//     doubleCount(state) {
//       state.count = state.count * 2
//     },
//   },
//   actions: {
//     // 这个可以通过 this 直接的就访问到state中的值
//     increment() {
//       this.count++
//     },
//   },
// })
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const name = ref('小张')
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
  return { count, name, doubleCount, increment }
})
