<script setup lang="ts">
import { ref } from 'vue'
import DicomUploader from '@/components/ctview/DicomUploader.vue'
import CornerstoneViewer from '@/components/ctview/CornerstoneViewer.vue'

definePage({
  meta: {
    icon: 'mdi-cube',
    title: 'Simulation',
    drawerIndex: 2,
  },
})

const selectedFile = ref<File>()

function handleFileSelected(file: File) {
  selectedFile.value = file
}
</script>

<template>
  <v-container fluid class="d-flex align-center">
    <v-row class="justify-center w-100">
      <v-col cols="12">
        <v-card-title class="mb-4">CT Image Viewer</v-card-title>
        <v-card class="viewer-card">
          <v-card-text class="pa-4">
            <DicomUploader @file-selected="handleFileSelected" />
            <CornerstoneViewer :file="selectedFile" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.viewer-card {
  width: 100%;
  overflow: hidden;
}

.v-card-text {
  width: 100%;
}
</style>
