<template>
  <drawer>
    <div class="drawer-route">
      <div>
        <ul class="drawer-ul">
          <li v-for="item in items" :key="item.id">
            <div class="drawer-li">
              <img :src="item.imageUrl" class="drawer-img" />
              <span class="drawer-li-title">{{ item.text }}</span>
            </div>
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
      <div class="drawer-index-header">
        <div class="drawer-index-header-quert-hint">自定义</div>
        <el-tooltip placement="bottom" :visible="tooltipVisible" effect="customized" content="请选择查询开始时间">
          <div>
            <el-date-picker class="el-date-picker-tidal" v-model="queryDateValue" type="datetime" placeholder="查询开始时间"
              value-format="YYYY-MM-DD HH:mm:ss" style="width: 180px " height="50" />
          </div>
        </el-tooltip>
        <div class="drawer-index-header-quert-hint">查询间隔:每</div>
        <el-tooltip placement="bottom" :visible="tooltipIntervalVisible" effect="customized" content="请输入查询间隔">
          <div>
            <el-input v-model="input" placeholder="" clearable style="width:70px"
              oninput="value=value.replace(/^\.+|[^\d.]/g,'')" />
          </div>
        </el-tooltip>
        <div class="drawer-index-header-quert-hint">分钟</div>
        <el-button type="primary" @click="handleHeaderClick()">批量查询</el-button>
      </div>
      <ul class="index-point-detail-ul">
        <li v-for="point in points" :key="point.id">
          <div class="index-point-detail-li">
            <div class="index-point-bg">
              <div class="index-point-title-bg">
                <span class="index-point-text">{{ point.text }}</span>
                <!-- <img class="index-point-img" :src="point.imageUrl" /> -->
                <div class="index-point-storage" @click="handleItemClickStorage(point)">
                  <span>{{ getStorageText(point) }}</span>
                </div>
              </div>
              <EchartItem class="index-point-echart" :chartData="point" :id="point.drawerId" />
            </div>
          </div>
        </li>
      </ul>
    </div>
  </drawer>
  <Map ref="mapRef"></Map>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import Map from "@/layouts/components/Map/index.vue";
import EchartItem from "@/layouts/components/EchartItem/index.vue";
import drawer from "@/layouts/components/drawer/index.vue";
import { GlobalStore } from '@/stores';
import { onMounted } from 'vue';
import * as echarts from 'echarts';
import { Point, StorageKind } from "@/stores/interface";
import { Tide, MultiTide } from '@/api/interface'

import { getLngLatTideApi, getMultiTideApi } from "@/api/modules/tide";
import { ElMessage } from 'element-plus'
const isShowDrawer = false;
function handleClose() {
  console.log("handleclose");
}
const items = reactive([
  { id: 1, text: '', imageUrl: './src/assets/gm_menu_gm_grey600_24dp.png' },
  { id: 2, text: '已关注', imageUrl: './src/assets/saved_filled_24px_grey_650.png' },
  { id: 3, text: '最近', imageUrl: './src/assets/gm_history_grey600_24dp.png' },
])

const mapRef = ref();



const points = reactive<Point[]>([

])


//数据反推 point item 增加
const globalStore = GlobalStore();
console.log("pointList in map", globalStore.pointList);

//vue3的数组监听地址相同无法判别oldnew,序列化转字符串观察
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
  //触发地图移动
  console.log("mapref", mapRef);
  console.log("mapRef.value", mapRef.value);
  mapRef.value.moveToFocusPoint(point);
}

let imageData: any = null;

const reader = new FileReader();

reader.onload = (event) => {
  imageData = event.target!.result;
};

reader.onerror = (event) => {
  console.error('Failed to load image', event);
};

function getStorageText(point: Point) {
  console.log("pointstorage", point.storage);
  console.log("StorageKind.Empty", StorageKind.Empty);

  switch (point.storage) {
    case StorageKind.Empty:
      console.log("switch关注");
      return "关注"
    case StorageKind.Stored:
      console.log("switch已关注");
      return "已关注"

    default:
      console.log("switchdefault");
      return ""
  }
}

function handleItemClickStorage(point: Point) {
  switch (point.storage) {
    case StorageKind.Empty:
      point.storage = StorageKind.Stored;
      const globalStore = GlobalStore();
      console.log("pointList in map after click storage", globalStore.pointList);
      break;
    case StorageKind.Stored:
      point.storage = StorageKind.Empty;
      const globalStore2 = GlobalStore();
      console.log("pointList in map after click storage", globalStore2.pointList);
      break;
    default:
      console.log("switchdefault");
      return;
  }
}
const queryDateValue = ref('');
const input = ref('');
const tooltipVisible = ref(false);
const tooltipIntervalVisible = ref(false);

function handleHeaderClick() {
  if (queryDateValue.value == "" || queryDateValue.value == null) {
    tooltipVisible.value = !tooltipVisible.value;
    setTimeout(function () { tooltipVisible.value = !tooltipVisible.value; }, 2000);
    ElMessage.error('请选择查询开始时间')

  } else if (input.value == "" || input.value == null) {
    tooltipIntervalVisible.value = !tooltipIntervalVisible.value;
    setTimeout(function () { tooltipIntervalVisible.value = !tooltipIntervalVisible.value; }, 2000);
    ElMessage.error('请输入查询间隔')
  } else {
    console.log("queryDateValue 的值", queryDateValue.value);
    console.log("input 的值", input.value);
    const point = points[points.length - 1];
    // points.forEach(function (element) {
    //   console.log("element", element);
    //   getLngLatTide(point.lng, point.lat, queryDateValue.value, parseInt(input.value))
    // })
    getMultiTide(points, queryDateValue.value, parseInt(input.value));
  }
}


async function getLngLatTide(lng: number, lat: number, date_bj: string, interval_minutes: number) {
  const params: Tide.ReqTideParams = {
    lng: lng,
    lat: lat,
    dateBJ: date_bj,
    intervalMinutes: interval_minutes
  };
  const globalStore = GlobalStore();
  const { data } = await getLngLatTideApi(params);
  console.log("responseData", data);
}

//批量查询点位潮高
async function getMultiTide(_points: Point[], _date_bj: string, _interval_minutes: number) {
  const latlngList = _points.map(point => ({ lat: point.lat, lng: point.lng }));
  const latlngListJSON = JSON.stringify(latlngList);
  console.log("latlngList", latlngList);
  const params: MultiTide.ReqMultiTideParams = {
    pointLatlngListJSON: latlngListJSON,
    dateBJ: _date_bj,
    intervalMinutes: _interval_minutes
  };
  const globalStore = GlobalStore();
  const { data } = await getMultiTideApi(params);
  console.log("points.length", points.length);
  console.log("data.point_tide_list", data.point_tide_list.length);

  for (let index = 0; index < points.length; index++) {
    const oldPoint = points[index];
    console.log("element", oldPoint.lat);

    data.point_tide_list.forEach(function (resPoint) {
      console.log("resPoint", resPoint.lat);
      if (oldPoint.lat == resPoint.lat && oldPoint.lng == resPoint.lng) {
        console.log("数据变了", oldPoint.lat);
        oldPoint.data.tides = resPoint.tides;
        oldPoint.data.timesStamp = resPoint.timesStamp;
        // oldPoint.data.tides = [];
        // oldPoint.data.timesStamp = [];
        points.splice(index, 1, oldPoint);
      } else {
        console.log("数据没变", oldPoint.lat);
      }
    })
  }

  //  points.pop();
  console.log("points.length", points.length);



}




</script>
<style>
.drawer-ul,
.point-ul,
.index-point-detail-ul {
  margin: 0;
  overflow-x: hidden;
  scrollbar-width: none;
}

.drawer-route {
  display: flex;
  flex-direction: column;
  box-shadow:0 1px 2px rgba(60,64,67,0.3), 0 2px 6px 2px rgba(60,64,67,0.15);
  z-index: 4;
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
  background-color: #fff;
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
  height: 300px;

}

.index-point-echart {
  width: 300px;
  height: 200px;
}

.index-point-title-bg {
  display: flex;
  flex-direction: row;
}

.index-point-storage {
  width: 50px;
}

.drawer-li-title {
  font-size: 11px;
  color: #70757a;
}

.point-text {
  font-size: 11px;
  color: #70757a;
}

.point-text.clicked {
  font-size: 11px;
  color: #1967d2;
}

.drawer-index-header {
  display: flex;
  flex-direction: row;
}

.drawer-index-header-quert-hint {
  display: flex;
  align-items: center;
}

/* .el-date-picker-tidal {

} */

.el-popper.is-customized {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}

.el-popper.is-customized .el-popper__arrow::before {
  background: linear-gradient(45deg, #b2e68d, #bce689);
  right: 0;
}

/* element.style{
  width: 20px;
}
.el-date-picker-bg {
  width: 20px;
}

/* .el-input,
  .el-select,
  .el-date-editor {
    width: 50px;
    height: 200px;
  }
  .el-input__wrapper{
    width:20px;
  } */
/* } */
</style>