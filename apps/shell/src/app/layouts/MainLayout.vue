<template>
  <div class="layout">
    <Navbar />
    <div class="content">
      <Sidebar />
      <main><slot /></main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '../components/Navbar.vue'
import Sidebar from '../components/Sidebar.vue'
</script>
