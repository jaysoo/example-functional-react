import React from 'react'
import Component from '../../react/Component'
import Reader from '../../monads/Reader'
import View from '../../react/View'

const HeaderCmp = Reader.of(Component.fromView(View(({ state }) => (
  <h1>Welcome, {state.user.name}!</h1>
))))

export default HeaderCmp
