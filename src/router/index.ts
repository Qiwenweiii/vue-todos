import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import CategoryListView from '@/views/CategoryListView.vue';
import TodoListView from '@/views/TodoListView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/categories',
  },

  {
    path: '/categories',
    name: 'CategoryList',
    component: CategoryListView,
  },
  {
    path: '/todos/:category',
    name: 'todos',
    component: TodoListView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
