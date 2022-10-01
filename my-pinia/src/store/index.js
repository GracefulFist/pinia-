import { defineStore } from 'pinia'

export const usePersonStore = defineStore('person', {
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
