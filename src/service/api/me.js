import axios from "axios";

const endpoints = {
  exist: (token) =>
    axios.get("/api/current-user-exist/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  get: (token) =>
    axios.get("/api/me/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  register: (token) =>
    axios.post(
      "/api/me/",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),
};

export default endpoints;
