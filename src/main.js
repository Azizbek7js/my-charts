// main.js
import { createApp } from 'vue';  // Importing Vue 3's createApp function
import App from './App.vue';       // Main application component
import VueApexCharts from 'vue3-apexcharts';  // For integrating ApexCharts
import mitt from 'mitt';

const eventBus = mitt();
// Global CSS imports
import './assets/main.css';

const app = createApp(App);
app.provide('eventBus', eventBus);
app.use(VueApexCharts);

app.mount('#app');
