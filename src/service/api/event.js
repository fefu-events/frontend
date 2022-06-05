import axios from "axios";

const endpoints = {
  create: (token, data) =>
    axios.post(
      "/api/event/",
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
  update: (token, data, eventID) =>
    axios.put(
      `/api/event/${eventID}/`,
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

  delete: (token, eventID) =>
    axios.delete(`/api/event/${eventID}/`, {
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

    return axios.get("/api/event/", {
      params: queryParams,
    });
  },

  getByUserID: (skip, userID) =>
    axios.get("/api/event/", {
      params: {
        skip: skip,
        limit: 10,
        user_id: userID,
        archived: true,
      },
    }),

  getByOrganizationID: (skip, organizationID, query) =>
    axios.get("/api/event/", {
      params: {
        skip: skip,
        limit: 10,
        title: query,
        organization_id: organizationID,
      },
    }),

  getByEventID: (eventID, token) => {
    return axios.get(`/api/event/${eventID}/`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
};

export default endpoints;
