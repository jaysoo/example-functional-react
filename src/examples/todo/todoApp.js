import React from 'react'
import Component from '../../react/Component'
import View from '../../react/View'
import Reader from '../../monads/Reader'
import Reducer from '../../monads/Reducer'

export const todoView = View(({ state, dispatch }) => {
  return (
    <div>
      <form
        onSubmit={evt => {
          evt.preventDefault()
          dispatch({ type: 'todo/ADD' })
        }}
      >
        <input
          autoFocus
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
    default:
      return state
  }
})

const todoApp = Reader.of(
  Component({
    view: todoView,
    reducer: todoReducer.contramap(state => ({
      todo: {
        nextId: 1,
        items: []
      },
      ...state
    }))
  })
)

export default todoApp
