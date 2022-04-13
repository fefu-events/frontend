import axios from "axios";

const endpoints = {
  create: (token, data) =>
    axios.post(
      "/api/event",
      {
        title: data.title,
        description: data.description,
        date_begin: data.date.start,
        date_end: data.date.end,
        place_description: data.placeDescription,
        tags: data.tags ? data.tags.split(" ").filter(Boolean) : [],
        place_id: data.selectedPlace,
        category_id: data.selectedCategory,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),
  update: (token, data, id) =>
    axios.put(
      `/api/event/${id}`,
      {
        title: data.title,
        description: data.description,
        date_begin: data.date.start,
        date_end: data.date.end,
        place_description: data.placeDescription,
        tags: data.tags ? data.tags.split(" ").filter(Boolean) : [],
        place_id: data.selectedPlace,
        category_id: data.selectedCategory,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),

  delete: (token, id) =>
    axios.delete(`/api/event/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  getByID: (id) => axios.get(`/api/event/${id}`),
};

export default endpoints;
