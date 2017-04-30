import { shallow } from 'enzyme'
import { compose } from 'ramda'
import React from 'react'
import View from './View'

const toHTML = compose(x => x.html(), shallow)

test('Applicative', () => {
  const a = View.of(<span>Hello</span>)
  const b = View.of(x => <p>{x}!</p>)

  expect(toHTML(b.ap(a).fold({}))).toEqual('<p><span>Hello</span>!</p>')

  // Identity
  expect(toHTML(View.of(x => x).ap(a).fold())).toEqual(toHTML(a.fold()))
})

test('Functor', () => {
  const a = View(({ name }) => <span>Hi, {name}</span>)

  // Identity
  expect(toHTML(a.map(x => x).fold({ name: 'Fred' }))).toEqual(
    toHTML(a.fold({ name: 'Fred' }))
  )

  // Composition
  const f = x => <span>{x}?</span>
  const g = x => <span>{x}!</span>
  const compLaw1 = a.map(compose(f, g))
  const compLaw2 = a.map(g).map(f)

  expect(toHTML(compLaw1.fold({ name: 'Fred' }))).toEqual(
    toHTML(compLaw2.fold({ name: 'Fred' }))
  )
})

test('Contravariant', () => {
  const a = View(({ name }) => <span>Hi, {name}</span>)

  // Identity
  expect(toHTML(a.contramap(x => x).fold({ name: 'Fred' }))).toEqual(
    toHTML(a.fold({ name: 'Fred' }))
  )

  // Composition
  const f = ({ name }) => ({ name: `${name}?` })
  const g = ({ name }) => ({ name: `${name}!` })
  const compLaw1 = a.contramap(compose(f, g))
  const compLaw2 = a.contramap(f).contramap(g)

  expect(toHTML(compLaw1.fold({ name: 'Fred' }))).toEqual(
    toHTML(compLaw2.fold({ name: 'Fred' }))
  )
})
