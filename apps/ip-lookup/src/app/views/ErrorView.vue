<template>
  <div class="error-view">
    <div class="error-view__container">
      <div class="error-view__icon">⚠️</div>
      <h1 class="error-view__title">Oops! Something went wrong</h1>
      <p class="error-view__message">
        We encountered an unexpected error. Please try again later.
      </p>
      <button class="error-view__button" @click="goHome">
        Go Back Home
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.error-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 20px;
  direction: ltr;
  text-align: center;

  &__container {
    background: white;
    border-radius: 8px;
    padding: 40px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;
  }

  &__icon {
    font-size: 64px;
    margin-bottom: 20px;
  }

  &__title {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin: 0 0 16px 0;
  }

  &__message {
    font-size: 16px;
    color: #666;
    margin: 0 0 32px 0;
    line-height: 1.5;
  }

  &__button {
    background-color: rgb(117, 210, 249);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: rgb(97, 190, 229);
    }

    &:active {
      transform: scale(0.98);
    }
  }
}
</style>
