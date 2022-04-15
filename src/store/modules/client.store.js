import api from "@/service/api";

export default {
  state: () => ({
    forceUpdateList: false,
    categories: [],
    places: [],
  }),

  actions: {
    async SET_CATEGORIES({ commit }) {
      const { data } = await api.client.getCategories();
      commit("categories", data);
    },

    async SET_PLACES({ commit }) {
      const { data } = await api.client.getPlaces();
      commit("places", data);
    },

    async SET_FORCE_UPDATE_LIST({ commit }, payload) {
      commit("forceUpdateList", payload);
    },
  },

  getters: {
    getPlaces(state) {
      return state.places;
    },
    getCategories(state) {
      return state.categories;
    },
  },

  mutations: {
    categories(state, payload) {
      state.categories = payload;
    },
    places(state, payload) {
      state.places = payload;
    },
    forceUpdateList(state, payload) {
      state.forceUpdateList = payload;
    },
  },

  namespaced: true,
};
