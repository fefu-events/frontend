<template>
  <div class="home">
    <img class="mx-auto h-20 mb-5" alt="Vue logo" :src="logo" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import Logo from "@/assets/img/svg/logo.svg";

export default {
  name: "HomeView",
  components: {
    HelloWorld,
  },
  data() {
    return {
      logo: Logo,
    };
  },
};
</script>
