import { compose } from 'ramda'
import Reducer from './Reducer'

function foldp(s, x) {
  switch (x) {
    case 'INC':
      return { counter: s.counter + 1 }
    case 'DEC':
      return { counter: s.counter - 1 }
    default:
      return s
  }
}

test('Functor', () => {
  const a = Reducer(foldp)

  // Identity
  expect(a.map(s => s).fold({ counter: 10 }, 'DEC')).toEqual(
    a.fold({ counter: 10 }, 'DEC')
  )

  // Composition
  const f = s => `${s}!`
  const g = s => `${s}?`
  expect(a.map(f).map(g).fold({ counter: 23 }, 'DEC')).toEqual(
    a.map(compose(g, f)).fold({ counter: 23 }, 'DEC')
  )
})

test('Contravariant', () => {
  const a = Reducer(foldp)

  // Identity
  expect(a.contramap(s => s).fold({ counter: 10 }, 'DEC')).toEqual(
    a.fold({ counter: 10 }, 'DEC')
  )

  // Composition
  const f = s => s.sliceA
  const g = s => s.sliceB
  const state = { sliceB: { sliceA: { counter: 23 } } }
  expect(a.contramap(f).contramap(g).fold(state, 'DEC')).toEqual(
    a.contramap(compose(f, g)).fold(state, 'DEC')
  )
})

test('Semigroup', () => {
  const a = Reducer(x => ({ a: x.a + 1 }))
  const b = Reducer(x => ({ b: x.b * 2 }))
  expect(a.concat(b).fold({ a: 0, b: 2 })).toEqual({ a: 1, b: 4 })

  // ...
})

test('Example: combine reducers', () => {
  const a = Reducer(foldp)
  const b = Reducer(foldp)

  // Nest original states.
  const c = a.promap(s => s.a, s => ({ a: s }))
  const d = b.promap(s => s.b, s => ({ b: s }))

  const combined = c.concat(d)

  expect(combined.fold({ a: { counter: 1 }, b: { counter: 2 } }, 'INC')).toEqual({
    a: { counter: 2 },
    b: { counter: 3 }
  })
})
