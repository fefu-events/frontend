import axios from "axios";

const endpoints = {
  part: (token, eventID) =>
    axios.post(
      `/api/event/${eventID}/participant/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),

  nonpart: (token, eventID) =>
    axios.delete(`/api/event/${eventID}/participant/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default endpoints;
