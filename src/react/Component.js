import { createElement } from 'react'
import withReducer from './withReducer'
import Reducer from '../monads/Reducer'
import View from './View'

const Component = ({ reducer = Reducer(s => s), view }) => ({
  reducer,
  view,

  concat: other =>
    Component({
      reducer: reducer.concat(other.reducer),
      view: view.concat(other.view)
    }),

  map: f =>
    Component({
      reducer,
      view: view.map(f)
    }),

  chain: f =>
    Component({
      reducer,
      view: view.chain(f)
    }),

  contramap: f =>
    Component({
      reducer: reducer.contramap(f),
      view: view
    }),

  promap: (f, g) =>
    Component({
      reducer: reducer.contramap(f),
      view: view.map(g)
    }),

  bimap: (f, g) =>
    Component({
      reducer: reducer.map(f),
      view: view.map(g)
    }),

  bicontramap: (f, g) =>
    Component({
      reducer: reducer.contramap(f),
      view: view.contramap(g)
    }),

  trimap: (f, g, h) =>
    Component({
      reducer: reducer.contramap(f).map(g),
      view: view.contramap(h)
    }),

  quadmap: (f, g, h, i) =>
    Component({
      reducer: reducer.contramap(f).map(g),
      view: view.contramap(h).map(i)
    }),

  startWith: _initialState =>
    createElement(withReducer(reducer.fold, _initialState)(view))
})

Component.of = view => Component({ reducer: Reducer(s => s), view })

export function combine(xs) {
  return Object.keys(xs).reduce((cmp, k) => {
    return cmp.concat(xs[k].trimap(
      s => s[k],
      x => ({ [k]: x }),
      ({ state, dispatch }) => ({
        state: state[k],
        dispatch
      })
    ))
  }, Component.of(View.of(() => null)))
}

export default Component
