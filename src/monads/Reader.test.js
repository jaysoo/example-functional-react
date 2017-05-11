import Reader from './Reader'
import Monad from './Monad'

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
  // Identity
  expect(Reader.of(x => x).ap(Reader.of(1)).runReader()).toEqual(
    Reader.of(1).runReader()
  )

  // Homomorphism
  const f = x => x + 1
  expect(Reader.of(f).ap(Reader.of(1)).runReader()).toEqual(
    Reader.of(f(1)).runReader()
  )

  // Interchange
  const y = 1
  const u = Reader.of(x => x * 2)
  expect(u.ap(Reader.of(y)).runReader()).toEqual(
    Reader.of(f => f(y)).ap(u).runReader()
  )
})

test('Monad', () => {
  const a = 1
  const f = x => Reader.of(x + 1)

  // Left identity
  expect(Reader.of(a).chain(f).runReader()).toEqual(f(a).runReader())

  const m = Reader.of(1)
  // Right identity
  expect(m.chain(Reader.of).runReader()).toEqual(m.runReader())
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
