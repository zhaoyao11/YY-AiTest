<template>
  <div id="userLoginPage">
    <h2 style="margin-bottom: 16px">用户注册</h2>
    <a-form
      :style="{ width: '480px', margin: '0 auto' }"
      label-align="left"
      auto-label-width
      @submit="onClickSubmit"
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

      <a-form-item
        field="checkPassword"
        tooltip="密码不小于 8 位"
        label="确认密码"
      >
        <a-input-password
          v-model="form.checkPassword"
          placeholder="请再次输入密码"
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
            注册
          </a-button>
          <a-link href="/user/login">老用户登录</a-link>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import API from "@/api";
import { userRegisterUsingPost } from "@/api/userController";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";

const router = useRouter();

const form = ref<API.UserRegisterRequest>({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
});

const onClickSubmit = async () => {
  const res = await userRegisterUsingPost(form.value);
  console.log(res);
  if (res.data.code === 0) {
    // 注册成功
    message.success("注册成功");
    router.push({
      path: "/user/login",
      replace: true,
    });
  } else {
    message.error("注册失败 " + res.data.message);
  }
};
</script>

<style></style>
