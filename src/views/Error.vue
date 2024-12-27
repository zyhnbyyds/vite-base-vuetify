<script lang="ts" setup>
import { useRouter } from 'vue-router'

function clickGoHome() {
  useRouter().push('/')
}
</script>

<template>
  <div class="error-container">
    <h1 class="error-title">
      Oops! Something went wrong.
    </h1>
    <p class="error-subtitle">
      The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
    </p>
    <Button label="Go to Homepage" class="p-button-primary" @click="clickGoHome" />
  </div>
</template>

<style scoped>
.error-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.error-image {
  margin-bottom: 20px;
}
.error-title {
  font-size: 2rem;
  margin-bottom: 10px;
}
.error-subtitle {
  font-size: 1.2rem;
  margin-bottom: 20px;
}
</style>
