<template>
  <drawer>
    <div class="drawer-route">
      <!-- 左主菜单 -->
      <div>
        <ul class="drawer-route-ul">
          <li v-for="item in items" :key="item.id">
            <div class="drawer-li" @click="handleMenuClick(item)" :class="selectedDrawerIndex == item.id ? 'active' : ''">
              <img :src="item.imageUrl" class="drawer-img" />
              <span class="drawer-li-title">{{ item.text }}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="drawer-divider" />
      <!-- 左主点位list -->
      <el-scrollbar class="point-ul">
        <p v-for="point in points" :key="point.id">
        <div class="point-li" :class="{ active: point.active }" @mouseenter="handlePointEnter(point)"
          @mouseleave="handlePointLeave(point)" @click="handlePointClick(point)">
          <div class="point-img-bg">
            <div class="point-img-border" :class="{ clicked: point.clicked }" />
            <img :src="point.imageUrl" class="point-img" :class="{ clicked: point.clicked }" />
          </div>
          <span class="point-text" :class="{ clicked: point.clicked }">{{ point.text }}</span>
        </div>
        </p>
      </el-scrollbar>
    </div>
    <div class="drawer-index">
      <!-- 已关注 -->
      <div class="drawer-index-followed" v-if="isShowFollowedList">
        <div class="drawer-header-followed">
          <div class="drawer-header-followed-arrow-bg" @click="handleClickBackToQueryList()">
            <img class="drawer-header-followed-arrow" src="@/assets/arrow_back_grey800_24dp.png" />
          </div>
          <div class="drawer-header-followed-text-bg">
            <div class="drawer-header-followed-text">
              <div class="drawer-header-followed-text-title">已关注的点位</div>
              <div class="drawer-header-followed-text-points">{{ points.length }}个点位</div>
            </div>
            <div v-if="isShowFollowedList && hasStoredPoints">

            </div>
          </div>
        </div>
        <div class="drawer-header-followed-holder" v-if="showEmptyHolder(points)">
          <div class="drawer-header-followed-holder-text">
            暂无关注的点位
          </div>
        </div>
        <el-scrollbar v-if="isShowFollowedList && hasStoredPoints">
          <template v-for="point in points">
            <p v-if="point.storage == StorageKind.Stored">
            <div class="index-point-followed-li-bg">
              <div class="index-point-followed-li" @click="handleItemClickPointFollowed(point)">
                <div class="index-point-followed-li-text">
                  <div class="index-point-followed-li-title">{{ point.text }}</div>
                  <div class="index-point-followed-li-num">坐标: {{ point.lat }} {{ point.lng }}</div>
                </div>
                <img class="index-point-followed-li-img" src="@/assets/temp_point.jpg" />
              </div>
              <div class="index-point-followed-li-remark">
                <div class="index-point-followed-li-remark-title-bg" @click="dialogFormVisible = true">
                  <div class="index-point-followed-li-remark-title">新增备注:</div>
                </div>
                <div>{{ point.remark }} </div>
                <el-dialog v-model="dialogFormVisible" title="新增备注">
                  <el-form :model="form">
                    <el-input v-model="point.remark" autocomplete="off" type="textarea" />
                  </el-form>
                  <template #footer>
                    <span class="dialog-footer">
                      <el-button @click="dialogFormVisible = false">取消</el-button>
                      <el-button type="primary" @click="dialogFormVisible = false">
                        完成
                      </el-button>
                    </span>
                  </template>
                </el-dialog>
              </div>

              <el-divider></el-divider>
            </div>
            </p>
          </template>
        </el-scrollbar>
      </div>
      <!-- 主界面 -->
      <div class="drawer-index-bg" v-if="isShowQueryList">
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

        <el-scrollbar class="index-point-detail-ul">
          <p v-for="point in points" :key="point.id">
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
          </p>
        </el-scrollbar>

      </div>
      <!-- 最近 -->
      <div class="drawer-index-history" v-if="isShowHistoryList">
        <div @click="handleClickBackToQueryList()">
          <img src="@/assets/arrow_back_grey800_24dp.png" />
        </div>
        <el-timeline>
          <el-timeline-item v-for="point in points" timestamp="2018/4/12" placement="top">
            <el-card>
              <h4>Update Github template</h4>
              <p>Tom committed 2018/4/12 20:46</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
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
const isShowQueryList = ref(true);
const isShowFollowedList = ref(false);
const isShowHistoryList = ref(false);
const dialogFormVisible = ref(false);
let selectedDrawerIndex = ref(1);
function showEmptyHolder(_points: Point[]) {
  let showEmptyHolder = true;
  for (let index = 0; index < points.length; index++) {
    const element = _points[index];
    if (element.storage) {
      showEmptyHolder = false;
    }
  }
  return showEmptyHolder;
};
const form = reactive({
  name: '',
})

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

//关注按钮的点击
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

//顶部查询的点击
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
  console.log("points.length", points.length);
}

//左侧菜单的点击
function handleMenuClick(_item: any) {
  console.log("item", _item);
  selectedDrawerIndex = _item.id;
  switch (_item.id) {
    case 1:
      isShowQueryList.value = true;
      isShowFollowedList.value = false;
      isShowHistoryList.value = false;
      break;
    case 2:
      isShowQueryList.value = false;
      isShowFollowedList.value = true;
      isShowHistoryList.value = false;
      break;
    case 3:
      isShowQueryList.value = false;
      isShowFollowedList.value = false;
      isShowHistoryList.value = true;
      break;
    default:
      break;
  }

}




//顶部返回按钮,重置状态
function handleClickBackToQueryList() {
  selectedDrawerIndex = ref(1);
  isShowQueryList.value = true;
  isShowFollowedList.value = false;
  isShowHistoryList.value = false;
}

const hasStoredPoints = computed(() => {
  return points.some(point => point.storage === StorageKind.Stored);
});

//已关注点位点击后地图对应偏移
function handleItemClickPointFollowed(_point: Point) {
  mapRef.value.moveToFocusPoint(_point);
}
</script>
<style>
.index-point-detail-ul,
.drawer-route-ul,
.point-ul,
.index-point-detail-ul {
  overflow: auto;
}

.index-point-detail-ul {
  height: calc(100vh - 10px);
}

.drawer-route {
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15);
  z-index: 4;
}

.drawer-li,
.point-li {
  height: 72px;
  width: 72px;
  padding-top: 8px;
  margin-top: 2px;
  margin-bottom: 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.drawer-header-followed-arrow-bg:hover,
.drawer-li:hover,
.point-li:hover {
  background-color: #e1e3e5;
}

.drawer-li.active {
  background-color: #e1e3e5;
}

.index-point-followed-li:hover,
.index-point-detail-li:hover,
.drawer-header-followed-holder-text:hover {
  background-color: #f5f7fa;
}

.index-point-followed-li:hover {
  cursor: pointer;
}

.index-point-followed-li-text {
  height: 108px;
  align-items: flex-start;
  justify-content: left;
  display: inline-block;
  flex-direction: column;
  padding-left: 20px;
  padding-top: 10px;
  flex: 1;
}

.index-point-followed-li-bg {
  display: block;
}

.index-point-followed-li {
  height: 80px;
  display: flex;
  padding: 10px 18px 10px 24px;
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
  width: 500px;
  height: 200px;
}

.index-point-title-bg {
  display: flex;
  flex-direction: row;
}

.index-point-storage {
  width: 50px;
}

.index-point-followed-li-remark-title {
  color: #1a73e8;
  padding-left: 40px;
  padding-right: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  font-weight: 500;
  font-size: 0.875em;
  font-family: "Google Sans", Roboto, "Noto Sans TC", Arial, sans-serif;
}

.index-point-followed-li-remark-title-bg:hover {
  background-color: rgba(177, 205, 241, 0.1);
  cursor: pointer;
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


.el-popper.is-customized {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}

.el-popper.is-customized .el-popper__arrow::before {
  background: linear-gradient(45deg, #b2e68d, #bce689);
  right: 0;
}

.drawer-index-followed {
  background-color: #fff;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.drawer-header-followed {
  display: flex;
  flex-direction: row;
  height: 70px;
}

.drawer-header-followed-arrow-bg {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
}

.drawer-header-followed-arrow {
  width: 24px;
  height: 24px;
  flex: 0 0 auto;
}

.drawer-header-followed-text {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: start;
  padding-left: 10px;
  flex-direction: column;
  text-align: center;
}

.drawer-header-followed-text-bg {
  height: 70px;
}

.index-point-followed-li-title {
  font-size: 15px;
  color: #202124;
  font-weight: 500;
  text-align: left;
}

.index-point-followed-li-num {
  margin-top: 20px;
  font-size: 13px;
  color: #70757a;
  text-align: left;
}

.index-point-followed-li-remark {
  display: flex;
  align-items: flex-start;
  flex-direction: row;

}

.index-point-followed-li-img {

  position: relative;
  height: 80px;
  width: 80px;
  margin-left: 10px;
  border-radius: 8px;
  background-position: 50% 50%;
}

.drawer-header-followed-text-title {
  font-weight: 900;
  font-size: 20px;
}

.drawer-header-followed-text-points {
  font-size: 8px;
}

.drawer-header-followed-holder {
  height: 100%;
  width: 100%;
}

.drawer-header-followed-holder-text {
  height: 100%;
  width: 100%;
  padding-top: 200px;
  text-align: center;
}

.drawer-index-bg {
  /* overflow: hidden; */
  /* 固定高度头+剩余的部分填充解决 */
  /* display: flex;
  flex-direction: column; */
  display: block;
  overflow: hidden;
}
</style>