<template>
  <div id="admin-manage">
    <a-form
      :model="formSearchParams"
      :style="{ marginBottom: '20px' }"
      layout="inline"
      @submit="handleSubmit"
    >
      <a-form-item field="appId" label="应用ID">
        <a-input v-model="formSearchParams.appId" placeholder="请输入应用ID" />
      </a-form-item>
      <!-- <a-form-item field="userProfile" label="用户简介">
        <a-input
          v-model="formSearchParams.userProfile"
          placeholder="请输入用户简介"
        />
      </a-form-item> -->
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
      <template #userAvatar="{ record }">
        <a-image width="55" :src="record.userAvatar" />
      </template>
      <template #createTime="{ record }">
        {{ dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <template #updateTime="{ record }">
        {{ dayjs(record.updateTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <template #delete="{ record }">
        <a-button status="danger" @click="onDelete(record)">删除</a-button>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { deleteUserUsingPost } from "@/api/userController";
import { ref, watchEffect } from "vue";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import dayjs from "dayjs";
import { listUserAnswerByPageUsingPost } from "@/api/userAnswerController";

//查找用户参数
const formSearchParams = ref<API.UserAnswerQueryRequest>({});

//点击搜索用户回调函数
const handleSubmit = () => {
  console.log("搜索用户函数触发了");
  searchParams.value = {
    ...searchParams.value,
    ...formSearchParams.value,
  };
};

//初始搜索条件
const initSearchParams = {
  current: 1,
  pageSize: 8,
};

//查询参数
const searchParams = ref<API.UserAnswerQueryRequest>({
  ...initSearchParams,
});

//数据列表
const ListData = ref<API.UserAnswer[]>([]);
//用户总数
const total = ref<number>(0);

//加载数据
const loadData = async () => {
  const res = await listUserAnswerByPageUsingPost(searchParams.value);
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
  // console.log("需要删除的用户为：" + record.id + record.userName);
  const res = await deleteUserUsingPost({ id: record.id });
  if (res.data.code === 0) {
    message.success("删除成功");
    loadData();
  } else {
    message.error("删除失败 " + res.data.message);
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
    title: "应用ID",
    dataIndex: "appId",
  },
  {
    title: "应用类型",
    dataIndex: "appType",
  },
  {
    title: "评分策略",
    dataIndex: "scoringStrategy",
  },
  {
    title: "用户答案",
    dataIndex: "choices",
  },
  {
    title: "评分结果ID",
    dataIndex: "resultId",
  },
  {
    title: "结果名称",
    dataIndex: "resultName",
  },
  {
    title: "结果描述",
    dataIndex: "resultDesc",
  },
  {
    title: "结果图标",
    dataIndex: "resultPicture",
  },
  {
    title: "得分",
    dataIndex: "resultScore",
  },
  {
    title: "用户ID",
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
    slotName: "delete",
  },
];
</script>

<style scoped>
#admin-manage {
  width: 100%;
  height: 100%;
}
</style>
