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
    icon: 'mdi-cube',
    title: 'Simulation',
    drawerIndex: 2,
  },
})
const imageElement = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const currentImageIndex = ref(0)
const imageIds = ref<string[]>([])
const totalImages = ref(0)

onMounted(() => {
  // Cornerstone 초기화
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser

  // WADO 이미지 로더 설정
  cornerstoneWADOImageLoader.configure({
    beforeSend: function (xhr: XMLHttpRequest) {
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
    },
  })

  if (imageElement.value) {
    // Cornerstone 활성화
    cornerstone.enable(imageElement.value)

    // Cornerstone Tools 초기화
    cornerstoneTools.external.cornerstone = cornerstone
    cornerstoneTools.external.Hammer = window.Hammer
    cornerstoneTools.init()

    // 스택 스크롤 도구만 등록
    cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool)
  }
})

// 파입 정의
type CornerstoneElement = HTMLElement & {
  addEventListener: (type: string, listener: (e: any) => void) => void
}

interface StackState {
  currentImageIdIndex: number
  imageIds: string[]
}

// 파일 읽기 함수
async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) =>
      resolve(e.target?.result as ArrayBuffer)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

// DICOM 파싱 및 프레임 처리 함수
function parseDicomAndGetFrames(byteArray: Uint8Array, file: File): string[] {
  const dataSet = dicomParser.parseDicom(byteArray)

  // numberOfFrames 가져오는 방식 수정
  const numberOfFrames = dataSet.intString('x00280008') || 1
  const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file)

  // 프레임 ID 생성
  const frameIds = []
  for (let i = 0; i < numberOfFrames; i++) {
    frameIds.push(imageId + (numberOfFrames > 1 ? `?frame=${i}` : ''))
  }

  return frameIds
}

// 이미지 표시 함수
async function displayImage(
  element: CornerstoneElement,
  imageId: string,
): Promise<void> {
  const image = await cornerstone.loadImage(imageId)
  cornerstone.displayImage(element, image)
}

// 이벤트 리스너 설정 함수
function setupImageRenderedListener(element: CornerstoneElement): void {
  element.addEventListener('cornerstoneimagerendered', (e: any) => {
    currentImageIndex.value = e.detail.image.imageIdIndex || 0
  })
}

// 에러 처리를 위한 커스텀 에러 클래스
class DicomError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DicomError'
  }
}

// DICOM 파일 유효성 검사 함수
async function validateAndProcessDicomFile(
  file: File,
): Promise<{ byteArray: Uint8Array; imageIds: string[] }> {
  const arrayBuffer = await readFileAsArrayBuffer(file)
  const byteArray = new Uint8Array(arrayBuffer)
  const imageIds = parseDicomAndGetFrames(byteArray, file)

  if (!imageIds.length) {
    throw new DicomError('No valid frames found in DICOM file')
  }

  return { byteArray, imageIds }
}

// Cornerstone 뷰어 초기화 함수
async function initializeCornerstoneViewer(
  element: CornerstoneElement,
  imageIds: string[],
): Promise<void> {
  await displayImage(element, imageIds[0])
  setupStackState(element, imageIds)
  setupCornerstoneTools(element)
  setupImageRenderedListener(element)
}

// 에러 처리 함수
function handleError(error: unknown, errorType: 'read' | 'validation'): void {
  console.error(
    errorType === 'read' ? 'Error reading file:' : 'Invalid DICOM file:',
    error,
  )
  alert(
    errorType === 'read'
      ? 'Error reading the DICOM file.'
      : 'Please select a valid DICOM file.',
  )
}

// 메인 파일 처리 함수
async function handleFileSelect(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const files = input.files

  if (!files?.length || !imageElement.value) return

  try {
    const file = files[0]
    const { imageIds: processedImageIds } =
      await validateAndProcessDicomFile(file)

    // ref 값 업데이트
    imageIds.value = processedImageIds
    totalImages.value = processedImageIds.length

    await initializeCornerstoneViewer(
      imageElement.value as CornerstoneElement,
      processedImageIds,
    )
  } catch (error) {
    handleError(error, error instanceof DicomError ? 'validation' : 'read')
  }
}

onBeforeUnmount(() => {
  if (imageElement.value) {
    cornerstone.disable(imageElement.value)
  }
})

// 도구 설정 함수
function setupCornerstoneTools(element: CornerstoneElement): void {
  // 마우스 휠 스크롤만 활성화
  cornerstoneTools.setToolActiveForElement(element, 'StackScrollMouseWheel', {})
}

// 스택 상태 설정 함수 추가
function setupStackState(
  element: CornerstoneElement,
  imageIds: string[],
): void {
  const stack: StackState = {
    currentImageIdIndex: 0,
    imageIds,
  }

  cornerstoneTools.addStackStateManager(element, ['stack'])
  cornerstoneTools.addToolState(element, 'stack', stack)
}
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
              prepend-icon=""
              prepend-inner-icon="mdi-file-upload"
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
  height: 512px;
  background-color: var(--v-theme-surface);
}
</style>
