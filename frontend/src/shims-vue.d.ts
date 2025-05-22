declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

/// <reference types="echarts" />
/// <reference types="vue-echarts" />