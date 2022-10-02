import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePersonStore = defineStore('person', {
  state: () => {
    return {
      name: '小张',
      id: 2,
      clickCount: 23,
      users: [
        {
          id: 2,
        },
        {
          id: 3,
        },
        {
          id: 4,
        },
      ],
    }
  },
  getters: {
    isFind: (state) => {
      return (userId) => state.users.find((user) => user.id === userId)
    },
  },
})
