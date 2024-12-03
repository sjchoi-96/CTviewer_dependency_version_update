import type { Case } from './Case'

interface Patient {
  id: number
  name: string
  gender: string
  dob: string
  memo: string
  caseList: Case[]
}

export type { Patient }
