<script setup lang="ts">
defineEmits<{
  add: []
}>()
</script>

<template>
  <button @click="$emit('add')" class="add-button"><i class="add-button__plus">+</i>Add
  </button>
</template>

<style lang="scss" scoped>
.add-button {
  padding: 6px 20px;
  background-color: #14a6f5;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgb(97, 190, 229);
  }

  &:active {
    transform: scale(0.98);
  }
  &__plus {
    font-size: 24px;
    font-weight: 600;
    font-family: auto;
    line-height: 1;
  }
}
</style>
