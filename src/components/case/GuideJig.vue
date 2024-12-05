<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { mockRepository } from '@/mockDB/MockRepository'

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

const selectedGuideSlot = ref<number | null>(null)
const selectedJigSlot = ref<number | null>(null)
const guideSlot = 1
const selectedGuideAndJigCase: number = guideSlot
const activeTab = ref<number>(selectedGuideAndJigCase)
// 상수 정의
const GUIDE_SLOTS_COUNT = 8
const JIG_SLOTS_COUNT = 4

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

interface Props {
  patientId: number
  caseId: number
}

const props = defineProps<Props>()

function onGuideImageClick(slotNumber: number): void {
  console.log(`Slot ${slotNumber} clicked`)

  if (activeTab.value === guideSlot) {
    selectedGuideSlot.value = slotNumber
    console.log('pre-guide')
    mockRepository.updateCaseGuideSlot(
      props.patientId,
      props.caseId,
      slotNumber,
    )
  } else {
    selectedJigSlot.value = slotNumber
    console.log('jig')
    mockRepository.updateCaseJigSlot(props.patientId, props.caseId, slotNumber)
  }
}

function updateCaseGuideSlot(
  patientId: number,
  caseId: number,
  slotNumber: number,
): void {
  mockRepository.updateCaseGuideSlot(patientId, caseId, slotNumber)
}

function updateCaseJigSlot(
  patientId: number,
  caseId: number,
  slotNumber: number,
): void {
  mockRepository.updateCaseJigSlot(patientId, caseId, slotNumber)
}

onMounted(() => {
  const slotInfo = mockRepository.getCaseSlotInfo(props.patientId, props.caseId)
  if (slotInfo) {
    selectedGuideSlot.value = slotInfo.guideSlot
    selectedJigSlot.value = slotInfo.jigSlot
    console.log('Loaded slot info:', slotInfo)
  }
})
</script>

<template>
  <v-tabs v-model="activeTab" fixed-tabs class="equal-tabs">
    <v-tab :value="1">Pre-Guide</v-tab>
    <v-tab :value="2">Jig</v-tab>
  </v-tabs>

  <v-container>
    <v-row>
      <template v-if="activeTab === guideSlot">
        <v-col
          v-for="n in GUIDE_SLOTS_COUNT"
          :key="n"
          class="grid-item"
          cols="6"
        >
          <v-card
            outlined
            class="slot-card"
            :class="{ 'selected-slot': selectedGuideSlot === n }"
          >
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

      <template v-if="activeTab !== guideSlot">
        <v-col v-for="n in JIG_SLOTS_COUNT" :key="n" class="grid-item" cols="6">
          <v-card
            outlined
            class="slot-card"
            :class="{ 'selected-slot': selectedJigSlot === n }"
          >
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
.slot-card {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 5px;
}

.slot-card:hover {
  border: 2px solid rgb(var(--v-theme-primary));
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

.selected-slot {
  border: 1px solid rgb(var(--v-theme-primary)) !important;
}
</style>
