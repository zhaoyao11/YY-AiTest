<template>
  <a-layout id="basicLayout" style="height: 100vh">
    <a-layout-header class="header">
      <globalHeader @showModal="showModal" />
    </a-layout-header>

    <a-layout-content class="content">
      <router-view />
      <UserDetailInfo :visible="isModalVisible" @close-modal="closeModal" />
    </a-layout-content>

    <a-layout-footer class="footer">
      <globalFooter />
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import globalFooter from "@/components/global/globalFooter.vue";
import globalHeader from "@/components/global/globalHeader.vue";
import UserDetailInfo from "@/components/global/userDetailInfo.vue";
import { ref } from "vue";
const isModalVisible = ref(false);
//显示模态框
const showModal = () => {
  isModalVisible.value = true;
  console.log("模态框显示");
};
//关闭模态框
const closeModal = () => {
  isModalVisible.value = false;
  console.log("模态框关闭");
};
</script>

<style scoped>
#basicLayout .header {
  margin-bottom: 15px;
  box-shadow: #eee 1px 1px 5px;
}

#basicLayout .content {
  max-width: 1200px;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto 15px;
  padding: 10px;
}

.footer {
  margin-bottom: 16px;
  background-color: #ffffff;
  text-align: center;
  text-justify: auto;
}
</style>
