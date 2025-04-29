import ACCESS_ENUM from "@/access/accessEnum";
import AddAppView from "@/views/add/AddAppView.vue";
import AddQuestionView from "@/views/add/AddQuestionView.vue";
import AddScoringView from "@/views/add/AddScoringView.vue";
import AdminAnswerView from "@/views/admin/AdminAnswerView.vue";
import AdminAppView from "@/views/admin/AdminAppView.vue";
import AdminQuestionView from "@/views/admin/AdminQuestionView.vue";
import AdminScoreView from "@/views/admin/AdminScoreView.vue";
import AdminUserView from "@/views/admin/AdminUserView.vue";
import AnswerResultView from "@/views/answer/AnswerResultView.vue";
import DoAnswerView from "@/views/answer/DoAnswerView.vue";
import MyAnswerView from "@/views/answer/MyAnswerView.vue";
import AppDetailView from "@/views/app/AppDetailView.vue";
import HomeView from "@/views/HomeView.vue";
import UserLoginView from "@/views/user/UserLoginView.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";

import { RouteRecordRaw } from "vue-router";
export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "首页",
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
    component: AdminUserView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: "/admin/app",
    name: "应用管理页面",
    component: AdminAppView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: "/admin/score",
    name: "评分管理页面",
    component: AdminScoreView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: "/admin/answer",
    name: "回答管理页面",
    component: AdminAnswerView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: "/admin/question",
    name: "题目管理页面",
    component: AdminQuestionView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: "/app/detail/:appId",
    name: "应用详情页面",
    component: AppDetailView,
    props: true,
    meta: {
      isHidden: true,
    },
  },
  {
    path: "/add/question/:appId",
    name: "设置题目页面",
    component: AddQuestionView,
    props: true,
    meta: {
      isHidden: true,
    },
  },
  {
    path: "/add/app/:id",
    name: "创建应用",
    component: AddAppView,
    props: true,
  },
  {
    path: "/add/score/:appId",
    name: "修改评分页面",
    component: AddScoringView,
    props: true,
    meta: {
      isHidden: true,
    },
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
    path: "/do/answer/:appId",
    name: "做题页面",
    component: DoAnswerView,
    props: true,
    meta: {
      isHidden: true,
    },
  },
  {
    path: "/answer/result/:data",
    name: "结果页面",
    component: AnswerResultView,
    props: true,
    meta: {
      isHidden: true,
    },
  },
  {
    path: "/my/answer",
    name: "我的答题",
    component: MyAnswerView,
  },
  {
    path: "/hide",
    name: "隐藏页面",
    component: HomeView,
    meta: {
      isHidden: true,
      access: ACCESS_ENUM.USER,
    },
  },
];
