<script setup>
import { computed } from 'vue';
import DataPoint from './DataPoint.vue';
import DropDownMenu from './DropDownMenu.vue';
const emit = defineEmits(['onDelete', 'onSelect', 'onFind', 'onSave']);
const { room, selectedData, pathFilterActive } = defineProps({
  room: {
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

const onHandleDelete = async (room) => {
  await emit('onDelete', room);
}

const handleSelect = async (room) => {
  await emit('onSelect', room);
}

const isSelected = computed(() => {
  return selectedData?.id === room?.id;
})
const dataPoint = computed(() => {
  if (pathFilterActive) {
    return room?.datapoints?.length > 0 ? room?.datapoints : [];
  }
  const isSelectedCurrent = selectedData?.id === room?.id;
  return room?.datapoints?.length > 0 ? room?.datapoints : isSelectedCurrent ? selectedData?.datapoints : [];
})

const onHandleFind = async (room) => {
  await emit('onFind', room);
}

const onHandleSave = async (room) => {
  await emit('onSave', room);
}
</script>

<template>
  <div class="relative">
    <DropDownMenu :data="room" @onDelete="onHandleDelete" @onFind="onHandleFind" @onSave="onHandleSave"
      :isSelected="isSelected" />
    <div :class="{ 'bg-gray-100': isSelected, 'bg-white': !isSelected, active: isSelected }"
      class="flex flex-col p-2 rounded-lg cursor-pointer card-item" @click="handleSelect(room)">
      <h2>{{ room.name }}</h2>
      <div class="text-[10px] mb-2">{{ room.type }}</div>
      <DataPoint :dataPoint="dataPoint" />
    </div>
  </div>
</template>
