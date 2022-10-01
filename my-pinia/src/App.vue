<template>
  <div class=""></div>
</template>

<script setup>
import {} from 'vue'
import { useCounterStore } from '/src/store/index.js'
import { storeToRefs } from 'pinia'

const store = useCounterStore()
const { count } = storeToRefs(store)
console.log(count, count.value)
</script>

<style lang="scss" scoped></style>
