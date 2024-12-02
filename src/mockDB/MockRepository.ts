// src/services/MockServer.ts
import type { Patient } from '@/models/Patient' // Patient 클래스 가져오기
import type { Case } from '@/models/Case' // Case 클래스 가져오기

export class MockServer {
  private patients: Patient[]

  constructor() {
    // 초기 환자 데이터 설정
    this.patients = [
      {
        id: 1,
        name: 'John Doe',
        gender: 'Male',
        dob: '1990-01-01',
        caseList: [],
      },
      {
        id: 2,
        name: 'Jane Smith',
        gender: 'Female',
        dob: '1992-02-02',
        caseList: [],
      },
    ]
  }

  // 모든 환자 목록 가져오기
  getPatients(): Patient[] {
    return this.patients
  }

  // 특정 환자 찾기
  findPatient(patientId: number): Patient | null {
    return this.patients.find((p) => p.id === patientId) || null
  }

  // 특정 환자의 case list 가져오기
  getPatientCaseList(patientId: number): Case[] | null {
    const patient = this.findPatient(patientId)
    return patient ? patient.caseList : null
  }
}

const MockRepository = new MockServer()

export { MockRepository }
