import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import LmAddress from '../../packages/src/lm-address/lm-address'

describe('LmAddress.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(LmAddress, {
      propsData: { msg }
    })
    expect(wrapper.text()).to.include(msg)
  })
})
