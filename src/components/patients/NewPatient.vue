<template>
  <v-col cols="6">
    <v-card-text>
      <v-card-title class="d-flex justify-space-between">
        <span>New Patient</span>
        <div class="button-group">
          <v-btn class="new-save-btn" small @click="savePatient">Save</v-btn>
          <v-btn class="new-cancel-btn" small @click="closeNewPatient"
            >Cancel</v-btn
          >
        </div>
      </v-card-title>
      <v-form ref="form" v-model="valid">
        <v-text-field
          v-model="newPatient.name"
          label="Name"
          :rules="[rules.required]"
          required
        />
        <v-text-field
          v-model="newPatient.gender"
          label="Gender"
          :rules="[rules.required]"
          required
        />
        <v-text-field
          v-model="newPatient.dob"
          label="Date of Birth"
          :rules="[rules.required]"
          required
        />
      </v-form>
    </v-card-text>
  </v-col>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'
import type { Patient } from '@/models/Patient'

const props = defineProps<{
  addPatient: (patient: Patient) => void
  closeNewPatient: () => void
  patientList: Patient[]
}>()

const newPatient = ref<Patient>({
  id: 0,
  name: '',
  gender: '',
  dob: '',
  caseList: [],
})

const valid = ref(false)
const rules = {
  required: (value: any) => !!value || 'Required.',
}

function savePatient() {
  if (valid.value) {
    const lastId =
      props.patientList.length > 0
        ? Math.max(...props.patientList.map((p) => p.id))
        : 0
    newPatient.value.id = lastId + 1

    props.addPatient(newPatient.value)
    newPatient.value = { id: 0, name: '', gender: '', dob: '', caseList: [] }
  }
}
</script>

<style scoped>
.new-save-btn {
  padding: 4px 8px;
  font-size: 13px;
  border: solid 1px rgb(var(--v-theme-primary));
}

.new-cancel-btn {
  padding: 4px 8px;
  font-size: 13px;
  border: solid 1px rgb(var(--v-theme-error));
}

.button-group {
  display: flex;
  gap: 8px; /* 버튼 사이의 간격 */
}
</style>
