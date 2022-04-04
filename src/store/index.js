import { createStore } from "vuex";
import auth from "./modules/auth.store";

const debug = process.env.NODE_ENV !== "production";

export default createStore({
  modules: {
    auth,
  },
  strict: debug,
});
