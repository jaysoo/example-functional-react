import React from 'react'
import { without } from 'ramda'
import Component from '../../react/Component'
import View from '../../react/View'
import Reader from '../../monads/Reader'
import Reducer from '../../monads/Reducer'

export const view = View(({ state, dispatch }) => {
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
        {state.todo.items.map(todo =>
          <li key={todo.id}>
            {todo.text}
            {' '}
            <a
              style={{ color: '#999', cursor: 'pointer' }}
              onClick={() => dispatch({ type: 'todo/REMOVE', id: todo.id })}
            >
              ×
            </a>
          </li>
        )}
      </ul>
    </div>
  )
})

export const reducer = Reducer((state, action) => {
  switch (action.type) {
    case 'todo/UPDATE_NEW_TEXT':
      return {
        todo: {
          ...state.todo,
          newText: action.text
        }
      }
    case 'todo/ADD':
      if (state.todo.newText) {
        return {
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

const todoApp = Reader.of(Component({ reducer, view }))

// We can use contramap on the reducer to create an initial state.
export default todoApp.map(cmp =>
  cmp.contramap(state => ({
    todo: state.todo || {
      newText: '',
      nextId: 1,
      items: []
    }
  }))
)
