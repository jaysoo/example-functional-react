import ReactDOM from 'react-dom'
import React from 'react'
import View from '../../react/View'
import Reader from '../../monads/Reader'
import Monad from '../../monads/Monad'
import { compose, map } from 'ramda'
import IntlMessageFormat from 'intl-messageformat'
const copyrightNotice = View(({ author, year }) => <p>© {author} {year}</p>)

const footer = Reader(({ author, year }) =>
  copyrightNotice.contramap(() => ({ author, year }))
)

const footer2 = footer.map(map(y => <footer>{y}</footer>))

const pageTitle = View(({ title }) => <h1>{title}</h1>)

const header = Reader(({ title }) =>
  pageTitle.contramap(() => ({ title }))
).map(map(x => <header>{x}</header>))

const combined =
  // Map over the view inside header
  header.map(headerView =>
    // Then map over the view inside footer
    footer2.map(footerView =>
      // Concat both views together
      headerView.concat(footerView)
    )
  )

const ctx = {
  year: 2017,
  author: 'Bob McBob',
  title: 'Awesome App'
}

const a = Reader.ask()
  .chain(x => Reader.of(x + 1))
  .chain(y => Reader.of(y * 2))
  .chain(z => Reader.of(`Got ${z}!`))

// console.log(a.runReader(1))
// console.log(a.runReader(0))
// console.log(a.runReader(-1))

const b = Monad.do(function*() {
  const ctx = yield Reader.ask()
  const x = yield Reader.of(ctx + 1)
  const y = x * 2
  const z = `Got ${y}!`
  return Reader.of(z)
})

// console.log(b.runReader(1))
// console.log(b.runReader(0))
// console.log(b.runReader(-1))

const makeColor = ({ color }) => view =>
  view.map(element => <div style={{ color }}>{element}</div>)

const withColor = Reader(makeColor)

const combined2 =
  // We need to use chain here since the result of the function
  // is another Reader.
  header.chain(headerView =>
    footer2.map(footerView => headerView.concat(footerView))
  )

const x = withColor.ap(footer2)

const messages = {
  en: { hello: 'Hello {name}!' },
  es: { hello: 'Hola {name}!' },
  fr: { hello: 'Bonjour {name}!' },
  zh: { hello: '你好 {name}!' }
}

const formatMessage = locale => id => values => {
  return new IntlMessageFormat(messages[locale][id], locale).format(values)
}

// console.log(formatMessage('fr')('hello')({ name: 'Alice' }))

const formatWithLocale = Monad.do(function*() {
  const { locale } = yield Reader.ask()
  return Reader.of(formatMessage(locale))
})

const formatHello = formatWithLocale.ap(Reader.of('hello'))

console.log(formatHello.runReader({ locale: 'fr' })({ name: 'Alice' }))

const clap = x => <span>👏 {x} 👏</span>
const uppercase = x => <span style={{ textTransform: 'uppercase' }}>{x}</span>
const emphasize = x => <span style={{ fontStyle: 'italic' }}>{x}</span>

const message = Reader.of(View(({ message }) => <p>{message}</p>))

const app = Monad.do(function*() {
  // Let's colorize our header shall we?
  const headerView = yield withColor.ap(header)

  // This will translate our message!
  const sayHello = yield formatHello

  // The message needs to be mapped using the context-aware `sayHello` function.
  const messageView = yield message.map(x =>
    // The `name` prop will be provided when we `fold` the view.
    x.contramap(({ name }) => ({
      message: compose(
        clap,
        emphasize,
        uppercase,
        sayHello
      )({ name })
    })
  ))

  const footerView = yield footer2

  // Combine everything together!
  return Reader.of(headerView.concat(messageView).concat(footerView))
})

// Hmm, let's style the element as well!
const styledApp = app.map(
  map(x => (
    <div style={{ fontFamily: 'Helvetica', textAlign: 'center' }}>{x}</div>
  ))
)

export default element => {
  ReactDOM.render(
    styledApp
      .runReader({
        color: 'green',
        locale: 'zh',
        title: 'Awesome App',
        author: 'Bob McBob',
        year: 2017
      })
      .fold({ name: 'Alice' }),
    element
  )
}
