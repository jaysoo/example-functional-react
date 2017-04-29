import React from 'react'
import ReactDOM from 'react-dom'
import { ap, map } from 'ramda'
import Monad from '../../monads/Monad'
import Reader from '../../monads/Reader'
import headerApp from './headerApp'
import footerApp from './footerApp'
import asSidebar from './asSidebar'
import { counterApp } from '../counter'
import { todoApp } from '../todo'

export const mainApp = Monad.do(function*() {
  const header = yield headerApp
  const counter = yield counterApp
  const todo = yield todoApp
  const footer = yield footerApp
  return Reader.of(
    header
      .concat(
        counter.map(map(x => (
          <div>
            <p>This is a counter that you can increment/decrement.</p>
            {x}
          </div>
        )))
      )
      .concat(footer)
      .concat(
        todo
          .map(map(x => (
            <div>
              <h2>Your items</h2>
              {x}
            </div>
          )))
        .map(ap(asSidebar))
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
