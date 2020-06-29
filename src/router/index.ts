import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/editor/1"
  },
  {
    path: "/editor/:id",
    name: "Editor",
    component: () =>
      import(/* webpackChunkName: "playground" */ "../views/Editor/index.vue"),
    props: router => {
      return {
        id: router.params.id
      };
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
