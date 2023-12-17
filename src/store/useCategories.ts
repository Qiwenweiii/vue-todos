import { defineStore } from 'pinia';
import { ref } from 'vue';

import {
  getCategoriesFromFirebase,
  getCategoryById,
  addCategoryToFirebase,
  updateCategoryInFirebase,
  deleteCategoryById,
} from '@/firebase/request';

export const useCategories = defineStore('categories', () => {
  const categories = ref([]);

  const getCategories = async () => {
    try {
      categories.value = await getCategoriesFromFirebase();
    } catch (error) {
      console.log('获取分类信息失败：', error);
    }
  };

  const getCategory = async (id: string) => {
    try {
      return await getCategoryById(id);
    } catch (error) {
      console.log('获取分类信息失败：', error);
    }
  };

  const addCategory = async (category: any) => {
    try {
      const res = await addCategoryToFirebase(category);
      return res.id;
    } catch (error) {
      console.log('添加新分类失败：', error);
    }
  };

  const updateCategory = async (category: any, newCategory: any) => {
    try {
      await updateCategoryInFirebase(category, newCategory);
    } catch (error) {
      console.log('更新分类信息失败：', error);
    }
  };

  const deleteCategory = async (category: any) => {
    try {
      await deleteCategoryById(category.id);
      console.log('删除分类成功：', category.id);
    } catch (error) {
      console.log('删除分类失败：', error);
    }
  };

  return { categories, getCategories, getCategory, addCategory, updateCategory, deleteCategory };
});
