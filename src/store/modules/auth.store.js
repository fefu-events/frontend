import api from "@/service/api";

export default {
  state: () => ({
    user: null,
    accessToken: null,
  }),

  actions: {
    async LOGIN({ commit }, token) {
      const { data } = await api.user.exist(token);
      const response = data?.exist
        ? await api.user.get(token)
        : await api.user.register(token);
      commit("login", { token, user: response?.data });
    },

    LOGOUT({ commit }) {
      commit("logout");
    },
  },

  getters: {
    getUser(state) {
      return state.user;
    },
  },

  mutations: {
    login(state, payload) {
      state.accessToken = payload.token;
      state.user = payload.user;
    },
    logout(state) {
      state.accessToken = undefined;
      state.user = null;
    },
  },

  namespaced: true,
};
