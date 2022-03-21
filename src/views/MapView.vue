<template>
  <div></div>
  <LiveMap class="w-screen h-screen" />
</template>

<script>
// @ is an alias to /src
import LiveMap from "@/components/LiveMap.vue";

export default {
  name: "HomeView",
  components: {
    LiveMap,
  },
};
</script>
