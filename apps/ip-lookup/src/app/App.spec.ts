import { describe, it, expect } from 'vitest';
import router from './router';
import { mount } from '@vue/test-utils';
import App from './App.vue';

describe('App', () => {
  it('renders properly', async () => {
    const wrapper = mount(App, { global: { plugins: [router] } });
    await router.isReady();
    // The app renders the main view with IP lookup functionality
    expect(wrapper.text()).toContain('IP Lookup');
  });
});
