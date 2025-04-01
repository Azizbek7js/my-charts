<template>
  <div class="spiral-chart-container">
    <apexchart
        type="radialBar"
        height="100%"
        :options="chartOptions"
        :series="series"
    ></apexchart>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const series = ref([74, 85, 60, 45, 32, 12]);

const chartOptions = ref({
  chart: {
    type: 'radialBar',
    background: 'transparent',
  },
  plotOptions: {
    radialBar: {
      offsetY: 0,
      startAngle: 0,
      endAngle: 360,
      hollow: {
        margin: 0,
        size: '0%',
        background: 'transparent',
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          show: false,
        }
      },
      track: {
        background: '#374151',
        strokeWidth: '100%',
        margin: 5
      }
    }
  },
  colors: ['#a855f7', '#60a5fa', '#2dd4bf', '#4ade80', '#d9f99d', '#fbbf24'],
  labels: ['1-2', '2-3', '3-4', '4-5', '5-6', '7-8'],
  legend: {
    show: true,
    floating: true,
    fontSize: '16px',
    position: 'top',
    horizontalAlign: 'center',
    offsetX: 0,
    offsetY: -10,
    labels: {
      useSeriesColors: true,
    },
    markers: {
      width: 12,
      height: 12,
      radius: 0,
    }
  },
  theme: {
    mode: 'dark'
  }
});
</script>

<style>
.spiral-chart-container {
  width: 100%;
  height: 100% !important;
}
</style>