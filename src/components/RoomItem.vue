<script setup>
import DropDownMenu from './DropDownMenu.vue';

const emit = defineEmits(['onDelete', 'onSelect']);
const { room, selected } = defineProps({
  room: {
    type: Object,
    required: true
  },
  selected: {
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
</script>

<template>
  <div class="relative">
    <DropDownMenu :data="room" @onDelete="onHandleDelete" />
    <div :class="{ 'bg-gray-100': selected, 'bg-white': !selected, active: selected }"
      class="flex flex-col p-2 rounded-lg cursor-pointer card-item" @click="handleSelect(room)">
      <h2>{{ room.name }}</h2>
      <div class="text-[10px] mb-2">{{ room.type }}</div>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2 justify-between">
          <div>
            <div v-for="child in room.children" :key="child.id" class="flex items-center gap-1">
              <span class="text-[8px] text-gray-500 rounded-md bg-gray-200 px-1 text-center">
                {{room.children.filter(child => child.type === child.type).length}}
              </span>
              <h3 class="text-[10px] capitalize">{{ child.type }}</h3>
            </div>
          </div>
          <svg class="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.33333 3.33333C9.5904 3.33333 10.2189 3.33333 10.6095 3.72385C11 4.11437 11 4.74291 11 5.99999V9.99999C11 11.2571 11 11.8856 10.6095 12.2761C10.2189 12.6667 9.5904 12.6667 8.33333 12.6667H7.66667C6.40959 12.6667 5.78105 12.6667 5.39053 12.2761C5 11.8856 5 11.2571 5 9.99999V5.99999C5 4.74291 5 4.11437 5.39053 3.72385C5.78105 3.33333 6.40959 3.33333 7.66667 3.33333H8.33333Z"
              stroke="white" />
            <path
              d="M14.6667 12.6667H14.3333C13.4129 12.6667 12.6667 11.9205 12.6667 11V4.99999C12.6667 4.07952 13.4129 3.33333 14.3333 3.33333H14.6667"
              stroke="white" stroke-linecap="round" />
            <path
              d="M1.33333 12.6667H1.66666C2.58713 12.6667 3.33333 11.9205 3.33333 11V4.99999C3.33333 4.07952 2.58713 3.33333 1.66666 3.33333H1.33333"
              stroke="white" stroke-linecap="round" />
          </svg>

        </div>
      </div>
    </div>
  </div>
</template>
