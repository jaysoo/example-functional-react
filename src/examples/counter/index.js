import React from 'react'
import ReactDOM from 'react-dom'
import { __, compose, concat, map } from 'ramda'
import Monad from '../../monads/Monad'
import Reader from '../../monads/Reader'
import HeaderCmp from './HeaderCmp'
import CounterCmp from './CounterCmp'
import FooterCmp from './FooterCmp'
import Sidebar from './Sidebar'

const Main = Monad.do(function*() {
  const headerCmp = yield HeaderCmp
  const counterCmp = yield CounterCmp
  const footerCmp = yield FooterCmp
  return Reader.of(
    compose(
      map(concat(Sidebar)),
      map(map(a => (
        <div style={{ marginLeft: '205px', padding: '5px' }}>{a}</div>
      ))),
      concat(__, footerCmp),
      concat(__, counterCmp)
    )(headerCmp)
  )
})

export default (element) => {
  ReactDOM.render(
    Main.runReader({ year: 2017, author: 'Bob McBob' }).start({
      user: { name: 'Alice' }
    }),
    element
  )
}
