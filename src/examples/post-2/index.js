import ReactDOM from 'react-dom'
import React from 'react'
import View from '../../react/View'
import Reader from '../../monads/Reader'
import Monad from '../../monads/Monad'
import { compose, map, liftN } from 'ramda'

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

export default element => {
  ReactDOM.render(
    x.runReader({
      color: 'red',
      year: 2017,
      author: 'Bob McBob'
    }).fold(),
    // combined2.runReader(ctx).fold(),
    // header.runReader({ title: 'Awesome App', year: 2017, author: 'Bob McBob' }).fold(),
    element
  )
}
