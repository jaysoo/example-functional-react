import Reader from './Reader'
import Monad from './Monad'
import { liftN } from 'ramda'

test('Examples', () => {
  expect(Reader.ask().runReader('Hi')).toEqual('Hi')

  expect(Reader.ask().chain(x => Reader.of(`${x}!`)).runReader('Hi')).toEqual(
    'Hi!'
  )

  expect(
    Reader.ask().chain(x => Reader.asks(() => `${x}!`)).runReader('Hi')
  ).toEqual('Hi!')

  const greet = name =>
    Reader.ask().chain(ctx => Reader.asks(() => `${ctx}, ${name}`))

  const exclaim = s =>
    Reader.asks(x => x === 'Alice').chain(isAlice =>
      Reader.of(`${s}${isAlice ? '!!' : '!'}`)
    )

  expect(greet('World').runReader('Hello')).toEqual('Hello, World')
  expect(greet('World').chain(exclaim).runReader('Hello')).toEqual(
    'Hello, World!'
  )
})

test('Functor', () => {
  const f = x => `[${x}]`
  const g = x => `(${x})`
  const contra1 = () => Reader.ask().map(g).map(f)
  const contra2 = () => Reader.ask().map(x => f(g(x)))
  expect(contra1().runReader('A')).toEqual(contra2().runReader('A'))
})

test('Contravariant', () => {
  const f = x => `[${x}]`
  const g = x => `(${x})`
  const contra1 = () => Reader.ask().contramap(f).contramap(g)
  const contra2 = () => Reader.ask().contramap(x => f(g(x)))
  expect(contra1().runReader('A')).toEqual(contra2().runReader('A'))
})

test('Applicative', () => {
  const a = Reader.ask()
  const b = Reader.of(x => x + 1)

  const x = b.ap(a).runReader(100)
  expect(x).toEqual(101)

  const mmult3 = liftN(3, (x, y, z) => x * y * z)
  expect(mmult3(Reader.of(2), Reader.of(3), Reader.of(4)).runReader()).toEqual(
    24
  )
})

test('Monad.do', () => {
  const example = ctx =>
    Monad.do(function*() {
      const { x, y } = yield Reader.ask()
      return Reader.of(x + y)
    }).runReader(ctx)

  expect(example({ x: 1, y: 2 })).toEqual(3)
  expect(example({ x: 1, y: 2 })).toEqual(3)

  const example2 = ctx =>
    Monad.do(function*() {
      const isEven = yield Reader.asks(x => x % 2 === 0)
      return Reader.of(isEven)
    }).runReader(ctx)

  expect(example2(2)).toEqual(true)
  expect(example2(3)).toEqual(false)
})
