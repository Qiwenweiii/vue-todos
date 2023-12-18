<template>
  <div class="flex flex-wrap gap-3 justify-between">
    <ion-icon
      v-for="(_, iconName) in icons"
      :key="iconName"
      :icon="icons[iconName]"
      size="large"
      class="cursor-pointer"
      @click="confirmIcon(iconName)"></ion-icon>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import * as icons from 'ionicons/icons';

const emits = defineEmits(['confirmIcon']);

function confirmIcon(iconName: string) {
  emits('confirmIcon', iconName);
}
</script>

<style scoped></style>
