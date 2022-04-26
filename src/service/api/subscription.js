import axios from "axios";

const endpoints = {
  getFollowersByUserID: (userID) =>
    axios.get(`/api/user/${userID}/followers/`),

  getFollowingByUserID: (userID) =>
    axios.get(`/api/user/${userID}/following/`),

  addOrganization: (token, organizationID) =>
    axios.post(
      `/api/organization/${organizationID}/follow/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),

  addUser: (token, userID) =>
    axios.post(
      `/api/user/${userID}/follow/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),

  removeOrganization: (token, organizationID) =>
    axios.delete(`/api/organization/${organizationID}/unfollow/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  removeUser: (token, userID) =>
    axios.delete(`/api/user/${userID}/unfollow/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default endpoints;
