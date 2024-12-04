<template>
  <v-card class="d-flex flex-column fill-height">
    <v-file-input
      label="Upload 3D Model (.obj .stl)"
      prepend-icon=""
      prepend-inner-icon="mdi-file-upload"
      accept=".obj,.stl"
      @change="updateCtImage"
    />

    <div class="model-view-section flex-grow-1">
      <div id="viewer" ref="viewer" class="viewer-container" />
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as THREE from 'three'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { STLLoader } from 'three/addons/loaders/STLLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
const uploadedCtImage = ref<File | null>(null)
// three.js 관련 변수 설정
const viewer = ref<HTMLDivElement | null>(null)
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls

function updateCtImage(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files ? input.files[0] : null
  const selectedFileName = ref('')

  if (file) {
    uploadedCtImage.value = file
    selectedFileName.value = file.name
    load3DModel(file)
  }
}

function load3DModel(file: File) {
  console.log('load3DModel 호출 완료')
  const reader = new FileReader()

  reader.onload = () => {
    if (reader.result && viewer.value) {
      initializeThreeJS() // Three.js 초기화
      const objData = reader.result as string

      if (file.name.toLowerCase().endsWith('.obj')) {
        loadOBJModel(objData)
      } else if (file.name.toLowerCase().endsWith('.stl')) {
        loadSTLModel(reader.result as ArrayBuffer)
      } else {
        console.error('지원되지 않는 파일 형식입니다.')
        return
      }

      camera.position.set(0, 0, 10) // Adjust the camera position as needed
      camera.lookAt(0, 0, 0) // Look at the center of the scene
      startAnimation()
    }
  }

  function loadOBJModel(objData: string): void {
    const loader = new OBJLoader()
    const objModel = loader.parse(objData)
    objModel.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.material = new THREE.MeshNormalMaterial()
        mesh.scale.set(0.1, 0.1, 0.1)
      }
    })

    const box = new THREE.Box3().setFromObject(objModel)
    const center = box.getCenter(new THREE.Vector3())
    objModel.position.sub(center)

    scene.add(objModel)
  }

  function loadSTLModel(stlData: ArrayBuffer): void {
    const loader = new STLLoader()
    const geometry = loader.parse(stlData)
    const material = new THREE.MeshNormalMaterial()
    const stlModel = new THREE.Mesh(geometry, material)
    stlModel.scale.set(0.1, 0.1, 0.1)

    const box = new THREE.Box3().setFromObject(stlModel)
    const center = box.getCenter(new THREE.Vector3())
    stlModel.position.sub(center)

    scene.add(stlModel)
  }

  function startAnimation(): void {
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update() // OrbitControls 업데이트
      renderer.render(scene, camera)
    }

    animate()
  }

  function initializeThreeJS(): void {
    scene = new THREE.Scene()

    // 현재 테마의 surface 색상 가져오기
    const surfaceColor = getComputedStyle(
      document.documentElement,
    ).getPropertyValue('--v-theme-surface')

    // 다크모드일 때만 커스텀 색상 적용
    const backgroundColor = rgbToHex(surfaceColor)
    scene.background = new THREE.Color(backgroundColor)

    if (viewer.value) {
      camera = new THREE.PerspectiveCamera(
        75,
        viewer.value.clientWidth / viewer.value.clientHeight,
        0.1,
        1000,
      )
    } else {
      console.error('Viewer is not initialized')
      return
    }

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // 투명도 지원
    })
    renderer.setClearColor(0xf5f5f5) // renderer의 배경색도 설정
    renderer.setSize(viewer.value.clientWidth, viewer.value.clientHeight)

    viewer.value.innerHTML = ''
    viewer.value.appendChild(renderer.domElement)

    // OrbitControls 초기화
    initializeOrbitControls(camera, renderer.domElement)
  }

  function initializeOrbitControls(
    camera: THREE.PerspectiveCamera,
    rendererDomElement: HTMLElement,
  ): void {
    controls = new OrbitControls(camera, rendererDomElement)
    controls.enableDamping = true // 감속 효과 활성화
    controls.dampingFactor = 0.25
    controls.screenSpacePanning = true // 드래그(닝) 활성화
    controls.maxPolarAngle = Math.PI / 2
    controls.minDistance = 3 // 최소 거리
    controls.maxDistance = 50 // 최대 거리
  }

  // .obj 파일은 텍스트로, .stl 파일은 바이너리로 읽기
  if (file.name.toLowerCase().endsWith('.obj')) {
    reader.readAsText(file)
  } else if (file.name.toLowerCase().endsWith('.stl')) {
    reader.readAsArrayBuffer(file)
  }
}

// RGB 문자열을 hex 값으로 변환하는 함수
function rgbToHex(rgbStr: string): number {
  const rgb = rgbStr.match(/\d+/g)
  if (!rgb || rgb.length !== 3) return 0x090909
  return (parseInt(rgb[0]) << 16) + (parseInt(rgb[1]) << 8) + parseInt(rgb[2])
}
</script>
<style scoped>
.model-view-section {
  width: 100%;
  height: 100%;
  position: relative;
}

.viewer-container {
  width: 100%;
  height: 100%;
  position: relative;
}

/* v-card가 flex container가 되도록 */
:deep(.v-card) {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
