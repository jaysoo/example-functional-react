import { createElement } from 'react'
import withReducer from './withReducer'
import Reducer from '../monads/Reducer'

const Application = ({ reducer = Reducer(s => s), view }) => ({
  reducer,
  view,

  contramap: f =>
    Application({
      reducer,
      view: view.contramap(f)
    }),

  map: f =>
    Application({
      reducer,
      view: f(view)
    }),

  chain: f =>
    Application({
      reducer,
      view: f(view).view
    }),

  concat: other =>
    Application({
      reducer: reducer.concat(other.reducer),
      view: view.concat(other.view)
    }),

  startWith: _initialState =>
    createElement(withReducer(reducer.fold, _initialState)(view))
})

Application.of = view => Application({ reducer: Reducer(s => s), view })

export default Application
