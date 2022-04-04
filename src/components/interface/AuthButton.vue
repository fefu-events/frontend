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
    };
  },

  async created() {
    this.$msalInstance = new PublicClientApplication(this.getMsalConfig);
    this.$emitter.on(
      "login",
      async function (account) {
        this.account = account;
        console.log(this.account);
      }.bind(this)
    ),
      this.$emitter.on("logout", () => {
        console.log("logging out");
        this.account = undefined;
      });
  },

  computed: {
    ...mapGetters(["getMsalConfig", "getAccessToken"]),
  },

  async mounted() {
    let request = {
      scopes: ["api://4793bb1a-a0d2-46ec-8af5-5509bf011a32/user_impersonation"],
    };
    const accounts = this.$msalInstance.getAllAccounts();
    if (accounts.length == 0) {
      return;
    }
    this.account = accounts[0];

    this.$emitter.emit("login", this.account);
    this.$msalInstance.setActiveAccount(this.account);
    let tokenResponse = await this.$msalInstance.acquireTokenSilent(request);
    this.$store.commit("setAccessToken", tokenResponse.accessToken);
  },

  methods: {
    async SignIn() {
      let request = {
        scopes: [
          "api://4793bb1a-a0d2-46ec-8af5-5509bf011a32/user_impersonation",
        ],
      };
      await this.$msalInstance
        .loginPopup(request)
        .then((data) => {
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
      const accounts = this.$msalInstance.getAllAccounts();
      if (accounts.length == 0) {
        return;
      }
      this.account = accounts[0];
    },
    async SignOut() {
      await this.$msalInstance
        .logoutPopup({})
        .then(() => {
          this.$emitter.emit("logout", "logging out");
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
