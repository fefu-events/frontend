import { createStore } from "vuex";
import me from "./modules/me.store";
import filter from "./modules/filter.store";
import client from "./modules/client.store";

const debug = process.env.NODE_ENV !== "production";

export default createStore({
  modules: {
    me,
    client,
    filter,
  },
  strict: debug,
});
