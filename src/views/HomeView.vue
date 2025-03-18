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
const VITE_API_URL = import.meta.env.VITE_API_URL;
const hotels = ref([]);
const floors = ref([]);
const rooms = ref([]);
const objects = ref([]);
const selectedHotel = ref(null);
const selectedFloor = ref(null);
const selectedRoom = ref(null);
const isOpenModalCreate = ref(false);
const modalCreateType = ref(null);
const modalCreateParentId = ref(null);
onMounted(() => {
  getHotels();
});

const getHotels = async () => {
  await axios.get(`${VITE_API_URL}/object/tree?limit=100&offset=0`)
    .then((response) => {
      hotels.value = response.data;
      handleHotelClick(selectedHotel.value || hotels.value[0]);
    }).catch((error) => {
      console.error("Error fetching hotels:", error);
    });
}

const getObjectDetails = async () => {
  if (!selectedRoom.value) return;
  await axios.get(`${VITE_API_URL}/object/${selectedRoom.value.id}?include_children=true&include_datapoints=true`)
    .then((response) => {
      objects.value = response.data;
    }).catch((error) => {
      console.error("Error fetching objects:", error);
    });
}

const handleHotelClick = (hotel) => {
  selectedHotel.value = hotel;
  floors.value = hotel?.children || [];
  const checkFloor = floors.value.find(floor => floor.id === selectedFloor.value?.id);
  handleFloorClick(checkFloor || floors.value[0] || null);
}

const handleFloorClick = (floor) => {
  selectedFloor.value = floor;
  rooms.value = floor?.children || [];
  const checkRoom = rooms.value.find(room => room.id === selectedRoom.value?.id);
  handleRoomClick(checkRoom || rooms.value[0] || null);
}

const handleRoomClick = async (room) => {
  selectedRoom.value = room;
  getObjectDetails();
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
  await axios.post(`${VITE_API_URL}/object`, data)
    .then(() => {
      getHotels();
    }).catch((error) => {
      console.error("Error creating hotel:", error);
    });
  closeModalCreate();
};

const handleDeleteObject = async (object) => {
  await axios.delete(`${VITE_API_URL}/object/${object.id}`).then(async () => {
    await getHotels();
  }).catch((error) => {
    console.error(error);
  });
}
</script>

<template>
  <main class="grid grid-cols-[60px_1fr] h-screen">
    <MenuSide />
    <div class="w-full h-full text-base">
      <PageTitle title="Hotels Management" :breadcrumb="['Home', 'Hotels']" />
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
          <HotelsItem @onSelect="handleHotelClick(hotel)" v-for="hotel in hotels" :key="hotel?.id" :hotel="hotel"
            :selected="selectedHotel?.id === hotel?.id" @onDelete="handleDeleteObject(hotel)" />
        </div>
        <div class="col-span-1 flex flex-col gap-2">
          <div class="h-12">
            <div class="flex items-center gap-2">
              <div class="flex items-center w-full gap-2">
                <h2 class="font-semibold">Floors</h2>
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
          <FloorItem @onSelect="handleFloorClick(floor)" @onDelete="handleDeleteObject(floor)" v-for="floor in floors"
            :key="floor.id" :floor="floor" :selected="selectedFloor?.id === floor?.id" />
        </div>
        <div class="col-span-1 flex flex-col gap-2">
          <div class="h-12">
            <div class="flex items-center gap-2">
              <div class="flex items-center w-full gap-2">
                <h2 class="font-semibold">Rooms</h2>
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
              {{ selectedHotel?.name }} - {{ selectedFloor?.name }}
            </div>
          </div>
          <RoomItem @onSelect="handleRoomClick(room)" @onDelete="handleDeleteObject(room)" v-for="room in rooms"
            :key="room.id" :room="room" :selected="selectedRoom?.id === room?.id" />
        </div>
        <div v-if="selectedRoom && objects" class="col-span-2 flex flex-col gap-2">
          <div class="h-12">
            <div class="flex items-center gap-2">
              <h2 class="font-semibold">{{ objects.name }}</h2>
            </div>
            <div class="text-sm text-gray-500">
              {{ selectedHotel?.name }} - {{ selectedFloor?.name }} - {{ selectedRoom?.name }}
            </div>
          </div>
          <div class="card-item active rounded-lg p-2 ">
            <div class="flex items-center gap-2 text-[10px] mb-4 ">
              <span>{{ objects.type }}</span>
              <span v-if="objects.location_details">{{ objects.location_details.purpose }}</span>
              <span v-if="objects.location_details">{{ objects.location_details.size }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <div v-for="datapoint in objects.datapoints" :key="datapoint.id" class="flex items-center text-xs">
                <ul>
                  <li>{{ datapoint.name }}: {{ datapoint.value }} {{ datapoint.unit }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal id="create" @onClose="closeModalCreate" :open="isOpenModalCreate">
      <template #header>
        <h2 class="text-2xl font-bold">Create {{ modalCreateType }}</h2>
      </template>
      <template #content>
        <ObjectForm @save="onCreateObject" @onClose="closeModalCreate" :type="modalCreateType"
          :parentId="modalCreateParentId" />
      </template>
    </Modal>
  </main>
</template>
