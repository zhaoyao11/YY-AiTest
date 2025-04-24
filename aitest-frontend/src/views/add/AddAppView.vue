<template>
  <div id="add-app-view" class="container">
    <h2>创建应用</h2>
    <a-form
      class="form"
      :model="AppInfo"
      :style="{ width: '600px' }"
      @submit="handleSubmit"
    >
      <a-form-item field="appName" label="应用名称">
        <a-input v-model="AppInfo.appName" placeholder="请输入应用名称" />
      </a-form-item>
      <a-form-item field="appDesc" label="应用描述">
        <a-input v-model="AppInfo.appDesc" placeholder="请输入应用描述" />
      </a-form-item>
      <a-form-item field="appIcon" label="应用图标">
        <a-input v-model="AppInfo.appIcon" placeholder="请输入应用图片地址" />
      </a-form-item>
      <a-form-item field="appType" label="应用类型">
        <a-select
          :style="{ width: '320px' }"
          placeholder="请选择应用类型"
          v-model="AppInfo.appType"
        >
          <a-option
            v-for="(value, key) in APP_TYPE_MAP"
            :key="key"
            :value="Number(key)"
            >{{ value }}</a-option
          >
        </a-select>
      </a-form-item>
      <a-form-item field="scoringStrategy" label="评分策略">
        <a-select
          :style="{ width: '320px' }"
          placeholder="请选择评分策略"
          v-model="AppInfo.scoringStrategy"
        >
          <a-option
            v-for="(value, key) in APP_SCORING_STRATEGY_MAP"
            :key="key"
            :value="Number(key)"
            >{{ value }}</a-option
          >
        </a-select>
      </a-form-item>

      <a-form-item>
        <a-button size="large" type="primary" html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, withDefaults, watchEffect } from "vue";
import API from "@/api";
import { APP_SCORING_STRATEGY_MAP, APP_TYPE_MAP } from "@/constants/app";
import {
  addAppUsingPost,
  editAppUsingPost,
  getAppVoByIdUsingGet,
} from "@/api/appController";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
const router = useRouter();
interface Props {
  id: number;
}
const props = withDefaults(defineProps<Props>(), {
  id: 0,
});
const AppInfo = ref<API.AppVO>({});

//旧数据
const oldAppInfo = ref<API.AppVO>({});

//根据id获取当前应用信息
const getAppInfo = async () => {
  const res = await getAppVoByIdUsingGet({ id: props.id });
  //   console.log(res);
  if (res.data.code === 0) {
    oldAppInfo.value = res.data.data;
    AppInfo.value = res.data.data;
  } else {
    message.error("数据获取失败 " + res.data.message);
  }
};

watchEffect(() => {
  getAppInfo();
});

const handleSubmit = async () => {
  let res;
  if (props.id) {
    //如果是修改
    res = await editAppUsingPost({
      id: props.id,
      ...AppInfo.value,
    });
  } else {
    //如果是添加
    res = await addAppUsingPost({
      ...AppInfo.value,
    });
  }

  if (res.data.code === 0) {
    message.success("操作成功，即将跳转到详情页");
    setTimeout(() => {
      router.push(`/app/detail/${props.id || res.data.data}`);
    }, 2500);
  } else {
    message.error("操作失败 " + res.data.message);
  }
};
</script>

<style scoped>
.container {
  margin: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.container h2 {
  margin-bottom: 20px;
}

.form > * {
  margin-bottom: 30px;
}
</style>
