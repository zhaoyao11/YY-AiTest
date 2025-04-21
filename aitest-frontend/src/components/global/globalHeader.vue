<template>
  <a-row class="grid-demo" style="margin-bottom: 16px" :wrap="false">
    <a-col flex="100px">
      <div class="icon-logo">
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
        <a-button type="primary">登录</a-button>
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { routes } from "@/router/routes";
//当前选中的菜单项
const currentMenu = ref<string[]>(["/"]);
const router = useRouter();
//路由跳转时，自动更新选中的菜单项
router.afterEach((to) => {
  currentMenu.value = [to.path];
});
//获取非隐藏页面菜单
const visibleRoutes = routes.filter((item) => {
  if (item.meta?.isHidden) {
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
