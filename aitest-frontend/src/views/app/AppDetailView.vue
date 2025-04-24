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
        <a-button type="primary">开始答题</a-button>
        <a-button>分享应用</a-button>
        <a-button v-if="isCurrentUser">设置题目</a-button>
        <a-button v-if="isCurrentUser">设置评分</a-button>
        <a-button v-if="isCurrentUser">修改应用</a-button>
      </a-space>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { getAppVoByIdUsingGet } from "@/api/appController";
import { defineProps, onMounted, withDefaults, ref, computed } from "vue";
import dayjs from "dayjs";
import API from "@/api";
import { APP_SCORING_STRATEGY_MAP, APP_TYPE_MAP } from "@/constants/app";
import { useLoginUserStore } from "@/store/userStore";
interface Props {
  id: number;
}
const props = withDefaults(defineProps<Props>(), {
  id: 0,
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
  const res = await getAppVoByIdUsingGet({ id: props.id });
  //   console.log(res);
  AppInfo.value = res.data.data;
};

onMounted(() => {
  getAppInfo();
});

console.log(props.id, "id");
</script>

<style scoped>
#AppDetailPage .App-Content > * {
  margin-bottom: 30px;
}

#AppDetailPage .lineButtons > * {
  margin-left: 20px;
}
</style>
