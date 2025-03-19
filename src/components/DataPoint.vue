<script setup>
const { dataPoint } = defineProps({
  dataPoint: {
    type: Object,
    required: true
  }
})
</script>

<template>

  <div v-if="dataPoint && dataPoint?.length > 0" class="flex items-center gap-1 mt-2 flex-wrap">
    <div v-for="datapoint in dataPoint" :key="datapoint.id"
      class="text-[8px] text-white rounded-md bg-gray-900/40 p-1 text-left">
      <span class="mr-1">{{ datapoint.name }}:</span>
      <span class="text-[10px]">{{ datapoint.value }} {{ datapoint.unit }}</span>
    </div>
  </div>
</template>