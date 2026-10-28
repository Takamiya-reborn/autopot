import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import App from '../App.vue'

describe('App', () => {
  it('渲染主界面', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
      },
    })
    expect(wrapper.findComponent({ name: 'CookpotView' }).exists()).toBe(true)
  })
})
