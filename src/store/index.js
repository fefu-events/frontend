import { createStore } from "vuex";
import auth from "./modules/auth.store";
import filter from "./modules/filter.store";

const debug = process.env.NODE_ENV !== "production";

export default createStore({
  modules: {
    auth,
    filter,
  },
  strict: debug,
});
