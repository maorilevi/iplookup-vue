import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ListItem from './list-item.component.vue';
import type { ListItemModel } from '@list-types';

/**
 * Test suite for ListItem component
 * Tests the basic list item component functionality
 */
describe('ListItem', () => {
  const mockItem: ListItemModel = {
    id: '123',
    value: 'Test Item'
  };

  it('renders properly', () => {
    const wrapper = mount(ListItem, {
      props: {
        item: mockItem,
        index: 0
      }
    });
    
    expect(wrapper.find('.list-item').exists()).toBe(true);
  });

  it('displays item label with ID', () => {
    const wrapper = mount(ListItem, {
      props: {
        item: mockItem,
        index: 0
      }
    });
    
    expect(wrapper.find('.list-item__label').text()).toBe('123');
  });

  it('displays input with correct value', () => {
    const wrapper = mount(ListItem, {
      props: {
        item: mockItem,
        index: 0
      }
    });
    
    const input = wrapper.find('input');
    expect(input.exists()).toBe(true);
    expect(input.element.value).toBe('Test Item');
  });

  it('emits itemChange event on input', async () => {
    const wrapper = mount(ListItem, {
      props: {
        item: mockItem,
        index: 0
      }
    });
    
    const input = wrapper.find('input');
    await input.setValue('New Value');
    
    expect(wrapper.emitted('itemChange')).toBeTruthy();
  });

  it('emits itemBlur event on blur', async () => {
    const wrapper = mount(ListItem, {
      props: {
        item: mockItem,
        index: 0
      }
    });
    
    const input = wrapper.find('input');
    await input.trigger('blur');
    
    expect(wrapper.emitted('itemBlur')).toBeTruthy();
  });

  it('emits itemDelete event when delete button clicked', async () => {
    const wrapper = mount(ListItem, {
      props: {
        item: mockItem,
        index: 0
      }
    });
    
    const deleteButton = wrapper.find('.list-item__delete');
    await deleteButton.trigger('click');
    
    expect(wrapper.emitted('itemDelete')).toBeTruthy();
  });

  it('has delete button', () => {
    const wrapper = mount(ListItem, {
      props: {
        item: mockItem,
        index: 0
      }
    });
    
    expect(wrapper.find('.list-item__delete').exists()).toBe(true);
  });
});
