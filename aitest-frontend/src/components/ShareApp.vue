<template>
  <div>{{ link }}</div>
  <img :src="codeImg" />
</template>

<script setup lang="ts">
import QRCode from "qrcode";
import { ref, defineProps } from "vue";

//接收传来的APPID
interface Props {
  appId: string | number;
}
const props = defineProps<Props>();

const link = `http://192.168.2.235:8080/app/detail/${props.appId}`;
const codeImg = ref();

//设置二维码
QRCode.toDataURL(link)
  .then((url) => {
    console.log(url);
    codeImg.value = url;
  })
  .catch((err) => {
    console.error(err);
  });
</script>
