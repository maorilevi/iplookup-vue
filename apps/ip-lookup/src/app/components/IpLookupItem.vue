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
        :disabled="item.status === 'searching'"
      />

      <img
        v-if="item.countryCode"
        :src="getFlagUrl(item.countryCode)"
        :alt="item.country"
        :title="item.country"
        class="ip-item__flag"
      />

      <span v-if="item.localTime" class="ip-item__time">{{ item.localTime }}</span>

      <button
        class="ip-item__delete"
        @click="$emit('delete', { id: item.id })"
        title="Delete"
      >
        ×
      </button>
    </div>

    <div v-if="showValidationError" class="ip-item-error">
      Invalid IP address format. Please enter a valid IP address.
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import {isValidIp} from '@list-utils'
import {IpLookupItemModel} from "../models/ipLookup.model";

const props = defineProps<{ item: IpLookupItemModel, index: number }>()

const emit = defineEmits<{
  change: [{ id: string; value: string }]
  blur: [{ id: string }]
  delete: [{ id: string }]
}>()

// Track if user has left the input field
const hasBlurred = ref(false)

const showValidationError = computed(() => {
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
  emit('change', {id: props.item.id, value: target.value})

  // Reset blur state when user starts typing again
  if (hasBlurred.value && props.item.status !== 'success') {
    hasBlurred.value = false
  }
}

function handleBlur() {
  hasBlurred.value = true
  emit('blur', {id: props.item.id})
}


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
    background-color: $status-error-bg;
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
    transition: border-color 0.3s;
    min-width: 0;

    &:focus {
      outline: none;
      border-color: $color-primary;
    }

    &:disabled {
      background: $bg-gray-light;
      cursor: not-allowed;
    }

    &--error {
      border-color: $color-error;

      &:focus {
        border-color: $color-error;
      }
    }
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
}

.ip-item-error {
  padding: 8px 16px;
  padding-left: 58px; // Align with input (after number circle)
  color: $color-error;
  font-size: 12px;
  direction: ltr;
  text-align: left;
  background-color: $bg-white;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
