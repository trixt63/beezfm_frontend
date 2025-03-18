<template>
  <div class="flex items-center gap-2 text-sm ">
    <template v-for="(item, index) in items" :key="item">
      <span>{{ item }}</span>
      <span v-if="index < items.length - 1">/</span>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})
</script>
