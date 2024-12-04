<template>
  <v-card-text>
    <v-list>
      <v-list-item>
        <v-list-item-title>
          <strong class="name-label">Name</strong>
          {{ patientInfo.name }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>
          <strong class="name-label">Patient ID</strong>
          {{ patientInfo.id }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>
          <strong class="name-label">Gender</strong>
          {{ patientInfo.gender }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>
          <strong class="name-label">DOB</strong>
          {{ patientInfo.dob }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>
          <strong class="name-label memo-label">Memo</strong>
          <div class="memo-text">{{ patientInfo.memo }}</div>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card-text>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const patientInfo = ref({
  id: route.query.patientId || '',
  name: route.query.patientName || '',
  gender: route.query.patientGender || '',
  dob: route.query.patientDob || '',
  memo: route.query.patientMemo || '',
})
</script>

<style scoped>
.name-label {
  color: rgb(var(--v-theme-primary)); /* 원하는 색상으로 변경 */
  margin-right: 5px; /* 레이블과 값 사이의 간격 */
}

.memo-label {
  display: block;
  margin-bottom: 8px; /* 메모 라벨과 내용 사이 간격 */
}

.memo-text {
  border: 1px solid rgba(var(--v-theme-primary), 0.3); /* 0.3은 30% 불투명도 */
  border-radius: 5px;
  padding: 10px;
  height: 100px;
  overflow-y: auto;
}
</style>
