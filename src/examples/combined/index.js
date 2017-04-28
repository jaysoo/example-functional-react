import React from 'react'
import ReactDOM from 'react-dom'
import { chain, map } from 'ramda'
import Monad from '../../monads/Monad'
import Reader from '../../monads/Reader'
import headerApp from './headerApp'
import footerApp from './footerApp'
import sidebarView from './sidebarView'
import { counterApp } from '../counter'
import { todoApp } from '../todo'

const makeMain = a => (
  <div style={{ marginLeft: '305px', padding: '5px' }}>{a}</div>
)

export const mainApp = Monad.do(function*() {
  const headerCmp = yield headerApp
  const counterCmp = yield counterApp
  const todoCmp = yield todoApp
  const footerCmp = yield footerApp
  return Reader.of(
    headerCmp.concat(counterCmp).concat(footerCmp).map(map(makeMain)).concat(
      todoCmp.map(
        chain(todoElement =>
          sidebarView.contramap(props => ({
            ...props,
            // Renders the todo app element as a child of the sidebar.
            children: todoElement
          }))
        )
      )
    )
  )
})

export default element => {
  ReactDOM.render(
    mainApp.runReader({ year: 2017, author: 'Bob McBob' }).start({
      user: { name: 'Alice' }
    }),
    element
  )
}
