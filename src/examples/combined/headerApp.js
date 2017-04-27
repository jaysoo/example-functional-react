import React from 'react'
import Component from '../../react/Component'
import Reader from '../../monads/Reader'
import View from '../../react/View'

const HeaderApp = Reader.of(Component.of(View(({ state }) => (
  <h1>Welcome, {state.user.name}!</h1>
))))

export default HeaderApp
