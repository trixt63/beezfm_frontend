<script setup>
import { computed } from 'vue';
import DropDownMenu from './DropDownMenu.vue';
import DataPoint from './DataPoint.vue';
const emit = defineEmits(['onDelete', 'onFind', 'onSave', 'onSelect']);
const { floor, selectedData, pathFilterActive } = defineProps({
  floor: {
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
const totalRooms = computed(() => {
  return floor?.children?.length;
})
const totalMeter = computed(() => {
  return floor?.children?.reduce((acc, room) => acc + room?.children?.length, 0);
})


const onHandleDelete = async (floor) => {
  await emit('onDelete', floor);
}

const handleSelect = async (floor) => {
  await emit('onSelect', floor);
}

const onHandleFind = async (floor) => {
  await emit('onFind', floor);
}

const onHandleSave = async (floor) => {
  await emit('onSave', floor);
}
const isSelected = computed(() => {
  return selectedData?.id === floor?.id;
})

const dataPoint = computed(() => {
  if (pathFilterActive) {
    return floor?.datapoints?.length > 0 ? floor?.datapoints : [];
  }
  const isSelectedCurrent = selectedData?.id === floor?.id;
  return floor?.datapoints?.length > 0 ? floor?.datapoints : isSelectedCurrent ? selectedData?.datapoints : [];
})
</script>

<template>
  <div class="relative">
    <DropDownMenu :data="floor" @onDelete="onHandleDelete" @onFind="onHandleFind" @onSave="onHandleSave"
      :isSelected="isSelected" />
    <div :class="{ 'bg-gray-100': isSelected, 'bg-white': !isSelected, active: isSelected }"
      class="flex flex-col p-2 rounded-lg cursor-pointer card-item" @click="handleSelect(floor)">
      <h2 class="font-semibold">{{ floor.name }}</h2>
      <div class="text-[10px] mb-2 capitalize">{{ floor.type }}</div>
      <div class="flex items-center gap-2 justify-between">
        <span class="text-xs">{{ totalRooms }} rooms, {{ totalMeter }} devices </span>
        <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3.33333 7.66667C3.33333 6.40959 3.33333 5.78105 3.72385 5.39053C4.11437 5 4.74291 5 5.99999 5H9.99999C11.2571 5 11.8856 5 12.2761 5.39053C12.6667 5.78105 12.6667 6.40959 12.6667 7.66667V8.33333C12.6667 9.5904 12.6667 10.2189 12.2761 10.6095C11.8856 11 11.2571 11 9.99999 11H5.99999C4.74291 11 4.11437 11 3.72385 10.6095C3.33333 10.2189 3.33333 9.5904 3.33333 8.33333V7.66667Z"
            stroke="white" />
          <path
            d="M12.6667 1.33334V1.66668C12.6667 2.58715 11.9205 3.33334 11 3.33334H4.99999C4.07952 3.33334 3.33333 2.58715 3.33333 1.66668V1.33334"
            stroke="white" stroke-linecap="round" />
          <path
            d="M12.6667 14.6667V14.3333C12.6667 13.4129 11.9205 12.6667 11 12.6667H4.99999C4.07952 12.6667 3.33333 13.4129 3.33333 14.3333V14.6667"
            stroke="white" stroke-linecap="round" />
        </svg>
      </div>
      <DataPoint :dataPoint="dataPoint" />
    </div>
  </div>
</template>