import React from 'react'
import Sidebar from './Sidebar'
import Toast from './Toast'

const Layout = ({ children, links }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar links={links} />
      <div className="flex-1 ml-64">
        <main className="p-8">
          {children}
        </main>
      </div>
      <Toast />
    </div>
  )
}

export default Layout
