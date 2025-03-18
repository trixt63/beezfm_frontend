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
  }
});
const mapType = computed(() => {
  return props.type === 'hotel' ? 'building' : props.type === 'floor' ? 'floor' : 'room';
});
const formData = ref({
  name: '',
  address: '',
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
        <input type="text" id="name" v-model="formData.name"
          class="mt-1 block w-full border rounded-md border-gray-300 focus:border-primary focus:ring-primary py-1 px-2"
          required />
      </div>
      <div>
        <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
        <input type="text" id="address" v-model="formData.address"
          class="mt-1 block w-full border rounded-md border-gray-300 focus:border-primary focus:ring-primary py-1 px-2"
          required />
      </div>
      <!-- <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="description" v-model="formData.description" rows="3"
          class="mt-1 block w-full border rounded-md border-gray-300 focus:border-primary focus:ring-primary py-1 px-2"></textarea>
      </div> -->
      <div class="flex justify-end gap-2">
        <button type="button" @click="handleClose"
          class="rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit"
          class="rounded-md border border-transparent bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary/80">
          {{ data ? 'Edit' : 'Create' }}
        </button>
      </div>
    </div>
  </form>
</template>