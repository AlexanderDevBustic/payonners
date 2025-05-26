import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { authGuard } from '../auth/auth-guard';
import { generateRoutesFromMenu } from './routes';
import { sidebarMenu } from './sidebar-routes';

import Auth from '../auth/Auth.vue';
import Register from '../auth/Register.vue';
import RegisterPayment from '../auth/RegisterPayment.vue';
import Dashboard from '../dashboard/Dashboard.vue';
import RegisterAmount from '../auth/RegisterAmount.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'auth',
    component: Auth,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/register-payment',
    name: 'register-payment',
    component: RegisterPayment,
  },
  {
    path: '/register-amount',
    name: 'register-amount',
    component: RegisterAmount,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: generateRoutesFromMenu(sidebarMenu),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authGuard);

export default router;
