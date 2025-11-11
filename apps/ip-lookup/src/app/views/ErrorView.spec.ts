import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ErrorView from './ErrorView.vue';
import { createRouter, createWebHistory } from 'vue-router';

/**
 * Test suite for ErrorView component
 * Tests the error view display and navigation functionality
 */
describe('ErrorView', () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: { template: '<div>Home</div>' } },
      { path: '/error', component: ErrorView }
    ]
  });

  it('renders properly', () => {
    const wrapper = mount(ErrorView, {
      global: {
        plugins: [router]
      }
    });
    
    expect(wrapper.find('.error-view').exists()).toBe(true);
  });

  it('displays error icon', () => {
    const wrapper = mount(ErrorView, {
      global: {
        plugins: [router]
      }
    });
    
    expect(wrapper.find('.error-view__icon').text()).toBe('⚠️');
  });

  it('displays error title', () => {
    const wrapper = mount(ErrorView, {
      global: {
        plugins: [router]
      }
    });
    
    expect(wrapper.find('.error-view__title').text()).toBe('Oops! Something went wrong');
  });

  it('displays error message', () => {
    const wrapper = mount(ErrorView, {
      global: {
        plugins: [router]
      }
    });
    
    const message = wrapper.find('.error-view__message');
    expect(message.exists()).toBe(true);
    expect(message.text()).toContain('unexpected error');
  });

  it('has a button to go back home', () => {
    const wrapper = mount(ErrorView, {
      global: {
        plugins: [router]
      }
    });
    
    const button = wrapper.find('.error-view__button');
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe('Go Back Home');
  });

  it('navigates to home when button is clicked', async () => {
    const push = vi.spyOn(router, 'push');
    
    const wrapper = mount(ErrorView, {
      global: {
        plugins: [router]
      }
    });
    
    const button = wrapper.find('.error-view__button');
    await button.trigger('click');
    
    expect(push).toHaveBeenCalledWith('/');
  });

  it('has error-view container', () => {
    const wrapper = mount(ErrorView, {
      global: {
        plugins: [router]
      }
    });
    
    expect(wrapper.find('.error-view__container').exists()).toBe(true);
  });
});
