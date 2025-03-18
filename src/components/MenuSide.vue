<script setup>
import Avatar from './Avatar.vue';
</script>

<template>
  <div class="border-r border-gray-200 w-full h-full py-4 relative flex flex-col items-center justify-between">
    <div class="flex flex-col items-center justify-center gap-4">
      <img src="@/assets/logo.svg" alt="logo" class="w-10 h-10" />
    </div>
    <div class="flex flex-col items-center justify-center gap-4">
      <Avatar />
    </div>
  </div>
</template>

