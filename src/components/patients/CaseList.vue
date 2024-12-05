<template>
  <v-col v-if="isCaseListVisible && !isNewPatientVisible" cols="6">
    <v-card-text>
      <v-card-title class="d-flex justify-space-between">
        <span>Case List</span>
        <v-btn class="new-patient-btn" small @click="handleCreateCase"
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
import { useRouter } from 'vue-router'
import type { Case } from '@/models/Case'
import { mockRepository } from '@/mockDB/MockRepository'

const router = useRouter()

const props = defineProps<{
  selectedCaseList: Case[]
  isCaseListVisible: boolean
  isNewPatientVisible: boolean
  getCaseDetail: (caseId: number, patientId: number) => void
  patientId: { id: number }
}>()

function handleCreateCase() {
  // 환자의 전체 케이스 목록 가져오기
  const caseList = mockRepository.getPatientCaseList(props.patientId.id)

  // 마지막 케이스의 ID 찾기 (없으면 0으로 시작)
  const lastCaseId = caseList?.length
    ? Math.max(...caseList.map((c) => c.id))
    : 0

  // 새 케이스 ID는 마지막 ID + 1
  const newCaseId = lastCaseId + 1

  // 라우팅 시 콘솔로그 추가
  console.log('Navigating to:', {
    patientId: props.patientId.id,
    newCaseId,
  })

  router.push({
    path: '/createCase', // 경로가 정확한지 확인
    query: {
      patientId: props.patientId.id,
      caseId: newCaseId,
    },
  })
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
