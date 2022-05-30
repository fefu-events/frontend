import axios from "axios";

const endpoints = {
  getModerators: (token) =>
    axios.get("/api/user/", {
      params: {
        skip: 0,
        limit: 100,
        moderator: true,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  addModerator: (token, userID) =>
    axios.post(
      `/api/user/${userID}/set-access/`,
      {
        is_moderator: true,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),

  removeModerator: (token, userID) =>
    axios.post(
      `/api/user/${userID}/set-access/`,
      {
        is_moderator: false,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),
};

export default endpoints;
