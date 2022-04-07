export default {
  state: {
    query: "",
    followToggle: false,
    recommendToggle: false,
    categories: [],
    date: null,
    places: [],
  },

  actions: {
    UPDATE_FILTER({ commit }, payload) {
      commit("setNewFilter", payload);
    },
  },

  getters: {
    GET_FILTER: (state) => {
      return state;
    },
  },

  mutations: {
    async setNewFilter(state, payload) {
      state[payload.key] = payload.value;
    },
  },
};
