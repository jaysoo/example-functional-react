import { ap, compose, pipe } from 'ramda'
import React, { createElement } from 'react'

const asArray = x => (Array.isArray(x) ? x : Array.of(x))

const View = pipe(
  x => compose(asArray, x),
  computation => ({
    computation, // This is used during chain, concat, etc.
                 // Not meant to be used publicly.

    fold: props => {
      const result = computation(props).filter(x => x !== null)

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
  })
)

View.of = x => View(() => x)

View.empty = () => View.of(null)

export default View
