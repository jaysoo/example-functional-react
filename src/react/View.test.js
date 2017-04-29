import { shallow } from 'enzyme'
import { compose } from 'ramda'
import React from 'react'
import View from './View'

const toHTML = compose(x => x.html(), shallow)

test('Applicative', () => {
  const a = View.of(<span>Hello</span>)
  const b = View.of(a => <p>{a}!</p>)

  expect(toHTML(a.ap(b).fold({}))).toEqual('<p><span>Hello</span>!</p>')

  const idLaw = a.ap(View.of(x => x))
  expect(toHTML(idLaw.fold())).toEqual(toHTML(a.fold()))
})
