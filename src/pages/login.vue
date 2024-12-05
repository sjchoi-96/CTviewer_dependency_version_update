<script setup lang="ts">
import { useRouter } from 'vue-router'
import LoginForm from '@/components/auth/LoginForm.vue'
import { mockRepository } from '@/mockDB/MockRepository'

const router = useRouter()

function handleLogin(username: string, password: string): void {
  if (mockRepository.authenticateUser(username, password)) {
    Notify.success(`Welcome, ${username}!`)
    router.push('/patientInfo')
  } else {
    Notify.error('Invalid username or password')
  }
}
</script>

<template>
  <div class="wrapper">
    <v-img
      src="@/assets/icons/neofavicon.svg"
      color="primary"
      alt="Logo"
      max-width="150"
      max-height="150"
      class="mx-auto mb-4"
    />
    <p>Start Neoplan</p>

    <LoginForm @login="handleLogin" />
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
  top: max(50vh - 300px, 0px);
  text-align: center;
}
</style>
