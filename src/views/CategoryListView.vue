<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Todos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" @ionScrollStart="closeFabList" :scrollEvents="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Todos</ion-title>
        </ion-toolbar>
      </ion-header>
      <div class="flex w-full flex-col overflow-auto">
        <div class="flex w-full flex-wrap justify-around mt-2" v-if="categories.length">
          <ion-card class="w-2/5">
            <router-link :to="{ name: 'todos', params: { category: '全部' } }">
              <ion-card-header>
                <ion-icon :icon="icons.clipboard" size="large" class="text-sky-400"></ion-icon>
              </ion-card-header>
              <ion-card-content>
                <div class="flex flex-col gap-2">
                  <ion-card-title class="text-2xl">全部</ion-card-title>
                  <div class="flex items-center justify-between">
                    <ion-card-subtitle> {{ getUndoTodosLength() }} 项任务待完成 </ion-card-subtitle>
                    <ion-badge color="danger" class="text-xs" v-if="getTodayUndoTodosLength()">
                      {{ getTodayUndoTodosLength() }}
                    </ion-badge>
                  </div>
                </div>
              </ion-card-content>
            </router-link>
          </ion-card>
          <ion-card class="w-2/5" v-for="category in categories" :key="category.id">
            <ion-button
              @click="openNewCategory(category.id)"
              size="small"
              fill="clear"
              class="absolute text-gray-500 top-0 right-0 z-50">
              <ion-icon :icon="icons.createOutline" slot="icon-only" class="opacity-60"></ion-icon>
            </ion-button>
            <router-link
              :to="{
                name: 'todos',
                params: { category: category.category },
              }">
              <ion-card-header>
                <ion-icon
                  size="large"
                  class="text-gray-300"
                  :icon="icons[category.icon]"
                  :style="{ color: category.iconColor ?? '' }"></ion-icon>
              </ion-card-header>
              <ion-card-content>
                <div class="flex flex-col gap-2">
                  <ion-card-title class="text-2xl">{{ category.title }}</ion-card-title>

                  <div class="flex items-center justify-between">
                    <ion-card-subtitle>
                      {{ getUndoTodosLength(category.category) }} 项任务待完成
                    </ion-card-subtitle>
                    <ion-badge
                      color="danger"
                      class="text-xs"
                      v-if="getTodayUndoTodosLength(category.category)">
                      {{ getTodayUndoTodosLength(category.category) }}
                    </ion-badge>
                  </div>
                </div>
              </ion-card-content>
            </router-link>
          </ion-card>
          <ion-card class="w-2/5">
            <router-link :to="{ name: 'todos', params: { category: '其他' } }">
              <ion-card-header>
                <ion-icon
                  :icon="icons.ellipsisHorizontalCircle"
                  size="large"
                  color="medium"></ion-icon>
              </ion-card-header>
              <ion-card-content>
                <div class="flex flex-col gap-2">
                  <ion-card-title class="text-2xl">其他</ion-card-title>
                  <div class="flex items-center justify-between">
                    <ion-card-subtitle>
                      {{ getUndoTodosLength('其他') }} 项任务待完成
                    </ion-card-subtitle>
                    <ion-badge
                      color="danger"
                      class="text-sm"
                      v-if="getTodayUndoTodosLength('其他')">
                      {{ getTodayUndoTodosLength('其他') }}
                    </ion-badge>
                  </div>
                </div>
              </ion-card-content>
            </router-link>
          </ion-card>
          <!-- 占位符，最后一行只有一个时使之不居中 -->
          <ion-card
            class="w-2/5"
            v-if="categories.length % 2 !== 0"
            style="visibility: hidden"></ion-card>
        </div>

        <ion-fab class="fixed bottom-2.5 right-2.5" ref="fabRef">
          <ion-fab-button>
            <ion-icon :icon="icons.add"></ion-icon>
          </ion-fab-button>
          <ion-fab-list side="top" class="-translate-x-10">
            <ion-button color="secondary" @click="openNewCategory()">新建分类</ion-button>
          </ion-fab-list>
          <ion-fab-list side="start">
            <ion-button color="warning" @click="openNewTodo">新建任务</ion-button>
          </ion-fab-list>
        </ion-fab>

        <ion-modal :is-open="isOpenNewCategory" :backdrop-dismiss="false">
          <NewCategory
            @closeNewCategory="isOpenNewCategory = false"
            :currentEditCategory="currentEditCategory" />
        </ion-modal>
        <ion-modal :is-open="isOpenNewTodo" :backdrop-dismiss="false">
          <NewTodo @closeNewTodo="isOpenNewTodo = false" />
        </ion-modal>
      </div>

      <ion-loading :isOpen="isLoadingOpen"></ion-loading>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';
import { onSnapshot, collection } from 'firebase/firestore';
import {
  IonPage,
  IonCard,
  IonCardHeader,
  IonIcon,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
  IonFab,
  IonFabButton,
  IonFabList,
  IonModal,
  IonButton,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonContent,
  IonLoading,
  IonBadge,
} from '@ionic/vue';
import * as icons from 'ionicons/icons';
import { db } from '@/firebase/firebase';
import { useCategories } from '@/store/useCategories';
import { useTodos } from '@/store/useTodos';

import NewCategory from '@/components/NewCategory.vue';
import NewTodo from '@/components/NewTodo.vue';

const { categories } = storeToRefs(useCategories());
const { getCategories } = useCategories();
const { allTodayAndLaterUndoTodos, allUndoTodos } = storeToRefs(useTodos());
const { getTodos } = useTodos();

const isOpenNewCategory = ref(false);
const isOpenNewTodo = ref(false);
const editCategoryId = ref<string | number>('');
const fabRef = ref(null);
const isLoadingOpen = ref(false);

onMounted(async () => {
  isLoadingOpen.value = true;

  await getCategories();
  await getTodos();

  isLoadingOpen.value = false;

  window.addEventListener('click', (e) => {
    if (e.target) {
      const target = e.target as Element;

      if (target.closest('ion-fab')?.tagName === 'ION-FAB') {
        return;
      } else {
        closeFabList();
      }
    }
  });
});

const currentEditCategory: any = computed(() => {
  return !editCategoryId.value
    ? null
    : categories.value.find((category) => category.id === editCategoryId.value);
});

const getUndoTodosLength = (category?: string) => {
  if (category) {
    return allUndoTodos.value.filter((todo) => {
      return todo.category === category && todo.done === false;
    }).length;
  } else {
    return allUndoTodos.value.filter((todo) => todo.done === false).length;
  }
};

const getTodayUndoTodosLength = (category?: string) => {
  if (category) {
    return allTodayAndLaterUndoTodos.value.filter((todo) => {
      return todo.category === category && todo.done === false;
    }).length;
  } else {
    return allTodayAndLaterUndoTodos.value.filter((todo) => todo.done === false).length;
  }
};

function openNewCategory(id?: string | number) {
  closeFabList();
  isOpenNewCategory.value = true;

  if (id) {
    editCategoryId.value = id;
  } else {
    editCategoryId.value = '';
  }
}

function openNewTodo() {
  closeFabList();
  isOpenNewTodo.value = true;
}

function closeFabList() {
  setTimeout(() => {
    if (fabRef.value) fabRef.value.$el.close();
  }, 100);
}

onSnapshot(collection(db, 'categories'), async () => {
  await getCategories();
});
onSnapshot(collection(db, 'todos'), async () => {
  await getTodos();
});
</script>

<style scoped></style>
