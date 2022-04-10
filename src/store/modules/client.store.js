import api from "@/service/api";

export default {
  state: () => ({
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
  },

  namespaced: true,
};
