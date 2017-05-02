import { ap, compose } from 'ramda'
import React, { createElement } from 'react'

const View = compose(computation => {
  return {
    computation,

    fold: props => {
      const result = computation(props)

      // If we only have one element to render, don't wrap it with div.
      // This preserves the view's root element if it only has one root.
      // e.g. View.of(<div/>).fold() is just <div/>
      if (result.length === 1) {
        return result[0]
      // If the computation results in multiple items, then wrap it in a
      // parent div. This is needed because React cannot render an array.
      // See: https://github.com/facebook/react/issues/2127
      } else {
        return createElement('div', { children: result })
      }
    },

    map: f => View(x => computation(x).map(f)),

    ap: other =>
      View(props => ap(computation(props), other.computation(props))),

    contramap: g => View(x => computation(g(x))),

    concat: other =>
      View(props => computation(props).concat(other.computation(props))),

    chain: g => View(x => computation(x).concat(y => g(y).computation(x)))
  }
}, x => compose(asArray, x))

View.of = x => View(() => x)

View.empty = () => View.of(null)

export default View

function asArray(x) {
  if (Array.isArray(x)) {
    return x
  } else {
    return Array.of(x)
  }
}
