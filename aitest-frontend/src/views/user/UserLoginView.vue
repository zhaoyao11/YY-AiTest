<template>
  <div id="userLoginPage">
    <h2 style="margin-bottom: 16px">用户登录</h2>
    <a-form
      :model="form"
      :style="{ width: '480px', margin: '0 auto' }"
      label-align="left"
      auto-label-width
      @submit="handleSubmit"
    >
      <a-form-item field="userAccount" label="账号">
        <a-input v-model="form.userAccount" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item field="userPassword" tooltip="密码不小于 8 位" label="密码">
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码"
        />
      </a-form-item>
      <a-form-item>
        <div
          style="
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: space-between;
          "
        >
          <a-button type="primary" html-type="submit" style="width: 120px">
            登录
          </a-button>
          <a-link href="/user/register">新用户注册</a-link>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { userLoginUsingPost } from "@/api/userController";
import message from "@arco-design/web-vue/es/message";
import { reactive } from "vue";
import API from "@/api";
import { useRouter } from "vue-router";
import { useLoginUserStore } from "@/store/userStore";

const router = useRouter();
const loginUserStore = useLoginUserStore();

const form = reactive<API.UserLoginRequest>({
  userAccount: "",
  userPassword: "",
});

const handleSubmit = async () => {
  //   console.log(form);
  const res = await userLoginUsingPost(form);

  if (res.data.code === 0) {
    //获取用户信息
    await loginUserStore.fetchLoginUser();
    //表示登陆成功
    message.success("登录成功");
    router.push({
      path: "/",
      replace: true,
    });
  } else {
    message.error("登录失败 " + res.data.message);
  }
};
</script>

<style>
#userLoginPage {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
