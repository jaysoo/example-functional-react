import { PureComponent } from 'react'

// Adapted from https://github.com/acdlite/recompose
const withReducer = (
  reducer,
  initialState
) => view => {
  return class extends PureComponent {
    state = {
      stateValue: this.initializeStateValue()
    }

    initializeStateValue() {
      if (initialState !== undefined) {
        return typeof initialState === 'function'
          ? initialState(this.props)
          : initialState
      } else {
        return reducer(undefined, { type: '@@INIT' })
      }
    }

    dispatch = action =>
      this.setState(({ stateValue }) => ({
        stateValue: reducer(stateValue, action)
      }))

    render() {
      return view.fold({
        ...this.props,
        state: this.state.stateValue,
        dispatch: this.dispatch
      })
    }
  }
}

export default withReducer
