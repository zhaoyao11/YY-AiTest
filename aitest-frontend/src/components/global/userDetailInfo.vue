<template>
  <div id="userDetailInfo">
    <a-modal
      :visible="props.visible"
      title="Modal Form"
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
        <a-form-item field="UserAccount" label="用户账号">
          <a-input
            placeholder="请输入你的账号"
            v-model="UserInfoForm.UserAccount"
          />
        </a-form-item>
        <a-form-item field="UserAvatar" label="用户头像">
          <a-input
            placeholder="请上传头像"
            v-model="UserInfoForm.UserAvatar"
          ></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { withDefaults, defineProps, reactive, ref, defineEmits } from "vue";
import PictureUploader from "../PictureUploader.vue";
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
  UserAccount: "",
});
const handleBeforeOk = (done) => {
  window.setTimeout(() => {
    done();
    // prevent close
    // done(false)
  }, 3000);
};
const handleCancel = () => {
  console.log("点上了");
  emit("close-modal");
};
</script>

<style scoped></style>
