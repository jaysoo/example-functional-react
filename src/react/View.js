import { createElement } from 'react'

const Component = type => ({
  type,

  map: f => Component(x => f(createElement(type, x))),

  ap: other => Component(props => type(props)(createElement(other.type, props))),

  contramap: g => Component(x => createElement(type, g(x))),

  concat: other =>
    Component(props =>
      createElement('div', {
        children: [createElement(type, props), other.fold(props)]
      })
    ),

  chain: f =>
    Component(props => createElement(f(createElement(type, props)).type, props)),

  fold: props => createElement(type, props)
})

Component.of = x => Component(() => x)

export default Component
