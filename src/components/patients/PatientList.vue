<template>
  <v-col cols="6">
    <v-card-text>
      <v-card-title class="d-flex justify-space-between">
        <span>Patient List</span>
        <v-btn class="new-patient-btn" small @click="createPatient"
          >New Patient</v-btn
        >
      </v-card-title>

      <v-list lines="two">
        <v-list-item
          v-for="patient in patientList"
          :key="patient.id"
          @click="getPatientWithCaseList(patient.id)"
        >
          <v-icon class="patient-icon">mdi-account</v-icon>
          <v-list-item-title> {{ patient.name }}</v-list-item-title>
          <v-list-item-subtitle>
            ID: {{ patient.id }}, Gender: {{ patient.gender }}, DOB:
            {{ patient.dob }}
            <span v-if="patient.caseList.length > 0"
              >, Cases: {{ patient.caseList.length }}</span
            >
            <span v-else>, No cases available</span>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-col>
</template>

<script setup lang="ts">
import type { Patient } from '@/models/Patient'
import { useRouter } from 'vue-router'

defineProps<{
  patientList: Patient[]
  createPatient: () => void
  getPatientWithCaseList: (patientId: number) => void
}>()

const router = useRouter()

const handleCreateCase = (patientId: number) => {
  const newCaseId = 1
  router.push(`/create-case/${patientId}/${newCaseId}`)
}
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
