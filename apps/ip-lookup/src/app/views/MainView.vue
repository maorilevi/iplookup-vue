<template>
  <section class="main-view">
    <div class="main-view__container">
      <h2 class="main-view__title">IP Lookup</h2>
      <hr class="main-view__divider"/>
      <p class="main-view__description">Enter one or more IP addresses and get their country</p>

      <ListComponent
        :items="items"
        :virtualScroll="false"
        :empty-message="'No IP addresses added yet. Click Add to get started.'"
        @add="addItem"
        @itemChange="onItemChange"
        @itemBlur="onItemBlur"
        @itemDelete="onItemDelete"
      >
        <!-- Custom IP item component -->
        <template #item="{ item, itemChange, itemBlur, itemDelete, index }">
          <IpLookupItem
            :item="item"
            :index="index"
            @itemChange="itemChange"
            @itemBlur="itemBlur"
            @itemDelete="itemDelete"
          />
        </template>
      </ListComponent>
    </div>
  </section>
</template>

<script setup lang="ts">
import {ref, onUnmounted} from 'vue';
import {ListComponent} from '@list-components/list.component';
import IpLookupItem from '../components/IpLookupItem.vue';
import type {IpLookupItemModel} from '../models/ipLookup.model';
import {lookupIp} from '../services/ipLookup.service';
import {isValidIp} from '@list-utils';
import type {ItemChangeEventModel} from '@list-types/models/item-change-event.model';
// The main state array
const items = ref<IpLookupItemModel[]>([])

// Store time update intervals per value
const timeIntervals = new Map<string, number>()

function addItem() {
  const uuid = crypto.randomUUID()
  items.value.push({
    id: uuid,
    value: '', // Use UUID as initial value
    status: 'idle',
  })
}

function onItemChange({id, value}: ItemChangeEventModel) {
  const item = items.value.find(i => i.id === id)
  if (item) {
    item.label = value // Update label (what's shown in input)
    item.value = value // Update value for key (or keep UUID if empty)
    // Clear error when user starts typing again
    if (item.status === 'error') {
      item.status = 'idle'
      item.country = undefined;
      item.countryCode = undefined;
      item.localTime = undefined;
      item.timezone = undefined;
      item.error = undefined
    }
  }
}

async function onItemBlur({id}: { id: string }) {
  const item = items.value.find(i => i.id === id)
  if (!item) return

  const trimmedValue = item.value.trim()

  // If value is empty or is UUID, don't process
  if (!trimmedValue || trimmedValue === item.id) return

  // Validate IP format
  if (!isValidIp(trimmedValue)) {
    item.status = 'error'
    item.error = 'Invalid IP address format'
    return
  }

  // Clear previous interval if exists
  const existingInterval = timeIntervals.get(item.value)
  if (existingInterval) {
    clearInterval(existingInterval)
    timeIntervals.delete(item.value)
  }

  const ipAddress = trimmedValue

  // Fetch from API (no cache)
  item.status = 'searching'
  item.error = undefined

  try {
    const data = await lookupIp(ipAddress)

    item.country = data.country
    item.countryCode = data.countryCode
    item.timezone = data.timezone
    item.city = data.city
    item.region = data.region

    // Update time immediately
    updateLocalTime(item)

    // Start live clock update for the IP's timezone
    const interval = window.setInterval(() => {
      updateLocalTime(item)
    }, 1000)

    timeIntervals.set(item.id, interval)

    item.status = 'success'
  } catch (err: any) {
    item.status = 'error'
    item.error = err.message || 'Failed to lookup IP'
  }
}

function updateLocalTime(item: IpLookupItemModel) {
  if (!item.timezone) return

  try {
    const now = new Date()
    const formatted = now.toLocaleTimeString('en-GB', {
      timeZone: item.timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    item.localTime = formatted
  } catch {
    item.localTime = '--:--:--'
  }
}

function onItemDelete({id}: { id: string }) {
  const item = items.value.find(i => i.id === id)

  // Clear interval when item is deleted
  if (item) {
    const existingInterval = timeIntervals.get(item.value)
    if (existingInterval) {
      clearInterval(existingInterval)
      timeIntervals.delete(item.value)
    }
  }

  items.value = items.value.filter(i => i.id !== id)
}

// Cleanup all intervals on unmount
onUnmounted(() => {
  timeIntervals.forEach(interval => clearInterval(interval))
  timeIntervals.clear()
})
</script>

<style lang="scss" scoped>
@use '../../styles/variables' as *;

.main-view {
  padding: 40px 20px;
  min-height: 100vh;
  background-color: $bg-gray-light;
  direction: ltr;
  text-align: left;
  font-family: system-ui;

  &__container {
    background: $bg-white;
    border-radius: 8px;
    box-shadow: $shadow-md;
    max-width: 900px;
    margin: 0 auto;
  }

  &__title {
    font-size: 24px;
    font-weight: 700;
    color: $text-primary;
    margin: 0;
    padding: 16px 28px;
    text-align: left;
    direction: ltr;
  }

  &__divider {
    border: none;
    border-top: 1px solid $border-color-light;
    margin: 0;
  }

  &__description {
    padding: 16px 28px;
    font-size: 14px;
    color: $text-secondary;
    margin: 0;
    text-align: left;
    direction: ltr;
  }
}
</style>
