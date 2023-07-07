<template>
    <div class="echart-chart" id="echart-chart-id">

    </div>
</template>
<script setup lang="ts">
import { onMounted, computed } from 'vue';
import * as echarts from 'echarts';
import { Tide } from '@/api/interface'
import Map from "@/layouts/components/Map/index.vue";
import '@/assets/data.ts'
import { Point } from "@/stores/interface";
import { watch } from 'vue';
import { Option } from 'element-plus/es/components/select-v2/src/select.types';

//point整个传入
const props = defineProps({
    chartData: {
        type: Object as () => Point | null,
        default: null,
    },
})
let chartInstance: echarts.ECharts ;




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
            type: 'line',
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

//vue3的数组监听地址相同无法判别oldnew,序列化转字符串观察
const computedPoint = computed(() => JSON.parse(JSON.stringify(props.chartData)));
watch(computedPoint, (newVal, oldVal) => {
    console.log("newComputedPoint", newVal);
    console.log("oldComputedPoint", oldVal);
    updateChart(newVal);
})


function updateChart(params: Point) {
    chartInstance.setOption({
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
                type: 'line',
                data: props.chartData?.data.tides
            }
        ]
    }
    )
}

onMounted(() => {
    console.log("onmounted");
    initChart();
});
</script>

<style>
.echart-chart {
    width: 100%;
    height: 100%;
}
</style>