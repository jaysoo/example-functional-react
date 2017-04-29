import ReactDOM from 'react-dom'
import React from 'react'
import Component from '../../react/Component'
import Reader from '../../monads/Reader'
import Monad from '../../monads/Monad'
import { liftN } from 'ramda'

const Heading = ({ name, greeting }) => <h1>{greeting}, {name}!</h1>
const Message = ({ message }) => <p>{message}</p>
const Footer = ({ author, year }) => <p>© {author} {year}</p>

const headerApp = Monad.do(function*() {
  const greeting = yield Reader.asks(ctx => ctx.greeting)
  return Reader.of(Component(Heading).contramap(({ name }) => ({ name, greeting })))
})

const footerApp = Monad.do(function*() {
  const { author, year } = yield Reader.ask()
  return Reader.of(Component(Footer).contramap(() => ({ author, year })))
})

const messageApp = Reader.of(
  Component(Message).contramap(({ message }) => ({
    message: <span>👏 {message} 👏</span>
  }))
)

const mconcat3 = liftN(3, (x, y, z) =>
  Monad.do(function*() {
    const a = yield x
    const b = yield y
    const c = yield z
    return Component.of(
      <div>
        {a} {b} {c}
      </div>
    )
  })
)

const wrap = Type => m => m.map(a => <Type>{a}</Type>)

const mainApp = mconcat3(
  headerApp.map(wrap('header')),
  messageApp.map(wrap('main')),
  footerApp.map(wrap('footer'))
)

export default element => {
  ReactDOM.render(
    mainApp.runReader({ greeting: 'Hello', author: 'Bob McBob', year: 2017 }).fold({
      name: 'Alice',
      message: 'Now this is composable react'
    }),
    element
  )
}
