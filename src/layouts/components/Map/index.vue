<template>
    <div id='myMap' class="mainMap"></div>
</template>
<script setup lang="ts">
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import { onMounted, defineProps, watch, inject, ref } from 'vue'
import { getMapKeystore } from '@/stores/keystore'
import * as echarts from 'echarts';

var map;
onMounted(() => {
    initMap();
})

function initMap() {
    const vecLayer = L.tileLayer(`https://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${getMapKeystore()}`);
    const cvaLayer = L.tileLayer(`https://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${getMapKeystore()}`);
    const imgLayer = L.tileLayer(`https://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${getMapKeystore()}`);
    const ciaLayer = L.tileLayer(`https://t0.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${getMapKeystore()}`);
     //矢量图层组
    const vecLayerGroup = L.layerGroup([vecLayer, cvaLayer])
     //影像图层组
    const imgLayerGroup = L.layerGroup([imgLayer, ciaLayer])
    var baseLayers = {
    "天地图矢量": vecLayerGroup,
    "天地图影像": imgLayerGroup
  };
  let centerLatlng = [32.063417, 118.849672];
  map = L.map('myMap', {  //需绑定地图容器div的id
    center: [32.659122,114.311576], //初始地图中心
    zoom: 13, //初始缩放等级
    maxZoom: 18, //最大缩放等级
    minZoom: 0, //最小缩放等级
    zoomControl: false,//不显示缩放小控件
    layers: [vecLayerGroup]
  });
  var popup = L.popup({
    keepInView: true,
    closeButton: false,
    autoPan:false
  })
    .setLatLng(centerLatlng)
    .setContent('<p>Hello world!<br />This is a nice popup.</p>');
    
  L.marker([32.063417, 118.849672]).addTo(map)
    .bindPopup(popup)
    ;
}

</script>
<style>
.mainMap {
    width: 100vw;
    height: 100vh;

}
</style>