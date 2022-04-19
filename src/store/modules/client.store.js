import api from "@/service/api";

export default {
  state: () => ({
    forceUpdateEventList: false,
    forceUpdateOrganizationList: false,
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

    async SET_FORCE_UPDATE_EVENT_LIST({ commit }, payload) {
      commit("forceUpdateEventList", payload);
    },

    async SET_FORCE_UPDATE_ORG_LIST({ commit }, payload) {
      commit("forceUpdateOrganizationList", payload);
    },
  },

  mutations: {
    categories(state, payload) {
      state.categories = payload;
    },
    places(state, payload) {
      state.places = payload;
    },
    forceUpdateEventList(state, payload) {
      state.forceUpdateEventList = payload;
    },
    forceUpdateOrganizationList(state, payload) {
      state.forceUpdateOrganizationList = payload;
    },
  },

  namespaced: true,
};
