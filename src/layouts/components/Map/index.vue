<template>
    <div id='myMap' class="mainMap"></div>
    <el-form-item label="头像" prop="pass">
        <img v-bind:src="imageData" style="width: 100px;">
        <button @click="saveImage">Save Image</button>
    </el-form-item>
</template>
<script setup lang="ts">
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import { onMounted, defineProps, watch, inject, ref } from 'vue'
import { getMapKeystore } from '@/stores/keystore'
import * as echarts from 'echarts';
import '@/assets/data.ts'
import SQL from 'sql.js';
import initSqlJs from 'sql.js';
import * as TileLnglatTransform from 'tile-lnglat-transform'
// import exampleImg from '@/assets/3.jpg'


var map;
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
    var localLayer = vecLayer;
    // var localLayer = L.tileLayer('Z:/era/map_sea/shipxy/terrain/{z}/{x}/{y}.jpg');
    // var localLayer = L.tileLayer('src/assets/map_sea/shipxy/terrain/{z}/{x}/{y}.jpg');

    let centerLatlng = [-2.811371, 80.15625];
    map = L.map('myMap', {  //需绑定地图容器div的id
        center: [-2.811371, 80.15625], //初始地图中心 lat, lng
        zoom: 10, //初始缩放等级
        maxZoom: 18, //最大缩放等级
        minZoom: 0, //最小缩放等级
        zoomControl: false,//不显示缩放小控件
        layers: localLayer
    });
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
    L.marker([-2.811371, 80.15625]).addTo(map)
        .bindPopup(popupContent)
        .on('popupopen', function (e) {

            var myChart = echarts.init(document.getElementById(idStr));
            // 指定图表的配置项和数据
            var option = {
                title: {
                    text: '测试'
                },
                tooltip: {},
                legend: {
                    data: ['销量']
                },
                xAxis: {
                    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子"]
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: [5, 20, 36, 10]
                }]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        })
        ;

    //====


    // const imageUrl = image;
    // const getImageBytes = async () => {
    //     const response = await fetch(imageUrl);
    //     const buffer = await response.arrayBuffer();
    //     const bytes = new Uint8Array(buffer);
    //     console.log(bytes); // 输出二进制字节
    //     const SQL = await initSqlJs({
    //         // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
    //         // You can omit locateFile completely when running in node
    //         locateFile: file => `https://sql.js.org/dist/sql-wasm.wasm`
    //     });
    //     // 创建 XMLHttpRequest 对象并请求 SQLite 数据库文件
    //     var xhr = new XMLHttpRequest();
    //     xhr.open('GET', '/src/assets/identifier2.sqlite', true);
    //     xhr.responseType = 'arraybuffer';
    //     xhr.onload = function (e) {
    //         var uInt8Array = new Uint8Array(this.response);
    //         // 打开 SQLite 数据库文件
    //         var db = new SQL.Database(uInt8Array);
    //         // 查询数据

    //         // db.run("INSERT INTO table_name1 (col_num, tile_file_name, tile_origin_path, tile_blob_data) VALUES (2, 2, 2, '${bytes}');");
    //         // db.run("INSERT INTO table_name1  VALUES (2, 2, 2, '${bytes}');");
    //         console.log(`run insert`);
    //         // var res = db.exec("SELECT * FROM table_name1")
    //         var res = db.exec("SELECT * FROM Images2")
    //         console.log("res", res);
    //         var res = db.exec("SELECT image FROM Images2 WHERE zpath = 10 AND xpath = 740 AND ypath = '520.jpg'")
    //         // var res = db.exec("SELECT ypath FROM Images2 WHERE zpath = 10 AND xpath = 740 AND ypath = '520.jpg'")
    //         // 处理查询结果
    //         console.log("res", res);
    //     };
    //     xhr.send();

    // };

    // getImageBytes();


    //=====

    // const SQL = await initSqlJs({
    //         // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
    //         // You can omit locateFile completely when running in node
    //         locateFile: file => `https://sql.js.org/dist/sql-wasm.wasm`
    //     });

    // // 加载数据库文件
    // const xhr = new XMLHttpRequest();
    // xhr.open('GET', '/src/assets/identifier2.sqlite', true);
    // xhr.responseType = 'arraybuffer';
    // xhr.onload = async function () {
    //     const data = new Uint8Array(xhr.response);
    //     const db = new SQL.Database(data);

    //     // 读取瓦片图像数据
    //     const stmt = db.prepare('SELECT image FROM Images2 WHERE zpath = :z AND xpath = :x AND ypath = :y');
    //     const tilePromise = (z, x, y) => new Promise((resolve, reject) => {
    //         const tile = L.tileLayer('');

    //         stmt.getAsObject({ ':z': z, ':x': x, ':y': y }, row => {
    //             console.log(`findinter`, z,x,y);
    //             if (row && row.data) {

    //                 // 将 Blob 数据转换为 Base64 字符串
    //                 const blob = new Blob([row.data], { type: 'image/png' });
    //                 const reader = new FileReader();
    //                 reader.onload = function () {
    //                     const url = reader.result;
    //                     tile.setUrl(url);
    //                     resolve(tile);
    //                 }
    //                 reader.onerror = function () {
    //                     reject(reader.error);
    //                 }
    //                 reader.readAsDataURL(blob);
    //             } else {
    //                 resolve(null);
    //             }
    //         });
    //     });

    //     // 创建地图并加载瓦片图层

    //     // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    //     L.tileLayer('penstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    //     const tiles = L.gridLayer({ tileSize: 256, updateWhenIdle: true });
    //     tiles.createTile = function (coords) {
    //         return tilePromise(coords.z, coords.x, coords.y);
    //     }
    //     tiles.addTo(map);
    // }
    // xhr.send();

    //========
    var MyGridLayer = L.GridLayer.extend({
        createTile: function (coords) {

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

                // // 将 blob 数据转换成 URL，用于替换瓦片的 src
                // console.log('blob', blob);
                // let binaryData = [];
                // binaryData.push(blob);
                // var url = window.URL.createObjectURL(new Blob(binaryData));
                // // var url = URL.createObjectURL(blob);
                // const blobImg = new Blob([blob], { type: 'image/png' });
                // tile.src = URL.createObjectURL(blobImg);
                var ctx = tile.getContext('2d');
                const img = new Image();
                img.src = blob;
                img.onload = function () {
                    ctx.width = tile.width;
                    ctx.height = tile.height;
                    ctx.drawImage(img, 0, 0);
                }
                console.log(`thenfinish`);
            });

            // var ctx = tile.getContext('2d');
            // const img = new Image();
            // img.src = exampleImg;
            // img.onload = function () {
            //     ctx.width = tile.width;
            //     ctx.height = tile.height;
            //     ctx.drawImage(img, 0, 0);
            // }
            return tile;
        }
    });

    // 创建自定义瓦片图层实例，并添加到地图上
    const myGridLayer = new MyGridLayer();
    myGridLayer.addTo(map);
    cvaLayer.addTo(map);
    console.log(`map`, map);
    localLayer = myGridLayer

    async function getBlobFromDatabase(z, x, y) {
        const SQL = await initSqlJs({
            // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
            // You can omit locateFile completely when running in node
            locateFile: file => `https://sql.js.org/dist/sql-wasm.wasm`
        });
        console.log(`ypath`, 1);

        // Open the SQLite database file
        const uInt8Array = new Uint8Array(await (await fetch('/src/assets/identifier2.sqlite')).arrayBuffer());
        const db = new SQL.Database(uInt8Array);

        // const stmt = db.prepare('SELECT image FROM Images2 WHERE zpath = ? AND xpath = ? AND ypath = ?');
        var sqlstat = "SELECT image FROM Images2 WHERE zpath = " + z + " AND xpath = " + x + " AND ypath = '" + y + ".jpg'";
        const stmt = db.exec(sqlstat);
        // const result = stmt.getAsObject({':zval' : z, ':xval' : x,'yval':y+'.jpg'});
        // console.log(`result`,result);
        // const stmt = db.prepare('SELECT ypath FROM Images2 WHERE zpath = ? AND xpath = ? AND ypath = ?');
        // const stmt = db.prepare("SELECT ypath FROM Images2 WHERE zpath = 10 AND xpath = 740 AND ypath = '520.jpg'");
        console.log(`zxy`,z,x,y);
        // stmt.bind([z, x, y]);
        // var stmt = db.exec("SELECT image FROM Images2 WHERE zpath = 10 AND xpath = 740 AND ypath = '425.jpg'")
        // var res = db.exec("SELECT ypath FROM Images2 WHERE zpath = 10 AND xpath = 740 AND ypath = '520.jpg'")
        // console.log(`res`, res);
        // const row = stmt.get();
        // stmt.get();
        console.log(`stmt`,stmt);
        const blobData = stmt[0].values[0][0];
        console.log(`blobData`, blobData);
        readBlobToImg(blobData);
        // Return the blob data as a Promise
        return new Promise(resolve => {
            const blob = new Blob([blobData], { type: 'image/jpeg' });
            const reader = new FileReader();
            reader.onload = function () {
                const result = reader.result;
                resolve(result);
            };
            reader.readAsDataURL(blob);
            // stmt.free()
        });

    }

}

// let imageData = null;

// const reader = new FileReader();

// reader.onload = (event) => {
//     imageData = event.target.result;
// };

// reader.onerror = (event) => {
//     console.error('Failed to load image', event);
// };

// const saveImage = () => {
//     console.log(`blobImg`, blobImg);
//     const blob = new Blob([blobImg], { type: 'image/jpeg' });
//     reader.readAsArrayBuffer(blob);
// };

function readBlobToImg(blobData) {
    // console.log(`exampleImg`, exampleImg);
    // var imgSrc = exampleImg;
    console.log(`blobData`, blobData);
    blobImg = blobData;
}

</script>
<style>
.mainMap {
    width: 100vw;
    height: 100vh;

}
</style>