import type { Implant } from './Implant'

interface Case {
  id: number
  patientId: number
  planName: string
  planStatus: string
  nerveCanalPosition: string
  sinusPosition: string
  stlFile: boolean
  ctData: boolean
  iosData: boolean
  faceScanData: boolean
  implant: Implant
}

export type { Case }
