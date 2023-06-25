<template>
    <div id='myMap' class="mainMap"></div>
</template>
<script setup lang="ts">
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import { onMounted, defineProps, watch, inject, ref, computed } from 'vue'
import { getMapKeystore } from '@/stores/keystore'
import * as echarts from 'echarts';
import '@/assets/data.ts'
import SQL from 'sql.js';
import initSqlJs from 'sql.js';
import * as TileLnglatTransform from 'tile-lnglat-transform'
// import exampleImg from '@/assets/3.jpg'
import { getLngLatTideApi } from "@/api/modules/tide";
import { Tide } from "@/api/interface"
import { GlobalStore } from '@/stores';
import { ElMessage } from 'element-plus';
import { Point } from '@/stores/interface';


var map: L.Map;
var markerMap: Map<String, L.Marker> = new Map();;
var blobImg;
onMounted(() => {
    initMap();
})


async function initMap() {
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
    // const tidalLayer = L.tileLayer(`http://localhost:8080/TestJava_war_exploded/WebGISHandler?x={x}&y={y}&z={z}`);

    const tidalLayer = L.tileLayer(`http://127.0.0.1:8000/tidal_map/get_tidal?x={x}&y={y}&z={z}`);
    // const tidalLayer = L.tileLayer(`http://localhost:5000/getTidal?x={x}&y={y}&z={z}`);
    // const tidalLayer = L.tileLayer(`http://localhost:5000/get_tidal?x={x}&y={y}&z={z}`);
    // var localLayer = L.tileLayer('Z:/era/map_sea/shipxy/terrain/{z}/{x}/{y}.jpg');
    // var localLayer = L.tileLayer('src/assets/map_sea/shipxy/nterrain/{z}/{x}/{y}.jpg');

    const centerLatlng = L.latLng(-2.811371, 80.15625);
    map = L.map('myMap', {  //需绑定地图容器div的id
        center: [33.837605, 121.490808], //初始地图中心 lat, lng
        zoom: 10, //初始缩放等级
        maxZoom: 13, //最大缩放等级
        minZoom: 4, //最小缩放等级
        zoomControl: false,//不显示缩放小控件
        doubleClickZoom: false//关闭双击放大地图
    });
    tidalLayer.addTo(map);
    var popup = L.popup({
        keepInView: true,
        closeButton: false,
        autoPan: false
    })
        .setLatLng(centerLatlng)
        .setContent('<p>Hello world!<br />This is a nice popup.</p>');


    var TileLnglatTransformGoogle = TileLnglatTransform.TileLnglatTransformGoogle;
    var tileLnglatGoogle = TileLnglatTransformGoogle.pixelToLnglat(0, 0, 740, 520, 10);
    console.log(`tileLnglatGoogle`, tileLnglatGoogle);
    var tileTileGoogle = TileLnglatTransformGoogle.lnglatToTile(80.15625, -2.811371193331131, 10);
    console.log(`tileLnglatGoogle`, tileTileGoogle);
    var idStr = "aaa";
    var popupContent = '<div style="width:350px;height:300px" id="' + idStr + '"></div>';
    // L.marker([33.837605, 121.490808]).addTo(map)
    //     .bindPopup(popupContent)
    //     .on('popupopen', function (e) {

    //         // 补充非空断言 '!'
    //         var myChart = echarts.init(document.getElementById(idStr)!);
    //         // 指定图表的配置项和数据
    //         var option = {
    //             title: {
    //                 text: '测试'
    //             },
    //             tooltip: {},
    //             legend: {
    //                 data: ['销量']
    //             },
    //             xAxis: {
    //                 data: ["衬衫", "羊毛衫", "雪纺衫", "裤子"]
    //             },
    //             yAxis: {},
    //             series: [{
    //                 name: '销量',
    //                 type: 'bar',
    //                 data: [5, 20, 36, 10]
    //             }]
    //         };

    //         // 使用刚指定的配置项和数据显示图表。
    //         myChart.setOption(option);
    //     })
    //     ;


    var MyGridLayer = L.GridLayer.extend({
        createTile: function (coords: any) {
            // 创建一个用于绘图的 <canvas> 元素
            var tile = L.DomUtil.create('canvas', 'leaflet-tile');

            // 根据选项设置瓦片的宽度和高度
            var size = this.getTileSize();
            tile.width = size.x;
            tile.height = size.y;
            console.log(`tileProto`, tile);

            console.log('xyz', coords.z, coords.x, coords.y);

            // 根据 xyz 坐标从数据库中获取 blob 数据
            getBlobFromDatabase(coords.z, coords.x, coords.y).then(function (blob) {

                var ctx = tile.getContext('2d')!;
                const img = new Image();
                img.src = URL.createObjectURL(blob as Blob);
                img.onload = function () {
                    // ctx.width = tile.width;
                    // ctx.height = tile.height;
                    ctx.drawImage(img, 0, 0);
                }
                console.log(`thenfinish`);
            });

            return tile;
        }
    });
    console.log('test');
    console.log('import', import.meta.env.VITE_API_URL);
    let date_bj = "2023-05-03 00:00:00";
    let interval_minutes = 60;
    map.on('dblclick', function (e) {
        console.log("dbclick");
        //获取点击位置的坐标
        var coordinate = [e.latlng.lat, e.latlng.lng];
        //弹框提示点击位置的坐标
        // alert("地图被双击了！点击位置为：" + coordinate);
        //坐标缩小到6位，再将string强转number
        // const globalStore = GlobalStore();
        // globalStore.addPointLngLat( e.latlng.lng, e.latlng.lat);
        getLngLatTide(Number(e.latlng.lng.toFixed(4)),
            Number(e.latlng.lat.toFixed(4)),
            date_bj,
            interval_minutes
        )
    });

    async function getLngLatTide(lng: number, lat: number, date_bj: string, interval_minutes: number) {
        const params: Tide.ReqTideParams = {
            lng: lat,
            lat: lng,
            dateBJ: date_bj,
            intervalMinutes: interval_minutes
        };
        const globalStore = GlobalStore();
        const { data } = await getLngLatTideApi(params);
        createMarker(lng, lat, data);
    }

    function createMarker(lng: number, lat: number, data: Tide.ResTideParams) {
        console.log("data", data);
        //根据接口返回值判断marker图标
        if (typeof data !== 'undefined') {

            const globalStore = GlobalStore();
          
            const mapId = globalStore.addPointLngLatData(lng, lat, data.timesStamp, data.tides);
            //地图基于id产生popupwindow
            var popupContent = '<div style="width:350px;height:300px" id="' + mapId + '"></div>';

            // const echartStatis = echarts.getInstanceByDom(document.getElementById(id + "")!);
            // if(echartStatis == null){
            //     console.log("id已经被使用");
            // }else{
            //     console.log("id未使用");
            // }
            const marker = L.marker([lat, lng]).addTo(map)
                .bindPopup(popupContent)
                .on('popupopen', function (e) {

                    // 补充非空断言 '!'
                    console.log("mapchartID", mapId);
                    var myChart = echarts.init(document.getElementById(mapId + "")!);
                    // 指定图表的配置项和数据
                    var option = {
                        title: {
                            text: '潮汐'
                        },
                        tooltip: {},
                        legend: {
                            data: ['高度/米']
                        },
                        xAxis: {
                            data: data.timesStamp
                        },
                        yAxis: {},
                        series: [
                            {
                                name: '高度/米',
                                type: 'bar',
                                data: data.tides
                            }
                        ]
                    };

                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                });
                const latlng = L.latLng(lat, lng);
                markerMap.set(JSON.stringify(latlng), marker);
        } else {
            ElMessage({
                showClose: true,
                message: '该点无法观测潮汐',
                type: 'error',
            })
            // var icon = L.icon({
            //     //图标地址
            //     iconUrl: "@/assets/arrow_left_2x.png",
            //     //图标大小
            //     iconSize: [38, 95]
            // })
            // var popupContent = '<div style="width:50px; height:50px" id="' + idStr + '"></div>';
            // L.marker([lat, lng]).addTo(map)
            //     .bindPopup(popupContent)
            //     .setIcon(icon)
            //     .on('popupopen', function (e) {
            //         console.log("该pop无数据");
            //         const element = document.getElementById(idStr);
            //         if (element) {
            //             element.textContent = '该pop无数据';
            //         }
            //     });
        }

    }
    console.log(`map`, map);
    async function getBlobFromDatabase(z: string, x: string, y: string) {
        const SQL = await initSqlJs({
            // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
            // You can omit locateFile completely when running in node
            locateFile: file => `https://sql.js.org/dist/sql-wasm.wasm`
        });
        console.log(`ypath`, 1);

        // Open the SQLite database file
        const uInt8Array = new Uint8Array(await (await fetch('/src/assets/identifier2.sqlite')).arrayBuffer());
        const db = new SQL.Database(uInt8Array);
        var sqlstat = "SELECT image FROM Images2 WHERE zpath = " + z + " AND xpath = " + x + " AND ypath = '" + y + ".jpg'";
        const stmt = db.exec(sqlstat);
        console.log(`zxy`, z, x, y);

        console.log(`stmt`, stmt);
        const blobData = stmt[0].values[0][0];
        console.log(`blobData`, blobData);
        // Return the blob data as a Promise
        return new Promise(resolve => {
            const blob = new Blob([(blobData as BlobPart)], { type: 'image/jpeg' });
            const reader = new FileReader();

            reader.onload = function () {
                const result = reader.result;
                resolve(result);
            };
            reader.readAsDataURL(blob);//读取为Base64格式
        });
    }
}

function moveToFocusPoint(point: Point) {

    let latlng = L.latLng(point.lat, point.lng);

    map.setView(latlng, 8);
    console.log("markermap", markerMap);
    console.log("latlng", latlng);
    console.log("point", point.lat, point.lng);
    console.log("markermap", markerMap.get(JSON.stringify(latlng)));
    markerMap.get(JSON.stringify(latlng))?.openPopup();
}

defineExpose({
    moveToFocusPoint
})


// //数据反推 point item 增加
// const globalStore = GlobalStore();
// console.log("pointList in map", globalStore.pointList);


// //vue3的数组监听地址相同无法判别oldnew,序列化转字符串观察
// const computedPoint = computed(() => JSON.parse(JSON.stringify(globalStore.pointList)));
// watch(computedPoint, (newVal, oldVal) => {
//   console.log("newComputedPoint", newVal);
//   console.log("oldComputedPoint", oldVal);

//   if (oldVal.length < newVal.length) {
//     console.log("pointList产生push");
//   }
// })


</script>
<style>
.mainMap {
    width: 100vw;
    height: 100vh;

}
</style>