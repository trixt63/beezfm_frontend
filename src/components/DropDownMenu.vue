<script setup>
import { ref } from 'vue';
import Modal from './Modal.vue';
import ObjectForm from './ObjectForm.vue';

const emit = defineEmits(['onDelete', 'onFind', 'onSave']);
const props = defineProps({
  data: {
    type: Object,
    required: true
  },
})

const isOpenDropDown = ref(false);
const isOpenModalDelete = ref(false);
const isOpenModalEdit = ref(false);
const isOpenModalFind = ref(false);
const openDropDown = () => {
  isOpenDropDown.value = !isOpenDropDown.value;
}

const openModalDelete = () => {
  isOpenDropDown.value = false;
  isOpenModalDelete.value = !isOpenModalDelete.value;
}

const closeModalDelete = () => {
  isOpenModalDelete.value = false;
}

const deleteHotel = () => {
  emit('onDelete', props.data);
  isOpenModalDelete.value = false;
}

const openModalEdit = () => {
  isOpenDropDown.value = false;
  isOpenModalEdit.value = !isOpenModalEdit.value;
}

const closeModalEdit = () => {
  isOpenModalEdit.value = false;
}

const onSaveObject = async (data) => {
  await emit('onSave', data);
  isOpenModalEdit.value = false;
}

const openModalFind = () => {
  isOpenDropDown.value = false;
  isOpenModalFind.value = !isOpenModalFind.value;
}

const onFind = () => {
  isOpenDropDown.value = false;
  isOpenModalFind.value = !isOpenModalFind.value;
  emit('onFind', props.data);
}

const closeModalFind = () => {
  isOpenModalFind.value = false;
}
</script>

<template>
  <button class="text-xs text-red-500 absolute top-1 right-1 cursor-pointer rounded-md p-1 z-10" @click="openDropDown">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.33333 9.33332C4.06971 9.33332 4.66667 8.73637 4.66667 7.99999C4.66667 7.26361 4.06971 6.66666 3.33333 6.66666C2.59695 6.66666 2 7.26361 2 7.99999C2 8.73637 2.59695 9.33332 3.33333 9.33332Z"
        stroke="white" />
      <path
        d="M8 9.33332C8.73638 9.33332 9.33333 8.73637 9.33333 7.99999C9.33333 7.26361 8.73638 6.66666 8 6.66666C7.26362 6.66666 6.66666 7.26361 6.66666 7.99999C6.66666 8.73637 7.26362 9.33332 8 9.33332Z"
        stroke="white" />
      <path
        d="M12.6667 9.33332C13.403 9.33332 14 8.73637 14 7.99999C14 7.26361 13.403 6.66666 12.6667 6.66666C11.9303 6.66666 11.3333 7.26361 11.3333 7.99999C11.3333 8.73637 11.9303 9.33332 12.6667 9.33332Z"
        stroke="white" />
    </svg>

  </button>
  <div v-if="isOpenDropDown"
    class="dropdown-menu absolute top-8 right-1 bg-white rounded-md shadow-md flex flex-col p-1 z-20 text-xs">
    <button class="hover:bg-gray-200 duration-300 transition-all rounded-md p-2 cursor-pointer" @click="openModalFind">
      <span>Find</span>
    </button>
    <button class="hover:bg-gray-200 duration-300 transition-all rounded-md p-2 cursor-pointer" @click="openModalEdit">
      <span>Edit</span>
    </button>
    <button class="hover:bg-red-200 duration-300 transition-all rounded-md p-2 cursor-pointer" @click="openModalDelete">
      <span>Delete</span>
    </button>
  </div>

  <Modal id="delete" @close="closeModalDelete" :open="isOpenModalDelete">
    <template #header>
      <h2 class="font-bold mb-4">Delete {{ data.name }}</h2>
    </template>
    <template #content>
      <div class="mb-4">Are you sure you want to delete this {{ data.type }}?</div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <button
          class="bg-gray-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-gray-600 duration-300 transition-all text-xs"
          @click="closeModalDelete">
          Cancel
        </button>
        <button
          class="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-red-600 duration-300 transition-all text-xs"
          @click="deleteHotel">
          Delete
        </button>
      </div>
    </template>
  </Modal>
  <Modal id="edit" @close="closeModalEdit" :open="isOpenModalEdit">
    <template #header>
      <h2 class="font-bold mb-4">Edit {{ data.name }}</h2>
    </template>
    <template #content>
      <ObjectForm @save="onSaveObject" @onClose="closeModalEdit" :type="modalEditType" :parentId="modalEditParentId"
        :data="data" />
    </template>
  </Modal>
  <Modal id="find" @close="closeModalFind" :open="isOpenModalFind">
    <template #header>
      <h2 class="font-bold mb-4">Find in {{ data.name }}</h2>
    </template>
    <template #content>
      <form @submit.prevent="onFind" class="">
        <div class="flex flex-col gap-2">
          <input type="text" required class="w-full p-2 rounded-md border border-gray-300"
            placeholder="Search by path" />
          <div class="flex items-center justify-end gap-2">
            <button @click="closeModalFind"
              class="bg-gray-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-gray-600 duration-300 transition-all text-xs">
              Cancel
            </button>
            <button type="submit"
              class="bg-primary text-white px-4 py-2 rounded-md cursor-pointer hover:bg-primary/80 duration-300 transition-all text-xs">
              Find
            </button>
          </div>
        </div>
      </form>
    </template>
  </Modal>
</template>