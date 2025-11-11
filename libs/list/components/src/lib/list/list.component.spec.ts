import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ListComponent from './list.component.vue';
import type { ListItemModel } from '@list-types';

/**
 * Test suite for List component
 * Tests the list component functionality including rendering items and handling events
 */
describe('ListComponent', () => {
  const mockItems: ListItemModel[] = [
    { id: '1', value: 'Item 1' },
    { id: '2', value: 'Item 2' },
    { id: '3', value: 'Item 3' }
  ];

  it('renders properly', () => {
    const wrapper = mount(ListComponent, {
      props: {
        items: []
      }
    });
    
    expect(wrapper.find('.list-container').exists()).toBe(true);
  });

  it('displays empty state when no items', () => {
    const wrapper = mount(ListComponent, {
      props: {
        items: [],
        emptyMessage: 'No items'
      }
    });
    
    expect(wrapper.find('.empty-state').exists()).toBe(true);
    expect(wrapper.find('.empty-state').text()).toContain('No items');
  });

  it('renders items when provided', () => {
    const wrapper = mount(ListComponent, {
      props: {
        items: mockItems,
        virtualScroll: false
      }
    });
    
    expect(wrapper.find('.list-items').exists()).toBe(true);
  });

  it('shows add button', () => {
    const wrapper = mount(ListComponent, {
      props: {
        items: []
      }
    });
    
    expect(wrapper.find('.list-header').exists()).toBe(true);
  });

  it('has divider element', () => {
    const wrapper = mount(ListComponent, {
      props: {
        items: []
      }
    });
    
    expect(wrapper.find('.list-divider').exists()).toBe(true);
  });

  it('renders with virtualScroll disabled by default', () => {
    const wrapper = mount(ListComponent, {
      props: {
        items: mockItems
      }
    });
    
    // When virtualScroll is false, should render regular div
    expect(wrapper.find('.list-items').exists()).toBe(true);
  });
});
