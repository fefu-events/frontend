<template>
  <div class="home">
    <img
      class="mx-auto h-20 mb-5"
      alt="Vue logo"
      src="../assets/img/logo.svg"
    />
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <LiveMap class="w-full" />
  </div>
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
