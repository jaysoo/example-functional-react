import { shallow} from 'enzyme'
import React from 'react'
import View from './View'

test('Applicative', () => {
  const x = View.of(<span>Hello</span>)
  const f = View.of(a => <p>{a}!</p>)

  const wrapper = shallow(f.ap(x).fold({}))
  expect(wrapper.html()).toEqual('<p><span>Hello</span>!</p>')
})
