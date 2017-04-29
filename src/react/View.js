import { createElement } from 'react'

const View = type => ({
  type,

  map: f => View(x => f(createElement(type, x))),

  ap: other => View(props => type(props)(createElement(other.type, props))),

  contramap: g => View(x => createElement(type, g(x))),

  concat: other =>
    View(props =>
      createElement('div', {}, [createElement(type, props), other.fold(props)])
    ),

  chain: f =>
    View(props => createElement(f(createElement(type, props)).type, props)),

  fold: props => createElement(type, props)
})

View.of = x => View(() => x)

export default View
