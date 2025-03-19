<script setup>
import { computed } from 'vue';
import DropDownMenu from './DropDownMenu.vue';
const emit = defineEmits(['onDelete', 'onSelect', 'onFind', 'onSave']);
const { hotel, selected } = defineProps({
  hotel: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    required: false,
    default: false
  },
  onSelect: {
    type: Function,
    required: false,
    default: () => { }
  },
})
const totalFloors = computed(() => {
  return hotel?.children?.length;
})
const totalRooms = computed(() => {
  return hotel?.children?.reduce((acc, floor) => acc + floor?.children?.length, 0);
})
const totalMeter = computed(() => {
  return hotel?.children?.reduce((acc, floor) => acc + floor?.children?.reduce((acc, room) => acc + room?.children?.length, 0), 0);
})


const onHandleDelete = async (hotel) => {
  await emit('onDelete', hotel);
}

const handleSelect = async (hotel) => {
  await emit('onSelect', hotel);
}

const onHandleFind = async (hotel) => {
  await emit('onFind', hotel);
}

const onHandleSave = async (hotel) => {
  await emit('onSave', hotel);
}

</script>

<template>
  <div class="relative">
    <DropDownMenu :data="hotel" @onDelete="onHandleDelete" @onFind="onHandleFind" @onSave="onHandleSave" />
    <div :class="{ 'bg-gray-100': selected, 'bg-white': !selected, active: selected }"
      class="flex flex-col p-2 rounded-lg cursor-pointer card-item" @click="handleSelect(hotel)">
      <h2 class="font-semibold">{{ hotel?.name }}</h2>
      <div class="text-[10px] mb-2">{{ hotel?.type }}</div>
      <div class="flex items-center gap-2 justify-between">
        <span class="text-xs">{{ totalFloors }} floors, {{ totalRooms }} rooms, {{ totalMeter }} devices </span>
        <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.6667 14.6667H1.33334" stroke="white" stroke-linecap="round" />
          <path
            d="M11.3333 14.6667V4.00001C11.3333 2.74293 11.3333 2.11439 10.9428 1.72387C10.5523 1.33334 9.92372 1.33334 8.66666 1.33334H7.33332C6.07624 1.33334 5.4477 1.33334 5.05718 1.72387C4.66666 2.11439 4.66666 2.74293 4.66666 4.00001V14.6667"
            stroke="white" />
          <path
            d="M14 14.6667V7.66668C14 6.73034 14 6.26222 13.7753 5.92592C13.678 5.78033 13.553 5.65533 13.4074 5.55805C13.0711 5.33334 12.603 5.33334 11.6667 5.33334"
            stroke="white" />
          <path
            d="M2 14.6667V7.66668C2 6.73034 2 6.26222 2.22471 5.92592C2.32199 5.78033 2.44699 5.65533 2.59257 5.55805C2.92887 5.33334 3.39703 5.33334 4.33333 5.33334"
            stroke="white" />
          <path d="M8 14.6667V12.6667" stroke="white" stroke-linecap="round" />
          <path d="M6.66666 3.33334H9.33332" stroke="white" stroke-linecap="round" />
          <path d="M6.66666 5.33334H9.33332" stroke="white" stroke-linecap="round" />
          <path d="M6.66666 7.33334H9.33332" stroke="white" stroke-linecap="round" />
          <path d="M6.66666 9.33334H9.33332" stroke="white" stroke-linecap="round" />
        </svg>
      </div>
    </div>
  </div>

</template>
