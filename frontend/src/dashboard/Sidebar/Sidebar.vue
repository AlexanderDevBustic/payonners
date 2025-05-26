<template>
  <div class="sidebar-wrapper">
    <div
      class="sidebar-container"
      :class="{ collapsed: isCollapsed, active: isActive }"
    >
      <ul class="menu">
        <SidebarMenuItem
          v-for="(item, index) in menuItems"
          :key="index"
          :item="item"
          :isCollapsed="isCollapsed"
          @toggle-menu-item="toggleMenuItem"
        />
      </ul>
    </div>
    <div class="toggle-button" @click="toggleSidebar">
      <i class="material-icons">{{
        isCollapsed ? 'chevron_right' : 'chevron_left'
      }}</i>
    </div>
    <div class="mobile-toggle-button" @click="toggleMobileSidebar">
      <i class="material-icons">menu</i>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref, computed } from 'vue';
  import { sidebarMenu } from '../../router/sidebar-routes';
  import SidebarMenuItem from './SidebarMenuItem.vue';

  export default defineComponent({
    name: 'Sidebar',
    components: { SidebarMenuItem },
    setup() {
      const isCollapsed = ref(true);
      const isActive = ref(false);

      const toggleSidebar = () => {
        isCollapsed.value = !isCollapsed.value;
      };

      const toggleMobileSidebar = () => {
        isCollapsed.value = false;
        isActive.value = !isActive.value;
      };

      const toggleMenuItem = (item: any) => {
        console.log('Menu item toggled:', item);
      };

      const isSmallScreen = computed(() => window.innerWidth <= 768);

      const menuItems = reactive(sidebarMenu);

      return {
        isCollapsed,
        isActive,
        toggleSidebar,
        toggleMobileSidebar,
        menuItems,
        toggleMenuItem,
        isSmallScreen,
      };
    },
  });
</script>

<style scoped>
  @import url(./sidebar-styles.css);
</style>
