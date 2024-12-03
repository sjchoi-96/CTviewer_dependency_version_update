<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MockRepository } from '@/mockDB/MockRepository'
import type { Patient } from '@/models/Patient'
import type { Case } from '@/models/Case'
import PatientList from '@/components/patients/PatientList.vue' // 새로운 PatientList 컴포넌트 가져오기
import CaseList from '@/components/patients/CaseList.vue' // 새로운 CaseList 컴포넌트 가져오기

const router = useRouter()
const patientList = ref<Patient[]>([]) // patientList를 ref로 정의
const selectedCaseList = ref<Case[]>([]) // 선택된 환자의 caseList를 ref로 정의
const isCaseListVisible = ref(false) // caseList의 가시성을 제어하는 변수

definePage({
  meta: {
    icon: 'mdi-account',
    title: 'PatientInfo',
    drawerIndex: 0,
  },
})

function createPatientCase(): void {
  router.push('/createCase')
}

function getPatientList(): void {
  patientList.value = MockRepository.getPatients() // patientList에 값을 할당
  console.log(patientList.value)
}

function getPatientCaseList(patientId: number): void {
  const caseList = MockRepository.getPatientCaseList(patientId)
  selectedCaseList.value = caseList || [] // 선택된 caseList를 업데이트
  isCaseListVisible.value = true // caseList를 보이도록 설정
  console.log(selectedCaseList.value)
}

function getCaseDetail(caseId: number, patientId: number): void {
  const selectedPatient = patientList.value.find(
    (patient) => patient.id === patientId,
  )

  if (selectedPatient) {
    router.push({
      path: '/createCase',
      query: {
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        patientGender: selectedPatient.gender,
        patientDob: selectedPatient.dob,
      },
    })
  }
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
        :createPatientCase="createPatientCase"
        :getPatientCaseList="getPatientCaseList"
      />
      <CaseList
        :selectedCaseList="selectedCaseList"
        :isCaseListVisible="isCaseListVisible"
        :createPatientCase="createPatientCase"
        :getCaseDetail="getCaseDetail"
      />
    </v-row>
  </v-container>
</template>
