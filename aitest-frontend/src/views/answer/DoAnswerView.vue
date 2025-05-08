<template>
  <div id="do-answer-view">
    <h1>{{ appInfo.appName }}</h1>
    <p>{{ appInfo.appDesc }}</p>
    <a-card
      v-for="(item, index) in questionList"
      :key="item.title"
      style="width: 60%; margin-top: 20px"
    >
      <h2>{{ item.title }}</h2>
      <div class="optionBox">
        <a-radio-group
          v-model="answerList[index]"
          direction="vertical"
          :options="optionsList[index]"
        />
      </div>
    </a-card>
    <a-spin size="large" :hide-icon="isLoadingHidden" />

    <a-button
      style="margin-top: 20px"
      type="primary"
      @click="submitAnswerThrottle"
      >提交答案</a-button
    >
  </div>
</template>

<script lang="ts" setup>
import { getAppVoByIdUsingGet } from "@/api/appController";
import { withDefaults, defineProps, watchEffect, ref, computed } from "vue";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import { listQuestionVoByPageUsingPost } from "@/api/questionController";
import {
  addUserAnswerUsingPost,
  generateUserAnswerIdUsingGet,
} from "@/api/userAnswerController";
import { useRouter } from "vue-router";

//控制是否显示加载
const isLoadingHidden = ref(true);

interface Props {
  appId: string;
}
const props = withDefaults(defineProps<Props>(), {
  appId: "",
});
const router = useRouter();

//APP信息
const appInfo = ref<API.AppVO>({});
//当前APP对应的题目信息
const questionList = ref<API.QuestionContentDTO[]>([]);
const optionsList = computed(() => {
  return questionList.value.map((item) => {
    return item.options.map((option) => {
      return {
        label: `${option.key}.${option.value}`,
        value: option,
      };
    });
  });
});

//用户答案列表
const answerList = ref<API.Option[]>([]);
const resultAnswerList = computed(() => {
  return answerList.value.map((item) => {
    return item.key;
  });
});
const ResultList = ref<string[]>([]);

//获取数据
const loadData = async () => {
  if (!props.appId) {
    return;
  }
  //获取当前APP
  const res_app = await getAppVoByIdUsingGet({
    id: props.appId as any,
  });
  if (res_app.data.code === 0) {
    appInfo.value = res_app.data.data;
    ResultList.value = resultAnswerList.value;
    // message.success("应用获取成功");
  } else {
    message.error("应用获取失败 " + res_app.data.message);
  }
  console.log(res_app, "res_app");

  //获取题目信息
  const res_question = await listQuestionVoByPageUsingPost({
    appId: props.appId as any,
    current: 1,
    pageSize: 1,
    sortField: "createTime",
    sortOrder: "descend",
  });
  console.log(res_question, "题目信息");

  if (res_question.data.code === 0) {
    if (res_question.data.data.records.length === 0) {
      message.warning("该应用当前没有题目");
      return;
    }
    questionList.value = res_question.data.data.records[0].questionContent;
    message.success("题目获取成功");
  } else {
    message.error("题目获取失败 " + res_question.data.message);
  }
  console.log(res_question, "res_question");
};

// 唯一 id
const id = ref<number>();

// 生成唯一 id
const generateId = async () => {
  const res = await generateUserAnswerIdUsingGet();
  if (res.data.code === 0) {
    id.value = res.data.data as any;
  } else {
    message.error("获取唯一 id 失败，" + res.data.message);
  }
};

// 进入页面时，生成唯一 id
watchEffect(() => {
  generateId();
});

//提交答案
const submitAnswer = async () => {
  if (!props.appId) {
    return;
  }
  if (resultAnswerList.value.length !== questionList.value.length) {
    message.warning("请完成所有题目");
    return;
  }
  isLoadingHidden.value = false;
  const res = await addUserAnswerUsingPost({
    appId: props.appId as any,
    choices: resultAnswerList.value,
    id: id.value,
  });
  isLoadingHidden.value = true;
  if (res.data.code === 0) {
    message.success("提交成功，即将跳转到结果页");
    setTimeout(() => {
      router.push(`/answer/result/${res.data.data}`);
    }, 1500);
  } else {
    message.error("提交失败 " + res.data.message);
  }
};
//写一个节流
const throttle = (func, delay) => {
  let timer = null;
  return function () {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      func();
      timer = null;
    }, delay);
  };
};
//节流提交答案
const submitAnswerThrottle = throttle(submitAnswer, 1500);

watchEffect(() => {
  loadData();
});
</script>

<style scoped>
#do-answer-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
