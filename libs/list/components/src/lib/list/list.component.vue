<script setup lang="ts">
import {ref} from 'vue'
import VirtualScroller from 'primevue/virtualscroller'
import ListItem from '../list-item/list-item.component.vue'
import ListAddButton from '../list-add-button/list-add-button.component.vue'
import type {ListEventsModel} from '@list-types/models/list-events.model';
import type {ListModel} from '@list-types/models/list.model';
import type {ItemChangeEventModel} from '@list-types/models/item-change-event.model';
import type {ItemBlurEventModel} from '@list-types/models/item-blur-event.model';
import type {ItemDeleteEventModel} from '@list-types/models/item-delete-event.model';

/**
 * List Component
 * A flexible list component that supports virtual scrolling for large datasets
 * and provides customizable item rendering through slots
 */

// Component props with defaults
const props = withDefaults(defineProps<ListModel>(), {
  virtualScroll: false,
  itemHeight: 60,
  visibleCount: 10,
  emptyMessage: 'No items yet. Click "Add" to get started.'
})

// Component events
const emit = defineEmits<ListEventsModel>()

/**
 * Reference to the virtual scroller component
 * Used for programmatic scrolling operations
 */
const virtualScrollerRef = ref<any>(null)

/**
 * Expose methods for parent components to control scrolling
 */
defineExpose({
  /**
   * Scroll to the top of the list
   */
  scrollToTop: () => {
    if (virtualScrollerRef.value) {
      virtualScrollerRef.value.scrollToIndex(0)
    }
  },
  /**
   * Scroll to a specific item by index
   * @param index - The index of the item to scroll to
   */
  scrollToItem: (index: number) => {
    if (virtualScrollerRef.value) {
      virtualScrollerRef.value.scrollToIndex(index)
    }
  }
})

/**
 * Handle item change events and forward to parent
 */
const onItemChange = (event: ItemChangeEventModel): any => emit('itemChange', event);

/**
 * Handle item blur events and forward to parent
 */
const onItemBlur = (event: ItemBlurEventModel): any => emit('itemBlur', event)

/**
 * Handle item delete events and forward to parent
 */
const onItemDelete = (event: ItemDeleteEventModel): any => emit('itemDelete', event)

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
          :itemChange="onItemChange"
          :itemBlur="onItemBlur"
          :itemDelete="onItemDelete"
        >
          <ListItem
            :item="item"
            :index="options.index"
            @itemChange="emit('itemChange', $event)"
            @itemBlur="emit('itemBlur', $event)"
            @itemDelete="emit('itemDelete', $event)"
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
          :itemChange="onItemChange"
          :itemBlur="onItemBlur"
          :itemDelete="onItemDelete"
        >
          <ListItem
            :item="item"
            :index="index"
            @itemChange="emit('itemChange', $event)"
            @itemBlur="emit('itemBlur', $event)"
            @itemDelete="emit('itemDelete', $event)"
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
@use '../../styles/variables' as *;

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
  border-top: 1px solid $border-color-light;
  margin: 0;
}

.list-items {
  height: 500px;
  min-height: 500px;
  max-height: 500px;
  overflow-y: auto;
  overflow-x: visible;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: $text-secondary;
  font-size: 14px;
  background-color: $bg-gray-lighter;
  border: 2px dashed $border-color;
  border-radius: 8px;
}
</style>
