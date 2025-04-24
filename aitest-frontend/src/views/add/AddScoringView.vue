<template>
  <div id="add-score-view">
    <h2>创建评分结果</h2>
    <a-form label-align="left" auto-label-width>
      <a-form-item label="应用ID">
        {{ props.appId }}
      </a-form-item>
      <a-form-item v-if="updateId" label="修改评分ID">
        {{ updateId }}
      </a-form-item>
      <a-form-item label="结果名称"
        ><a-input
          v-model="formData.resultName"
          :style="{ width: '320px' }"
          placeholder="请输入结果名称"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="结果描述"
        ><a-input
          v-model="formData.resultDesc"
          :style="{ width: '320px' }"
          placeholder="请输入结果描述"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="结果图标"
        ><a-input
          v-model="formData.resultPicture"
          :style="{ width: '320px' }"
          placeholder="请输入结果图标"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="结果集"
        ><a-input-tag
          v-model="formData.resultProp"
          :style="{ width: '320px' }"
          placeholder="请输入结果集，按回车确定"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="结果得分范围">
        <a-input-number
          v-model="formData.resultScoreRange"
          :style="{ width: '320px' }"
          placeholder="请输入得分范围，范围为[0,100]"
          class="input-demo"
          :min="0"
          :max="100"
        />
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          size="large"
          style="width: 120px; margin-bottom: 20px"
          @click="onClickSubmit"
          >提交</a-button
        >
      </a-form-item>
    </a-form>
    <ScoringResultTable
      :appId="props.appId"
      :onUpdate="onUpdate"
      ref="tableRef"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults, ref } from "vue";
import ScoringResultTable from "./components/ScoringResultTable.vue";
import API from "@/api";
import {
  addScoringResultUsingPost,
  editScoringResultUsingPost,
} from "@/api/scoringResultController";
import message from "@arco-design/web-vue/es/message";
interface Props {
  appId: number;
}
const props = withDefaults(defineProps<Props>(), {
  appId: 0,
});
//获取表格实例
const tableRef = ref();
console.log(props.appId);
//定义表单数据
const formData = ref({
  resultName: "",
  resultDesc: "",
  resultPicture: "",
} as API.ScoringResultAddRequest);

//更新函数
const updateId = ref();
const onUpdate = (scoringResult: API.ScoringResultVO) => {
  updateId.value = scoringResult.id;
  formData.value = scoringResult;
};

//点击提交按钮
const onClickSubmit = async () => {
  let res;
  if (updateId.value) {
    //如果是修改
    res = await editScoringResultUsingPost({
      id: props.appId,
      ...formData.value,
    });
  } else {
    //如果是添加
    res = await addScoringResultUsingPost({
      appId: props.appId,
      ...formData.value,
    });
  }

  if (res.data.code === 0) {
    message.success("操作成功");
  } else {
    message.error("操作失败 " + res.data.message);
  }
  if (tableRef.value) {
    tableRef.value.loadData();
    updateId.value = undefined;
    formData.value = {};
  }
};
</script>

<style scoped></style>
