import {
  addDoc,
  collection,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

// todo 相关请求
export async function addTodoToFirebase(todo: any) {
  return await addDoc(collection(db, 'todos'), todo);
}

export async function getTodosFromFirebase() {
  const todos: any = [];
  const querySnapshot = await getDocs(collection(db, 'todos'));

  querySnapshot.forEach((doc: any) => {
    todos.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return todos;
}

export async function updateTodoInFirebase(todo: any, field: any) {
  return await updateDoc(doc(db, 'todos', todo.id), field);
}

export async function deleteTodoById(todoId: any) {
  return await deleteDoc(doc(db, 'todos', todoId));
}

export async function deleteTodosByCategoryInFirebase(category: string) {
  const q = query(collection(db, 'todos'), where('category', '==', category));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(async (todo: any) => {
    await deleteDoc(doc(db, 'todos', todo.id));
  });
}

// category 相关请求
export async function addCategoryToFirebase(category: any) {
  return await addDoc(collection(db, 'categories'), category);
}

export async function getCategoriesFromFirebase() {
  const result: any = [];
  const querySnapshot = await getDocs(collection(db, 'categories'));

  querySnapshot.forEach((doc) => {
    result.push({ id: doc.id, ...doc.data() });
  });

  return result;
}

export async function updateCategoryInFirebase(category: any, field: any) {
  return await updateDoc(doc(db, 'categories', category.id), field);
}

export async function deleteCategoryById(categoryId: any) {
  return await deleteDoc(doc(db, 'categories', categoryId));
}
