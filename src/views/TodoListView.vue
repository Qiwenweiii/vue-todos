<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            color="medium"
            text=" "
            :icon="icons.chevronBack"
            default-href="/categories"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ categoryTitle.toUpperCase() }} </ion-title>
        <ion-icon :icon="icons.ellipsisVertical" slot="end" class="text-2xl"></ion-icon>
      </ion-toolbar>
    </ion-header>

    <ion-content class="overflow-auto">
      <ion-header collapse="condense">
        <ion-toolbar class="text-center">
          <div style="height: 40px">
            <ion-icon
              :icon="icons.clipboard"
              color="primary"
              size="large"
              v-if="categoryTitle === '全部'"></ion-icon>
            <ion-icon
              :icon="icons.ellipsisHorizontalCircle"
              color="medium"
              size="large"
              v-else-if="categoryTitle === '其他'"></ion-icon>
            <template v-else>
              <ion-icon
                size="large"
                class="text-gray-300"
                :icon="icons[currentCategory.icon]"
                :style="{ color: currentCategory.iconColor ?? '' }"
                v-if="currentCategory"></ion-icon>
            </template>
          </div>
          <h2 class="text-2xl">{{ categoryTitle.toUpperCase() }}</h2>
        </ion-toolbar>
      </ion-header>
      <ion-list>
        <ion-list-header>
          <ion-label>
            今天待完成事项&nbsp;
            <span class="text-gray-600 text-base">{{ todayTodos.length }}</span>
          </ion-label>
        </ion-list-header>
        <ion-item-sliding v-for="todo in todayTodos" :key="todo?.id">
          <ion-item-options side="start">
            <ion-item-option @click="deleteTodo(todo)" color="danger" expandable>
              <ion-icon :icon="icons.trash" size="large"></ion-icon>
            </ion-item-option>
          </ion-item-options>
          <ion-item :detail="true" @click="editTodo(todo)">
            <ion-label>
              <h2>{{ todo?.todo }}</h2>
              <p>
                截止时间：
                <span :style="isLate(todo?.dueDate) ? 'color: rgba(255, 0, 0, 0.7)' : ''">
                  {{ todo?.dueDate.replace('T', ' ') }}
                </span>
              </p>
            </ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="primary" expandable>
              <ion-checkbox :checked="todo?.done" @ion-change="doneTodo(todo)"></ion-checkbox>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
      <ion-list>
        <ion-list-header>
          <ion-label>
            超时未完成事项&nbsp;
            <span class="text-gray-600 text-base">{{ lateTodos.length }}</span>
          </ion-label>
        </ion-list-header>
        <ion-item-sliding v-for="todo in lateTodos" :key="todo?.id">
          <ion-item-options side="start">
            <ion-item-option @click="deleteTodo(todo)" color="danger" expandable>
              <ion-icon :icon="icons.trash" size="large"></ion-icon>
            </ion-item-option>
          </ion-item-options>
          <ion-item :detail="true" @click="editTodo(todo)">
            <ion-label>
              <h2>{{ todo?.todo }}</h2>
              <p>
                截止时间：
                <span style="color: rgba(255, 0, 0, 0.7)">
                  {{ todo?.dueDate.replace('T', ' ') }}
                </span>
              </p>
            </ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="primary" expandable>
              <ion-checkbox :checked="todo?.done" @ion-change="doneTodo(todo)"></ion-checkbox>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
      <ion-list>
        <ion-list-header>
          <ion-label>
            待完成事项&nbsp;
            <span class="text-gray-600 text-base">{{ laterTodos.length }}</span>
          </ion-label>
        </ion-list-header>
        <ion-item-sliding v-for="todo in laterTodos" :key="todo?.id">
          <ion-item-options side="start">
            <ion-item-option @click="deleteTodo(todo)" color="danger" expandable>
              <ion-icon :icon="icons.trash" size="large"></ion-icon>
            </ion-item-option>
          </ion-item-options>
          <ion-item :detail="true" @click="editTodo(todo)">
            <ion-label>
              <h2>{{ todo?.todo }}</h2>
              <p>
                截止时间：
                <span>
                  {{ todo?.dueDate.replace('T', ' ') }}
                </span>
              </p>
            </ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="primary" expandable>
              <ion-checkbox :checked="todo?.done" @ion-change="doneTodo(todo)"></ion-checkbox>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
      <ion-list>
        <ion-list-header>
          <ion-label>
            已完成事项&nbsp;
            <span class="text-gray-600 text-base">{{ doneTodos.length }}</span>
          </ion-label>
        </ion-list-header>
        <ion-item-sliding v-for="todo in doneTodos" :key="todo?.id">
          <ion-item-options side="start">
            <ion-item-option @click="deleteTodo(todo)" color="danger" expandable>
              <ion-icon :icon="icons.trash" size="large" @click="deleteTodo(todo)"></ion-icon>
            </ion-item-option>
          </ion-item-options>
          <ion-item :detail="true" @click="editTodo(todo)">
            <ion-label>
              <h2 style="color: #3490dc">
                <del>{{ todo?.todo }}</del>
              </h2>
              <p>
                <del>
                  截止时间：
                  <span>
                    {{ todo?.dueDate.replace('T', ' ') }}
                  </span>
                </del>
              </p>
            </ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="white" expandable>
              <ion-checkbox :checked="todo?.done" @ion-change="undoneTodo(todo)"></ion-checkbox>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
    </ion-content>

    <ion-fab class="fixed bottom-2.5 right-2.5" ref="fabRef">
      <ion-fab-button @click="openNewTodo">
        <ion-icon :icon="icons.add"></ion-icon>
      </ion-fab-button>
    </ion-fab>
    <ion-modal :is-open="isOpenNewTodo" :backdrop-dismiss="false">
      <NewTodo
        @closeNewTodo="isOpenNewTodo = false"
        :currentCategory="currentCategory"
        :currentEditTodo="currentEditTodo" />
    </ion-modal>
  </ion-page>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { onSnapshot, collection } from 'firebase/firestore';
import {
  IonFab,
  IonFabButton,
  IonCheckbox,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonListHeader,
  IonTitle,
  IonBackButton,
  IonPage,
  IonContent,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
} from '@ionic/vue';
import * as icons from 'ionicons/icons';
import NewTodo from '@/components/NewTodo.vue';
import { db } from '@/firebase/firebase';
import { useTodos } from '@/store/useTodos';
import { useCategories } from '@/store/useCategories';

const route = useRoute();
const { category: categoryTitle } = route.params;

const { todayTodos, lateTodos, laterTodos, doneTodos } = storeToRefs(useTodos());
const { getTodos, getTodosByCategory, doneTodo, undoneTodo, deleteTodo } = useTodos();
const { currentCategory } = storeToRefs(useCategories());
const { getCategory } = useCategories();

const isOpenNewTodo = ref(false);
const currentEditTodo: any = ref(null);

onBeforeMount(async () => {
  getTodosByCategory(categoryTitle as string);
  getCategory(categoryTitle as string);
});

function openNewTodo() {
  currentEditTodo.value = null;
  isOpenNewTodo.value = true;
}

function editTodo(todo: any) {
  isOpenNewTodo.value = true;
  currentEditTodo.value = todo;
}

function isLate(date: string) {
  return new Date(date).getTime() < new Date().getTime();
}

// 监视数据库的变化，更新 Todos
const subTodo = onSnapshot(collection(db, 'todos'), async () => {
  await getTodos();
  getTodosByCategory(categoryTitle as string);
});

onBeforeUnmount(() => {
  subTodo();
});
</script>

<style scoped></style>
