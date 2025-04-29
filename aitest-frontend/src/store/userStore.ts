import ACCESS_ENUM from "@/access/accessEnum";
import { getLoginUserUsingGet } from "@/api/userController";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoginUserStore = defineStore(
  "loginUser",
  () => {
    const loginUser = ref<API.LoginUserVO>({
      userName: "未登录",
    });

    function setLoginUser(newLoginUser: API.LoginUserVO) {
      loginUser.value = newLoginUser;
    }

    async function fetchLoginUser() {
      const res = await getLoginUserUsingGet();
      if (res.data.code === 0 && res.data.data) {
        loginUser.value = res.data.data;
      } else {
        loginUser.value = { userRole: ACCESS_ENUM.NOT_LOGIN };
      }
    }

    //退出登录
    function logout() {
      loginUser.value = { userName: "未登录", userRole: ACCESS_ENUM.NOT_LOGIN };
      //清除持久化
      localStorage.removeItem("loginUser");
    }

    return {
      loginUser,
      setLoginUser,
      fetchLoginUser,
      logout,
    };
  },
  {
    persist: true, // 持久化存储
  }
);
