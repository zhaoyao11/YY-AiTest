<template>
  <div>
    <a-card class="appCard" hoverable @click="onClickCard">
      <template #actions>
        <span class="icon-hover" @click.stop @click="openModal">
          <IconShareInternal />
        </span>
      </template>
      <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel">
        <template #title> 分享应用 </template>
        <div>
          <ShareApp :appId="props.app.id" />
        </div>
      </a-modal>
      <template #cover>
        <div
          :style="{
            height: '204px',
            overflow: 'hidden',
          }"
        >
          <img
            draggable="false"
            :style="{ width: '100%', transform: 'translateY(-20px)' }"
            :alt="props.app.appName"
            :src="props.app.appIcon"
            fit="scale-down"
          />
        </div>
      </template>
      <a-card-meta :title="props.app.appName" :description="props.app.appDesc">
        <template #avatar>
          <div
            :style="{ display: 'flex', alignItems: 'center', color: '#1D2129' }"
          >
            <a-avatar
              :size="24"
              :image-url="props.app.user.userAvatar"
              :style="{ marginRight: '8px' }"
            >
              A
            </a-avatar>
            <a-typography-text>{{
              props.app.user.userName || "无名"
            }}</a-typography-text>
          </div>
        </template>
      </a-card-meta>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { IconShareInternal } from "@arco-design/web-vue/es/icon";
import API from "@/api";
import { defineProps, ref, withDefaults } from "vue";
import { useRouter } from "vue-router";
import ShareApp from "./ShareApp.vue";

//获取传递的参数
interface Props {
  app: API.AppVO;
}
const props = withDefaults(defineProps<Props>(), {
  app: () => {
    return {};
  },
});
const router = useRouter();
//点击图片后跳转到对应路由
const onClickCard = () => {
  router.push(`/app/detail/${props.app.id}`);
};

//点击分享按钮
const openModal = () => {
  visible.value = true;
};

//应用分享
const visible = ref(false);

const handleOk = () => {
  visible.value = false;
};
const handleCancel = () => {
  visible.value = false;
};
</script>
<style scoped>
.appCard {
  cursor: pointer;
}

.icon-hover {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: all 0.1s;
}
.icon-hover:hover {
  background-color: rgb(var(--gray-2));
}
</style>
