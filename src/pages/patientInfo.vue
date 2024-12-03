<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { mockRepository } from '@/mockDB/MockRepository'
import type { Patient } from '@/models/Patient'
import type { Case } from '@/models/Case'
import PatientList from '@/components/patients/PatientList.vue' // 새로운 PatientList 컴포넌트 가져오기
import CaseList from '@/components/patients/CaseList.vue' // 새로운 CaseList 컴포넌트 가져오기
import NewPatient from '@/components/patients/NewPatient.vue' // 새로운 NewPatient 컴포넌트 가져오기
const router = useRouter()
const patientList = ref<Patient[]>([]) // patientList를 ref로 정의
const selectedCaseList = ref<Case[]>([]) // 선택된 환자의 caseList를 ref로 정의
const isCaseListVisible = ref(false) // caseList의 가시성을 제어하는 변수
const isNewPatientVisible = ref(false)
const selectedPatientId = ref({ id: 0 })

definePage({
  meta: {
    icon: 'mdi-account',
    title: 'PatientInfo',
    drawerIndex: 0,
  },
})

function createCase(patientId: number): void {
  const selectedPatient = findPatientById(patientId)
  if (selectedPatient) {
    sendPatientInfoToCreateCase(selectedPatient)
  }
}

function createPatient(): void {
  isNewPatientVisible.value = true
}

function addPatient(patient: Patient) {
  patientList.value.push(patient)
  closeNewPatient()
}

function getPatientList(): void {
  patientList.value = mockRepository.getPatients() // patientList에 값을 할당
  console.log(patientList.value)
}

function getPatientWithCaseList(patientId: number): void {
  selectedPatientId.value = { id: patientId }
  const caseList = findCaseListByPatientId(patientId)
  selectedCaseList.value = caseList || [] // 선택된 caseList를 업데이트
  isCaseListVisible.value = true // caseList를 보이도록 설정
  console.log(selectedCaseList.value)
}

function findCaseListByPatientId(patientId: number): Case[] {
  const caseList = mockRepository.getPatientCaseList(patientId)
  return caseList || []
}

function findPatientById(patientId: number): Patient | null {
  const selectedPatient = mockRepository.getPatient(patientId)
  return selectedPatient
}

function sendPatientInfoToCreateCase(selectedPatient: Patient): void {
  if (selectedPatient) {
    router.push({
      path: '/createCase',
      query: {
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        patientGender: selectedPatient.gender,
        patientDob: selectedPatient.dob,
        patientMemo: selectedPatient.memo,
      },
    })
  } else {
    console.error('선택된 환자가 없습니다.')
  }
}

function getCaseDetail(caseId: number, patientId: number): void {
  const selectedPatient = findPatientById(patientId)
  if (selectedPatient) {
    sendPatientInfoToCreateCase(selectedPatient)
  }
}
function closeNewPatient() {
  isNewPatientVisible.value = false // NewPatient 컴포넌트를 숨김
}

onMounted(() => {
  getPatientList()
})
</script>

<template>
  <v-container fluid>
    <v-row>
      <PatientList
        :patientList="patientList"
        :createPatient="createPatient"
        :getPatientWithCaseList="getPatientWithCaseList"
      />
      <NewPatient
        v-if="isNewPatientVisible"
        :addPatient="addPatient"
        :closeNewPatient="closeNewPatient"
        :patientList="patientList"
      />
      <CaseList
        :selectedCaseList="selectedCaseList"
        :isCaseListVisible="isCaseListVisible"
        :createCase="createCase"
        :getCaseDetail="getCaseDetail"
        :isNewPatientVisible="isNewPatientVisible"
        :patientId="selectedPatientId"
      />
    </v-row>
  </v-container>
</template>
