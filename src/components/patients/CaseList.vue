<template>
  <v-col v-if="isCaseListVisible && !isNewPatientVisible" cols="6">
    <v-card-text>
      <v-card-title class="d-flex justify-space-between">
        <span>Case List</span>
        <v-btn class="new-patient-btn" small @click="createCase"
          >New Case</v-btn
        >
      </v-card-title>
      <v-list lines="two">
        <v-list-item
          v-for="caseItem in selectedCaseList"
          :key="caseItem.id"
          @click="getCaseDetail(caseItem.id, caseItem.patientId)"
        >
          <v-icon class="patient-icon">mdi-file-outline</v-icon>
          <v-list-item-title
            >Plan Name: {{ caseItem.planName }}</v-list-item-title
          >
          <v-list-item-subtitle>
            Case ID: {{ caseItem.id }}, Status: {{ caseItem.planStatus }}, STL
            File: {{ caseItem.stlFile ? 'Yes' : 'No' }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-col>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { Case } from '@/models/Case'

const props = defineProps<{
  selectedCaseList: Case[]
  isCaseListVisible: boolean
  isNewPatientVisible: boolean
  createCase: () => void
  getCaseDetail: (caseId: number, patientId: number) => void
}>()
</script>

<style scoped>
.new-patient-btn {
  padding: 4px 8px;
  font-size: 13px;
  margin-left: 150px;
  border: solid 1px rgb(var(--v-theme-primary));
}

.patient-icon {
  color: rgb(var(--v-theme-primary));
}
</style>
