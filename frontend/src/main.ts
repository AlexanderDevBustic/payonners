import { createApp } from 'vue';
import VChart from 'vue-echarts';
import * as echarts from 'echarts';
import App from './App.vue';
import router from './router';

import './main.css';
import './colors.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import '../node_modules/cropperjs/dist/cropper.min.css';
import '../node_modules/@fullcalendar/core';

const app = createApp(App);

app.component('VChart', VChart);

app.config.globalProperties.$echarts = echarts;

app.use(router).mount('#app');