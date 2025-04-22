import axios from "axios";

const myAxios = axios.create({
  baseURL: "http://localhost:8101",
  timeout: 10000,
  withCredentials: true,
});

// 添加请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    console.log(response.data);
    const { data } = response.data;

    //未登录
    // if (data.code === 40100) {
    //   //不是获取用户信息的请求，并且用户当前没在登录页面，则跳转到登录页面
    //   if (
    //     !response.request.responseURL.includes("/user/get/login") &&
    //     !window.location.pathname.includes("/user/login")
    //   ) {
    //     window.location.href = `/user/login?redirect=${window.location.href}`;
    //   }
    // }

    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default myAxios;
