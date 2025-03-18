<script setup>
import Breadcrumb from "./Breadcrumb.vue";
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  breadcrumb: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="flex flex-col px-4 py-2">
    <Breadcrumb :items="breadcrumb" />
    <h1 class="text-2xl font-semibold">{{ title }}</h1>
  </div>
</template>
