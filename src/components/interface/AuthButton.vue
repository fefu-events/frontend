<template>
  <div>
    <div class="w-20 h-20 bg-orange-500" @click="SignIn">
      <!-- {{ account?.name }} -->
    </div>
    <div class="w-20 h-20 bg-red-500" @click="SignOut"></div>
    <div class="w-20 h-20 bg-pink-400" @click="SignOut">OK</div>
  </div>
</template>

<script>
export default {
  name: "AuthButtonComponent",
  components: {},

  data() {
    return {};
  },

  async mounted() {
    const response = await this.$msal.setActiveAccount();
    this.$store.commit("setAccessToken", response);
  },

  methods: {
    async SignIn() {
      const response = await this.$msal.signIn();
      this.$store.commit("setAccessToken", response);
    },
    async SignOut() {
      await this.$msal.signOut();
      this.$store.commit("setAccessToken", undefined);
    },
  },
};
</script>
