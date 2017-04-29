import { shallow } from 'enzyme'
import { compose } from 'ramda'
import React from 'react'
import Component from './Component'

const toHTML = compose(x => x.html(), shallow)

test('Applicative', () => {
  const a = Component.of(<span>Hello</span>)
  const b = Component.of(a => <p>{a}!</p>)

  expect(toHTML(a.ap(b).fold({}))).toEqual('<p><span>Hello</span>!</p>')

  const idLaw = a.ap(Component.of(x => x))
  expect(toHTML(idLaw.fold())).toEqual(toHTML(a.fold()))
})
