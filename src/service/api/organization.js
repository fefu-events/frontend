import axios from "axios";

const endpoints = {
  create: (token, data) =>
    axios.post(
      `/api/organization/`,
      {
        title: data.title,
        description: data.description,
        members_ids: data.members.map((member) => member.id),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),

  update: (token, data, organizationID) =>
    axios.put(
      `/api/organization/${organizationID}/`,
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
    axios.delete(`/api/organization/${organizationID}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  getByOrganizationID: (organizationID, token) =>
    axios.get(`/api/organization/${organizationID}/`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  promoteMember: (token, memberID, organizationID) =>
    axios.post(
      `/api/organization/${organizationID}/transfer-ownership/`,
      {
        user_id: memberID,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),

  addMember: (token, organizationID, userID) =>
    axios.post(
      `/api/organization/${organizationID}/member/`,
      {},
      {
        params: {
          user_id: userID,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),

  removeMember: (token, organizationID, userID) =>
    axios.delete(`/api/organization/${organizationID}/member/`, {
      data: {
        user_id: userID,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default endpoints;
