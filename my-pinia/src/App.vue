<template>
  <div class=""></div>
</template>

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

<style lang="scss" scoped></style>
