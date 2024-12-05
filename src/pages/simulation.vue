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
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card-title>CT Image Viewer</v-card-title>
        <v-card>
          <v-card-text class="align-center">
            <DicomUploader @file-selected="handleFileSelected" />
            <CornerstoneViewer :file="selectedFile" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
