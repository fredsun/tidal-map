<template>
  <el-container>
    <el-header>Header
      <el-form-item label="头像" prop="pass">

      </el-form-item>
      <drawer></drawer>
    </el-header>
    <el-main>
      <drawer
      :isShowDrawer.sync="isShowDrawer"
      title="这是一个title"
      direction="left"
      :beforeClose="handleClose"
      :showCloseIcon="true"
>
      <div>this is div</div>
    </drawer>
        <Map></Map>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Map from "@/layouts/components/Map/index.vue";
// import Map from "../Map/index.vue";
// import exampleImg from '@/assets/3.jpg'
import drawer from "@/layouts/components/drawer/index.vue";
const isShowDrawer = true;
function handleClose (){
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