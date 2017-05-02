import { shallow } from 'enzyme'
import { compose } from 'ramda'
import React from 'react'
import View from './View'

const toHTML = compose(x => x.html(), shallow)

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

test('Semigroup', () => {
  const a = View.of(<div>a</div>)
  const b = View.of(<div>b</div>)
  const c = View.of(<div>c</div>)

  expect(toHTML((a.concat(b)).concat(c).fold())).toEqual(
    toHTML(a.concat(b.concat(c)).fold())
  )
})

test('Monoid', () => {
  const a = View.of(<div>a</div>)
  const empty = View.empty()

  expect(toHTML(a.concat(empty).fold())).toEqual(
    toHTML(empty.concat(a).fold())
  )
})

test('Applicative', () => {
  const a = View.of(<span>Hello</span>)
  const b = View.of(x => <p>{x}!</p>)

  expect(toHTML(b.ap(a).fold({}))).toEqual('<div><p><span>Hello</span>!</p></div>')

  // Identity
  expect(toHTML(View.of(x => x).ap(a).fold())).toEqual(toHTML(a.fold()))
})

test('Chain', () => {
  const a = View.of(<span>Hello</span>)
  const f = x => View.of(<div>x: {x}</div>)
  const g = y => View.of(<div>y: {y}</div>)

  expect(toHTML(a.chain(f).chain(g).fold())).toEqual(toHTML(a.chain(x => f(x).chain(g)).fold()))
})
