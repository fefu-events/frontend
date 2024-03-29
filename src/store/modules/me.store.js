import api from "@/service/api";

export default {
  state: () => ({
    user: {},
    accessToken: "",
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

    LOGOUT({ commit }) {
      commit("accessToken", undefined);
      commit("user", null);
    },

    async SET_NEW_ORGANIZATIONS({ commit }, token) {
      const orgs = await api.me
        .get(token)
        .then(({ data }) => data.organizations);
      commit("user_organizations", orgs);
    },

    async SET_NEW_TAGS({ commit }, tags) {
      commit("user_tags", tags);
    },
  },

  getters: {
    statusPermissions: (state) => {
      return state.user.is_admin || state.user.is_moderator;
    },
  },

  mutations: {
    user_organizations(state, payload) {
      state.user.organizations = payload;
    },
    user(state, payload) {
      state.user = payload;
    },
    user_tags(state, payload) {
      state.user.tags = payload;
    },
    accessToken(state, payload) {
      state.accessToken = payload;
    },
  },

  namespaced: true,
};
