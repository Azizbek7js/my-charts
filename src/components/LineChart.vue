<template>
  <div class="line-chart-container">
    <apexchart
        type="line"
        height="100%"
        :options="chartOptions"
        :series="series"
    ></apexchart>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const series = ref([{
  name: 'value',
  data: [58, 71, 84, 91, 85, 40, 85, 105, 85, 52, 85, 95, 90, 80, 75, 20, 20, 45, 50, 110, 10]
}]);

const chartOptions = ref({
  chart: {
    height: 300,
    type: 'line',
    background: 'transparent',
    toolbar: {
      show: false
    }
  },
  colors: ['#f97316'],
  dataLabels: {
    enabled: false,
    background: {
      enabled: false
    },
    style: {
      colors: ['#f97316']
    }
  },
  stroke: {
    curve: 'straight',
    width: 2
  },
  grid: {
    show: true,
    borderColor: '#000000',
    strokeDashArray: 0,
    position: 'back',
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 10
    }
  },
  xaxis: {
    categories: Array.from({ length: 20 }, (_, i) => i),
    labels: {
      style: {
        colors: '#9ca3af'
      }
    },
    axisBorder: {
      show: true
    },
    axisTicks: {
      show: true
    }
  },
  yaxis: {
    min: -2,
    max: 110,
    tickAmount: 3,
    labels: {
      style: {
        colors: '#9ca3af'
      }
    },
    axisBorder: {
      show: true
    },
    axisTicks: {
      show: true
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    labels: {
      colors: '#9ca3af'
    }
  },
  markers: {
    size: 5,
    colors: ['#f97316'],
    strokeWidth: 0,
    hover: {
      size: 7
    }
  },
  theme: {
    mode: 'dark'
  }
});
</script>

<style>
.line-chart-container {
  height: 100% !important;
  width: 100% !important;
}
</style>