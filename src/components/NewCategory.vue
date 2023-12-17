<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>
          {{ isUpdate ? '编辑分类' : '新建分类' }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="mt-24 flex flex-col items-center h-[70%]">
        <ion-icon
          id="open-icon-dialog"
          :icon="icons[iconName]"
          class="text-5xl cursor-pointer"
          :style="{ color: iconColor }"></ion-icon>
        <h2 class="text-3xl font-bold mt-5" @click="editTitle" v-show="!isEditTitle">
          {{ categoryName }}
        </h2>
        <input
          type="text"
          v-model="categoryName"
          @blur="isEditTitle = false"
          @keyup.enter="isEditTitle = false"
          placeholder="请输入分类名称！"
          ref="titleInput"
          class="text-2xl font-bold text-center mt-5 outline-none border-b border-blue-200"
          v-show="isEditTitle" />
        <button
          id="open-color-dialog"
          expand="block"
          class="mt-5 text-white px-4 py-2 rounded-md shadow-xl font-mono"
          :style="{ backgroundColor: iconColor }">
          请选择图标颜色({{ iconColor }})
        </button>
      </div>

      <div class="mt-8">
        <ion-button @click="handleAdd" v-if="!isUpdate" expand="block" type="submit" class="mb-5">
          新增分类
        </ion-button>
        <ion-button
          @click="handleAdd"
          v-else
          expand="block"
          type="submit"
          class="mb-5"
          color="warning">
          更新分类
        </ion-button>
      </div>

      <div class="flex flex-col items-center">
        <ion-icon
          v-if="isUpdate"
          :icon="icons.trash"
          size="large"
          color="danger"
          id="deleteCategory"></ion-icon>
      </div>

      <ion-modal id="example-modal" ref="iconModal" trigger="open-icon-dialog">
        <div class="wrapper">
          <h3 class="border-b-1 text-center">请选择图标</h3>
          <div class="icons-container max-h-64 overflow-auto flex flex-wrap gap-3 justify-between">
            <ion-icon
              v-for="(_, iconName) in icons"
              :key="iconName"
              :icon="icons[iconName]"
              size="large"
              class="cursor-pointer"
              @click="confirmIcon(iconName)"></ion-icon>
          </div>
        </div>
      </ion-modal>
      <ion-modal id="example-modal" ref="colorModal" trigger="open-color-dialog">
        <div class="wrapper">
          <h3 class="border-b-1 text-center">请选择图标颜色</h3>
          <ColorPicker @confirmColor="confirmColor" />
        </div>
      </ion-modal>

      <ion-action-sheet
        v-if="isUpdate"
        trigger="deleteCategory"
        header="删除"
        :buttons="actionSheetButtons"></ion-action-sheet>
    </ion-content>
    <ion-fab
      slot="fixed"
      vertical="top"
      horizontal="end"
      class="cursor-pointer"
      @click="$emit('close-new-category')">
      <ion-icon :icon="icons.close" class="text-3xl"></ion-icon>
    </ion-fab>
  </ion-page>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import {
  IonPage,
  IonFab,
  IonIcon,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonContent,
  IonModal,
  IonButton,
  IonActionSheet,
} from '@ionic/vue';
import * as icons from 'ionicons/icons';
import ColorPicker from './ColorPicker.vue';
import { useCategories } from '@/store/useCategories';
import { useTodos } from '@/store/useTodos';

const router = useRouter();
const { addCategory, updateCategory, deleteCategory } = useCategories();
const { deleteTodosByCategory, updateTodo, getTodos, getTodosByCategory } = useTodos();
const { filterTodos } = storeToRefs(useTodos());

const actionSheetButtons = [
  {
    text: '删除该分类及该分类下的任务',
    handler: deleteCategoryAndTodos,
    data: {
      action: 'deleteCategoryAndTodos',
    },
  },
  {
    text: '仅删除该分类，保留该分类下的任务',
    handler: onlyDeleteCategory,
    data: {
      action: 'share',
    },
  },
  {
    text: '取消',
    data: {
      action: 'cancel',
    },
  },
];

const iconName = ref<string>('bookmarks');
const categoryName = ref<string>('分类名称');
const iconColor = ref<string>('#3dc2ff');
const isUpdate = ref(false);
const isEditTitle = ref(false);
const iconModal = ref();
const titleInput = ref();
const colorModal = ref();

const props = defineProps({
  currentEditCategory: {
    type: Object,
    default: null,
  },
});
const emits = defineEmits(['close-new-category']);

onBeforeMount(async () => {
  if (props.currentEditCategory) {
    iconName.value = props.currentEditCategory.icon;
    categoryName.value = props.currentEditCategory.category;
    iconColor.value = props.currentEditCategory.iconColor;
    isUpdate.value = true;

    // 更新 filterTodos
    getTodosByCategory(props.currentEditCategory.category);
  }
});

function confirmIcon(icon: string) {
  iconName.value = icon;
  iconModal.value.$el.dismiss();
}

function editTitle() {
  isEditTitle.value = true;
  titleInput.value.focus();
}

function confirmColor(color: string) {
  iconColor.value = color;
  colorModal.value.$el.dismiss();
}

async function handleAdd() {
  const newCategory = {
    icon: iconName.value,
    iconColor: iconColor.value,
    title: categoryName.value,
    category: categoryName.value.toLowerCase(),
  };

  if (!isUpdate.value) {
    await addCategory(newCategory);
    router.push({
      name: 'todos',
      params: { category: categoryName.value },
    });
  } else {
    await updateCategory(props.currentEditCategory, newCategory);

    filterTodos.value.forEach(async (todo: any) => {
      await updateTodo(todo, { ...todo, category: categoryName.value });
      await getTodos();
    });
  }

  emits('close-new-category');
}

async function deleteCategoryAndTodos() {
  await deleteCategory(props.currentEditCategory);
  await deleteTodosByCategory(categoryName.value);

  // 删除分类和todo后更新一下数据，否则在所有页面中会有数据滞留
  await getTodos();

  emits('close-new-category');
}

async function onlyDeleteCategory() {
  await deleteCategory(props.currentEditCategory);

  // 更新该分类下的todo信息
  filterTodos.value.forEach(async (todo: any) => {
    await updateTodo(todo, { ...todo, category: 'another' });
  });
  emits('close-new-category');
}
</script>

<style scoped>
ion-modal#example-modal {
  --width: fit-content;
  --max-width: 80%;
  --height: fit-content;
  --border-radius: 6px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
}

ion-modal#example-modal h3 {
  margin: 20px 20px 10px 20px;
}

ion-modal#example-modal .wrapper {
  margin-bottom: 10px;
  padding: 5px;
}
</style>
