import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import './Wits.css'

const Wits = () => {
    return (
        <>
            <div className="createpost text-center flex flex-col">
                <h1 className='temp text-3xl font-bold'>Wits: Discover, Connect, Create</h1>
                <div className=' flex flex-col max-h-max py-2'>
                    <nav className='main-nav'>
                        <ul className='flex text-white gap-1 lg:gap-28 p-1 justify-around items-center'>
                            <NavLink to={'create'} draggable='false'>
                                <li className='menu_item text-lg'>Create Wit</li>
                            </NavLink>
                            <NavLink to={'searchandjoin'} draggable='false'>
                                <li className='menu_item text-lg'>Search and Join</li>
                            </NavLink>
                            <NavLink to={''} draggable='false'>
                                <li className='menu_item text-lg'>Joined Wits</li>
                            </NavLink>
                            <NavLink to={'mywits'} draggable='false'>
                                <li className='menu_item text-lg'>My Wits</li>
                            </NavLink>
                        </ul>
                    </nav>
                </div>
                <div className='mt-2'>
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default Wits