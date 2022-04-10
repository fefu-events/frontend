<template>
  <router-view />
</template>

<script>
export default {
  name: "App",

  async created() {
    await this.$store.dispatch("client/SET_CATEGORIES");
    await this.$store.dispatch("client/SET_PLACES");
  },
};
</script>
