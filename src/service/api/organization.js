import axios from "axios";

const endpoints = {
  create: (token, data) =>
    axios.post(
      `/api/organization/`,
      {
        title: data.title,
        description: data.description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),

  update: (token, data, organizationID) =>
    axios.put(
      `/api/organization/${organizationID}`,
      {
        title: data.title,
        description: data.description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),

  delete: (token, organizationID) =>
    axios.delete(`/api/organization/${organizationID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  getByID: (organizationID) => axios.get(`/api/organization/${organizationID}`),

  addMember: (token, organizationID, userID) => {
    axios.post(
      `/api/organization/${organizationID}/member`,
      {
        user_id: userID,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  removeMember: (token, organizationID, userID) =>
    axios.delete(`/api/organization/${organizationID}/member`, {
      data: {
        user_id: userID,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default endpoints;
