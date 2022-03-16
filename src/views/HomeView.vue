<template>
  <div class="home">
    <img
      class="mx-auto h-20 mb-5"
      alt="Vue logo"
      src="../assets/img/logo.svg"
    />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "HomeView",
  components: {
    HelloWorld,
  },
};
</script>
