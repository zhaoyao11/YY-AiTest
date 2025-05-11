<template>
  <div id="admin-manage">
    <a-form
      :model="formSearchParams"
      :style="{ marginBottom: '20px' }"
      layout="inline"
      @submit="doSearch"
    >
      <a-form-item field="appName" label="应用名">
        <a-input
          v-model="formSearchParams.appName"
          placeholder="请输入应用名"
        />
      </a-form-item>
      <a-form-item field="appDesc" label="应用描述">
        <a-input
          v-model="formSearchParams.appDesc"
          placeholder="请输入应用描述"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>

    <a-table
      :columns="columns"
      :data="ListData"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @page-change="onPageChange"
    >
      <template #appIcon="{ record }">
        <a-image width="55" :src="record.appIcon" />
      </template>
      <template #appType="{ record }">
        {{ APP_TYPE_MAP[record.appType] }}
      </template>
      <template #appStrategy="{ record }">
        {{ APP_SCORING_STRATEGY_MAP[record.scoringStrategy] }}
      </template>
      <template #appStatus="{ record }">
        {{ REVIEW_STATUS_MAP[record.reviewStatus] }}
      </template>
      <template #createTime="{ record }">
        {{ dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <template #updateTime="{ record }">
        {{ dayjs(record.updateTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button
            v-if="record.reviewStatus !== REVIEW_STATUS_ENUM.PASS"
            status="success"
            @click="onDoReview(record, REVIEW_STATUS_ENUM.PASS, '审核通过')"
          >
            通过</a-button
          >

          <a-button
            v-if="record.reviewStatus !== REVIEW_STATUS_ENUM.REJECT"
            status="warning"
            @click="onDoReview(record, REVIEW_STATUS_ENUM.REJECT, '审核失败')"
            >拒绝</a-button
          >

          <a-button status="danger" @click="onDelete(record)">删除</a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import dayjs from "dayjs";
import { listAppByPageUsingPost } from "@/api/appController";
import {
  APP_SCORING_STRATEGY_MAP,
  APP_TYPE_MAP,
  REVIEW_STATUS_MAP,
} from "@/constants/app";
import { REVIEW_STATUS_ENUM } from "@/constants/app";
import { deleteAppUsingPost } from "@/api/appController";
import { doAppReviewUsingPost } from "@/api/appController";

//查找用户参数
const formSearchParams = ref<API.AppQueryRequest>({});

//初始搜索条件
const initSearchParams = {
  current: 1,
  pageSize: 8,
  sortOrder: "descend",
  sortField: "createTime",
};

//查询参数
const searchParams = ref<API.AppQueryRequest>({
  ...initSearchParams,
});

//进行搜索
const doSearch = () => {
  searchParams.value = {
    ...searchParams.value,
    ...formSearchParams.value,
  };
  formSearchParams.value = {};
};

//应用列表
const ListData = ref<API.App[]>([]);
//应用总数
const total = ref<number>(0);

//加载数据
const loadData = async () => {
  const res = await listAppByPageUsingPost(searchParams.value);
  if (res.data.code === 0) {
    ListData.value = res.data.data?.records || [];
    total.value = res.data.data?.total || 0;
    console.log(ListData.value, "listdata");
  } else {
    message.error("数据获取失败 " + res.data.message);
  }
};

//页面切换
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

//删除按钮
const onDelete = async (record: API.User) => {
  const res = await deleteAppUsingPost({ id: record.id });
  if (res.data.code === 0) {
    message.success("删除成功");
    loadData();
  } else {
    message.error("删除失败 " + res.data.message);
  }
};

//通过按钮
const onDoReview = async (
  record: API.App,
  reviewStatus: number,
  reviewMessage?: string
) => {
  if (!record.id) {
    return;
  }

  const res = await doAppReviewUsingPost({
    id: record.id,
    reviewStatus,
    reviewMessage,
  });
  if (res.data.code === 0) {
    loadData();
  } else {
    message.error("审核失败 " + res.data.message);
  }
};

watchEffect(() => {
  loadData();
});

const columns = [
  {
    title: "id",
    dataIndex: "id",
  },
  {
    title: "应用名",
    dataIndex: "appName",
  },
  {
    title: "应用描述",
    dataIndex: "appDesc",
  },
  {
    title: "应用头标",
    dataIndex: "appIcon",
    slotName: "appIcon",
  },
  {
    title: "应用类型",
    dataIndex: "appType",
    slotName: "appType",
  },
  {
    title: "评分策略",
    dataIndex: "scoringStrategy",
    slotName: "appStrategy",
  },
  {
    title: "审核状态",
    dataIndex: "reviewStatus",
    slotName: "appStatus",
  },
  {
    title: "审核信息",
    dataIndex: "reviewMessage",
  },
  {
    title: "审核人ID",
    dataIndex: "reviewerId",
  },
  {
    title: "审核时间",
    dataIndex: "reviewTime",
  },
  {
    title: "创建用户ID",
    dataIndex: "userId",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    slotName: "createTime",
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    slotName: "updateTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];
</script>

<style scoped>
#admin-manage {
  width: 100%;
  height: 100%;
}
</style>
