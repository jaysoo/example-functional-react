import React from 'react'
import ReactDOM from 'react-dom'
import { compose, map } from 'ramda'
import Monad from '../../monads/Monad'
import Reader from '../../monads/Reader'
import headerApp from './headerApp'
import footerApp from './footerApp'
import makeSidebar from './makeSidebar'
import { counterApp } from '../counter'
import { todoApp } from '../todo'

const makeMain = a => (
  <div style={{ marginLeft: '305px', padding: '5px' }}>{a}</div>
)

export const mainApp = Monad.do(function*() {
  const header = yield headerApp
  const counter = yield counterApp
  const todo = yield todoApp
  const footer = yield footerApp
  return Reader.of(
    header
      .concat(counter)
      .concat(footer)
      .map(map(makeMain))
      .concat(
        todo.map(map(
          compose(
            makeSidebar,
            x => (
              <div>
                <h2>Your items</h2>
                {x}
              </div>
            )
          )
        ))
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
