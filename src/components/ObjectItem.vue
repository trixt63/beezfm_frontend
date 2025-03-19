<script setup>
import { computed } from 'vue';
import DataPoint from './DataPoint.vue';
import DropDownMenu from './DropDownMenu.vue';
const emit = defineEmits(['onDelete', 'onSelect', 'onFind', 'onSave']);
const { object, selectedData, pathFilterActive } = defineProps({
  object: {
    type: Object,
    required: true
  },
  selectedData: {
    type: Object,
    required: false,
    default: () => { }
  },
  pathFilterActive: {
    type: Boolean,
    required: false,
    default: false
  }
})

const onHandleDelete = async (object) => {
  await emit('onDelete', object);
}

const handleSelect = async (object) => {
  await emit('onSelect', object);
}

const isSelected = computed(() => {
  return selectedData?.id === object?.id;
})
const dataPoint = computed(() => {
  if (pathFilterActive) {
    return object?.datapoints?.length > 0 ? object?.datapoints : [];
  }
  const isSelectedCurrent = selectedData?.id === object?.id;
  return object?.datapoints?.length > 0 ? object?.datapoints : isSelectedCurrent ? selectedData?.datapoints : [];
})

const onHandleFind = async (object) => {
  await emit('onFind', object);
}

const onHandleSave = async (object) => {
  await emit('onSave', object);
}
</script>

<template>
  <div class="relative">
    <DropDownMenu :data="object" @onDelete="onHandleDelete" @onFind="onHandleFind" @onSave="onHandleSave"
      :isSelected="isSelected" />
    <div :class="{ 'bg-gray-100': isSelected, 'bg-white': !isSelected, active: isSelected }"
      class="flex flex-col p-2 rounded-lg cursor-pointer card-item" @click="handleSelect(object)">
      <h2>{{ object.name }}</h2>
      <div class="text-[10px] mb-2">{{ object.type }}</div>
      <DataPoint :dataPoint="dataPoint" />
    </div>
  </div>
</template>
