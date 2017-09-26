import { shallow } from 'enzyme'
import { compose } from 'ramda'
import React from 'react'
import View from './View'
import Component, { combine } from './Component'
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
  }),
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
  const g = s => s * 2
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
  const g = s => s * 2
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

test('Bicontraviant', () => {
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

  y1.find('button').simulate('click')
  y2.find('button').simulate('click')

  expect(y1.html()).toEqual(y2.html())
})

test('Ternary functor example', () => {
  const b = a.trimap(
    s => s.b,
    b => ({ b }),
    ({ state, dispatch }) => ({
      state: state.b,
      dispatch
    })
  )

  const wrapper = shallow(b.startWith({ b: { counter: 10 } }))
  expect(wrapper.html()).toMatch(/<p>10<\/p>/)

  wrapper.find('button').simulate('click')
  wrapper.find('button').simulate('click')
  expect(wrapper.html()).toMatch(/<p>12<\/p>/)
})

test('Quaternary functor example', () => {
  const b = a.quadmap(
    s => s.b,
    b => ({ b: { counter: b.counter } }),
    ({ state, dispatch }) => ({
        state: state.b,
        dispatch
    }),
    x => <main>{x}</main>
  )

  const wrapper = shallow(b.startWith({ b: { counter: 10 } }))
  expect(wrapper.html()).toEqual(
    '<main><div><button>increment</button><p>10</p></div></main>'
  )

  wrapper.find('button').simulate('click')
  wrapper.find('button').simulate('click')
  expect(wrapper.html()).toEqual(
    '<main><div><button>increment</button><p>12</p></div></main>'
  )
})

test('Combine example', () => {
  const combined = combine({
    x: a,
    y: a,
    z: a
  })

  const wrapper = shallow(
    combined.startWith({
      x: { counter: 1 },
      y: { counter: 2 },
      z: { counter: 3 }
    })
  )

  expect(wrapper.html()).toEqual(
    '<div><div><button>increment</button><p>1</p></div><div><button>increment</button><p>2</p></div><div><button>increment</button><p>3</p></div></div>'
  )

  wrapper.find('button').at(0).simulate('click')

  expect(wrapper.html()).toEqual(
    '<div><div><button>increment</button><p>2</p></div><div><button>increment</button><p>3</p></div><div><button>increment</button><p>4</p></div></div>'
  )
})
