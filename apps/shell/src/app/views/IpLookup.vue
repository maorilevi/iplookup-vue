<template>
  <section class="ip-lookup-view">
    <h2>IP Lookup</h2>
    <!-- Import the IP Lookup app or component -->
    <IpLookupList />
  </section>
</template>

<script setup lang="ts">
import IpLookupList from '@list-components/../lib/list/list.component.vue'
</script>

<style scoped>
.ip-lookup-view {
  padding: 2rem;
}
</style>
