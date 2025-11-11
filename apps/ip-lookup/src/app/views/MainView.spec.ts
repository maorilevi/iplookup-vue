import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import MainView from './MainView.vue';
import { ListComponent } from '@list-components/list.component';

/**
 * Test suite for MainView component
 * Tests the main IP lookup view functionality including list management and IP lookups
 */
describe('MainView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders properly', () => {
    const wrapper = mount(MainView, {
      global: {
        components: {
          ListComponent
        }
      }
    });
    
    expect(wrapper.find('.main-view').exists()).toBe(true);
    expect(wrapper.find('.main-view__title').text()).toBe('IP Lookup');
  });

  it('displays the correct title', () => {
    const wrapper = mount(MainView, {
      global: {
        components: {
          ListComponent
        }
      }
    });
    
    expect(wrapper.find('.main-view__title').text()).toBe('IP Lookup');
  });

  it('displays the description', () => {
    const wrapper = mount(MainView, {
      global: {
        components: {
          ListComponent
        }
      }
    });
    
    const description = wrapper.find('.main-view__description');
    expect(description.exists()).toBe(true);
    expect(description.text()).toContain('Enter one or more IP addresses');
  });

  it('renders ListComponent', () => {
    const wrapper = mount(MainView, {
      global: {
        components: {
          ListComponent
        }
      }
    });
    
    expect(wrapper.findComponent(ListComponent).exists()).toBe(true);
  });

  it('has main-view container with correct styling', () => {
    const wrapper = mount(MainView, {
      global: {
        components: {
          ListComponent
        }
      }
    });
    
    const container = wrapper.find('.main-view__container');
    expect(container.exists()).toBe(true);
  });

  it('has a divider element', () => {
    const wrapper = mount(MainView, {
      global: {
        components: {
          ListComponent
        }
      }
    });
    
    expect(wrapper.find('.main-view__divider').exists()).toBe(true);
  });
});
