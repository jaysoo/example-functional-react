import { createElement } from 'react'
import withReducer from './withReducer'
import Reducer from '../monads/Reducer'

const Component = ({ reducer = Reducer(s => s), view }) => ({
  reducer,
  view,

  contramap(f) {
    return Component({
      reducer,
      view: view.contramap(f)
    })
  },

  map(f) {
    return Component({
      reducer,
      view: f(view)
    })
  },

  chain(f) {
    return Component({
      reducer,
      view: f(view).view
    })
  },

  concat(other) {
    return Component({
      reducer: reducer.concat(other.reducer),
      view: view.concat(other.view)
    })
  },

  start(_initialState) {
    return createElement(withReducer(reducer.fold, _initialState)(view))
  }
})

Component.of = view => Component({ reducer: Reducer(s => s), view })

export default Component
