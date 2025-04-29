<template>
  <a-button type="outline" @click="handleClick">AI生成题目</a-button>
  <a-drawer
    :width="380"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    unmountOnClose
  >
    <template #title> AI生成题目 </template>

    <div>
      <a-form :model="form" v-model="form">
        <a-form-item label="题目数量">
          <a-input
            v-model="form.questionNumber"
            placeholder="请输入题目数量"
            style="width: 200px"
          ></a-input>
        </a-form-item>
        <a-form-item label="选项数量">
          <a-input
            v-model="form.optionNumber"
            placeholder="请输入选项数量"
            style="width: 200px"
          ></a-input>
        </a-form-item>
      </a-form>
      <a-space size="large">
        <a-button :loading="isLoading" type="primary" @click="onGenerate"
          >一键生成</a-button
        >
        <a-button :loading="isSSELoading" type="primary" @click="onGenerateSSE"
          >实时生成</a-button
        >
      </a-space>
    </div>
  </a-drawer>
</template>

<script lang="ts" setup>
import { reactive, ref, withDefaults, defineProps } from "vue";
import API from "@/api";
import { aiGenerateQuestionUsingPost } from "@/api/questionController";
import message from "@arco-design/web-vue/es/message";
interface Props {
  appId: string;
  onSuccess: (result: API.QuestionContentDTO[]) => void;
  onSSESuccess?: (result: API.QuestionContentDTO) => void;
  onSSEStart?: (event: any) => void;
  onSSEClose?: (event: any) => void;
}
const props = withDefaults(defineProps<Props>(), {
  appId: "",
});
const form = reactive<API.AiGenerateQuestionRequest>({
  optionNumber: "2",
  questionNumber: "10",
});
//按钮加载
const isLoading = ref(false);
const isSSELoading = ref(false);
const visible = ref(false);

const handleClick = () => {
  visible.value = true;
};
const handleOk = () => {
  visible.value = false;
};
const handleCancel = () => {
  visible.value = false;
};

//点击开始生成
const onGenerate = async () => {
  if (!props.appId) {
    return;
  }
  isLoading.value = true;
  const res = await aiGenerateQuestionUsingPost({
    appId: props.appId as any,
    ...form,
  });
  if (res.data.code === 0) {
    if (props.onSuccess) {
      props.onSuccess(res.data.data);
    } else {
      message.success("生成成功");
    }
    handleCancel();
  } else {
    message.error("生成失败 " + res.data.message);
  }
  isLoading.value = false;
};

//点击实时生成按钮
const onGenerateSSE = () => {
  if (!props.appId) {
    return;
  }
  //创建SSE请求
  const eventSource = new EventSource(
    "http://localhost:8101/api/question/ai_generate/sse" +
      `?appId=${props.appId}&optionNumber=${form.optionNumber}&questionNumber=${form.questionNumber}`,
    { withCredentials: true }
  );
  let first = true;
  //接受信息
  eventSource.onmessage = (event) => {
    if (first) {
      props.onSSEStart(event);
      handleCancel();
      first = !first;
    }
    props.onSSESuccess(JSON.parse(event.data));
  };

  //报错
  eventSource.onerror = (event) => {
    if (event.eventPhase === EventSource.CLOSED) {
      console.log("关闭连接");
      props.onSSEClose(event);
      eventSource.close();
    }
    console.log("连接出错");
    eventSource.close();
  };
};
</script>
