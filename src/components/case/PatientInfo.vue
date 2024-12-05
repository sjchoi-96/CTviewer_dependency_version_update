<template>
  <v-card-text>
    <v-list>
      <v-list-item>
        <v-list-item-title>
          <strong class="name-label">Name</strong>
          {{ name }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>
          <strong class="name-label">Patient ID</strong>
          {{ patientId }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>
          <strong class="name-label">Gender</strong>
          {{ gender }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>
          <strong class="name-label">DOB</strong>
          {{ dob }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>
          <strong class="name-label memo-label">Memo</strong>
          <div class="memo-text">{{ memo }}</div>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card-text>
</template>

<script setup lang="ts">
defineProps<{
  patientId: number
  name?: string
  gender?: string
  dob?: string
  memo?: string
}>()
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
