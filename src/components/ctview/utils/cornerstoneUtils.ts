import dicomParser from 'dicom-parser'
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'

export class DicomError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DicomError'
  }
}

export async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) =>
      resolve(e.target?.result as ArrayBuffer)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

export function parseDicomAndGetFrames(
  byteArray: Uint8Array,
  file: File,
): string[] {
  const dataSet = dicomParser.parseDicom(byteArray)
  const numberOfFrames = dataSet.intString('x00280008') || 1
  const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file)
  const frameIds = []
  for (let i = 0; i < numberOfFrames; i++) {
    frameIds.push(imageId + (numberOfFrames > 1 ? `?frame=${i}` : ''))
  }
  return frameIds
}

export async function validateAndProcessDicomFile(
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

export function handleError(
  error: unknown,
  errorType: 'read' | 'validation',
): void {
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
