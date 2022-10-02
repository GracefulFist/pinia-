<template>
  <div class=""></div>
</template>

<script setup>
import { watch } from 'vue'
import { usePersonStore } from '/src/store'

const person = usePersonStore()

console.log(person.isFind(2))
</script>

<style lang="scss" scoped></style>
