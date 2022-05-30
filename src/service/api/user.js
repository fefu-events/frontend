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

  getByUserID: (userID, token) =>
    axios.get(`/api/user/${userID}/`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
};

export default endpoints;
