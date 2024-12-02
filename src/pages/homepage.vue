<script setup lang="ts">
import { ref } from 'vue'

// 상태 관리: username과 password
const userName = ref('')
const password = ref('')

// 로그인 버튼 동작
function login(): void {
  if (userName.value && password.value) {
    Notify.success(`Welcome, ${userName.value}!`)
  } else if (!userName.value || undefined) {
    Notify.warning('Please enter your username.')
  } else if (!password.value || undefined) {
    Notify.warning('Please enter your password.')
  }
}

// 취소 버튼 동작
function clearInputs(): void {
  userName.value = ''
  password.value = ''
}

// 필드 참조를 위한 ref
const userNameField = ref<HTMLInputElement | null>(null)
const passwordField = ref<HTMLInputElement | null>(null)

// 포커스 이동 함수
function focusNext(currentField: 'userNameField' | 'passwordField'): void {
  if (currentField === 'userNameField' && passwordField.value) {
    passwordField.value.focus()
  } else if (currentField === 'passwordField') {
    login()
  }
}
</script>
<template>
  <div class="wrapper">
    <!-- 중앙에 이미지 배치 및 크기 조정 -->
    <v-img
      src="@/assets/icons/neofavicon.svg"
      color="primary"
      alt="Logo"
      max-width="150"
      max-height="150"
      class="mx-auto mb-4"
    />
    <p>Start Neoplan</p>

    <!-- 로그인 창 -->
    <v-responsive max-width="300" class="mx-auto">
      <v-text-field
        v-model="userName"
        color="primary"
        placeholder="Enter your user name"
        label="User Name"
        class="mx-auto mt-8"
        ref="userNameField"
        @keydown.enter="focusNext('userNameField')"
      />
      <v-text-field
        v-model="password"
        color="primary"
        placeholder="Enter your password"
        label="Password"
        type="password"
        class="mx-auto mt-4"
        ref="passwordField"
        @keydown.enter="focusNext('passwordField')"
      />
    </v-responsive>

    <!-- 버튼 -->
    <v-btn
      :disabled="!userName || !password"
      class="mr-2"
      color="primary"
      @click="login"
    >
      Login
    </v-btn>
    <v-btn @click="clearInputs">Cancel</v-btn>
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
  top: max(50vh - 300px, 0px);
  text-align: center;
}
</style>
