import axios from "axios";

const endpoints = {
  part: (token, event_id) =>
    axios.post(
      `/api/event/${event_id}/participant/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),

  nonpart: (token, event_id) =>
    axios.delete(`/api/event/${event_id}/participant/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default endpoints;
