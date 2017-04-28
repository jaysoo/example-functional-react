import { createElement } from 'react'

const View = type => ({
  type,

  map(f) {
    return View(x => f(createElement(type, x)))
  },


  ap(other) {
    return View(props => type(props)(createElement(other.type, props)))
  },

  contramap(g) {
    return View(x => createElement(type, g(x)))
  },

  concat(other) {
    return View(props =>
      createElement('div', {
        children: [createElement(type, props), other.fold(props)]
      })
    )
  },

  chain(f) {
    return View(props =>
      createElement(f(createElement(type, props)).type, props)
    )
  },

  fold(props) {
    return createElement(type, props)
  }
})

View.of = x => View(() => x)

export default View
