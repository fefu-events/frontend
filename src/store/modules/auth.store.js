import api from "@/service/api";

export default {
  state: () => ({
    user: null,
    accessToken: null,
  }),

  actions: {
    async LOGIN({ commit }, token) {
      const isExist = await api.me.exist(token).then(({ data }) => data.exist);
      const response = isExist
        ? await api.me.get(token)
        : await api.me.register(token);
      commit("accessToken", token);
      commit("user", response?.data);
    },

    async SET_NEW_ORGANIZATIONS({ commit }, token) {
      const orgs = await api.me
        .get(token)
        .then(({ data }) => data.organizations);
      commit("user_organizations", orgs);
    },

    LOGOUT({ commit }) {
      commit("accessToken", undefined);
      commit("user", null);
    },
  },

  mutations: {
    user_organizations(state, payload) {
      state.user.organizations = payload;
    },
    user(state, payload) {
      state.user = payload;
    },
    accessToken(state, payload) {
      state.accessToken = payload;
    },
  },

  namespaced: true,
};
