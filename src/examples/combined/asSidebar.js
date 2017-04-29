import React from 'react'
import Component from '../../react/Component'

const inSidebar = Component.of(x => (
  <aside
    style={{
      padding: '5px',
      width: '300px',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      borderRight: '1px solid gray'
    }}
  >
    {x}
  </aside>
))

export default inSidebar
