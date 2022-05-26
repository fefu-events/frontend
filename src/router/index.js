import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/pages/MapView.vue"),
    meta: {
      title: "Map",
    },
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/views/pages/MapView.vue"),
    meta: {
      title: "About",
    },
  },
  {
    path: "/:catchAll(.*)",
    name: "404",
    redirect: { name: "home" },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

export default router;
