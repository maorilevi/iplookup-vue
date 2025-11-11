import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MainLayout from './MainLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

/**
 * Test suite for MainLayout component
 * Tests the main layout structure and navigation
 */
describe('MainLayout', () => {
  it('renders properly', () => {
    const wrapper = mount(MainLayout);
    
    expect(wrapper.find('.layout').exists()).toBe(true);
  });

  it('has layout container', () => {
    const wrapper = mount(MainLayout);
    
    expect(wrapper.find('.layout').exists()).toBe(true);
  });

  it('has content wrapper', () => {
    const wrapper = mount(MainLayout);
    
    expect(wrapper.find('.content').exists()).toBe(true);
  });

  it('has main element with slot', () => {
    const wrapper = mount(MainLayout);
    
    expect(wrapper.find('main').exists()).toBe(true);
  });
});
