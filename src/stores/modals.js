import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useModalsStore = defineStore('modals', () => {
  const modals = ref([])
  function addModal(modal) {
    modals.value.push(modal)
  }

  function removeModal(id) {
    modals.value = modals.value.filter(modal => modal.id !== id)
  }

  return { modals, addModal, removeModal }
})
