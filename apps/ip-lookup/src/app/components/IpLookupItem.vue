<template>
  <div class="ip-item-wrapper">
    <div class="ip-item" :class="[`ip-item--status-${item.status || 'idle'}`]">
      <span class="ip-item__number">{{ index + 1 }}</span>

      <input
        type="text"
        :value="item.value"
        @input="onInput"
        @blur="handleBlur"
        placeholder="Enter IP address"
        class="ip-item__input"
        :class="{ 'ip-item__input--error': showValidationError }"
        :readonly="item.status === 'searching'"
      />

      <!-- Loader during search -->
      <div v-if="item.status === 'searching'" class="ip-item__loader"></div>

      <!-- Flag after successful search -->
      <img
        v-else-if="item.countryCode"
        :src="getFlagUrl(item.countryCode)"
        :alt="item.country"
        :title="item.country"
        class="ip-item__flag"
      />

      <!-- Time display -->
      <span v-if="item.localTime && item.status !== 'searching'" class="ip-item__time">{{ item.localTime }}</span>

      <!-- Error icon with tooltip -->
      <div
        v-if="item.status === 'error' && item.error"
        class="ip-item__error-icon"
        :title="item.error"
      >
        ⚠
      </div>

      <!-- Validation error icon with tooltip -->
      <div
        v-else-if="showValidationError"
        class="ip-item__error-icon"
        title="Invalid IP address format"
      >
        ⚠
      </div>

      <button
        class="ip-item__delete"
        @click="$emit('itemDelete', { id: item.id })"
        title="Delete"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch} from 'vue'
import {isValidIp} from '@list-utils'
import {IpLookupItemModel} from "../models/ipLookup.model";
import type {ItemEvents} from "@list-types/models/item-events.model";

const props = defineProps<{ item: IpLookupItemModel, index: number }>()

const emit = defineEmits<ItemEvents>()

// Track if user has left the input field
const hasBlurred = ref(false)

const showValidationError = computed(() => {
  console.log('showValidationError !!!!!!')
  // Only show error after user has left the input
  if (!hasBlurred.value) {
    return false
  }

  // Show error only if there's text and it's not a valid IP
  if (!props.item.value || props.item.value.trim() === '') {
    return false
  }

  // Don't show validation error during searching or if already showing API error
  if (props.item.status === 'searching' || props.item.status === 'error') {
    return false
  }

  // Don't show validation error if successful
  if (props.item.status === 'success') {
    return false
  }

  return !isValidIp(props.item.value.trim())
})

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('itemChange', { id: props.item.id, value: target.value, reset: false })

  // Reset blur state when user starts typing again
  if (hasBlurred.value && props.item.status !== 'success') {
    hasBlurred.value = false
  }
}

function handleBlur() {
  hasBlurred.value = true
  emit('itemBlur', {id: props.item.id})
}

watch(
  () => props.item.status,
  (newStatus) => {
    // Reset item information when IP address is invalid
    if (newStatus === 'error') {
      emit('itemChange', {id: props.item.id, value: props.item.value, reset: true})
    }
  }
)

function getFlagUrl(countryCode: string): string {
  const code = countryCode.toLowerCase()
  return `https://flagcdn.com/w40/${code}.png`
}
</script>

<style lang="scss" scoped>
@use '../../styles/variables' as *;

.ip-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid $border-color-light;
  direction: ltr;
  text-align: left;
  transition: background-color 0.2s;

  &:hover {
    background-color: $bg-gray-lighter;
  }

  &:last-child {
    border-bottom: none;
  }

  // Block Modifiers
  &--status-idle {
    background-color: $status-idle-bg;
  }

  &--status-searching {
    background-color: $status-searching-bg;
  }

  &--status-success {
    background-color: $status-success-bg;
  }

  &--status-error {
    background-color: $status-idle-bg; // No red background
  }

  // Elements
  &__number {
    height: 30px;
    width: 30px;
    font-weight: 600;
    font-size: 13px;
    color: $text-secondary;
    background: $border-color-dark;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    line-height: 0;
  }

  &__input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid $border-color;
    border-radius: 4px;
    font-size: 14px;
    transition: all 0.3s;
    min-width: 0;
    width: 300px;
    max-width: 300px;
    &:focus {
      outline: none;
      border-color: $color-primary;
    }

    &:disabled {
      background: $bg-gray-light;
      cursor: not-allowed;
    }

    &[readonly] {
      background: $bg-gray-light;
      color: $text-secondary;
      cursor: not-allowed;
      border-color: $border-color-light;
    }

    &--error {
      border-color: $color-error;

      &:focus {
        border-color: $color-error;
      }
    }
  }

  &__loader {
    width: 35px;
    height: 35px;
    border: 3px solid $border-color-light;
    border-top-color: $color-primary;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  &__flag {
    object-fit: contain;
    box-shadow: $shadow-sm;
    height: auto;
    border-radius: 3px;
    width: 35px;
  }

  &__time {
    font-family: 'Courier New', monospace;
    font-size: 14px;
    font-weight: 600;
    color: $text-tertiary;
    min-width: 80px;
    text-align: center;
  }

  &__error-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
    font-size: 24px;
    color: $color-error;
    cursor: help;
  }

  &__delete {
    background: none;
    border: none;
    font-size: 24px;
    color: $text-light;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;
    flex-shrink: 0;

    &:hover {
      background: $color-error;
      color: $bg-white;
    }
  }
}

.ip-item-wrapper {
  position: relative;
  overflow: visible;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
