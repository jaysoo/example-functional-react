import React from 'react'

const inSidebar = x => (
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
    <h2>Sidebar</h2>
    {x}
  </aside>
)

export default inSidebar
