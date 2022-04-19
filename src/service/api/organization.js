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
};

export default endpoints;
