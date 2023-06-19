<template>
    <div class="echart-chart" id="echart-chart-id">

    </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import * as echarts from 'echarts';
import { Tide } from '@/api/interface'
import Map from "@/layouts/components/Map/index.vue";
import '@/assets/data.ts'
import { Point } from "@/stores/interface";

let chartInstance = null;
onMounted(() => {
    console.log("onmounted");
    initChart();
});

//point整个传入
const props = defineProps({
    chartData: {
        type: Object as () => Point | null,
        default: null,
    },
})

const option = {
    title: {
        text: '潮汐'
    },
    tooltip: {},
    legend: {
        data: ['高度/米']
    },
    xAxis: {
        data: props.chartData?.data.timesStamp
    },
    yAxis: {},
    series: [
        {
            name: '高度/米',
            type: 'bar',
            data: props.chartData?.data.tides
        }
    ]
};



function initChart() {
    // setTimeout(() => {
        console.log("echartid" + props.chartData?.id);
        chartInstance = echarts.init(document.getElementById(props.chartData?.drawerId + "")!);
        chartInstance.setOption(option);
        console.log("props", props.chartData?.data);
    // }, 800);
}
</script>

<style>
.echart-chart {
    width: 100%;
    height: 100%;
}
</style>