<template>
  <div id="AppDetailPage">
    <a-card style="width: 90%; margin: 30px auto">
      <a-row class="grid-demo" style="margin-bottom: 16px">
        <a-col flex="auto" class="App-Content">
          <h2>应用标题{{ AppInfo.appName }}</h2>
          <p>应用描述：{{ AppInfo.appDesc }}</p>
          <p>应用类型：{{ APP_TYPE_MAP[AppInfo.appType] }}</p>
          <p>
            评分策略：{{ APP_SCORING_STRATEGY_MAP[AppInfo.scoringStrategy] }}
          </p>
          <a-space>
            <p>作者：</p>
            <a-avatar>
              <img
                alt="avatar"
                src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
              />
            </a-avatar>
            <a-typography-text
              >{{ AppInfo.user?.userName ?? "无名" }}
            </a-typography-text>
          </a-space>
          <p>
            创建时间：{{
              dayjs(AppInfo.createTime).format("YYYY-MM-DD HH:mm:ss")
            }}
          </p>
        </a-col>
        <a-col flex="280px">
          <div>
            <a-image :src="AppInfo.appIcon" width="100%"> </a-image>
          </div>
        </a-col>
      </a-row>
      <a-space class="lineButtons">
        <a-button
          type="primary"
          @click="$router.push(`/do/answer/${props.appId}`)"
          >开始答题</a-button
        >
        <a-button @click="openModal">分享应用</a-button>
        <a-button
          v-if="isCurrentUser"
          @click="$router.push(`/add/question/${props.appId}`)"
          >设置题目</a-button
        >
        <a-button
          v-if="isCurrentUser"
          @click="$router.push(`/add/score/${props.appId}`)"
          >设置评分</a-button
        >
        <a-button
          v-if="isCurrentUser"
          @click="$router.push(`/add/app/${props.appId}`)"
          >修改应用</a-button
        >
      </a-space>

      <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel">
        <template #title> 分享应用 </template>
        <div>
          <ShareApp :appId="props.appId" />
        </div>
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { getAppVoByIdUsingGet } from "@/api/appController";
import { defineProps, withDefaults, ref, computed, watchEffect } from "vue";
import dayjs from "dayjs";
import API from "@/api";
import { APP_SCORING_STRATEGY_MAP, APP_TYPE_MAP } from "@/constants/app";
import { useLoginUserStore } from "@/store/userStore";
import message from "@arco-design/web-vue/es/message";
import ShareApp from "@/components/ShareApp.vue";
interface Props {
  appId: string;
}
const props = withDefaults(defineProps<Props>(), {
  appId: "",
});
const AppInfo = ref<API.AppVO>({});

//获得当前用户信息
const loginUserStore = useLoginUserStore();
const loginUserId = loginUserStore.loginUser?.id;
console.log(loginUserId, "loginUserId");
//判断是否为当前用户
const isCurrentUser = computed(() => {
  return loginUserId === AppInfo.value.userId;
});

//根据id获取当前应用信息
const getAppInfo = async () => {
  if (!props.appId) {
    return;
  }
  const res = await getAppVoByIdUsingGet({ id: props.appId as any });
  //   console.log(res);
  if (res.data.code === 0) {
    AppInfo.value = res.data.data;
  } else {
    message.error("获取数据失败，" + res.data.message);
  }
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

watchEffect(() => {
  getAppInfo();
});

console.log(props.appId, "appid");
</script>

<style scoped>
#AppDetailPage .App-Content > * {
  margin-bottom: 30px;
}

#AppDetailPage .lineButtons > * {
  margin-left: 20px;
}
</style>
