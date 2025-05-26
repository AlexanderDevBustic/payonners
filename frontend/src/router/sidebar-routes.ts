export interface MenuItem {
  icon?: string;
  label: string;
  expanded?: boolean;
  children?: MenuItem[];
  routeName?: string;
  path?: string;
  component?: () => Promise<any>;
  visible?: boolean;
}

export const sidebarMenu: MenuItem[] = [
  {
    icon: 'home',
    label: 'Inicio',
    routeName: 'home',
    component: () => import('../modules/Home/Home.vue'),
  },
  {
    icon: 'payments',
    label: 'Retirar y convertir',
    routeName: 'withdraw',
    component: () => import('../modules/Withdraw/Withdraw.vue'),
  },
  {
    icon: 'list',
    label: 'Administrar',
    routeName: 'administrator',
    component: () => import('../modules/Administrator/Administrator.vue'),
  },
]
