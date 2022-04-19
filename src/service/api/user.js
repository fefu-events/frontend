import axios from "axios";

const endpoints = {
  getAll: (skip, query) =>
    axios.get("/api/user", {
      params: {
        skip: skip,
        limit: 10,
        search_query: query,
      },
    }),
  getByUserID: (userID) => axios.get(`/api/user/${userID}`),
};

export default endpoints;
