import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AboutView from './AboutView.vue';

/**
 * Test suite for AboutView component
 * Tests the about page display
 */
describe('AboutView', () => {
  it('renders properly', () => {
    const wrapper = mount(AboutView);
    
    expect(wrapper.find('.about').exists()).toBe(true);
  });

  it('displays about heading', () => {
    const wrapper = mount(AboutView);
    
    const heading = wrapper.find('h1');
    expect(heading.exists()).toBe(true);
    expect(heading.text()).toBe('This is an about page');
  });
});
