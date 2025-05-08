<template>
  <div id="appStatisticPage">
    <h2>热门应用统计</h2>
    <v-chart
      class="hotAppBar"
      :option="hotAppCountOptions"
      style="height: 300px"
    />
    <h2>应用结果统计</h2>
    <a-space style="margin-top: 20px; margin-bottom: 30px">
      <a-input v-model="appId" placeholder="请输入应用ID"></a-input>
      <a-button type="primary" @click="onClickButton">查看统计结果</a-button>
    </a-space>
    <v-chart :option="appPanDataOption" style="height: 300px" />
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import "echarts";
import { computed, onMounted, ref } from "vue";
import {
  getAppAnswerCountUsingGet,
  getAppAnswerResultCountUsingGet,
} from "@/api/appStatisticController";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";

//各个应用回答数量
const appAnswerData = ref<API.AppAnswerCountDTO[]>([]);
//应用结果统计
const appPanData = ref<API.AppAnswerResultCountDTO[]>([]);
//查询的APPID
const appId = ref<number>();

//获取数据
onMounted(async () => {
  //热门应用数据
  const res_appAnswer = await getAppAnswerCountUsingGet();
  appAnswerData.value = res_appAnswer.data.data;
  console.log(appAnswerData.value);
});

//点击查看结果按钮
const onClickButton = async () => {
  //判断输入框是否为空
  if (!appId.value) {
    message.warning("请输入应用ID");
    return;
  }
  //应用结果
  const res_appResul = await getAppAnswerResultCountUsingGet({
    appId: appId.value,
  });
  appPanData.value = res_appResul.data.data;
  console.log(res_appResul.data);
};

const hotAppCountOptions = computed(() => {
  return {
    toolbox: {
      feature: {
        dataView: {
          show: true,
          readOnly: false,
        },
      },
    },
    xAxis: {
      type: "category",
      data: appAnswerData.value.map((item) => item.appId),
      name: "应用ID",
    },
    yAxis: {
      type: "value",
      name: "回答数量",
    },
    series: [
      {
        data: appAnswerData.value.map((item) => item.answerCount),
        type: "bar",
      },
    ],
  };
});

//应用结果统计
const appPanDataOption = computed(() => {
  return {
    title: {
      text: "应用结果统计饼状图",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "图例",
        type: "pie",
        radius: "50%",
        data: appPanData.value.map((item) => {
          return { value: item.resultCount, name: item.resultName };
        }),

        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
});
</script>

<style scoped></style>
