<template>
  <Sidebar />
  <LiveMap class="w-screen h-screen" />
</template>

<script>
import LiveMap from "@/components/LiveMap.vue";
import Sidebar from "@/components/Sidebar.vue";

export default {
  name: "MapView",
  components: {
    LiveMap,
    Sidebar,
  },
};
</script>
