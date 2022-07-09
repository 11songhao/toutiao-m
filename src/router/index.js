import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
//路由表
const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("@/views/login/index.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
