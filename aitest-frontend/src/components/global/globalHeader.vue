<template>
  <a-row class="grid-demo" style="margin-bottom: 16px" :wrap="false">
    <a-col flex="100px">
      <div
        class="icon-logo"
        @click="$router.push({ path: '/' })"
        style="cursor: pointer"
      >
        <img src="@/assets/logo.png" alt="logo" style="width: 32px" />
        <span style="font-weight: bolder; margin-left: 8px">YY-Test</span>
      </div>
    </a-col>
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="currentMenu"
        @menu-item-click="onClickMenu"
      >
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">{{
          item.name
        }}</a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <div>
        <template v-if="userInfo.id">
          <a-dropdown @select="handleSelect">
            <a-avatar>
              <img alt="avatar" :src="userInfo.userAvatar" />
            </a-avatar>
            <span style="font-weight: bolder">
              {{ userInfo.userName }}
            </span>
            <template #content>
              <a-doption @click="onClickUserInfo">个人信息</a-doption>
              <a-doption @click="onLoginOut">退出登录</a-doption>
            </template>
          </a-dropdown>
        </template>
        <template v-else>
          <a-button @click="router.push({ path: '/user/login' })" type="primary"
            >登录</a-button
          >
        </template>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { ref, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { routes } from "@/router/routes";
import { useLoginUserStore } from "@/store/userStore";
import API from "@/api";
import checkAccess from "@/access/checkAccess";
//向父组件传递
const emit = defineEmits(["show-modal"]);
//当前选中的菜单项
const currentMenu = ref<string[]>(["/"]);
const router = useRouter();
//用户信息
const userInfo = ref<API.LoginUserVO>({});
//获取用户登录信息
const loginUserStore = useLoginUserStore();
userInfo.value = loginUserStore.loginUser;

//路由跳转时，自动更新选中的菜单项
router.afterEach((to) => {
  currentMenu.value = [to.path];
});
//获取非隐藏页面菜单
const visibleRoutes = routes.filter((item) => {
  if (item.meta?.isHidden) {
    return false;
  }
  //根据权限过滤菜单
  if (!checkAccess(loginUserStore.loginUser, item.meta?.access as string)) {
    return false;
  }
  return true;
});

//点击菜单选项后跳转路由
const onClickMenu = (key: string) => {
  router.push({
    path: key,
  });
};
//点击用户详情
const handleSelect = () => {
  console.log("下拉菜单展开");
};
//点击个人信息
const onClickUserInfo = () => {
  //向父组件发送事件
  emit("show-modal");
};
//点击退出登录
const onLoginOut = () => {
  loginUserStore.logout();
  //点击后页面自动刷新
  window.location.reload();
};
</script>

<style scoped>
.icon-logo {
  display: flex;
  align-items: center;
  justify-content: center;
}
.grid-demo {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
