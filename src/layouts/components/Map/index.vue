<template>
    <div id='myMap' class="mainMap"></div>
</template>
<script setup lang="ts">
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import { onMounted, defineProps, watch, inject, ref } from 'vue'
import { getMapKeystore } from '@/stores/keystore'
// import { getMapKeystore } from '../../../stores/keystore'
onMounted(() =>{
    initMap();
})

function initMap() {
    const vecLayer = L.tileLayer(`https://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${getMapKeystore()}`);
    const myMap = L.map('myMap').setView([51.505, -0.09], 13);
}

</script>
<style>
.mainMap {
    width: 100vw;
    height: 100vh;

}
</style>