<template>
  <MainLayout>
    <router-view /> <!-- dynamic views load here -->
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from './layouts/MainLayout.vue'
</script>
