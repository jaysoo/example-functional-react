import Reducer from './Reducer'

function foldp(acc, x) {
  switch (x) {
    case 'INC':
      return acc + 1
    case 'DEC':
      return acc - 1
    default:
      return acc
  }
}

test('Basic example', () => {
  const a = Reducer(foldp)
  expect(a.fold(0, 'INC')).toEqual(1)
})

test('Functor', () => {
  const a = Reducer(foldp).map(x => `Counter: ${x}`)
  expect(a.fold(0, 'INC')).toEqual('Counter: 1')
})

test('Contravariant', () => {
  const a = Reducer(foldp).contramap(x => x / 2)
  expect(a.fold(10, 'DEC')).toEqual(4)
})

test('Semigroup', () => {
  const a = Reducer(x => x + 1)
  const b = Reducer(x => x * 2)
  expect(a.concat(b).fold(0)).toEqual(2)
})
