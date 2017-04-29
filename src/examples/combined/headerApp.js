import React from 'react'
import Application from '../../react/Application'
import Reader from '../../monads/Reader'
import Component from '../../react/Component'

const headerApp = Reader.of(Application.of(Component(({ state }) => (
  <h1>Welcome, {state.user.name}! You have {state.todo.items.length} items left to do.</h1>
))))

export default headerApp
