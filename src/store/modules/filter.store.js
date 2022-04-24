export default {
  state: () => ({
    query: "",
    followToggle: false,
    recommendToggle: false,
    categories: [],
    date: null,
    places: [],

    cachePlaces: null,
  }),

  actions: {
    UPDATE_FILTER({ commit }, payload) {
      commit("updateFilter", payload);
    },
    SET_MAP_PLACE({ commit }, payload) {
      commit("setMapPlace", payload);
    },
  },

  getters: {
    filterParams(state) {
      return {
        query: state.query,
        followToggle: state.followToggle,
        recommendToggle: state.recommendToggle,
        categories: state.categories,
        date: state.date,
        places: state.places,
      };
    },
  },

  mutations: {
    updateFilter(state, payload) {
      state[payload.key] = payload.value;
    },

    setMapPlace(state, payload) {
      if (payload) {
        state.cachePlaces = { cachePlaces: state.places, mapPlace: payload };
        state.places = [payload];
      } else {
        state.places = state.cachePlaces.cachePlaces;
        state.cachePlaces = null;
      }
    },
  },

  namespaced: true,
};
