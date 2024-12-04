<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as cornerstone from 'cornerstone-core'
import * as cornerstoneTools from 'cornerstone-tools'
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import dicomParser from 'dicom-parser'
import Hammer from 'hammerjs'

// window에 Hammer 추가
;(window as any).Hammer = Hammer

definePage({
  meta: {
    icon: 'mdi-compass',
    title: 'Guide',
    drawerIndex: 4,
  },
})

const imageElement = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const imageIds = ref<string[]>([])
const totalImages = ref(0)

onMounted(() => {
  // dicom-parser 설정
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone

  // WADO 이미지 로더 설정
  cornerstoneWADOImageLoader.configure({
    beforeSend: function (xhr: XMLHttpRequest) {
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
    },
  })

  if (imageElement.value) {
    // Cornerstone 요소 활성화
    cornerstone.enable(imageElement.value)

    // Cornerstone Tools 초기화
    cornerstoneTools.external.cornerstone = cornerstone
    cornerstoneTools.external.Hammer = window.Hammer
    cornerstoneTools.init({
      mouseEnabled: true,
      touchEnabled: true,
      globalToolSyncEnabled: false,
      showSVGCursors: true,
    })
  }
})

// 파일 로드 핸들러
async function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files

  if (files && files.length > 0 && imageElement.value) {
    imageIds.value = [] // 이미지 ID 배열 초기화
    const file = files[0] // 멀티프레임 DICOM은 하나의 파일만 처리

    try {
      const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as ArrayBuffer)
        reader.onerror = reject
        reader.readAsArrayBuffer(file)
      })

      const byteArray = new Uint8Array(arrayBuffer)

      try {
        // DICOM 파일 파싱
        const dataSet = dicomParser.parseDicom(byteArray)

        // 프레임 수 확인
        const numberOfFrames = dataSet.intString('x00280008') || 1

        // 각 프레임에 대한 imageId 생성
        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file)
        for (let i = 0; i < numberOfFrames; i++) {
          imageIds.value.push(`${imageId}?frame=${i}`)
        }

        if (imageIds.value.length > 0) {
          totalImages.value = imageIds.value.length
          // 첫 번째 프레임 로드 및 표시
          const image = await cornerstone.loadImage(imageIds.value[0])
          cornerstone.displayImage(imageElement.value, image)

          // 스택 상태 설정
          const stack = {
            currentImageIdIndex: 0,
            imageIds: imageIds.value,
          }

          // 스택 도구 상태 설정
          cornerstoneTools.addStackStateManager(imageElement.value, ['stack'])
          cornerstoneTools.addToolState(imageElement.value, 'stack', stack)

          // 기본 도구 활성화
          cornerstoneTools.addTool(cornerstoneTools.WwwcTool)
          cornerstoneTools.addTool(cornerstoneTools.PanTool)
          cornerstoneTools.addTool(cornerstoneTools.ZoomTool)
          cornerstoneTools.addTool(cornerstoneTools.StackScrollTool)
          cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool)

          // 도구 활성화
          cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 })
          cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 2 })
          cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 4 })
          cornerstoneTools.setToolActive('StackScroll', { mouseButtonMask: 1 })
          cornerstoneTools.setToolActive('StackScrollMouseWheel', {})
        }
      } catch (error) {
        console.error('Invalid DICOM file:', error)
        alert('Please select a valid DICOM file.')
      }
    } catch (error) {
      console.error('Error reading file:', error)
      alert('Error reading the DICOM file.')
    }
  }
}

onBeforeUnmount(() => {
  if (imageElement.value) {
    cornerstone.disable(imageElement.value)
  }
})
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card-title>CT Image Viewer</v-card-title>
        <v-card>
          <v-card-text>
            <v-file-input
              ref="fileInput"
              label="Upload DICOM file"
              accept=".dcm"
              prepend-icon="mdi-file-upload"
              class="mb-4"
              hide-details
              @change="handleFileSelect"
            />
            <div ref="imageElement" class="cornerstone-element" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.cornerstone-element {
  width: 100%;
  height: 600px;
  background-color: black;
}
</style>
