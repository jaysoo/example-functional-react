import React from 'react'
import Component from '../../react/Component'
import View from '../../react/View'
import Reader from '../../monads/Reader'
import Monad from '../../monads/Monad'

const FooterCmp = Monad.do(function*() {
  const { author, year } = yield Reader.ask()
  return Reader.of(Component.fromView(View(() => (
    <p>© {author} {year} </p>
  ))))
})

export default FooterCmp
