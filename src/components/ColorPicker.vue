<template>
  <div class="color-picker__container" :class="{ expand: isExpand }">
    <div class="color-preset__container">
      <span
        class="color-preset__item"
        v-for="color in colorPreset"
        :key="color"
        :style="{ backgroundColor: color }"
        @click="setColor(color)"></span>
      <span class="color-preset__item" @click="toggleExpand">
        <ion-icon :icon="chevronDown" class="arrowdown"></ion-icon>
      </span>
    </div>
    <div class="color-picker">
      <Sketch v-model="color" class="color-picker__inner" :preset-colors="null" disableAlpha />
      <span class="color-picker__ensure" @click="colorPicker">确 定</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { IonIcon } from '@ionic/vue';
import { chevronDown } from 'ionicons/icons';
import { Sketch } from '@ckpack/vue-color';

const emits = defineEmits(['confirmColor']);

const colorPreset = ref([
  '#e74c3c',
  '#e67e22',
  '#f1c40f',
  '#2ecc71',
  '#1abc9c',
  '#3498db',
  '#8e44ad',
  '#ffffff',
  '#000000',
]);
const isExpand = ref(false);

const color = ref('rgb(255,255,255)');

const setColor = (newColor) => {
  color.value = newColor;
  emits('confirmColor', newColor);
};

const colorPicker = () => {
  emits('confirmColor', color.value.hex);
};

const toggleExpand = () => {
  isExpand.value = !isExpand.value;
};
</script>

<style lang="scss" scoped>
.color-picker__container {
  width: 164px;
  max-height: 74px;
  padding: 12px;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 6px;
  overflow: hidden;
  transition: max-height 0.3s;

  &.expand {
    max-height: 320px;

    .arrowdown {
      transform: rotate(180deg);
    }
  }
  .color-preset__container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 6px;

    .color-preset__item {
      width: 20px;
      height: 20px;
      margin: 0 2px 10px;
      border-radius: 2px;
      border: 1px solid rgba($color: #000, $alpha: 0.1);
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;

      .arrowdown {
        color: #222;
        transition: all 0.2s;
      }
    }
  }

  .color-picker {
    .color-picker__inner {
      width: 100%;
      padding: 0;
      box-sizing: border-box;
      box-shadow: none;
    }
  }
  .color-picker__ensure {
    display: block;
    margin: 0 auto;
    width: 66px;
    font-size: 12px;
    font-weight: 500;
    color: #fff;
    background-image: linear-gradient(270deg, #f58365, #ff188a);
    text-align: center;
    line-height: 26px;
    border-radius: 13px;
    cursor: pointer;
    user-select: none;
  }
}
</style>
