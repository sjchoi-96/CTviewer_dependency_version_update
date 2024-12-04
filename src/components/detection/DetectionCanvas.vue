<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const detectionCanvas = ref<HTMLCanvasElement | null>(null)
const detectionCtx = ref<CanvasRenderingContext2D | null>(null)
const x = ref<number>(0)
const y = ref<number>(0)
const isDrawing = ref<boolean>(false)

function initializeCanvas(): void {
  if (detectionCanvas.value) {
    detectionCtx.value = detectionCanvas.value.getContext('2d')
    setCanvasDimensions(detectionCanvas.value)
    if (detectionCtx.value) {
      scaleCanvasForHighResolution(detectionCanvas.value, detectionCtx.value)
    }
  }
}

function scaleCanvasForHighResolution(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
): void {
  const dpr = window.devicePixelRatio || 1
  canvas.width = canvas.clientWidth * dpr
  canvas.height = canvas.clientHeight * dpr
  ctx.scale(1, 1)
}

function setCanvasDimensions(canvas: HTMLCanvasElement): void {
  const canvasWidth = canvas.clientWidth
  const canvasHeight = canvas.clientHeight
  canvas.width = canvasWidth
  canvas.height = canvasHeight
}

function drawLine(x1: number, y1: number, x2: number, y2: number): void {
  if (detectionCtx.value) {
    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--v-theme-primary')
      .trim()

    detectionCtx.value.lineWidth = 5
    detectionCtx.value.strokeStyle = `rgb(${primaryColor})`
    detectionCtx.value.beginPath()
    detectionCtx.value.moveTo(x1, y1)
    detectionCtx.value.lineTo(x2, y2)
    detectionCtx.value.closePath()
    detectionCtx.value.stroke()
  }
}

function getMousePosition(e: MouseEvent): { x: number; y: number } {
  if (!detectionCanvas.value) {
    throw new Error('Canvas is not initialized')
  }
  const rect = detectionCanvas.value.getBoundingClientRect()
  const scaleX = detectionCanvas.value.width / rect.width
  const scaleY = detectionCanvas.value.height / rect.height
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  }
}

function beginDrawing(e: MouseEvent): void {
  const position = getMousePosition(e)
  x.value = position.x
  y.value = position.y
  isDrawing.value = true
}

function keepDrawing(e: MouseEvent): void {
  if (isDrawing.value) {
    const position = getMousePosition(e)
    drawLine(x.value, y.value, position.x, position.y)
    x.value = position.x
    y.value = position.y
  }
}

function stopDrawing(): void {
  isDrawing.value = false
}

function handleResize() {
  if (detectionCanvas.value) {
    setCanvasDimensions(detectionCanvas.value)
    if (detectionCtx.value) {
      scaleCanvasForHighResolution(detectionCanvas.value, detectionCtx.value)
    }
  }
}

onMounted(() => {
  nextTick(() => {
    initializeCanvas()
    window.addEventListener('resize', handleResize)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="detection-view">
    <canvas
      ref="detectionCanvas"
      @mousedown="beginDrawing"
      @mousemove="keepDrawing"
      @mouseup="stopDrawing"
      @mouseout="stopDrawing"
    />
  </div>
</template>

<style scoped>
.detection-view {
  flex: 1;
  display: flex;
  border-radius: 5px;
  height: 600px;
}

canvas {
  cursor: crosshair;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/panoramic/detection.png');
  background-position: center center;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
