<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MockRepository } from '@/mockDB/MockRepository'

const router = useRouter()
const patientList = ref([])
const caseList = ref([])

definePage({
  meta: {
    icon: 'mdi-account',
    title: 'PatientInfo',
    drawerIndex: 0,
  },
})

function createPatient(): void {
  router.push('/createCase')
}

// 환자 리스트를 가져오는 함수
function getPatientList(): void {
  patientList = MockRepository.getPatients()
  console.log(patientList.value)
}

function getPatientCaseList(patientId: number): void {
  caseList = MockRepository.getPatientCaseList(patientId)
  console.log(caseList.value)
}

// 컴포넌트가 마운트될 때 환자 리스트를 가져옴
onMounted(() => {
  getPatientList()
})
</script>

<template>
  <v-container fluid>
    <v-card-text>
      <v-card-title>
        <span>Patient List</span>
        <v-btn class="mr-2 new-patient-btn" small @click="createPatient"
          >New Patient</v-btn
        >
      </v-card-title>

      <v-list lines="two">
        <v-list-item
          v-for="patient in patientList"
          :key="patient.id"
          @click="getPatientCaseList(patient.id)"
        >
          <v-icon class="patient-icon">mdi-account</v-icon>
          <v-list-item-content>
            <v-list-item-title> {{ patient.name }}</v-list-item-title>
            <v-list-item-subtitle>
              ID: {{ patient.id }}, Gender: {{ patient.gender }}, DOB:
              {{ patient.dob }}
              <span v-if="patient.caseList.length > 0"
                >, Cases: {{ patient.caseList.length }}</span
              >
              <span v-else>, No cases available</span>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-container>
</template>

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
