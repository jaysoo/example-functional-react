import React from 'react'
import { without } from 'ramda'
import Application from '../../react/Application'
import Component from '../../react/Component'
import Reader from '../../monads/Reader'
import Reducer from '../../monads/Reducer'

export const todoCmp = Component(({ state, dispatch }) => {
  console.log('???', state)
  return (
    <div>
      <form
        onSubmit={evt => {
          evt.preventDefault()
          dispatch({ type: 'todo/ADD' })
        }}
      >
        <input
          type="text"
          placeholder="Write something..."
          value={state.todo.newText}
          onChange={evt =>
            dispatch({
              type: 'todo/UPDATE_NEW_TEXT',
              text: evt.target.value
            })}
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {state.todo.items.map(todo => (
          <li key={todo.id}>
            {todo.text}
            {' '}
            <a style={{ cursor: 'pointer' }} onClick={() => dispatch({ type: 'todo/REMOVE', id: todo.id })}>
              ×
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
})

export const todoReducer = Reducer((state, action) => {
  switch (action.type) {
    case 'todo/UPDATE_NEW_TEXT':
      return {
        ...state,
        todo: {
          ...state.todo,
          newText: action.text
        }
      }
    case 'todo/ADD':
      if (state.todo.newText) {
        return {
          ...state,
          todo: {
            nextId: state.todo.nextId + 1,
            newText: '',
            items: state.todo.items.concat([
              {
                id: state.todo.nextId,
                text: state.todo.newText
              }
            ])
          }
        }
      } else {
        return state
      }
    case 'todo/REMOVE':
      const todo = state.todo.items.find(x => x.id === action.id)
      if (todo) {
        return {
          ...state,
          todo: {
            ...state.todo,
            items: without([todo], state.todo.items)
          }
        }
      } else {
        return state
      }
    default:
      return state
  }
})

const todoApp = Reader.of(
  Application({
    view: todoCmp,
    reducer: todoReducer.contramap(state => ({
      todo: {
        newText: '',
        nextId: 1,
        items: []
      },
      ...state
    }))
  })
)

export default todoApp
