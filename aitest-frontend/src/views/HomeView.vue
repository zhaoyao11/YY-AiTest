<template>
  <div id="home-page">
    <div class="searchBox">
      <a-input-search
        :style="{ width: '320px' }"
        placeholder="快速发现答题应用"
        button-text="搜索"
        size="large"
        search-button
      />
    </div>

    <a-list
      :grid-props="{ gutter: [20, 20], sm: 24, md: 12, lg: 8, xl: 6 }"
      class="list-demo-action-layout"
      :bordered="false"
      :data="dataList"
      :pagination-props="{
        showTotal: true,
        current: searchParams.current,
        total: total,
      }"
      @page-change="onPageChange"
    >
      <template #item="{ item }">
        <Card :app="item" />
      </template>
    </a-list>
  </div>
</template>

<script lang="ts" setup>
import Card from "@/components/HomeCard.vue";
import { onMounted, ref, watchEffect } from "vue";
import API from "@/api";
import { listAppVoByPageUsingPost } from "@/api/appController";
import { REVIEW_STATUS_ENUM } from "@/constants/app";
import message from "@arco-design/web-vue/es/message";

//定义搜索参数
const initSearchParams = {
  current: 1,
  pageSize: 10,
};
const searchParams = ref<API.AppQueryRequest>({
  ...initSearchParams,
});
//数据总数
const total = ref(0);
//数据列表
const dataList = ref<API.AppVO[]>([]);

//获取数据
const loadData = async () => {
  const params = {
    ...searchParams.value,
    reviewStatus: REVIEW_STATUS_ENUM.PASS,
  };
  const res = await listAppVoByPageUsingPost(params);
  // console.log(res.data);

  if (res.data.code === 0) {
    dataList.value = res.data.data.records;
    // console.log(dataList.value);

    total.value = res.data.data.total;
  } else {
    message.error("数据获取失败 " + res.data.message);
  }
};
//页码变化回调函数
const onPageChange = (current: number) => {
  searchParams.value = {
    ...searchParams.value,
    current,
  };
};

//数据监听钩子
watchEffect(() => {
  loadData();
});
</script>

<style scoped>
.searchBox {
  margin-bottom: 28px;
  text-align: center;
}

.list-demo-action-layout .image-area {
  width: 183px;
  height: 119px;
  overflow: hidden;
  border-radius: 2px;
}

.list-demo-action-layout .list-demo-item {
  padding: 20px 0;
  border-bottom: 1px solid var(--color-fill-3);
}

.list-demo-action-layout .image-area img {
  width: 100%;
}

.list-demo-action-layout .arco-list-item-action .arco-icon {
  margin: 0 4px;
}
</style>
