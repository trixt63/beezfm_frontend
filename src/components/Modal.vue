<script setup>
const emit = defineEmits(['onClose'])
const { id, open } = defineProps({
  id: {
    type: String,
    required: true
  },
  open: {
    type: Boolean,
    required: true
  }
})
const closeModal = () => {
  emit('onClose')
}
const time = new Date().getTime()
</script>

<template>
  <div v-if="open" class="fixed inset-0 flex items-center justify-center duration-300 transition-all"
    :style="{ zIndex: time }">
    <div class="bg-black/20  absolute inset-0 z-10" @click="closeModal"></div>
    <div class="bg-white rounded-2xl p-4 z-20">
      <slot name="header"></slot>
      <slot name="content"></slot>
      <slot name="footer"></slot>
    </div>
  </div>
</template>