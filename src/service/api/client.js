import axios from "axios";

const endpoints = {
  getPlaces: () => axios.get("/api/place/"),
  getCategories: () => axios.get("/api/category/"),
};

export default endpoints;
