import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import NotFound from './NotFound.vue';

/**
 * Test suite for NotFound component
 * Tests the 404 error page (currently empty component)
 */
describe('NotFound', () => {
  it('renders properly', () => {
    const wrapper = mount(NotFound);
    
    expect(wrapper.exists()).toBe(true);
  });
});
