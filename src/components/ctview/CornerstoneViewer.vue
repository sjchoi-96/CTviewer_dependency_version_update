<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as cornerstone from 'cornerstone-core'
import * as cornerstoneTools from 'cornerstone-tools'
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import dicomParser from 'dicom-parser'
import Hammer from 'hammerjs'
import * as cornerstoneMath from 'cornerstone-math'
import {
  validateAndProcessDicomFile,
  handleError,
  DicomError,
} from './utils/cornerstoneUtils'

const props = defineProps<{
  file?: File
}>()

const imageElement = ref<HTMLElement | null>(null)
const currentImageIndex = ref(0)
const imageIds = ref<string[]>([])
const totalImages = ref(0)

type CornerstoneElement = HTMLElement & {
  addEventListener: (type: string, listener: (e: any) => void) => void
}

interface StackState {
  currentImageIdIndex: number
  imageIds: string[]
}

onMounted(() => {
  initializeCornerstoneTools()
  setupViewerElement()
})

watch(
  () => props.file,
  async (newFile) => {
    if (newFile && imageElement.value) {
      await loadAndDisplayFile(newFile)
    }
  },
  { immediate: true },
)

function initializeCornerstoneTools() {
  cornerstoneTools.external.cornerstone = cornerstone
  cornerstoneTools.external.Hammer = Hammer
  cornerstoneTools.external.cornerstoneMath = cornerstoneMath

  cornerstoneWADOImageLoader.external.cornerstone = cornerstone
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser

  cornerstoneTools.init({
    showSVGCursors: true,
    globalToolSyncEnabled: true,
  })
}

function setupViewerElement() {
  if (!imageElement.value) return
  cornerstone.enable(imageElement.value)
  initializeTools()
  setupTools(imageElement.value)
}

function initializeTools() {
  cornerstoneTools.addTool(cornerstoneTools.PanTool)
  cornerstoneTools.addTool(cornerstoneTools.ZoomTool, {
    configuration: {
      mouseButtonMask: 1,
      minScale: 0.25,
      maxScale: 20.0,
    },
  })
  cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool)
}

function setupTools(element: CornerstoneElement) {
  cornerstoneTools.setToolActiveForElement(element, 'Pan', {
    mouseButtonMask: 2,
  })
  cornerstoneTools.setToolActiveForElement(element, 'Zoom', {
    mouseButtonMask: 1,
  })
  cornerstoneTools.setToolActiveForElement(element, 'StackScrollMouseWheel', {})
}

async function loadAndDisplayFile(file: File) {
  try {
    const { imageIds: processedImageIds } =
      await validateAndProcessDicomFile(file)
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

async function initializeCornerstoneViewer(
  element: CornerstoneElement,
  imageIds: string[],
): Promise<void> {
  await displayImage(element, imageIds[0])
  setupStackState(element, imageIds)
  setupImageRenderedListener(element)
  setupTools(element)
}

async function displayImage(
  element: CornerstoneElement,
  imageId: string,
): Promise<void> {
  const image = await cornerstone.loadImage(imageId)
  cornerstone.displayImage(element, image)

  // 이미지를 뷰어에 맞게 자동 조절
  cornerstone.fitToWindow(element)

  // 뷰포트 설정으로 이미지 크기 최적화
  const viewport = cornerstone.getViewport(element)
  viewport.scale = 1.0 // 기본 스케일 설정
  cornerstone.setViewport(element, viewport)
}

function setupImageRenderedListener(element: CornerstoneElement): void {
  element.addEventListener('cornerstoneimagerendered', (e: any) => {
    currentImageIndex.value = e.detail.image.imageIdIndex || 0
  })
}

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

onBeforeUnmount(() => {
  if (imageElement.value) {
    cornerstone.disable(imageElement.value)
  }
})
</script>

<template>
  <div ref="imageElement" class="cornerstone-element" />
</template>

<style scoped>
.cornerstone-element {
  width: 100%;
  height: 70vh;
  background-color: var(--v-theme-surface);
  display: block;
  margin: 0 auto;
}
</style>
