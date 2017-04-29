import React from 'react'
import Application from '../../react/Application'
import Component from '../../react/Component'
import Reader from '../../monads/Reader'
import Monad from '../../monads/Monad'

const footerApp = Monad.do(function*() {
  const { author, year } = yield Reader.ask()
  return Reader.of(Application.of(Component(() => (
    <p>© {author} {year} </p>
  ))))
})

export default footerApp
