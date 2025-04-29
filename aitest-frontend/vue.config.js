const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  runtimeCompiler: true, // 确保支持模板编译
  chainWebpack: (config) => {
    config.plugin("define").tap((args) => {
      args[0]["__VUE_PROD_HYDRATION_MISMATCH_DETAILS__"] =
        JSON.stringify(false); // 或者设置为 true
      return args;
    });
  },
});
