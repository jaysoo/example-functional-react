import React from 'react'
import Component from '../../react/Component'
import View from '../../react/View'
import Reader from '../../monads/Reader'
import Reducer from '../../monads/Reducer'

const counterCmp = View(({ state, dispatch }) => {
  return (
    <div>
      <button onClick={() => dispatch({ type: 'counter/DEC' })}>
        -
      </button>
      {' '}
      <span>
        Counter: {state.counter}
      </span>
      {' '}
      <button onClick={() => dispatch({ type: 'counter/INC' })}>
        +
      </button>
    </div>
  )
})

export const counterReducer = Reducer((state, action) => {
  switch (action.type) {
    case 'counter/INC':
      return {
        counter: state.counter + 1
      }
    case 'counter/DEC':
      return {
        counter: state.counter - 1
      }
    default:
      return state
  }
})

const counterApp = Reader.of(
  Component({
    view: counterCmp,
    reducer: counterReducer
  })
)

export default counterApp.map(cmp => cmp.contramap(state => ({
  counter: typeof state.counter === 'number' ? state.counter : 10
})))
