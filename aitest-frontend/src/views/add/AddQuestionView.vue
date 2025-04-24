<template>
  <div id="add-question-view">
    <h2>创建题目</h2>
    <a-form
      class="form"
      :style="{ width: '480px' }"
      label-align="left"
      v-model="QuestionContentList"
      auto-label-width
      @submit="handleSubmit"
    >
      <a-form-item field="appId" label="应用ID">
        {{ props.appId }}
      </a-form-item>

      <a-form-item label="题目列表" :content-flex="false" :merge-props="false">
        <a-button @click="addQuestionFromBottom(QuestionContentList.length)"
          >底部添加题目</a-button
        >
        <!-- 遍历每一个题目 -->
        <div v-for="(item, index) in QuestionContentList" :key="index">
          <a-space>
            <h3>题目{{ index + 1 }}</h3>
            <a-button
              style="margin-left: 10px"
              size="mini"
              @click="addQuestion(index + 1)"
              >添加题目</a-button
            >
            <a-button
              style="margin-left: 10px"
              size="mini"
              status="danger"
              @click="deleteQuestion(index)"
              >删除题目</a-button
            >
          </a-space>

          <a-form label-align="left">
            <a-form-item :label="`题目 ${index + 1} 标题`">
              <a-input v-model="item.title" placeholder="请输入题目标题" />
            </a-form-item>
            <a-space>
              <h4>题目 {{ index + 1 }} 选项</h4>
              <a-button
                style="margin-left: 10px"
                size="mini"
                @click="addQuestionOption(index)"
                >底部添加选项</a-button
              >
            </a-space>
            <a-form-item
              v-for="(option, optionIndex) in item.options"
              :key="optionIndex"
              :label="`选项 ${index + 1} `"
            >
              <a-form>
                <a-form-item label="选项key">
                  <a-input v-model="option.key" placeholder="请输入选项key" />
                </a-form-item>
                <a-form-item label="选项值">
                  <a-input v-model="option.value" placeholder="请输入选项值" />
                </a-form-item>
                <a-form-item label="选项结果">
                  <a-input
                    v-model="option.result"
                    placeholder="请输入选项结果"
                  />
                </a-form-item>
                <a-form-item label="选项得分">
                  <a-input
                    v-model="option.score"
                    placeholder="请输入选项得分"
                  />
                </a-form-item>
                <a-space>
                  <a-button
                    size="mini"
                    @click="addOptionFromIndex(item, optionIndex + 1)"
                    >添加选项</a-button
                  >
                  <a-button
                    size="mini"
                    status="danger"
                    @click="deleteOption(item, optionIndex)"
                    >删除选项</a-button
                  >
                </a-space>
              </a-form>
            </a-form-item>
            <a-divider />
          </a-form>
        </div>
      </a-form-item>
      <a-button
        type="primary"
        html-type="submit"
        style="width: 120px; margin: 0 auto"
        >提交</a-button
      >
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, watchEffect, withDefaults } from "vue";
import API from "@/api";
import {
  addQuestionUsingPost,
  editQuestionUsingPost,
  listQuestionVoByPageUsingPost,
} from "@/api/questionController";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
const router = useRouter();
interface Props {
  appId: number;
}
const props = withDefaults(defineProps<Props>(), {
  appId: 0,
});
console.log(props.appId, "问题对应的id");

/**
 * 题目列表
 * option:题目选项
 * title:题目标题
 */
const QuestionContentList = ref<API.QuestionContentDTO[]>([]);
const oldQuestion = ref<API.QuestionVO>();

//在指定位置添加题目
const addQuestion = (index: number) => {
  QuestionContentList.value.splice(index, 0, {
    title: "",
    options: [],
  });
};

//给题目从底部添加选项
const addQuestionOption = (index: number) => {
  QuestionContentList.value[index].options.push({
    key: "",
    value: "",
    result: "",
    score: 0,
  });
};
//在特定位置给题目加入选项
const addOptionFromIndex = (
  question: API.QuestionContentDTO,
  index: number
) => {
  question.options.splice(index, 0, {
    key: "",
    value: "",
    result: "",
    score: 0,
  });
};

//删除题目
const deleteQuestion = (index: number) => {
  QuestionContentList.value.splice(index, 1);
};
//删除题目的某个选项
const deleteOption = (question: API.QuestionContentDTO, index: number) => {
  question.options.splice(index, 1);
};
//点击从底部添加题目
const addQuestionFromBottom = (index: number) => {
  console.log("底部添加题目");
  QuestionContentList.value.splice(index, 0, {
    options: [],
    title: "",
  });
};

//加载数据
const lodaData = async () => {
  if (!props.appId) {
    return;
  }
  const res = await listQuestionVoByPageUsingPost({ id: props.appId });
  if (res.data.code === 0) {
    oldQuestion.value = res.data.data.records[0];
    if (oldQuestion.value) {
      QuestionContentList.value = oldQuestion.value.questionContent ?? [];
    }
  } else {
    message.error("数据获取失败，" + res.data.message);
  }
};

watchEffect(() => {
  lodaData();
});

//点击提交按钮
const handleSubmit = async () => {
  if (!props.appId || !QuestionContentList.value) {
    return;
  }
  let res;
  //如果是修改
  if (oldQuestion.value) {
    res = await editQuestionUsingPost({
      id: oldQuestion.value.id,
      questionContent: QuestionContentList.value,
    });
  } else {
    res = await addQuestionUsingPost({
      appId: props.appId,
      questionContent: QuestionContentList.value,
    });
  }

  if (res.data.code === 0) {
    //操作成功
    message.success("操作成功，即将跳转到详情页");
    setTimeout(() => {
      router.push(`/app/detail/${props.appId}`);
    }, 2500);
  } else {
    message.error("操作失败，" + res.data.message);
  }
};
</script>

<style scoped>
#add-question-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
