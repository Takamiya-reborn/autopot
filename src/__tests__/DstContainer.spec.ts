import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import DstContainer from '../components/DstContainer.vue'

describe('DstContainer', () => {
  it('渲染默认插槽内容', () => {
    const wrapper = mount(DstContainer, {
      slots: { default: '<p class="content">内容</p>' },
    })
    expect(wrapper.find('.content').text()).toBe('内容')
    expect(wrapper.find('.dst-container__inner').exists()).toBe(true)
  })

  it('渲染顶/底饰件', () => {
    const wrapper = mount(DstContainer)
    expect(wrapper.findAll('.dst-container__orn')).toHaveLength(2)
  })
})
