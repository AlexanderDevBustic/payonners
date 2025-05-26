<template>
  <div class="dashboard-layout">
    <Header />
    <div class="container">
      <Sidebar />
      <main class="main-content">
        <Breadcrumb v-if="$route.path !== '/dashboard'" />

        <div v-if="$route.path === '/dashboard'" class="welcome-container">
          <div>
            <img src="../assets/img/logo.png" alt="logo" />
          </div>
          <div>
            Bienvenido de nuevo
          </div>
        </div>

        <router-view v-else></router-view>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from './Header/Header.vue';
import Sidebar from './Sidebar/Sidebar.vue';
import Breadcrumb from '../shared/Breadcrumb/Breadcrumb.vue';

export default defineComponent({
  name: 'Dashboard',
  components: {
    Header,
    Sidebar,
    Breadcrumb,
  },
});
</script>

<style scoped>
@import url(./dashboard-styles.css);
</style>