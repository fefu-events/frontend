<template>
  <div>
    <div class="w-20 h-20 bg-orange-500" @click="SignIn">
      {{ account?.name }}
    </div>
    <div class="w-20 h-20 bg-red-500" @click="SignOut"></div>
  </div>
</template>

<script>
import { PublicClientApplication } from "@azure/msal-browser";
import { mapGetters } from "vuex";

export default {
  name: "AuthButtonComponent",
  components: {},

  data() {
    return {
      account: undefined,
      request: {
        scopes: [
          "api://4793bb1a-a0d2-46ec-8af5-5509bf011a32/user_impersonation",
        ],
      },
    };
  },

  async created() {
    this.$msalInstance = new PublicClientApplication(this.getMsalConfig);
  },

  computed: {
    ...mapGetters(["getMsalConfig", "getAccessToken"]),
  },

  async mounted() {
    const accounts = this.$msalInstance.getAllAccounts();
    if (accounts.length == 0) {
      return;
    }
    this.account = accounts[0];

    this.$msalInstance.setActiveAccount(this.account);
    let tokenResponse = await this.$msalInstance.acquireTokenSilent(
      this.request
    );
    this.$store.commit("setAccessToken", tokenResponse.accessToken);
  },

  methods: {
    async SignIn() {
      await this.$msalInstance
        .loginPopup(this.request)
        .then((data) => {
          const myAccounts = this.$msalInstance.getAllAccounts();
          this.account = myAccounts[0];
          this.$store.commit("setAccessToken", data.accessToken);
        })
        .catch((error) => {
          console.error(`error during authentication: ${error}`);
        });

      fetch("http://localhost:8000/user/register", {
        method: "get",
        headers: new Headers({
          Authorization: `Bearer ${this.getAccessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        }),
      });
    },
    async SignOut() {
      await this.$msalInstance
        .logoutPopup({})
        .then(() => {
          this.account = undefined;
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
