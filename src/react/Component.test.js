import { shallow } from 'enzyme'
import { compose } from 'ramda'
import React from 'react'
import View from './View'
import Component from './Component'
import Reducer from '../monads/Reducer'

const a = Component({
  view: View(({ state, dispatch }) => {
    return (
      <div>
        <button onClick={() => dispatch({ type: 'INC' })}>
          increment
        </button>
        <p>
          {state.counter}
        </p>
      </div>
    )
    }
  ),
  reducer: Reducer((state, action) => {
    switch (action.type) {
      case 'INC':
        return { counter: state.counter + 1 }
      default:
        return state
    }
  })
})

test('Contravariant', () => {
  // Identity
  const x1 = shallow(a.contramap(x => x).startWith({ counter: 10 }))
  const x2 = shallow(a.startWith({ counter: 10 }))

  expect(x1.html()).toEqual(x2.html())

  x1.find('button').simulate('click')
  x2.find('button').simulate('click')

  expect(x1.html()).toEqual(x2.html())

  // Composition
  const f = s => s + 1
  const g = s => s  * 2
  const compLaw1 = a.contramap(compose(f, g))
  const compLaw2 = a.contramap(f).contramap(g)
  const y1 = shallow(compLaw1.startWith({ counter: 10 }))
  const y2 = shallow(compLaw2.startWith({ counter: 10 }))

  expect(y1.html()).toEqual(y2.html())

  y1.find('button').simulate('click')
  y2.find('button').simulate('click')

  expect(y1.html()).toEqual(y2.html())
})

test('Functor', () => {
  // Identity
  const x1 = shallow(a.map(x => x).startWith({ counter: 10 }))
  const x2 = shallow(a.startWith({ counter: 10 }))

  expect(x1.html()).toEqual(x2.html())

  x1.find('button').simulate('click')
  x2.find('button').simulate('click')

  expect(x1.html()).toEqual(x2.html())

  // Composition
  const f = x => <div>x: {x}</div>
  const g = y => <div>y: {y}</div>
  const compLaw1 = a.map(compose(f, g))
  const compLaw2 = a.map(g).map(f)
  const y1 = shallow(compLaw1.startWith({ counter: 10 }))
  const y2 = shallow(compLaw2.startWith({ counter: 10 }))

  expect(y1.html()).toEqual(y2.html())

  y1.find('button').simulate('click')
  y2.find('button').simulate('click')

  expect(y1.html()).toEqual(y2.html())
})

test('Profunctor', () => {
  // Identity
  const x1 = shallow(a.promap(x => x, x => x).startWith({ counter: 10 }))
  const x2 = shallow(a.startWith({ counter: 10 }))

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
  const y1 = shallow(compLaw1.startWith({ counter: 10 }))
  const y2 = shallow(compLaw2.startWith({ counter: 10 }))

  expect(y1.html()).toEqual(y2.html())

  y1.find('button').simulate('click')
  y2.find('button').simulate('click')

  expect(y1.html()).toEqual(y2.html())
})


test.only('Bicontraviant', () => {
  // Identity
  const x1 = shallow(a.bicontramap(x => x, x => x).startWith({ counter: 10 }))
  const x2 = shallow(a.startWith({ counter: 10 }))

  expect(x1.html()).toEqual(x2.html())

  x1.find('button').simulate('click')
  x2.find('button').simulate('click')

  expect(x1.html()).toEqual(x2.html())

  // Composition
  const f = s => {
    return { counter: s.counter + 1 }
  }
  const g = s => {
    return { counter: s.counter * 2 }
  }
  const h = ({ state, dispatch }) => {
    return { state: { counter: `${state.counter}!` }, dispatch }
  }
  const i = ({ state, dispatch }) => {
    return { state: { counter: `${state.counter}?` }, dispatch }
  }
  const compLaw1 = a.bicontramap(compose(f, g), compose(h, i))
  const compLaw2 = a.bicontramap(f, h).bicontramap(g, i)
  const y1 = shallow(compLaw1.startWith({ counter: 10 }))
  const y2 = shallow(compLaw2.startWith({ counter: 10 }))

  expect(y1.html()).toEqual(y2.html())
  console.log(y1.html())
  console.log(y2.html())

  y1.find('button').simulate('click')
  y2.find('button').simulate('click')

  expect(y1.html()).toEqual(y2.html())
  console.log(y1.html())
  console.log(y2.html())
})
