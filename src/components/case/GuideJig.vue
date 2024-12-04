<script setup lang="ts">
import { ref } from 'vue'

// 이미지 직접 import
import guide1 from '@/assets/images/guide/guide1.png'
import guide2 from '@/assets/images/guide/guide2.png'
import guide3 from '@/assets/images/guide/guide3.png'
import guide4 from '@/assets/images/guide/guide4.png'
import guide5 from '@/assets/images/guide/guide5.png'
import guide6 from '@/assets/images/guide/guide6.png'
import guide7 from '@/assets/images/guide/guide7.png'
import guide8 from '@/assets/images/guide/guide8.png'

import jig1 from '@/assets/images/jig/jig1.png'
import jig2 from '@/assets/images/jig/jig2.png'
import jig3 from '@/assets/images/jig/jig3.png'
import jig4 from '@/assets/images/jig/jig4.png'

const selectedGuideAndJigCase: number = 1
const activeTab = ref<number>(selectedGuideAndJigCase)
const selectedGuideImage = ref<string | null>(null)

const guideImages = ref([
  guide1,
  guide2,
  guide3,
  guide4,
  guide5,
  guide6,
  guide7,
  guide8,
])
const jigImages = ref([jig1, jig2, jig3, jig4])

function onGuideImageClick(slotNumber: number): void {
  console.log(`Slot ${slotNumber} clicked`)
  if (activeTab.value === 1) {
    selectedGuideImage.value = guideImages.value[slotNumber - 1]
  } else if (activeTab.value === 2 && slotNumber <= 4) {
    selectedGuideImage.value = jigImages.value[slotNumber - 1]
  }
}
</script>

<template>
  <v-tabs v-model="activeTab" fixed-tabs class="equal-tabs">
    <v-tab :value="1">Pre-Guide</v-tab>
    <v-tab :value="2">Jig</v-tab>
  </v-tabs>

  <v-container>
    <v-row>
      <!-- Pre-Guide 탭일 때만 보이는 내용 -->
      <template v-if="activeTab === 1">
        <v-col v-for="n in 8" :key="n" class="grid-item" cols="6">
          <v-card outlined class="jig-slot">
            <v-card-text class="centered-image-container">
              <v-btn class="guide-image-btn" icon @click="onGuideImageClick(n)">
                <v-img
                  :src="guideImages[n - 1]"
                  alt="Guide Image"
                  class="guide-image"
                />
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </template>

      <!-- Jig 탭일 때만 보이는 내용 -->
      <template v-if="activeTab === 2">
        <v-col v-for="n in 4" :key="n" class="grid-item" cols="6">
          <v-card outlined class="jig-slot">
            <v-card-text class="centered-image-container">
              <v-btn class="guide-image-btn" icon @click="onGuideImageClick(n)">
                <v-img
                  :src="jigImages[n - 1]"
                  alt="Jig Image"
                  class="guide-image"
                />
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<style scoped>
.jig-slot {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 5px;
}

.centered-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.guide-image-btn {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: none;
}

.guide-image {
  width: 7rem;
  object-fit: contain;
}
.equal-tabs :deep(.v-tab) {
  flex: 1;
  width: 50%;
}

.equal-tabs :deep(.v-tab--selected) {
  flex: 1;
  width: 50%;
}

.equal-tabs :deep(.v-slide-group__content) {
  width: 100%;
}
</style>
