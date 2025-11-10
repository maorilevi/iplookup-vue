<script setup lang="ts">
defineEmits<{
  add: []
}>()
</script>

<template>
  <button @click="$emit('add')" class="add-button">
    + Add
  </button>
</template>

<style lang="scss" scoped>
.add-button {
  padding: 10px 20px;
  background-color: #14a6f5;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgb(97, 190, 229);
  }

  &:active {
    transform: scale(0.98);
  }
}
</style>
