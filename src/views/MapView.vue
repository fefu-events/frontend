<template>
  <Sidebar :singleEvent="singleEvent" />
  <LiveMap class="w-screen h-screen" @setSingleEvent="setSingleEvent" />
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

  data() {
    return {
      singleEvent: null,
    };
  },

  methods: {
    setSingleEvent(eventID) {
      this.singleEvent = eventID;
    },
  },
};
</script>
