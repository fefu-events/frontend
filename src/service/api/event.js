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
        url: data.link ? data.link : null,
        place_id: data.selectedPlace,
        category_id: data.selectedCategory,
        organization_id: data.selectedOrganization,
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
        url: data.link ? data.link : null,
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

  getAll: (skip, data, user) => {
    const queryParams = {
      skip: skip,
      limit: 10,
      title: data.query,
      for_user_id: user?.id,
      category_ids: data.categories,
      place_ids: data.places,
      subscriptions: data.followToggle,
      personalize_tags: data.recommendToggle,
    };
    if (data.date) {
      if (data.date.start) {
        queryParams["date_begin"] = data.date.start;
      } else {
        queryParams["date_begin"] = data.date;
      }
      if (data.date.end) {
        queryParams["date_end"] = data.date.end;
      }
    }

    return axios.get("/api/event", {
      params: queryParams,
    });
  },

  getByUserID: (skip, user_id) =>
    axios.get("/api/event", {
      params: {
        skip: skip,
        limit: 10,
        user_id: user_id,
      },
    }),

  getByOrganizationID: (skip, organization_id, query) =>
    axios.get("/api/event", {
      params: {
        skip: skip,
        limit: 10,
        title: query,
        organization_id: organization_id,
      },
    }),

  getByEventID: (id, token) => {
    return axios.get(`/api/event/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
};

export default endpoints;
