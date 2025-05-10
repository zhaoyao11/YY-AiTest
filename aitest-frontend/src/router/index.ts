import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

//添加路由守卫
router.beforeEach((to, from, next) => {
  //判断用户是否登录
  const isUserLogin = localStorage.getItem("loginUser") !== null;

  //如果进入的是首页
  if (to.path === "/" || to.path.startsWith("/app/detail")) {
    next();
  } else {
    if (to.path !== "/user/login" && !isUserLogin) {
      next({ path: "/user/login" });
    } else {
      next();
    }
  }
});

export default router;
