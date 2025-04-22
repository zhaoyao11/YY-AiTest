import AdminManageView from "@/views/admin/AdminManageView.vue";
import HomeView from "@/views/HomeView.vue";
import UserLoginView from "@/views/user/UserLoginView.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";

import { RouteRecordRaw } from "vue-router";
export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/user/login",
    name: "登录页面",
    component: UserLoginView,
    meta: {
      isHidden: true,
    },
  },
  {
    path: "/admin",
    name: "管理页面",
    component: AdminManageView,
  },

  {
    path: "/user/register",
    name: "注册页面",
    component: UserRegisterView,
    meta: {
      isHidden: true,
    },
  },
  {
    path: "/hide",
    name: "隐藏页面",
    component: HomeView,
    meta: {
      isHidden: true,
    },
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];
