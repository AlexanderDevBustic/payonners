import type { RouteRecordRaw } from 'vue-router';
import type { MenuItem } from './sidebar-routes';

const kebabCase = (str: string): string =>
  str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

export const generateRoutesFromMenu = (
  menu: MenuItem[],
  parentPath = '/dashboard'
): RouteRecordRaw[] => {
  return menu.flatMap((item) => {
    if (!item.routeName) {
      console.warn(`Skipping menu item with missing routeName: ${item.label}`);
      return [];
    }

    const fullPath = `${parentPath}/${kebabCase(item.routeName)}`;
    const routes: RouteRecordRaw[] = [];

    if (item.component) {
      routes.push({
        path: fullPath,
        name: item.routeName,
        component: item.component,
      });
    } else {
      routes.push({
        path: fullPath,
        name: item.routeName,
        component: () => import('../shared/Breadcrumb/EmptyRoute.vue'),
      });
    }

    if (item.children && item.children.length > 0) {
      routes.push(...generateRoutesFromMenu(item.children, fullPath));
    }

    return routes;
  });
};