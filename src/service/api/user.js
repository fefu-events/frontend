import axios from "axios";

const endpoints = {
  getAll: (skip, query) =>
    axios.get("/api/user/", {
      params: {
        skip: skip,
        limit: 10,
        search_query: query,
      },
    }),

  getModerators: () =>
    axios.get("/api/user/", {
      params: {
        skip: 0,
        limit: 100,
      },
    }),

  getByUserID: (userID, token) =>
    axios.get(`/api/user/${userID}/`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
};

export default endpoints;
