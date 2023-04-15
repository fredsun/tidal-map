<template>
    <el-container>
        <el-header>Header
            <el-form-item label="头像" prop="pass">
                <img v-bind:src="imageData" style="width: 100px;">
                <button @click="saveImage">Save Image</button>
            </el-form-item>
        </el-header>
        <el-main>
            <Map></Map>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Map from "@/layouts/components/Map/index.vue";
// import Map from "../Map/index.vue";
// import exampleImg from '@/assets/3.jpg'
import exampleImg from '@/assets/blobmap.txt'
console.log(`exampleImg`, exampleImg);
// var imgSrc = exampleImg;
let imageData = null;

const reader = new FileReader();

reader.onload = (event) => {
  imageData = event.target.result;
};

reader.onerror = (event) => {
  console.error('Failed to load image', event);
};

const saveImage = () => {
  reader.readAsArrayBuffer(exampleImg);
};
</script>