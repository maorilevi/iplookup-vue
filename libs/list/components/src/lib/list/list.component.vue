<script setup lang="ts">
import { ref } from 'vue'
import VirtualScroller from 'primevue/virtualscroller'
import type { ListItemModel } from '@list-types/models/list-item.model'
import ListItem from '../list-item/list-item.component.vue'
import ListAddButton from '../list-add-button/list-add-button.component.vue'

const props = withDefaults(defineProps<{
  items: ListItemModel[]
  virtualScroll?: boolean
  itemHeight?: number
  visibleCount?: number
  emptyMessage?: string
}>(), {
  virtualScroll: false,
  itemHeight: 60,
  visibleCount: 10,
  emptyMessage: 'No items yet. Click "Add" to get started.'
})

const emit = defineEmits<{
  add: []
  itemChange: [{ id: string; value: string }]
  itemBlur: [{ id: string }]
  itemDelete: [{ id: string }]
}>()

const virtualScrollerRef = ref<any>(null)

// Expose methods for parent components
defineExpose({
  scrollToTop: () => {
    if (virtualScrollerRef.value) {
      virtualScrollerRef.value.scrollToIndex(0)
    }
  },
  scrollToItem: (index: number) => {
    if (virtualScrollerRef.value) {
      virtualScrollerRef.value.scrollToIndex(index)
    }
  }
})
</script>

<template>
  <div class="list-container">
    <div class="list-header">
      <!-- Custom add button slot -->
      <slot name="addButton" :on-add="() => emit('add')">
        <ListAddButton @add="emit('add')"/>
      </slot>
    </div>

    <hr class="list-divider"/>

    <!-- VirtualScroller when virtualScroll is true -->
    <VirtualScroller
      v-if="virtualScroll && items.length > 0"
      ref="virtualScrollerRef"
      :key="items.length"
      :items="items"
      :itemSize="itemHeight"
      class="list-items"
    >
      <template v-slot:item="{item, options}">
        <slot
          name="item"
          :item="item"
          :index="options.index"
          :on-change="(event: { id: string; value: string }) => emit('itemChange', event)"
          :on-blur="(event: { id: string }) => emit('itemBlur', event)"
          :on-delete="(event: { id: string }) => emit('itemDelete', event)"
        >
          <ListItem
            :item="item"
            :index="index"
            @change="emit('itemChange', $event)"
            @blur="emit('itemBlur', $event)"
            @delete="emit('itemDelete', $event)"
          />
        </slot>
      </template>
    </VirtualScroller>

    <!-- Regular scrolling when virtualScroll is false -->
    <div v-else-if="!virtualScroll && items.length > 0" class="list-items">
      <template v-for="(item, index) in items" :key="item.id">
        <slot
          name="item"
          :item="item"
          :index="index"
          :on-change="(event: { id: string; value: string }) => emit('itemChange', event)"
          :on-blur="(event: { id: string }) => emit('itemBlur', event)"
          :on-delete="(event: { id: string }) => emit('itemDelete', event)"
        >
          <ListItem
            :item="item"
            :index="index"
            @change="emit('itemChange', $event)"
            @blur="emit('itemBlur', $event)"
            @delete="emit('itemDelete', $event)"
          />
        </slot>
      </template>
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <slot name="empty">
        <p>{{ emptyMessage }}</p>
      </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
  max-width: 800px;
  padding: 0 28px 16px;
}

.list-header {
  display: flex;
  justify-content: start;
}

.list-divider {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 0;
}

.list-items {
  height: 500px;
  min-height: 500px;
  max-height: 500px;
  overflow-y: auto;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: #666;
  font-size: 14px;
  background-color: #f9f9f9;
  border: 2px dashed #ddd;
  border-radius: 8px;
}
</style>
