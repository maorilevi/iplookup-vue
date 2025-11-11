import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ListAddButton from './list-add-button.component.vue';

/**
 * Test suite for ListAddButton component
 * Tests the add button component functionality
 */
describe('ListAddButton', () => {
  it('renders properly', () => {
    const wrapper = mount(ListAddButton);
    
    expect(wrapper.find('.add-button').exists()).toBe(true);
  });

  it('displays button text', () => {
    const wrapper = mount(ListAddButton);
    
    expect(wrapper.find('.add-button').text()).toContain('Add');
  });

  it('displays plus icon', () => {
    const wrapper = mount(ListAddButton);
    
    expect(wrapper.find('.add-button__plus').text()).toBe('+');
  });

  it('emits add event when clicked', async () => {
    const wrapper = mount(ListAddButton);
    
    await wrapper.find('.add-button').trigger('click');
    
    expect(wrapper.emitted('add')).toBeTruthy();
    expect(wrapper.emitted('add')).toHaveLength(1);
  });

  it('has correct button structure', () => {
    const wrapper = mount(ListAddButton);
    
    const button = wrapper.find('.add-button');
    expect(button.exists()).toBe(true);
    expect(button.element.tagName).toBe('BUTTON');
  });
});
