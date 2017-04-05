import React from 'react'
import Component from '../../react/Component'
import View from '../../react/View'
import Reader from '../../monads/Reader'
import Reducer from '../../monads/Reducer'

const CounterCmp = Reader.of(
  Component({
    view: View(({ state, dispatch }) => {
      return (
        <div>
          <button onClick={() => dispatch({ type: 'DEC' })}>
            -
          </button>
          {' '}
          <span>
            Counter: {state.counter}
          </span>
          {' '}
          <button onClick={() => dispatch({ type: 'INC' })}>
            +
          </button>
        </div>
      )
    }),
    reducer: Reducer((state, action) => {
      switch (action.type) {
        case 'INC':
          return {
            ...state,
            counter: state.counter + 1
          }
        case 'DEC':
          return {
            ...state,
            counter: state.counter - 1
          }
        default:
          return state
      }
    }).contramap(state => ({
      counter: 10,
      ...state
    }))
  })
)

export default CounterCmp
