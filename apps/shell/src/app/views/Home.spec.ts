import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Home from './Home.vue';

/**
 * Test suite for Home view component
 * Tests the home page display and navigation
 */
describe('Home', () => {
  it('renders properly', () => {
    const wrapper = mount(Home, {
      global: {
        stubs: {
          IpLookupView: true
        }
      }
    });
    
    expect(wrapper.find('.home-view').exists()).toBe(true);
  });

  it('has home-view container', () => {
    const wrapper = mount(Home, {
      global: {
        stubs: {
          IpLookupView: true
        }
      }
    });
    
    expect(wrapper.find('.home-view').exists()).toBe(true);
  });
});
