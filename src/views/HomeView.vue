<script setup>
import MenuSide from "../components/MenuSide.vue";
import PageTitle from "@/components/PageTitle.vue";
import HotelsItem from "@/components/HotelsItem.vue";
import FloorItem from "@/components/FloorItem.vue";
import RoomItem from "@/components/RoomItem.vue";
import { ref, onMounted } from "vue";
import axios from "axios";
import ObjectForm from "@/components/ObjectForm.vue";
import Modal from "@/components/Modal.vue";
import ObjectItem from "@/components/ObjectItem.vue";
const VITE_API_URL = import.meta.env.VITE_API_URL;
const hotels = ref([]);
const floors = ref([]);
const rooms = ref([]);
const objects = ref([]);
const selectedHotel = ref(null);
const selectedFloor = ref(null);
const selectedRoom = ref(null);
const selectedObject = ref(null);
const isOpenModalCreate = ref(false);
const modalCreateType = ref(null);
const modalCreateParentId = ref(null);
const pathFilterActive = ref(false);
const pathFilterData = ref(null);
onMounted(() => {
  getHotels();
});

const getHotels = async () => {
  await axios.get(`${VITE_API_URL}/objects/tree?limit=100&offset=0`)
    .then((response) => {
      hotels.value = response.data;
      const currentSelectedHotel = hotels.value.find(hotel => hotel.id === selectedHotel.value?.id);
      handleHotelClick(currentSelectedHotel || hotels.value[0]);
    }).catch((error) => {
      console.error("Error fetching hotels:", error);
    });
}

const getObjectDetails = async (id, type) => {
  if (!id) return;
  await axios.get(`${VITE_API_URL}/objects/${id}?include_children=true&include_datapoints=true`)
    .then((response) => {
      if (type === 'hotel') {
        selectedHotel.value = response.data;
      } else if (type === 'floor') {
        selectedFloor.value = response.data;
      } else if (type === 'room') {
        selectedRoom.value = response.data;
      } else if (type === 'object') {
        selectedObject.value = response.data;
      }
    }).catch((error) => {
      console.error("Error fetching objects:", error);
    });
}

const handleHotelClick = (hotel) => {
  selectedHotel.value = hotel;
  floors.value = hotel?.children || [];
  getObjectDetails(hotel.id, 'hotel');
  const currentSelectedFloor = floors.value.find(floor => floor.id === selectedFloor.value?.id);
  handleFloorClick(currentSelectedFloor || floors.value[0] || null);
}

const handleFloorClick = (floor) => {
  selectedFloor.value = floor;
  rooms.value = floor?.children || [];
  getObjectDetails(floor.id, 'floor');
  const currentSelectedRoom = rooms.value.find(room => room.id === selectedRoom.value?.id);
  handleRoomClick(currentSelectedRoom || rooms.value[0] || null);
}

const handleRoomClick = async (room) => {
  console.log(room);
  selectedRoom.value = room;
  objects.value = room?.children || [];
  getObjectDetails(room.id, 'room');
  const currentSelectedObject = objects.value.find(object => object.id === selectedObject.value?.id);
  handleObjectClick(currentSelectedObject || objects.value[0] || null);
}

const handleObjectClick = async (object) => {
  selectedObject.value = object;
  getObjectDetails(object.id, 'object');
}

const handleCreateObject = (type, parentId = null) => {
  isOpenModalCreate.value = true;
  modalCreateType.value = type;
  modalCreateParentId.value = parentId;
}

const closeModalCreate = async () => {
  isOpenModalCreate.value = false;
};

const onCreateObject = async (data) => {
  await axios.post(`${VITE_API_URL}/objects`, data)
    .then(() => {
      getHotels();
    }).catch((error) => {
      console.error("Error creating hotel:", error);
    });
  closeModalCreate();
};

const handleDeleteObject = async (object) => {
  await axios.delete(`${VITE_API_URL}/objects/${object.id}`).then(async () => {
    await getHotels();
  }).catch((error) => {
    console.error(error);
  });
}

const handleFindObject = async (object) => {
  await axios.get(`${VITE_API_URL}/objects/query/${object.parent_id}/${object.path}`)
    .then((response) => {
      pathFilterActive.value = true;
      pathFilterData.value = object;
      hotels.value = response.data;
      const currentSelectedHotel = hotels.value.find(hotel => hotel.id === selectedHotel.value?.id);
      handleHotelClick(currentSelectedHotel || hotels.value[0]);
    }).catch((error) => {
      console.error(error);
    });
}

const handleSaveObject = async (object) => {
  await axios.put(`${VITE_API_URL}/objects/${object.id}`, object)
    .then(() => {
      getHotels();
    }).catch((error) => {
      console.error(error);
    });
}

const resetFilter = () => {
  pathFilterActive.value = false;
  pathFilterData.value = null;
  getHotels();
}

</script>

<template>
  <main class="grid grid-cols-[60px_1fr] h-screen">
    <MenuSide />
    <div class="w-full h-full text-base">
      <PageTitle title="Hotels Management" :breadcrumb="['Home', 'Hotels']" />
      <div v-if="pathFilterActive" class="flex items-center gap-2 px-4 py-2">
        <button @click="resetFilter"
          class="text-xs rounded-md border border-gray-300 text-center hover:bg-gray-100 cursor-pointer duration-300 p-1">
          <div class="flex items-center gap-2">
            <span class="text-gray-500">Filter by</span> {{ pathFilterData?.path }}
            <svg class="rotate-45" width="24" height="24" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M15 12H12M12 12H9M12 12V9M12 12V15" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </div>
        </button>

      </div>
      <div class="grid grid-cols-[repeat(5,200px)] gap-4 px-4 py-2">
        <div class="col-span-1 flex flex-col gap-2">
          <div class="h-12">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center w-full gap-2">
                <h2 class="font-semibold">Hotels</h2>
                <span class="text-xs text-gray-500 rounded-md bg-gray-200 px-2 py-[2px] text-center">
                  {{ hotels.length }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <button @click="handleCreateObject('hotel')"
                  class="text-xs rounded-md border border-gray-300 text-center hover:bg-gray-100 cursor-pointer duration-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 12H12M12 12H9M12 12V9M12 12V15" stroke="#1C274C" stroke-width="1.5"
                      stroke-linecap="round" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="text-sm text-gray-500 mb-2">
              {{ selectedHotel?.name }}
            </div>
          </div>
          <HotelsItem :pathFilterActive="pathFilterActive" @onSelect="handleHotelClick(hotel)" v-for="hotel in hotels"
            :key="hotel?.id" :hotel="hotel" :selectedData="selectedHotel" @onDelete="handleDeleteObject(hotel)"
            @onFind="handleFindObject" @onSave="handleSaveObject" />
        </div>
        <div class="col-span-1 flex flex-col gap-2">
          <div class="h-12">
            <div class="flex items-center gap-2">
              <div class="flex items-center w-full gap-2">
                <h2 class="font-semibold">{{ selectedHotel?.name }}</h2>
                <span class="text-xs text-gray-500 rounded-md bg-gray-200 px-2 py-[2px] text-center">
                  {{ floors.length }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <button :disabled="!selectedHotel" @click="handleCreateObject('floor', selectedHotel?.id)"
                  class="text-xs rounded-md border border-gray-300 text-center hover:bg-gray-100 cursor-pointer duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 12H12M12 12H9M12 12V9M12 12V15" stroke="#1C274C" stroke-width="1.5"
                      stroke-linecap="round" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="text-sm text-gray-500 mb-2">
              {{ selectedHotel?.name }}
            </div>
          </div>
          <FloorItem :pathFilterActive="pathFilterActive" @onSelect="handleFloorClick(floor)"
            @onDelete="handleDeleteObject(floor)" v-for="floor in floors" :key="floor.id" :floor="floor"
            :selectedData="selectedFloor" @onFind="handleFindObject" @onSave="handleSaveObject" />
        </div>
        <div class="col-span-1 flex flex-col gap-2">
          <div class="h-12">
            <div class="flex items-center gap-2">
              <div class="flex items-center w-full gap-2">
                <h2 class="font-semibold">{{ selectedFloor?.name }}</h2>
                <span class="text-xs text-gray-500 rounded-md bg-gray-200 px-2 py-[2px] text-center">
                  {{ rooms.length }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <button :disabled="!selectedFloor" @click="handleCreateObject('room', selectedFloor?.id)"
                  class="text-xs rounded-md border border-gray-300 text-center hover:bg-gray-100 cursor-pointer duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 12H12M12 12H9M12 12V9M12 12V15" stroke="#1C274C" stroke-width="1.5"
                      stroke-linecap="round" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="text-sm text-gray-500">
              {{ selectedHotel?.name }}
            </div>
          </div>
          <RoomItem :pathFilterActive="pathFilterActive" @onSelect="handleRoomClick(room)"
            @onDelete="handleDeleteObject(room)" v-for="room in rooms" :key="room.id" :room="room"
            :selectedData="selectedRoom" @onFind="handleFindObject" @onSave="handleSaveObject" />
        </div>
        <div class="col-span-1 flex flex-col gap-2">
          <div class="h-12">
            <div class="flex items-center gap-2">
              <div class="flex items-center w-full gap-2">
                <h2 class="font-semibold">{{ selectedRoom?.name }}</h2>
              </div>
              <div class="flex items-center gap-2">
                <button :disabled="!selectedRoom" @click="handleCreateObject('object', selectedRoom?.id)"
                  class="text-xs rounded-md border border-gray-300 text-center hover:bg-gray-100 cursor-pointer duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 12H12M12 12H9M12 12V9M12 12V15" stroke="#1C274C" stroke-width="1.5"
                      stroke-linecap="round" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="text-sm text-gray-500">
              {{ selectedHotel?.name }} - {{ selectedFloor?.name }}
            </div>
          </div>
          <ObjectItem :pathFilterActive="pathFilterActive" @onSelect="handleObjectClick(object)"
            @onDelete="handleDeleteObject(object)" v-for="object in objects" :key="object.id" :object="object"
            :selectedData="selectedObject" @onFind="handleFindObject" @onSave="handleSaveObject" />
        </div>
      </div>
    </div>
    <Modal id="create" @onClose="closeModalCreate" :open="isOpenModalCreate">
      <template #header>
        <h2 class="text-2xl font-bold">Create {{ modalCreateType }}</h2>
      </template>
      <template #content>
        <ObjectForm @onSave="onCreateObject" @onClose="closeModalCreate" :type="modalCreateType"
          :parentId="modalCreateParentId" />
      </template>
    </Modal>
  </main>
</template>
