import React from 'react'
import View from '../../react/View'

const asSidebar = View.of(x => (
  <aside
    style={{
      padding: '5px',
      width: '300px',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      borderLeft: '1px solid gray'
    }}
  >
    {x}
  </aside>
))

export default asSidebar
