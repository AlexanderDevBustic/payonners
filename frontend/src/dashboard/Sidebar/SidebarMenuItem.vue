<template>
  <li class="menu-item-container">
    <div v-if="item.routeName == 'chat'" class="circle-notifications">+99</div>

    <template v-if="isStandaloneItem(item)">
      <router-link
        v-if="item.routeName"
        :to="{ name: item.routeName }"
        custom
        v-slot="{ navigate }"
      >
        <div
          class="menu-item"
          :class="{ active: isAnyChildActive(item) }"
          @click="navigate"
        >
          <span v-if="item.icon" class="icon">
            <i class="material-icons">{{ item.icon }}</i>
          </span>
          <span class="label" v-if="!isCollapsed">{{ item.label }}</span>
        </div>
      </router-link>
    </template>

    <template v-else>
      <div
        class="menu-item"
        :class="{ active: isAnyChildActive(item) }"
        @click="toggleMenuItem(item)"
      >
        <span v-if="item.icon" class="icon">
          <i class="material-icons">{{ item.icon }}</i>
        </span>
        <span class="label" v-if="!isCollapsed">{{ item.label }}</span>
        <span
          v-if="hasChildren(item) && !isStandaloneItem(item) && !isCollapsed"
          class="arrow-icon"
        >
          <i class="material-icons">
            {{ item.expanded ? 'expand_less' : 'expand_more' }}
          </i>
        </span>
      </div>

      <ul v-if="hasChildren(item) && item.expanded" class="submenu">
        <SidebarMenuItem
          v-for="(child, childIndex) in visibleChildren(item)"
          :key="childIndex"
          :item="child"
          :isCollapsed="isCollapsed"
          @toggle-menu-item="$emit('toggle-menu-item', $event)"
        />
      </ul>
    </template>
  </li>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { useRoute } from 'vue-router';
  import type { MenuItem } from '../../router/sidebar-routes';

  export default defineComponent({
    name: 'SidebarMenuItem',
    props: {
      item: {
        type: Object as () => MenuItem,
        required: true,
      },
      isCollapsed: {
        type: Boolean,
        required: true,
      },
    },
    emits: ['toggle-menu-item'],
    setup(_, { emit }) {
      const route = useRoute();

      const hasChildren = (item: MenuItem): boolean => {
        return !!item.children && item.children.length > 0;
      };

      const hasVisibleChildren = (item: MenuItem): boolean => {
        return (
          !!item.children &&
          item.children.some((child) => child.visible !== false)
        );
      };

      const visibleChildren = (item: MenuItem): MenuItem[] => {
        if (!item.children) return [];
        return item.children.filter((child) => child.visible !== false);
      };

      const toggleMenuItem = (item: MenuItem) => {
        if (hasChildren(item)) {
          item.expanded = !(item.expanded ?? false);
          emit('toggle-menu-item', item);
        }
      };

      const isAnyChildActive = (item: MenuItem): boolean => {
        const currentRouteName = route.name;

        const checkChildren = (children: MenuItem[] | undefined): boolean => {
          if (!children) return false;
          return children.some((child) => {
            if (child.routeName === currentRouteName) return true;
            return checkChildren(child.children);
          });
        };

        if (item.routeName === currentRouteName) return true;

        return !!item.children && checkChildren(item.children);
      };

      const isStandaloneItem = (item: MenuItem): boolean => {
        return !hasVisibleChildren(item);
      };

      return {
        hasChildren,
        hasVisibleChildren,
        visibleChildren,
        toggleMenuItem,
        isAnyChildActive,
        isStandaloneItem,
      };
    },
  });
</script>

<style scoped>
  @import url(./sidebar-styles.css);
</style>
