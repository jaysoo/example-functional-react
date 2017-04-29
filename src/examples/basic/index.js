import ReactDOM from 'react-dom'
import React from 'react'
import View from '../../react/View'
import Reader from '../../monads/Reader'
import Monad from '../../monads/Monad'
import { compose, liftN } from 'ramda'

const Header = ({ name, greeting }) => <h1>{greeting}, {name}!</h1>
const Message = ({ message }) => <p>{message}</p>
const Footer = ({ author, year }) => <footer>© {author} {year}</footer>

// HOCs
const clap = x => <span>👏 {x} 👏</span>
const toUpper = x => <span style={{ textTransform: 'uppercase' }}>{x}</span>
const emphasize = x => <span style={{ fontStyle: 'italic' }}>{x}</span>

const headerApp = Monad.do(function*() {
  const greeting = yield Reader.asks(ctx => ctx.greeting)
  return Reader.of(View(Header).contramap(({ name }) => ({ name, greeting })))
})

const footerApp = Monad.do(function*() {
  const { author, year } = yield Reader.ask()
  return Reader.of(View(Footer).contramap(() => ({ author, year })))
})

const messageApp = Reader.of(
  View.of(compose(emphasize, toUpper))
    .ap(View(Message))
    .contramap(({ message }) => ({ message: clap(message) }))
)

const mconcat3 = liftN(3, (x, y, z) =>
  Monad.do(function*() {
    const a = yield x
    const b = yield y
    const c = yield z
    return View.of(
      <div>
        {a} {b} {c}
      </div>
    )
  })
)

const mainApp = mconcat3(headerApp, messageApp, footerApp)

export default element => {
  ReactDOM.render(
    mainApp
      .runReader({ greeting: 'Hello', author: 'Bob McBob', year: 2017 })
      .fold({
        name: 'Alice',
        message: 'Now this is composable react'
      }),
    element
  )
}
