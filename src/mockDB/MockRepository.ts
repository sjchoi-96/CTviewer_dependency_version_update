// src/services/MockServer.ts
import type { Patient } from '@/models/Patient' // Patient 인터페이스 가져오기
import type { Case } from '@/models/Case' // Case 인터페이스 가져오기
import type { User } from '@/models/User'

export class MockRepository {
  private patients: Patient[]
  private users: User[]

  constructor() {
    // 초기 환자 데이터 설정
    this.patients = [
      {
        id: 0,
        name: 'John Doe',
        gender: 'Male',
        dob: '1990-01-01',
        memo: '',
        caseList: [
          {
            id: 1,
            patientId: 0,
            planName: 'Plan 1',
            planStatus: 'Done',
            nerveCanalPosition: 'Left',
            sinusPosition: 'Left',
            stlFile: true,
            ctData: true,
            iosData: true,
            faceScanData: true,
            selectedGuideSlot: null,
            selectedJigSlot: null,
            implant: {
              id: 1,
              caseId: 1,
              implantLocation: 23,
              implantType: 'Implant Type 1',
              implantSize: 'Implant Size 1',
              abutmentType: 'Abutment Type 1',
              abutmentSize: 'Abutment Size 1',
              crownType: 'Crown Type 1',
              crownSize: 'Crown Size 1',
            },
          },
          {
            id: 2,
            patientId: 0,
            planName: 'Plan 2',
            planStatus: 'Pending',
            nerveCanalPosition: 'Left',
            sinusPosition: 'Left',
            stlFile: false,
            ctData: true,
            iosData: true,
            faceScanData: true,
            selectedGuideSlot: null,
            selectedJigSlot: null,
            implant: {
              id: 2,
              caseId: 2,
              implantLocation: 31,
              implantType: 'Implant Type 1',
              implantSize: 'Implant Size 1',
              abutmentType: 'Abutment Type 1',
              abutmentSize: 'Abutment Size 1',
              crownType: 'Crown Type 1',
              crownSize: 'Crown Size 1',
            },
          },
          {
            id: 3,
            patientId: 0,
            planName: 'Plan 3',
            planStatus: 'Pending',
            nerveCanalPosition: 'Left',
            sinusPosition: 'Left',
            stlFile: true,
            ctData: true,
            iosData: true,
            faceScanData: true,
            selectedGuideSlot: null,
            selectedJigSlot: null,
            implant: {
              id: 3,
              caseId: 3,
              implantLocation: 12,
              implantType: 'Implant Type 1',
              implantSize: 'Implant Size 1',
              abutmentType: 'Abutment Type 1',
              abutmentSize: 'Abutment Size 1',
              crownType: 'Crown Type 1',
              crownSize: 'Crown Size 1',
            },
          },
          {
            id: 4,
            patientId: 0,
            planName: 'Plan 4',
            planStatus: 'Pending',
            nerveCanalPosition: 'Left',
            sinusPosition: 'Left',
            stlFile: true,
            ctData: true,
            iosData: true,
            faceScanData: true,
            selectedGuideSlot: null,
            selectedJigSlot: null,
            implant: {
              id: 4,
              caseId: 4,
              implantLocation: 22,
              implantType: 'Implant Type 1',
              implantSize: 'Implant Size 1',
              abutmentType: 'Abutment Type 1',
              abutmentSize: 'Abutment Size 1',
              crownType: 'Crown Type 1',
              crownSize: 'Crown Size 1',
            },
          },
        ],
      },
      {
        id: 1,
        name: 'Jane Smith',
        gender: 'Female',
        dob: '1992-02-02',
        memo: '',
        caseList: [],
      },
    ]
    // 초기 유저 데이터 설정
    this.users = [
      {
        userName: 'neo',
        password: '0000',
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
    if (patient) {
      // 원본 배열을 변경하지 않고 복사본을 반환
      return [...patient.caseList].reverse()
    }
    return null
  }

  // 특정 환자 가져오기
  getPatient(patientId: number): Patient | null {
    return this.findPatient(patientId) || null
  }

  // 유저 인증
  authenticateUser(userName: string, password: string): boolean {
    return this.users.some(
      (u) => u.userName === userName && u.password === password,
    )
  }

  // Case의 가이드 선택시
  updateCaseGuideSlot(
    patientId: number,
    caseId: number,
    slotNumber: number,
  ): void {
    const patient = this.findPatient(patientId)
    if (!patient) {
      console.log('Patient not found:', patientId)
      return
    }

    const targetCase = patient.caseList.find((c) => c.id === caseId)
    if (!targetCase) {
      console.log('Case not found:', caseId)
      return
    }

    targetCase.selectedGuideSlot = slotNumber
    console.log('Updated case:', targetCase)
    console.log('All cases for patient:', patient.caseList)
  }

  updateCaseJigSlot(
    patientId: number,
    caseId: number,
    slotNumber: number,
  ): void {
    const patient = this.findPatient(patientId)
    if (!patient) return

    const targetCase = patient.caseList.find((c) => c.id === caseId)
    if (!targetCase) return

    targetCase.selectedJigSlot = slotNumber
  }

  // Case의 가이드/지그 슬롯 정보 조회
  getCaseSlotInfo(
    patientId: number,
    caseId: number,
  ): { guideSlot: number | null; jigSlot: number | null } | null {
    const patient = this.findPatient(patientId)
    if (!patient) return null

    const targetCase = patient.caseList.find((c) => c.id === caseId)
    if (!targetCase) return null

    return {
      guideSlot: targetCase.selectedGuideSlot,
      jigSlot: targetCase.selectedJigSlot,
    }
  }
}
// 단일 인스턴스 생성 및 export
export const mockRepository = new MockRepository()
