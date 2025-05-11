<template>
  <div id="userDetailInfo">
    <a-modal
      :visible="props.visible"
      title="个人信息"
      @cancel="handleCancel"
      @before-ok="handleBeforeOk"
    >
      <a-form :model="UserInfoForm">
        <a-form-item field="UserName" label="用户名">
          <a-input
            placeholder="请输入你的用户名"
            v-model="UserInfoForm.UserName"
          />
        </a-form-item>
        <a-form-item field="UserProfile" label="个人简介">
          <a-input
            placeholder="请输入你的个人简介"
            v-model="UserInfoForm.UserProfile"
          />
        </a-form-item>
        <a-form-item field="UserAvatar" label="用户头像">
          <PictureUploader
            :value="UserInfoForm.UserAvatar"
            biz="user_avatar"
            @updateUrl="handleNewUrl"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { updateMyUserUsingPost } from "@/api/userController";
import { useLoginUserStore } from "@/store/userStore";
import message from "@arco-design/web-vue/es/message";
import PictureUploader from "../PictureUploader.vue";
import {
  withDefaults,
  defineProps,
  reactive,
  defineEmits,
  onMounted,
} from "vue";
// import PictureUploader from "../PictureUploader.vue";
const emit = defineEmits(["close-modal"]);
interface Props {
  visible: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
});

const UserInfoForm = reactive({
  UserName: "",
  UserAvatar: "",
  UserProfile: "",
});
const handleBeforeOk = async () => {
  const res = await updateMyUserUsingPost({
    userName: UserInfoForm.UserName,
    userAvatar: UserInfoForm.UserAvatar,
    userProfile: UserInfoForm.UserProfile,
  });
  // console.log(res);
  if (res.data.code === 0) {
    message.success("修改成功");
    //重新获取用户信息
    const loginUserStore = useLoginUserStore();
    loginUserStore.fetchLoginUser();
    const updateUserInfo = loginUserStore?.loginUser;
    localStorage.setItem("loginUser", JSON.stringify(updateUserInfo));
    //重新刷新一次页面
    setTimeout(() => {
      location.reload();
    }, 1000);
  } else {
    message.error("修改失败");
  }
  emit("close-modal");
};
const handleCancel = () => {
  // console.log("点上了");
  emit("close-modal");
};

//获取上传图片的地址
const handleNewUrl = (url: string) => {
  UserInfoForm.UserAvatar = url;
  // console.log(url, "avatarUrl");
};

onMounted(() => {
  if (localStorage.getItem("loginUser")) {
    const res = JSON.parse(localStorage.getItem("loginUser"));
    UserInfoForm.UserName = res.loginUser?.userName;
    UserInfoForm.UserAvatar = res.loginUser?.userAvatar;
    UserInfoForm.UserProfile = res.loginUser?.userProfile;
  }
});
</script>

<style scoped></style>
