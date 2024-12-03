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
          <v-col cols="6">
            <v-card-text>{{ patientInfo.name }}</v-card-text>
            <v-card-text>{{ patientInfo.id }}</v-card-text>
            <v-card-text>{{ patientInfo.gender }}</v-card-text>
            <v-card-text>{{ patientInfo.dob }}</v-card-text>
          </v-col>

          <!-- Memo 영역 -->
          <v-col cols="6">
            <v-text>{{ patientInfo.memo }}</v-text>
          </v-col>
        </v-card>

        <!-- 구강 이미지 케이스 세팅 -->
        <v-card-title>Case Setting</v-card-title>
        <v-card>
          <v-col justify="center">
            <v-img
              src="@/assets/images/mouth-structure.png"
              alt="Mouth Structure"
            ></v-img>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
