<template>
  <LeftSidebar class="absolute" />
  <LiveMap class="w-screen h-screen" />
</template>

<script>
import LiveMap from "@/components/LiveMap.vue";
import LeftSidebar from "@/components/LeftSidebar.vue";

export default {
  name: "MapView",
  components: {
    LiveMap,
    LeftSidebar,
  },
};
</script>
