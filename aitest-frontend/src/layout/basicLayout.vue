<template>
  <a-layout id="basicLayout" style="height: 100vh">
    <a-layout-header class="header">
      <globalHeader />
    </a-layout-header>

    <a-layout-content class="content">
      <router-view />
    </a-layout-content>

    <a-layout-footer class="footer">
      <globalFooter />
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import globalFooter from "@/components/global/globalFooter.vue";
import globalHeader from "@/components/global/globalHeader.vue";
</script>

<style scoped>
.footer {
  margin-bottom: 16px;
  background-color: #ffffff;
  text-align: center;
  text-justify: auto;
}
</style>
