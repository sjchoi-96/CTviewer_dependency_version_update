<script setup lang="ts">
import panoramicImg from '@/assets/images/panoramic/panoramic.png'
import axialImg from '@/assets/images/panoramic/axial.png'
import orthogonalImg from '@/assets/images/panoramic/orthogonal.png'
import tangentialImg from '@/assets/images/panoramic/tangential.png'
</script>

<template>
  <div class="panoramic-container">
    <div class="panoramic-view">
      <v-img :src="panoramicImg" width="100%" height="100%" />
    </div>
    <div class="panoramic-view">
      <v-img :src="axialImg" width="100%" height="100%" />
    </div>
    <div class="panoramic-view">
      <v-img :src="orthogonalImg" width="100%" height="100%" />
    </div>
    <div class="panoramic-view">
      <v-img :src="tangentialImg" width="100%" height="100%" />
    </div>
  </div>
</template>

<style scoped>
.panoramic-container {
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  width: 100%;
  height: 100%;
  flex: 1;
  gap: 10px;
}

.panoramic-view {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  border: solid 2px rgb(var(--v-theme-primary));
  margin-bottom: 2rem;
}
</style>
