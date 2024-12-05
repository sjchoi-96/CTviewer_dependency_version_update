<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'login', username: string, password: string): void
  (e: 'clear'): void
}>()

const userName = ref('')
const password = ref('')

const userNameField = ref<HTMLInputElement | null>(null)
const passwordField = ref<HTMLInputElement | null>(null)

function handleLogin(): void {
  if (userName.value && password.value) {
    emit('login', userName.value, password.value)
  } else if (!userName.value) {
    Notify.warning('Please enter your username.')
  } else if (!password.value) {
    Notify.warning('Please enter your password.')
  }
}

function clearInputs(): void {
  userName.value = ''
  password.value = ''
  emit('clear')
}

function focusNext(currentField: 'userNameField' | 'passwordField'): void {
  if (currentField === 'userNameField' && passwordField.value) {
    passwordField.value.focus()
  } else if (currentField === 'passwordField') {
    handleLogin()
  }
}
</script>

<template>
  <v-responsive max-width="300" class="mx-auto">
    <v-text-field
      ref="userNameField"
      v-model="userName"
      color="primary"
      placeholder="Enter your user name"
      label="User Name"
      class="mx-auto mt-8"
      @keydown.enter="focusNext('userNameField')"
    />
    <v-text-field
      ref="passwordField"
      v-model="password"
      color="primary"
      placeholder="Enter your password"
      label="Password"
      type="password"
      class="mx-auto mt-4"
      @keydown.enter="focusNext('passwordField')"
    />

    <div class="text-center mt-4">
      <v-btn
        :disabled="!userName || !password"
        class="mr-2"
        color="primary"
        @click="handleLogin"
      >
        Login
      </v-btn>
      <v-btn @click="clearInputs">Cancel</v-btn>
    </div>
  </v-responsive>
</template>
