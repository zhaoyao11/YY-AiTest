<template>
  <div id="answer-result-view">
    <a-card>
      <a-row style="margin-bottom: 16px">
        <a-col flex="auto" class="content-wrapper">
          <h2>{{ resultData.resultName }}</h2>
          <p>结果描述：{{ resultData.resultDesc }}</p>
          <p>我的答案：{{ resultData.choices }}</p>
          <p>应用 id：{{ resultData.appId }}</p>
          <p>应用类型：{{ APP_TYPE_MAP[resultData.appType] }}</p>
          <p>
            评分策略：{{ APP_SCORING_STRATEGY_MAP[resultData.scoringStrategy] }}
          </p>
          <p>
            <a-space>
              答题人：
              <div :style="{ display: 'flex', alignItems: 'center' }">
                <a-avatar
                  :size="24"
                  :image-url="resultData.user?.userAvatar"
                  :style="{ marginRight: '8px' }"
                />
                <a-typography-text
                  >{{ resultData.user?.userName ?? "无名" }}
                </a-typography-text>
              </div>
            </a-space>
          </p>
          <p>
            答题时间：{{
              dayjs(resultData.createTime).format("YYYY-MM-DD HH:mm:ss")
            }}
          </p>
          <a-space size="medium">
            <a-button type="primary" :href="`/do/answer/${resultData.appId}`"
              >去答题
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { getUserAnswerVoByIdUsingGet } from "@/api/userAnswerController";
import message from "@arco-design/web-vue/es/message";
import { withDefaults, defineProps, ref, watchEffect } from "vue";
import API from "@/api";
import dayjs from "dayjs";
import { APP_TYPE_MAP, APP_SCORING_STRATEGY_MAP } from "@/constants/app";
interface Props {
  data: string;
}
const props = withDefaults(defineProps<Props>(), {
  data: "",
});

console.log(props.data);

const resultData = ref<API.UserAnswerVO>({});

/**
 * 加载数据
 */
const loadData = async () => {
  if (!props.data) {
    return;
  }
  const res = await getUserAnswerVoByIdUsingGet({
    id: props.data as any,
  });
  if (res.data.code === 0) {
    resultData.value = res.data.data as any;
  } else {
    message.error("获取数据失败，" + res.data.message);
  }
};

/**
 * 监听 searchParams 变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  loadData();
});
</script>

<style scoped></style>
