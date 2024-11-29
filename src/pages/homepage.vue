<script setup lang="ts">
import { ref } from 'vue'

// 상태 관리: username과 password
const username = ref('')
const password = ref('')

// 로그인 버튼 동작
const login = () => {
  if (username.value && password.value) {
    Notify.success(`Welcome, ${username.value}!`)
  }
}

// 취소 버튼 동작
const clearInputs = () => {
  username.value = ''
  password.value = ''
  Notify.warning('Inputs cleared.')
}
</script>
<template>
  <div class="wrapper">
    <!-- 중앙에 이미지 배치 및 크기 조정 -->
    <v-img
      src="@/assets/icons/logo_on.png"
      alt="Logo"
      max-width="150"
      max-height="150"
      class="mx-auto mb-4"
    />
    <p>Start Neoplan</p>

    <!-- 로그인 창 -->
    <v-responsive max-width="300" class="mx-auto">
      <v-text-field
        v-model="username"
        color="primary"
        placeholder="Enter your username"
        label="Username"
        class="mx-auto mt-8"
      />
      <v-text-field
        v-model="password"
        color="primary"
        placeholder="Enter your password"
        label="Password"
        type="password"
        class="mx-auto mt-4"
      />
    </v-responsive>

    <!-- 버튼 -->
    <v-btn
      :disabled="!username || !password"
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
