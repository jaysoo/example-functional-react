import React from 'react'
import Component from '../../react/Component'
import View from '../../react/View'
import Reader from '../../monads/Reader'
import Monad from '../../monads/Monad'

const FooterApp = Monad.do(function*() {
  const { author, year } = yield Reader.ask()
  return Reader.of(Component.of(View(() => (
    <p>© {author} {year} </p>
  ))))
})

export default FooterApp
