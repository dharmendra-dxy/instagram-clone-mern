import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div>
        sidebar


        {/* to display children: */}
        <div>
            <Outlet/>
        </div>
        
    </div>
  )
}

export default MainLayout