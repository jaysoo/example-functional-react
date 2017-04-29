import { shallow } from 'enzyme'
import { compose } from 'ramda'
import React from 'react'
import View from './View'

const toHTML = compose(x => x.html(), shallow)

test('Applicative', () => {
  const a = View.of(<span>Hello</span>)
  const b = View.of(x => <p>{x}!</p>)

  expect(toHTML(b.ap(a).fold({}))).toEqual('<p><span>Hello</span>!</p>')

  const idLaw = View.of(x => x).ap(a)
  expect(toHTML(idLaw.fold())).toEqual(toHTML(a.fold()))
})
