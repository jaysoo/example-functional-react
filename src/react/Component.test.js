import { shallow } from 'enzyme'
import { compose } from 'ramda'
import React from 'react'
import View from './View'
import Component from './Component'
import Reducer from '../monads/Reducer'

test('Contravariant', () => {
  const a = Component({
    view: View(({ state, dispatch }) =>
      <div>
        <button onClick={() => dispatch({ type: 'INC' })}>
          increment
        </button>
        <p>
          {state}
        </p>
      </div>
    ),
    reducer: Reducer((state, action) => {
      switch (action.type) {
        case 'INC':
          return state + 1
        default:
          return state
      }
    })
  })

  // Identity
  const x1 = shallow(a.contramap(x => x).startWith(10))
  const x2 = shallow(a.startWith(10))

  expect(x1.html()).toEqual(x2.html())

  x1.find('button').simulate('click')
  x2.find('button').simulate('click')

  expect(x1.html()).toEqual(x2.html())

  // Composition
  const f = s => s + 1
  const g = s => s  * 2
  const compLaw1 = a.contramap(compose(f, g))
  const compLaw2 = a.contramap(f).contramap(g)
  const y1 = shallow(compLaw1.startWith(10))
  const y2 = shallow(compLaw2.startWith(10))

  expect(y1.html()).toEqual(y2.html())

  y1.find('button').simulate('click')
  y2.find('button').simulate('click')

  expect(y1.html()).toEqual(y2.html())
})

test('Functor', () => {
  const a = Component({
    view: View(({ state, dispatch }) =>
      <div>
        <button onClick={() => dispatch({ type: 'INC' })}>
          increment
        </button>
        <p>
          {state}
        </p>
      </div>
    ),
    reducer: Reducer((state, action) => {
      switch (action.type) {
        case 'INC':
          return state + 1
        default:
          return state
      }
    })
  })

  // Identity
  const x1 = shallow(a.map(x => x).startWith(10))
  const x2 = shallow(a.startWith(10))

  expect(x1.html()).toEqual(x2.html())

  x1.find('button').simulate('click')
  x2.find('button').simulate('click')

  expect(x1.html()).toEqual(x2.html())

  // Composition
  const f = x => <div>x: {x}</div>
  const g = y => <div>y: {y}</div>
  const compLaw1 = a.map(compose(f, g))
  const compLaw2 = a.map(g).map(f)
  const y1 = shallow(compLaw1.startWith(10))
  const y2 = shallow(compLaw2.startWith(10))

  expect(y1.html()).toEqual(y2.html())

  y1.find('button').simulate('click')
  y2.find('button').simulate('click')

  expect(y1.html()).toEqual(y2.html())
})

test('Profunctor', () => {
  const a = Component({
    view: View(({ state, dispatch }) =>
      <div>
        <button onClick={() => dispatch({ type: 'INC' })}>
          increment
        </button>
        <p>
          {state}
        </p>
      </div>
    ),
    reducer: Reducer((state, action) => {
      switch (action.type) {
        case 'INC':
          return state + 1
        default:
          return state
      }
    })
  })

  // Identity
  const x1 = shallow(a.promap(x => x, x => x).startWith(10))
  const x2 = shallow(a.startWith(10))

  expect(x1.html()).toEqual(x2.html())

  x1.find('button').simulate('click')
  x2.find('button').simulate('click')

  expect(x1.html()).toEqual(x2.html())

  // Composition
  const f = s => s + 1
  const g = s => s  * 2
  const h = x => <div>x: {x}</div>
  const i = y => <div>y: {y}</div>
  const compLaw1 = a.promap(compose(f, g), compose(h, i))
  const compLaw2 = a.promap(f, i).promap(g, h)
  const y1 = shallow(compLaw1.startWith(10))
  const y2 = shallow(compLaw2.startWith(10))

  expect(y1.html()).toEqual(y2.html())

  y1.find('button').simulate('click')
  y2.find('button').simulate('click')

  expect(y1.html()).toEqual(y2.html())
})
