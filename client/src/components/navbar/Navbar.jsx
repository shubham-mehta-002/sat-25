import React from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'
import logo from '../../assets/logo.png'
import hamburger from './svg/hamburger.svg'
import { useState } from 'react'

const Navbar = () => {
    const [sidebar, setSidebar] = useState(true)

    const change = () => {
        setSidebar(!sidebar)
        if (sidebar) {
            document.body.querySelector('.nav').style.left = "0"
            document.body.querySelector('.nav').classList.add('entry')
            document.body.querySelector('.nav').classList.remove('exit')
            document.body.querySelector('.hamburger').style.left = "43vw"
            document.body.querySelector('.hamburger').classList.add('entry')
            document.body.querySelector('.hamburger').classList.remove('exit')
        }
        else {
            document.body.querySelector('.nav').style.left = "-42vw"
            document.body.querySelector('.nav').classList.remove('entry')
            document.body.querySelector('.nav').classList.add('exit')
            document.body.querySelector('.hamburger').style.left = "0vw"
        }
    }
    return (
        <>
            <header className='flex w-full bg-wittyweb_dark justify-around nav gap-96 '>
                <NavLink to={"/"} draggable="false">
                    <div>
                        <img src={logo} alt="" className='logo' draggable="false" />
                    </div>
                </NavLink>
                <ul className='menu flex text-white gap-28 p-1 justify-end items-center'>
                    <NavLink to="/signup" className={({ isActive }) =>
                        `no-underline p-3 hover:bg-slate-800 hover:rounded-lg ${isActive ? 'border-b-2 border-white font-bold' : ''}`
                    } draggable="false"><li>Sign Up</li></NavLink>
                    <NavLink to="/signin" className={({ isActive }) =>
                        `no-underline p-3 hover:bg-slate-800 hover:rounded-lg ${isActive ? 'border-b-2 border-white font-bold' : ''}`
                    } draggable="false"><li>Sign In</li></NavLink>
                </ul>
            </header>
            <button value={sidebar} onClick={change} className='hamburger'>
                <img src={hamburger} alt="" id='temp' draggable="false" />
            </button>
        </>
    )
}

export default Navbar