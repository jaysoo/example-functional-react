import React from 'react'
import ReactDOM from 'react-dom'
import Monad from '../../monads/Monad'
import Reader from '../../monads/Reader'
import headerApp from './headerApp'
import footerApp from './footerApp'
import { counterApp } from '../counter'
import { todoApp } from '../todo'

export const mainApp = Monad.do(function*() {
  const header = yield headerApp
  const counter = yield counterApp
  const counterWithHint = counter.map(x =>
    <div>
      <p>This is a counter that you can increment/decrement.</p>
      {x}
    </div>
  )
  const todo = yield todoApp
  const todoSidebar = todo
    .map(x =>
      <div>
        <h2>Your items</h2>
        {x}
      </div>
    )
    .map(asSidebar)
  const footer = yield footerApp
  return Reader.of(header.concat(counterWithHint).concat(footer).concat(todoSidebar))
})

function asSidebar(x) {
  return (
    <aside
      style={{
        padding: '5px',
        width: '300px',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        borderLeft: '1px solid gray'
      }}
    >
      {x}
    </aside>
  )
}

export default element => {
  ReactDOM.render(
    mainApp.runReader({ year: 2017, author: 'Bob McBob' }).startWith({
      user: { name: 'Alice' }
    }),
    element
  )
}
