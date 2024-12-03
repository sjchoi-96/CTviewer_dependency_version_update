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

<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <!-- 환자, case setting 영역 -->
        <v-card-title>New Case</v-card-title>
        <v-card>
          <!-- Name, ID, Gender, DOB 영역 -->
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
                  <strong class="name-label">Memo</strong>
                  {{ patientInfo.memo }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.name-label {
  color: rgb(var(--v-theme-primary)); /* 원하는 색상으로 변경 */
  margin-right: 5px; /* 레이블과 값 사이의 간격 */
}
</style>
