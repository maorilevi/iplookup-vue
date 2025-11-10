<script setup lang="ts">
import type { ListItemModel } from '@list-types/models/list-item.model'

defineProps<{
  item: ListItemModel,
  index: number,
}>()

defineEmits<{
  change: [{ id: string; value: string }]
  blur: [{ id: string }]
  delete: [{ id: string }]
}>()
</script>

<template>
  <div class="list-item">
    <span class="list-item__label">{{ item.id }}</span>

    <input
      type="text"
      :value="item.value"
      @input="$emit('change', { id: item.id, value: ($event.target as HTMLInputElement).value })"
      @blur="$emit('blur', { id: item.id })"
      placeholder="Enter value"
      class="list-item__input"
    />

    <button
      @click="$emit('delete', { id: item.id })"
      class="list-item__delete"
      :aria-label="`Delete ${item.value}`"
    >
      ×
    </button>
  </div>
</template>

<style lang="scss" scoped>
.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  transition: box-shadow 0.3s ease;
  direction: ltr;
  text-align: left;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  // BEM - Elements
  &__label {
    font-weight: 600;
    font-size: 14px;
    color: #333;
    min-width: 80px;
  }

  &__input {
    flex: 1;
    padding: 10px 12px;
    border: 2px solid #e0e0e0;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: #2196f3;
    }
  }

  &__delete {
    background: none;
    border: none;
    font-size: 24px;
    color: #999;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover {
      background-color: #ffebee;
      color: #f44336;
    }
  }
}
</style>
