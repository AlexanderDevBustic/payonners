import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export const authGuard = (
  to: RouteLocationNormalized,
  _: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const isAuthenticated = !!localStorage.getItem("AUTH_TOKEN");

  if (to.name === 'auth' && isAuthenticated) {
    return next({ name: 'dashboard' });
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'auth' });
  }

  next();
};