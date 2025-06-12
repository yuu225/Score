import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/user";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/LoginView.vue"),
      meta: { requiresAuth: false }
    },
    {
      path: "/home",
      name: "Home",
      component: () => import("../views/HomeView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/students",
      name: "Students",
      component: () => import("../views/Students.vue"),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/courses",
      name: "Courses",
      component: () => import("../views/Courses.vue"),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/grade-entry",
      name: "GradeEntry",
      component: () => import("../views/GradeEntry.vue"),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: "/grade-query",
      name: "GradeQuery",
      component: () => import("../views/GradeQuery.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/statistics",
      name: "Statistics",
      component: () => import("../views/Statistics.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/profile",
      name: "Profile",
      component: () => import("../views/Profile.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/",
      redirect: "/login"
    }
  ]
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("token");
  const userStore = useUserStore();
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresAdmin && !userStore.isAdmin) {
    // 如果需要管理员权限但用户不是管理员，重定向到首页
    next("/home");
  } else {
    next();
  }
});

export default router;
