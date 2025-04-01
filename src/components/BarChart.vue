<template>
  <div class="bar-chart-container">
    <apexchart
        type="bar"
        height="320"
        :options="chartOptions"
        :series="series"
    ></apexchart>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const series = ref([
  {
    name: 'pv',
    data: [-75, 40, -80, -80, -80, 10, 50, -60, -20, -40, -20, -50, 0, 100, 20, 0, 0, -30, 80, -70]
  },
  {
    name: 'uv',
    data: [85, 40, -80, -80, 10, 50, -60, 80, -20, 50, -20, 60, 20, 100, -10, 0, 0, 80, 0, -70]
  }
]);

const chartOptions = ref({
  chart: {
    type: 'bar',
    stacked: false,
    background: 'transparent',
    toolbar: {
      show: false
    }
  },
  colors: ['#a855f7', '#4ade80'],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '90%',
    },
  },
  dataLabels: {
    enabled: false
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
    min: -100,
    max: 100,
    tickAmount: 4,
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
    horizontalAlign: 'center',
    offsetY: 0,
    labels: {
      colors: '#9ca3af'
    }
  },
  theme: {
    mode: 'dark'
  }
});
</script>

<style>
.bar-chart-container {
  width: 100%;
}
</style>