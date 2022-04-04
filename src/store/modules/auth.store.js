export default {
  state: {
    msalConfig: {
      auth: {
        clientId: process.env.VUE_APP_AAD_CLIENT_ID,
        authority: `${process.env.VUE_APP_AAD_TENANT_NAME}/${process.env.VUE_APP_AAD_TENANT_ID}`,
      },
      cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: true,
        secureCookies: true,
      },
    },
    accessToken: "",
  },

  getters: {
    getMsalConfig: (state) => {
      return state.msalConfig;
    },
    getAccessToken: (state) => {
      return state.accessToken;
    },
  },

  mutations: {
    setAccessToken(state, token) {
      state.accessToken = token;
    },
  },
};
