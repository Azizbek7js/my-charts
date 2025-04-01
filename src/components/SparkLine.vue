<template>
  <div class="spark-line-container">
    <apexchart
        type="area"
        height="100%"
        :options="chartOptions"
        :series="series"
    ></apexchart>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const series = ref([{
  name: 'value',
  data: [10, 41, 35, 51, 49, 62, 69, 91, 80, 42]
}]);

const chartOptions = ref({
  chart: {
    id: 'realtime',
    type: 'area',
    width: '100%',
    sparkline: {
      enabled: true
    },
    background: 'transparent',
    animations: {
      enabled: true,
      easing: 'linear',
      dynamicAnimation: {
        speed: 1000
      }
    }
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.2,
      stops: [0, 100]
    }
  },
  colors: ['#0284c7'],
  tooltip: {
    theme: 'dark',
    fixed: {
      enabled: false
    },
    x: {
      show: false
    },
    y: {
      title: {
        formatter: function() {
          return 'Value:'
        }
      }
    },
    marker: {
      show: false
    }
  }
});

let interval;

onMounted(() => {
  // Update data every 2 seconds to simulate real-time
  interval = setInterval(() => {
    const newData = [...series.value[0].data];
    newData.shift();
    newData.push(Math.floor(Math.random() * 91) + 10);

    series.value = [{
      name: 'value',
      data: newData
    }];
  }, 2000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<style>
.spark-line-container {
  height: 100% !important;
  width: 100% !important;
}
</style>