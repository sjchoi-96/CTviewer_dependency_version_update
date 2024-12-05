<script setup lang="ts">
const emit = defineEmits<{
  (e: 'fileSelected', file: File): void
}>()

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files?.length) return
  emit('fileSelected', files[0])
}
</script>

<template>
  <v-file-input
    label="Upload DICOM file"
    accept=".dcm"
    prepend-icon=""
    prepend-inner-icon="mdi-file-upload"
    class="mb-4"
    hide-details
    @change="handleFileSelect"
  />
</template>
