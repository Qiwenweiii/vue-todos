import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import {
  addTodoToFirebase,
  getTodosFromFirebase,
  updateTodoInFirebase,
  deleteTodoById,
  deleteTodosByCategoryInFirebase,
} from '@/firebase/request';

interface Todo {
  id: string;
  todo: string;
  category: string;
  dueDate: string;
  done: boolean;
  note: string;
}

export const useTodos = defineStore('todos', () => {
  const todos = ref<[Todo?]>([]);
  const filterTodos = ref<[Todo?]>([]);

  const todayTodos = computed(() => {
    return filterTodos.value.filter((todo) => {
      if (todo) {
        return new Date(todo.dueDate).toDateString() === new Date().toDateString() && !todo.done;
      }
    });
  });

  const lateTodos = computed(() => {
    return filterTodos.value.filter((todo) => {
      if (todo) {
        return new Date(todo.dueDate).getTime() < new Date().getTime() && !todo.done;
      }
    });
  });

  const laterTodos = computed(() => {
    return filterTodos.value.filter((todo) => {
      if (todo) {
        return (
          new Date(todo.dueDate).getTime() > new Date().getTime() &&
          new Date(todo.dueDate).toDateString() !== new Date().toDateString() &&
          !todo.done
        );
      }
    });
  });

  const doneTodos = computed(() => {
    return filterTodos.value.filter((todo) => {
      if (todo) {
        return todo.done;
      }
    });
  });

  async function addTodo(todo: any) {
    try {
      await addTodoToFirebase(todo);
    } catch (error) {
      console.log('添加todo失败：', error);
    }
  }

  async function getTodos() {
    try {
      todos.value = await getTodosFromFirebase();
    } catch (error) {
      console.log('获取todos失败：', error);
    }
  }

  function getTodosByCategory(category: string) {
    filterTodos.value =
      category === '全部' ? todos.value : todos.value.filter((todo) => todo.category === category);
  }

  async function updateTodo(todo: Todo, newTodo: any) {
    try {
      await updateTodoInFirebase(todo, newTodo);
    } catch (error) {
      console.log(`更新 ${todo.id} 失败：`, error);
    }
  }

  async function doneTodo(todo: Todo) {
    try {
      await updateTodoInFirebase(todo, { done: true });
    } catch (error) {
      console.log(`更新 ${todo.id} 失败：`, error);
    }
  }

  async function undoneTodo(todo: Todo) {
    try {
      await updateTodoInFirebase(todo, { done: false });
    } catch (error) {
      console.log(`更新 ${todo.id} 失败：`, error);
    }
  }

  async function deleteTodo(todo: Todo) {
    try {
      await deleteTodoById(todo.id);
    } catch (error) {
      console.log(`删除 ${todo.id} 失败：`, error);
    }
  }

  async function deleteTodosByCategory(category: string) {
    try {
      await deleteTodosByCategoryInFirebase(category);
    } catch (error) {
      console.log(`删除 ${category} 分类下的任务失败：`, error);
    }
  }

  return {
    todos,
    filterTodos,
    todayTodos,
    lateTodos,
    laterTodos,
    doneTodos,
    addTodo,
    getTodos,
    getTodosByCategory,
    updateTodo,
    doneTodo,
    undoneTodo,
    deleteTodo,
    deleteTodosByCategory,
  };
});
