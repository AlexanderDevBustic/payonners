export interface MenuItem {
  icon?: string;
  label: string;
  expanded?: boolean;
  children?: MenuItem[];
  routeName?: string;
  path?: string;
  component?: () => Promise<any>;
  visible?: boolean;
  role?: string[];
}

export const sidebarMenu: MenuItem[] = [
  {
    icon: 'home',
    label: 'Inicio',
    routeName: 'home',
    component: () => import('../modules/Home/Home.vue'),
    role: ["ADMIN", "USER"]
  },
  {
    icon: 'payments',
    label: 'Retirar y convertir',
    routeName: 'withdraw',
    component: () => import('../modules/Withdraw/Withdraw.vue'),
     role: ["ADMIN", "USER"]
  },
  {
    icon: 'list',
    label: 'Administrar',
    routeName: 'administrator',
    component: () => import('../modules/Administrator/Administrator.vue'),
     role: ["ADMIN", "USER"]
  },
  {
    icon: 'list',
    label: 'Agregar fondos',
    routeName: 'funds',
    component: () => import('../modules/AddFunds/AddFunds.vue'),
     role: ["ADMIN"]
  },
  {
    icon: 'list',
    label: 'Retirar fondos',
    routeName: 'funds-withdraw',
    component: () => import('../modules/WithdrawFunds/WithdrawFunds.vue'),
     role: ["ADMIN"]
  },
]
