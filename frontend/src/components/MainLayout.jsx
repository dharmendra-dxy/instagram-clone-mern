
import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    <div>
        <LeftSidebar/>


        {/* to display children: */}
        <div>
            <Outlet/>
        </div>
        
    </div>
  )
}

export default MainLayout