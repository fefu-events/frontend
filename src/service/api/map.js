import axios from "axios";

const endpoints = {
  getInfo: (data, user) => {
    const queryParams = {
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

    return axios.get("/api/map/", {
      params: queryParams,
    });
  },

  getByPlaceID: (skip, data, place, user) => {
    const queryParams = {
      skip: skip,
      limit: 10,
      title: data.query,
      for_user_id: user?.id,
      category_ids: data.categories,
      place_ids: [place],
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
};

export default endpoints;
