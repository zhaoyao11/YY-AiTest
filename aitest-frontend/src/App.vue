<template>
  <div id="app">
    <BasicLayout />
  </div>
</template>

<script setup>
import BasicLayout from "./layout/basicLayout.vue";
import { useRoute } from "vue-router";
const route = useRoute();
</script>

<style></style>
