<template>
  <drawer>
    <div class="drawer-route">
      <div>
        <ul class="drawer-ul">
          <li v-for="item in items" :key="item.id">
            <!-- <button> -->
            <div class="drawer-li">
              <img :src="item.imageUrl" class="drawer-img" />
              <span>{{ item.text }}</span>
            </div>

            <!-- </button> -->
          </li>
        </ul>
      </div>
      <div class="drawer-divider" />
      <ul class="point-ul">
        <li v-for="point in points" :key="point.id">
          <div class="point-li" :class="{ active: point.active }" @mouseenter="handlePointEnter(point)"
            @mouseleave="handlePointLeave(point)" @click="handlePointClick(point)">
            <div class="point-img-bg">
              <div class="point-img-border" :class="{ clicked: point.clicked }" />
              <img :src="point.imageUrl" class="point-img" :class="{ clicked: point.clicked }" />
            </div>
            <span class="point-text" :class="{ clicked: point.clicked }">{{ point.text }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="drawer-index">
      <ul class="index-point-detail-ul">
        <li v-for="point in points" :key="point.id">
          <div class="index-point-detail-li">
            <div class="index-point-bg">
              <div class="index-point-title-bg">
                <span>{{ point.text }}</span>
                <img class="index-point-img" :src="point.imageUrl" />
              </div>

              <EchartItem class="index-point-echart" :chartData="point" :id="point.id" />

            </div>
          </div>
        </li>
      </ul>
    </div>

  </drawer>
  <Map></Map>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import Map from "@/layouts/components/Map/index.vue";
import EchartItem from "@/layouts/components/EchartItem/index.vue";
// import Map from "../Map/index.vue";
// import exampleImg from '@/assets/3.jpg'
import drawer from "@/layouts/components/drawer/index.vue";
import { GlobalStore } from '@/stores';
import { onMounted } from 'vue';
import * as echarts from 'echarts';
import { Point } from "@/stores/interface";
import { Tide } from '@/api/interface'

const isShowDrawer = false;
function handleClose() {
  console.log("handleclose");
}
const items = reactive([
  { id: 1, text: '', imageUrl: './src/assets/gm_menu_gm_grey600_24dp.png' },
  { id: 2, text: '已储存', imageUrl: './src/assets/saved_filled_24px_grey_650.png' },
  { id: 3, text: '最近', imageUrl: './src/assets/gm_history_grey600_24dp.png' },
])



const points = reactive<Point[]>([

])


//数据反推 point item 增加
const globalStore = GlobalStore();
console.log("pointList in map", globalStore.pointList);


const computedPoint = computed(() => JSON.parse(JSON.stringify(globalStore.pointList)));
watch(computedPoint, (newVal, oldVal) => {
  console.log("newComputedPoint", newVal);
  console.log("oldComputedPoint", oldVal);
  if (oldVal.length < newVal.length) {
    console.log("pointList产生push");
    points.push(newVal[newVal.length - 1]);
  }
})


function handlePointEnter(point: Point) {
  //todo
  point.active = false;
}


function handlePointLeave(point: Point) {
  point.active = false;
}


function handlePointClick(point: Point) {
  console.log("click了");
  //点击一个point，还原其他point样式
  for (const p of points) {
    if (p !== point) {
      console.log("进了for");
      p.active = false;
      p.clicked = false;
    }
  }
  console.log("没进for");
  point.clicked = true;
  console.log("click后points", points);
  // const globalStore = GlobalStore();
  // console.log("pointList in map", globalStore.pointList);
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
<style>
.drawer-ul,
.point-ul,
.index-point-detail-ul {
  margin: 0;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
}

.drawer-route {
  display: flex;
  flex-direction: column;
}

.drawer-li,
.point-li {
  height: 72px;
  width: 72px;
  margin-top: 8px;
  margin-bottom: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center
}

.drawer-img {
  width: 24px;
  height: 24px;
  margin: 0 auto;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

/* 删除li前面的点 */
li {
  list-style: none;
  margin: 0;
  padding: 0;
}

.drawer-divider {
  height: 1px;
  background-color: #dadce0;
  margin-top: 24px;
  margin-left: 14px;
  margin-right: 14px;
}

.drawer-index {
  background-color: #1a884a;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.point-li span {
  color: #70757a;
}

.point-li.active span {
  color: black;
}

.point-li span.clicked {
  color: blue;
}

.point-img-bg {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 32px;
  height: 32px;
  justify-content: center;
}

.point-img-border {
  position: absolute;
  height: 32px;
  width: 32px;
  border-radius: 8px;
  box-shadow: 0 0 0 2px #fff;
}

.point-img-border.clicked {
  height: 32px;
  width: 32px;
  box-shadow: inset 0 0 0 2px #fff, 0 0 0 2px #1967d2;
}

.point-img {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.point-text {
  width: 72px;
  height: 24px;
}


.index-point-detail-li {
  width: 100%;
  height: 400px;

}

.index-point-echart {
  width: 300px;
  height: 200px;
}
</style>