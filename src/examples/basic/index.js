import ReactDOM from 'react-dom'
import React from 'react'
import View from '../../react/View'
import Reader from '../../monads/Reader'
import Monad from '../../monads/Monad'
import { compose, map, liftN } from 'ramda'

const pageTitle = ({ title }) => <h1>{title}</h1>
const message = ({ message }) => <p>{message}</p>
const copyrightNotice = ({ author, year }) => <p>© {author} {year}</p>
const footerMessage = () => (
  <div>
    <hr />
    <p>This is the footer.</p>
  </div>
)

// HOCs
const clap = x => <span>👏 {x} 👏</span>
const uppercase = x => <span style={{ textTransform: 'uppercase' }}>{x}</span>
const emphasize = x => <span style={{ fontStyle: 'italic' }}>{x}</span>

const headerApp = Monad.do(function*() {
  const title = yield Reader.asks(ctx => ctx.title)
  return Reader.of(View(pageTitle).contramap(() => ({ title })))
})

const footerApp = Monad.do(function*() {
  const { author, year } = yield Reader.ask()
  return Reader.of(
    View(footerMessage)
      .concat(View(copyrightNotice).contramap(() => ({ author, year })))
      .map(x => <footer>{x}</footer>)
  )
})

const messageApp = Monad.do(function*() {
  const { greeting } = yield Reader.ask()
  return Reader.of(
    View(message).contramap(({ name }) => ({
      message: compose(clap, emphasize, uppercase)(`${greeting}, ${name}!`)
    }))
  )
})

const mconcat3 = liftN(3, (a, b, c) =>
  Monad.do(function*() {
    return a.concat(b).concat(c)
  })
)

const main = mconcat3(headerApp, messageApp, footerApp)

const centered = main.map(
  map(x => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {x}
    </div>
  ))
)


const test = Reader(({ author, year }) =>
  View(copyrightNotice).contramap(() => ({ author, year }))
)
const footer2 = map(map(y => <footer>{y}</footer>), test)

const header = Reader(
  ({ title }) => View(pageTitle).contramap(() => ({ title }))
).map(map(x => <pageTitle>{x}</pageTitle>))

export default element => {
  ReactDOM.render(
    header.runReader({ title: 'Awesome App', year: 2017, author: 'Bob McBob' }).fold(),
    // centered
    //   .runReader({
    //     title: 'Awesome App',
    //     greeting: 'Hello',
    //     author: 'Bob McBob',
    //     year: 2017
    //   })
    //   .fold({
    //     name: 'Alice',
    //     message: 'Now this is composable react'
    //   }),
    element
  )
}
