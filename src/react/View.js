import { ap, compose } from 'ramda'
import React, { createElement } from 'react'

const View = computation => {
  computation = compose(asArray, computation)

  return {
    computation,

    fold: props => createElement('div', { children: computation(props) }),

    map: f => View(x => computation(x).map(f)),

    ap: other =>
      View(props => ap(computation(props), other.computation(props))),

    contramap: g => View(x => computation(g(x))),

    concat: other =>
      View(props => computation(props).concat(other.computation(props))),

    chain: g => View(x => computation(x).concat(y => g(y).computation(x)))
  }
}

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
