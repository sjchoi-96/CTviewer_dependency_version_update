<script setup lang="ts">
import { ref } from 'vue'

definePage({
  meta: {
    icon: 'mdi-compass',
    title: 'Guide',
    drawerIndex: 4,
  },
})

const selectedFiles = ref<File[]>([])
const fileInput = ref<HTMLInputElement | null>(null)

function handleFolderSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files) return

  const files = Array.from(input.files)
  const dicomFiles = files.filter((file) =>
    file.name.toLowerCase().endsWith('.dcm'),
  )

  if (dicomFiles.length === 0) {
    alert('선택한 폴더에 DICOM 파일이 없습니다.')
    return
  }

  console.log('Selected DICOM files:', dicomFiles)
  selectedFiles.value = dicomFiles
}
</script>

<template>
  <v-container fluid class="guide-container">
    <!-- 메인 뷰어 영역 (70% 높이) -->
    <v-card class="main-viewer mb-3">
      <div class="upload-container">
        <input
          ref="fileInput"
          type="file"
          webkitdirectory
          directory
          multiple
          style="display: none"
          @change="handleFolderSelect"
        />
        <v-btn
          color="primary"
          @click="fileInput?.click()"
          prepend-icon="mdi-folder-open"
          class="upload-btn"
        >
          Select CT Folder
        </v-btn>
      </div>
      <div class="viewer-content">
        <!-- 메인 뷰어 컨텐츠가 들어갈 자리 -->
      </div>
    </v-card>

    <!-- MPR 뷰어 영역 -->
    <v-row class="mpr-container">
      <v-col cols="4">
        <v-card class="mpr-view">
          <v-card-title>Axial View</v-card-title>
          <!-- Axial 뷰 컨텐츠 -->
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="mpr-view">
          <v-card-title>Sagittal View</v-card-title>
          <!-- Sagittal 뷰 컨텐츠 -->
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="mpr-view">
          <v-card-title>Coronal View</v-card-title>
          <!-- Coronal 뷰 컨텐츠 -->
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.guide-container {
  height: calc(100vh - 100px);
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.main-viewer {
  height: 70vh;
  position: relative;
  margin-bottom: 10px;
}

.upload-container {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1;
}

.upload-btn {
  min-width: 150px;
}

.viewer-content {
  width: 100%;
  height: 100%;
  background-color: var(--v-theme-surface);
}

.mpr-container {
  height: calc(
    30vh - 26px
  ); /* 컨테이너 패딩(16px * 2) + 메인 뷰어 마진(10px) 고려 */
  margin: 0;
}

.mpr-view {
  height: 100%;
}

.v-card-title {
  font-size: 1rem;
  padding: 8px;
  background-color: rgba(var(--v-theme-primary), 0.1);
}
</style>
