export default {
  state: {
    accessToken: "",
  },

  getters: {
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
