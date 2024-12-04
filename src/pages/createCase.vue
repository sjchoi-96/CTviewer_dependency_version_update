<script setup lang="ts">
definePage({
  meta: {
    icon: 'mdi-tooth',
    title: 'Create Case',
    drawerIndex: 1,
  },
})

import PatientInfo from '@/components/case/PatientInfo.vue'
import CaseSetting from '@/components/case/CaseSetting.vue'
import UploadCTFile from '@/components/case/UploadCTFile.vue'
import GuideJig from '@/components/case/GuideJig.vue'
</script>

<template>
  <v-container fluid class="container-height">
    <v-row class="fill-height">
      <v-col cols="2" class="d-flex flex-column">
        <!-- Patient Info -->
        <div class="section-container">
          <v-card-title>Patient Info</v-card-title>
          <v-card class="flex-card">
            <div class="patient-section">
              <PatientInfo />
            </div>
          </v-card>
        </div>

        <!-- Case Setting -->
        <div class="section-container">
          <v-card-title>Case Setting</v-card-title>
          <v-card class="flex-card">
            <div class="case-section">
              <CaseSetting />
            </div>
          </v-card>
        </div>
      </v-col>

      <!-- Import Data -->
      <v-col cols="6" class="d-flex flex-column">
        <v-card-title>Import Data</v-card-title>
        <v-card class="flex-card">
          <UploadCTFile />
        </v-card>
      </v-col>

      <!-- Empty space for balance -->
      <v-col cols="3" class="d-flex flex-column">
        <v-card-title>Guide & Jig</v-card-title>
        <v-card class="flex-card">
          <GuideJig />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.container-height {
  height: 100%; /* 상단 앱바 높이 제외 */
  overflow: hidden;
}

.fill-height {
  height: 100%;
}

.section-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.section-container:first-child {
  margin-bottom: 16px;
}

.flex-card {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.patient-section,
.case-section {
  flex: 1;
}

.v-card-title {
  margin-bottom: 8px;
}
</style>
