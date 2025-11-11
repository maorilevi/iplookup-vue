import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import IpLookupItem from './IpLookupItem.vue';
import type { IpLookupItemModel } from '../models/ipLookup.model';

/**
 * Test suite for IpLookupItem component
 * Tests the IP lookup item component functionality including validation, status display, and user interactions
 */
describe('IpLookupItem', () => {
  const mockItem: IpLookupItemModel = {
    id: '123',
    value: '8.8.8.8',
    status: 'idle'
  };

  it('renders properly with item data', () => {
    const wrapper = mount(IpLookupItem, {
      props: {
        item: mockItem,
        index: 0
      }
    });
    
    expect(wrapper.find('.ip-item').exists()).toBe(true);
    expect(wrapper.find('.ip-item__number').text()).toBe('1');
  });

  it('displays input field with correct value', () => {
    const wrapper = mount(IpLookupItem, {
      props: {
        item: mockItem,
        index: 0
      }
    });
    
    const input = wrapper.find('input');
    expect(input.exists()).toBe(true);
    expect(input.element.value).toBe('8.8.8.8');
  });

  it('emits itemChange event on input', async () => {
    const wrapper = mount(IpLookupItem, {
      props: {
        item: mockItem,
        index: 0
      }
    });
    
    const input = wrapper.find('input');
    await input.setValue('1.1.1.1');
    
    expect(wrapper.emitted('itemChange')).toBeTruthy();
  });

  it('emits itemBlur event on blur', async () => {
    const wrapper = mount(IpLookupItem, {
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
    const wrapper = mount(IpLookupItem, {
      props: {
        item: mockItem,
        index: 0
      }
    });
    
    const deleteButton = wrapper.find('.ip-item__delete');
    await deleteButton.trigger('click');
    
    expect(wrapper.emitted('itemDelete')).toBeTruthy();
  });

  it('shows loader when status is searching', () => {
    const searchingItem = { ...mockItem, status: 'searching' as const };
    const wrapper = mount(IpLookupItem, {
      props: {
        item: searchingItem,
        index: 0
      }
    });
    
    expect(wrapper.find('.ip-item__loader').exists()).toBe(true);
  });

  it('shows flag when country code is available', () => {
    const successItem: IpLookupItemModel = {
      ...mockItem,
      status: 'success',
      countryCode: 'US',
      country: 'United States'
    };
    
    const wrapper = mount(IpLookupItem, {
      props: {
        item: successItem,
        index: 0
      }
    });
    
    expect(wrapper.find('.ip-item__flag').exists()).toBe(true);
  });

  it('shows error icon when status is error', () => {
    const errorItem: IpLookupItemModel = {
      ...mockItem,
      status: 'error',
      error: 'Invalid IP'
    };
    
    const wrapper = mount(IpLookupItem, {
      props: {
        item: errorItem,
        index: 0
      }
    });
    
    expect(wrapper.find('.ip-item__error-icon').exists()).toBe(true);
  });

  it('displays local time when available', () => {
    const itemWithTime: IpLookupItemModel = {
      ...mockItem,
      status: 'success',
      localTime: '12:00:00'
    };
    
    const wrapper = mount(IpLookupItem, {
      props: {
        item: itemWithTime,
        index: 0
      }
    });
    
    expect(wrapper.find('.ip-item__time').text()).toBe('12:00:00');
  });
});
