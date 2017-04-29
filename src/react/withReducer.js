import { PureComponent } from 'react'

// Adapted from https://github.com/acdlite/recompose
const withReducer = (
  reducer,
  initialState
) => component => {
  return class extends PureComponent {
    state = {
      stateValue: this.initializeStateValue()
    }

    initializeStateValue() {
      const initial = reducer(undefined, { type: '@@INIT' })
      if (initialState !== undefined) {
        const provided = typeof initialState === 'function'
          ? initialState(this.props)
          : initialState
        return { ...initial, ...provided }
      } else {
        return initial
      }
    }

    dispatch = action =>
      this.setState(({ stateValue }) => ({
        stateValue: reducer(stateValue, action)
      }))

    render() {
      return component.fold({
        ...this.props,
        state: this.state.stateValue,
        dispatch: this.dispatch
      })
    }
  }
}

export default withReducer
