import React from 'react'
import Component from '../../react/Component'
import Reader from '../../monads/Reader'
import View from '../../react/View'

const headerApp = Reader.of(Component.of(View(({ state }) => (
  <h1>Welcome, {state.user.name}! You have {state.todo.items.length} items left to do.</h1>
))))

export default headerApp
