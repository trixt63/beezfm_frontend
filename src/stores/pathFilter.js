import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePathFilterStore = defineStore('pathFilter', () => {
  const pathFilterActive = ref(false)
  const pathFilterData = ref({})

  function setPathFilterActive(value) {
    pathFilterActive.value = value
  }
  function setPathFilterData(data) {
    pathFilterData.value = data
  }

  return { pathFilterActive, pathFilterData, setPathFilterActive, setPathFilterData }
})
