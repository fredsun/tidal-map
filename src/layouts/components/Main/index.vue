<template>
  <drawer :isShowDrawer.sync="isShowDrawer" title="这是一个title" direction="left" :beforeClose="handleClose"
    :showCloseIcon="true">
    <div>this is div</div>
  </drawer>
  <Map></Map>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Map from "@/layouts/components/Map/index.vue";
// import Map from "../Map/index.vue";
// import exampleImg from '@/assets/3.jpg'
import drawer from "@/layouts/components/drawer/index.vue";
const isShowDrawer = false;
function handleClose() {
  console.log("handleclose");
}

// var imgSrc = exampleImg;
let imageData: any = null;

const reader = new FileReader();

reader.onload = (event) => {
  imageData = event.target!.result;
};

reader.onerror = (event) => {
  console.error('Failed to load image', event);
};


</script>