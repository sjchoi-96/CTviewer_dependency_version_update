<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import panoramicImg from '@/assets/images/panoramic/panoramic.png'
import axialImg from '@/assets/images/panoramic/axial.png'
import orthogonalImg from '@/assets/images/panoramic/orthogonal.png'
import tangentialImg from '@/assets/images/panoramic/tangential.png'

definePage({
  meta: {
    icon: 'mdi-molecule',
    title: 'Detection',
    drawerIndex: 3,
  },
})

const detectionCanvas = ref<HTMLCanvasElement | null>(null)
const detectionCtx = ref<CanvasRenderingContext2D | null>(null)
const x = ref<number>(0)
const y = ref<number>(0)
const isDrawing = ref<boolean>(false)

function initializeCanvas(): void {
  if (detectionCanvas.value) {
    console.log('Canvas context initialized')
    detectionCtx.value = detectionCanvas.value.getContext('2d')

    setCanvasDimensions(detectionCanvas.value)

    if (detectionCtx.value) {
      scaleCanvasForHighResolution(detectionCanvas.value, detectionCtx.value)
    }
  } else {
    console.log('Canvas is still null after nextTick')
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
    // primary 색상 가져오기
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

// 리사이즈 핸들러
function handleResize() {
  if (detectionCanvas.value) {
    setCanvasDimensions(detectionCanvas.value)
    if (detectionCtx.value) {
      scaleCanvasForHighResolution(detectionCanvas.value, detectionCtx.value)
    }
  }
}

// 컴포넌트가 마운트될 때 캔버스 초기화
onMounted(() => {
  nextTick(() => {
    initializeCanvas()
    // 리사이즈 이벤트 리스너 등록
    window.addEventListener('resize', handleResize)
  })
})

// 컴포넌트가 제거되기 전에 이벤트 리스너 제거
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="9">
                <div class="detection-view">
                  <canvas
                    ref="detectionCanvas"
                    @mousedown="beginDrawing"
                    @mousemove="keepDrawing"
                    @mouseup="stopDrawing"
                    @mouseout="stopDrawing"
                  />
                </div>
              </v-col>

              <v-col class="panoramic-container" cols="3">
                <div class="panoramic-view">
                  <v-img :src="panoramicImg" width="100%" height="100%" />
                </div>
                <div class="panoramic-view">
                  <v-img :src="axialImg" width="100%" height="100%" />
                </div>
                <div class="panoramic-view">
                  <v-img :src="orthogonalImg" width="100%" height="100%" />
                </div>
                <div class="panoramic-view">
                  <v-img :src="tangentialImg" width="100%" height="100%" />
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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

.panoramic-container {
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  width: 100%;
  height: 100%;
  flex: 1;
  gap: 10px;
}

.panoramic-view {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  border: solid 2px rgb(var(--v-theme-primary));
  margin-bottom: 2rem;
}
</style>
