import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import MainView from './MainView.vue';
import { ListComponent } from '@list-components/list.component';
import * as ipLookupService from '../services/ipLookup.service';
import * as listUtils from '@list-utils';

/**
 * Test suite for MainView component
 * Tests the main IP lookup view functionality including list management and IP lookups
 */
describe('MainView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
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

  describe('timeIntervals management', () => {
    it('should clear interval when item is deleted', async () => {
      // Mock the IP lookup service
      vi.spyOn(ipLookupService, 'lookupIp').mockResolvedValue({
        country: 'United States',
        countryCode: 'US',
        timezone: 'America/New_York',
        city: 'New York',
        region: 'NY'
      });

      vi.spyOn(listUtils, 'isValidIp').mockReturnValue(true);

      const wrapper = mount(MainView, {
        global: {
          components: {
            ListComponent
          }
        }
      });

      const vm = wrapper.vm as any;

      // Add an item
      vm.addItem();
      await wrapper.vm.$nextTick();

      const itemId = vm.items[0].id;
      vm.items[0].value = '8.8.8.8';

      // Trigger blur to create interval
      await vm.onItemBlur({ id: itemId });
      await flushPromises();

      // Verify interval was created
      expect(vm.timeIntervals.has(itemId)).toBe(true);

      // Delete the item
      vm.onItemDelete({ id: itemId });
      await wrapper.vm.$nextTick();

      // Verify interval was cleared
      expect(vm.timeIntervals.has(itemId)).toBe(false);
      expect(vm.items.length).toBe(0);
    });

    it('should use item.id consistently for interval management', async () => {
      vi.spyOn(ipLookupService, 'lookupIp').mockResolvedValue({
        country: 'United States',
        countryCode: 'US',
        timezone: 'America/New_York',
        city: 'New York',
        region: 'NY'
      });

      vi.spyOn(listUtils, 'isValidIp').mockReturnValue(true);

      const wrapper = mount(MainView, {
        global: {
          components: {
            ListComponent
          }
        }
      });

      const vm = wrapper.vm as any;

      // Add an item
      vm.addItem();
      await wrapper.vm.$nextTick();

      const itemId = vm.items[0].id;
      vm.items[0].value = '8.8.8.8';

      // First blur - create interval
      await vm.onItemBlur({ id: itemId });
      await flushPromises();

      const firstInterval = vm.timeIntervals.get(itemId);
      expect(firstInterval).toBeDefined();

      // Change IP and blur again
      vm.items[0].value = '1.1.1.1';
      await vm.onItemBlur({ id: itemId });
      await flushPromises();

      // Should have cleared old interval and created new one using same ID
      const secondInterval = vm.timeIntervals.get(itemId);
      expect(secondInterval).toBeDefined();
      expect(secondInterval).not.toBe(firstInterval);
    });

    it('should cleanup all intervals on unmount', async () => {
      vi.spyOn(ipLookupService, 'lookupIp').mockResolvedValue({
        country: 'United States',
        countryCode: 'US',
        timezone: 'America/New_York',
        city: 'New York',
        region: 'NY'
      });

      vi.spyOn(listUtils, 'isValidIp').mockReturnValue(true);

      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

      const wrapper = mount(MainView, {
        global: {
          components: {
            ListComponent
          }
        }
      });

      const vm = wrapper.vm as any;

      // Add multiple items with intervals
      vm.addItem();
      vm.addItem();
      await wrapper.vm.$nextTick();

      const item1Id = vm.items[0].id;
      const item2Id = vm.items[1].id;

      vm.items[0].value = '8.8.8.8';
      vm.items[1].value = '1.1.1.1';

      await vm.onItemBlur({ id: item1Id });
      await vm.onItemBlur({ id: item2Id });
      await flushPromises();

      expect(vm.timeIntervals.size).toBe(2);

      // Unmount component
      wrapper.unmount();

      // Should have cleared all intervals
      expect(clearIntervalSpy).toHaveBeenCalledTimes(2);
    });

    it('should not create interval for invalid IP', async () => {
      vi.spyOn(listUtils, 'isValidIp').mockReturnValue(false);

      const wrapper = mount(MainView, {
        global: {
          components: {
            ListComponent
          }
        }
      });

      const vm = wrapper.vm as any;

      vm.addItem();
      await wrapper.vm.$nextTick();

      const itemId = vm.items[0].id;
      vm.items[0].value = 'invalid-ip';

      await vm.onItemBlur({ id: itemId });
      await flushPromises();

      // Should not create interval for invalid IP
      expect(vm.timeIntervals.has(itemId)).toBe(false);
      expect(vm.items[0].status).toBe('error');
      expect(vm.items[0].error).toBe('Invalid IP address format');
    });
  });
});
