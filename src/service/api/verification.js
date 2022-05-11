import axios from "axios";

const endpoints = {
  organizationVerify: (token, organizationID) =>
    axios.post(
      `/api/organization/${organizationID}/verification`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),
  organizationUnverify: (token, organizationID) =>
    axios.delete(`/api/organization/${organizationID}/verification`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default endpoints;
