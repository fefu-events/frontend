export default {
  state: () => ({
    query: "",
    followToggle: false,
    recommendToggle: false,
    categories: [],
    date: null,
    places: [],
  }),

  actions: {
    UPDATE_FILTER({ commit }, payload) {
      commit("setNewFilter", payload);
    },
  },

  mutations: {
    async setNewFilter(state, payload) {
      state[payload.key] = payload.value;
    },
  },

  namespaced: true,
};
