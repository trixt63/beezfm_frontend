<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  parentId: {
    type: String,
    required: false
  },
  data: {
    type: Object,
    required: false
  }
});
const mapType = computed(() => {
  return props.type === 'hotel' ? 'building' : props.type === 'floor' ? 'floor' : 'room';
});
const formData = ref({
  name: props.data?.name || '',
  location_details: props.data?.location_details || '',
  type: mapType.value,
  parent_id: props.parentId
  // description: ''
});

const emit = defineEmits(['save', 'onClose']);

const handleSubmit = async () => {
  await emit('save', formData.value);
};

const handleClose = async () => {
  await emit('onClose');
};

</script>

<template>
  <form @submit.prevent="handleSubmit" class="w-xs">
    <div class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
        <input v-model="formData.name" type="text" id="name"
          class="mt-1 block w-full border rounded-md border-gray-300 focus:border-primary focus:ring-primary py-1 px-2"
          required />
      </div>
      <div>
        <label for="location_details" class="block text-sm font-medium text-gray-700">Location Details</label>
        <textarea v-model="formData.location_details" id="location_details"
          class="mt-1 block w-full border rounded-md border-gray-300 focus:border-primary focus:ring-primary py-1 px-2"
          required rows="3"></textarea>
      </div>
      <!-- <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="description" v-model="formData.description" rows="3"
          class="mt-1 block w-full border rounded-md border-gray-300 focus:border-primary focus:ring-primary py-1 px-2"></textarea>
      </div> -->
      <div class="flex justify-end gap-2">
        <button type="button" @click="handleClose"
          class="rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
          Cancel
        </button>
        <button type="submit"
          class="rounded-md border border-transparent bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary/80 cursor-pointer">
          {{ data ? 'Edit' : 'Create' }}
        </button>
      </div>
    </div>
  </form>
</template>