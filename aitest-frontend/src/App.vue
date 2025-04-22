<template>
  <div id="app">
    <template v-if="route.path.startsWith('/user')">
      <router-view />
    </template>
    <template v-else>
      <BasicLayout />
    </template>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import BasicLayout from "./layout/basicLayout.vue";
import { useRoute } from "vue-router";
const route = useRoute();
/**
 * 全局初始化函数
 */
const Init = () => {
  console.log("欢迎来到YY-Test");
};

onMounted(() => {
  Init();
});
</script>

/

<style></style>
