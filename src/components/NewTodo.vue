<template>
  <ion-page>
    <div class="mt-2">
      <h2 class="text-center text-2xl font-semibold">{{ isUpdate ? '编辑' : '新建' }}任务</h2>
    </div>
    <Form @submit="handleAddTodo" class="flex flex-col justify-center h-full">
      <div>
        <ion-item>
          <ion-icon :icon="clipboard" slot="start"></ion-icon>
          <Field v-slot="{ field }" name="todoField" :rules="isRequired" v-model="todo">
            <ion-input
              v-bind="field"
              type="text"
              name="todoField"
              placeholder="请输入您的待办事项！"></ion-input>
          </Field>
        </ion-item>
        <ion-item lines="none">
          <ErrorMessage v-slot="{ message }" name="todoField">
            <ion-text color="danger" v-if="message">{{ message }}</ion-text>
          </ErrorMessage>
        </ion-item>
      </div>
      <div>
        <ion-item>
          <ion-icon :icon="time" slot="start"></ion-icon>
          <Field v-slot="{ field }" name="duedateField" :rules="isRequired" v-model="dueDate">
            <ion-datetime-button
              datetime="datetime"
              v-bind="field"
              v-model="dueDate"></ion-datetime-button>

            <ion-modal :keep-contents-mounted="true">
              <ion-datetime
                locale="zh-ZH"
                presentation="date-time"
                :preferWheel="true"
                id="datetime"
                v-bind="field"
                v-model="dueDate"
                :value="now"
                :min="now"
                max="2027-12-31"
                :show-default-buttons="true"
                done-text="确定"
                cancel-text="取消"
                size="cover"></ion-datetime>
            </ion-modal>
          </Field>
        </ion-item>
        <ion-item lines="none">
          <ErrorMessage v-slot="{ message }" name="duedateField">
            <ion-text color="danger" v-if="message">{{ message }}</ion-text>
          </ErrorMessage>
        </ion-item>

        <ion-item>
          <ion-icon :icon="document" slot="start"></ion-icon>
          <ion-textarea v-model="note" placeholder="请输入事项描述！（可选）"></ion-textarea>
        </ion-item>
        <ion-item lines="none"></ion-item>

        <ion-item>
          <ion-icon :icon="grid" slot="start"></ion-icon>
          <Field v-model="category" v-slot="{ field }" name="categoryField">
            <ion-select
              v-bind="field"
              label="分类"
              placeholder="请选择分类！"
              ok-text="确定"
              cancel-text="取消">
              <ion-select-option
                v-for="category in categories"
                :key="category.id"
                :value="category.category">
                {{ category.title }}
              </ion-select-option>
              <ion-select-option value="another">其他</ion-select-option>
            </ion-select>
          </Field>
        </ion-item>
        <ion-item lines="none">
          <ErrorMessage v-slot="{ message }" name="categoryField">
            <ion-text color="danger" v-if="message">{{ message }}</ion-text>
          </ErrorMessage>
        </ion-item>
      </div>

      <div class="mt-8">
        <ion-button v-if="!isUpdate" expand="block" type="submit" class="mb-5"> 添加 </ion-button>
        <ion-button v-else expand="block" type="submit" class="mb-5" color="warning">
          更新
        </ion-button>
      </div>
    </Form>

    <ion-fab
      slot="fixed"
      vertical="top"
      horizontal="end"
      class="cursor-pointer"
      @click="$emit('closeNewTodo')">
      <ion-icon :icon="close" class="text-3xl"></ion-icon>
    </ion-fab>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import {
  IonButton,
  IonPage,
  IonFab,
  IonIcon,
  IonItem,
  IonInput,
  IonText,
  IonDatetime,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonDatetimeButton,
  IonModal,
} from '@ionic/vue';
import { close, clipboard, time, document, grid } from 'ionicons/icons';
import { ErrorMessage, Form, Field } from 'vee-validate';
import { useTodos } from '@/store/useTodos';
import { useCategories } from '@/store/useCategories';

const { addTodo, updateTodo } = useTodos();
const { categories } = storeToRefs(useCategories());

const emit = defineEmits(['closeNewTodo']);
const props = defineProps(['currentCategory', 'currentEditTodo']);

const now = new Date().toLocaleString().split(' ').join('T').split('/').join('-');

const todo = ref('');
const dueDate = ref(now);
const note = ref('');
const category = ref('');
const isUpdate = ref(false);
const isRequired = (value: string) => {
  if (!value) {
    return '该字段必填！';
  }
  return true;
};

onMounted(() => {
  // 从某个分类进来时将分类select设置为对应的值
  if (props.currentCategory) {
    category.value = props.currentCategory.category;
  }

  if (props.currentEditTodo) {
    todo.value = props.currentEditTodo.todo;
    dueDate.value = props.currentEditTodo.dueDate;
    note.value = props.currentEditTodo.note;
    category.value = props.currentEditTodo.category;
    isUpdate.value = true;
  }
});

async function handleAddTodo() {
  const newTodo = {
    todo: todo.value,
    dueDate: dueDate.value,
    note: note.value,
    category: category.value ? category.value : 'another',
    done: false,
  };
  if (!isUpdate.value) {
    await addTodo(newTodo);
  } else {
    await updateTodo(props.currentEditTodo, newTodo);
  }
  emit('closeNewTodo');
}
</script>

<style scoped></style>
