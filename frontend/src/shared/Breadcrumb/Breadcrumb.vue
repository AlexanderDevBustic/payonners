<template>
  <nav class="breadcrumb">
    <ul>
      <li v-for="(item, index) in breadcrumbs" :key="index">
        <span
          :class="{ active: isActive(item.routeName) }"
          @click="navigateTo(item.routeName)"
          :style="{ cursor: 'pointer' }"
        >
          {{ item.label }}
        </span>
        <span v-if="index < breadcrumbs.length - 1" class="separator">/</span>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
  import { defineComponent, ref, watchEffect } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { sidebarMenu } from '../../router/sidebar-routes';
  import type { MenuItem } from '../../router/sidebar-routes';
  import type { RouteLocationNormalizedLoaded } from 'vue-router';

  interface BreadcrumbItem {
    label: string;
    routeName: string;
  }

  export default defineComponent({
    name: 'Breadcrumb',
    props: {
      extraItems: {
        type: Array as () => BreadcrumbItem[],
        default: () => [],
      },
    },
    setup(props) {
      const route = useRoute();
      const router = useRouter(); 
      const breadcrumbs = ref<BreadcrumbItem[]>([]);

      const findBreadcrumbTrail = (
        menu: MenuItem[],
        currentRoute: RouteLocationNormalizedLoaded,
        trail: BreadcrumbItem[] = []
      ): BreadcrumbItem[] | null => {
        for (const item of menu) {
          if (!item.routeName) continue;

          if (item.routeName === currentRoute.name) {
            return [...trail, { label: item.label, routeName: item.routeName }];
          }

          if (item.children) {
            const childTrail = findBreadcrumbTrail(
              item.children,
              currentRoute,
              [...trail, { label: item.label, routeName: item.routeName }]
            );
            if (childTrail) return childTrail;
          }
        }
        return null;
      };

      watchEffect(() => {
        const baseTrail = findBreadcrumbTrail(sidebarMenu, route) || [];
        const metaBreadcrumb = route.meta?.breadcrumb as
          | BreadcrumbItem[]
          | undefined;

        breadcrumbs.value = [
          ...baseTrail,
          ...(metaBreadcrumb || []),
          ...props.extraItems,
        ];
      });

      const isActive = (routeName: string): boolean =>
        route.name === routeName && typeof route.name === 'string';

      const navigateTo = (routeName: string): void => {
        if (route.name !== routeName) {
          router.push({ name: routeName });
        }
      };

      return { breadcrumbs, isActive, navigateTo };
    },
  });
</script>

<style scoped>
  @import url(./breadcrumb-styles.css);
</style>
