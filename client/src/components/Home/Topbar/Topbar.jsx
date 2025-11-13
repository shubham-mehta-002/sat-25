import React, { useContext, useEffect } from 'react'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { NavLink } from "react-router-dom";
import logo from '../../../assets/logo.png'
import './Topbar.css'
import DarkMode from '../../DarkMode/DarkMode';
import hamburger from '../../navbar/svg/hamburger.svg';
import { useState } from 'react';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import { toast } from "react-toastify";
import { LoginContext } from '../../../Context/LoginContext';
import usericon from '../../../assets/usericon.png'


const Topbar = () => {
  const [sidebar, setSidebar] = useState(true)
  const { setModalOpen } = useContext(LoginContext)
  const [profilephototopbar, setProfilephototopbar] = useState("")

  const notifySignin = () => toast.error('You must signin first!')

  const loginStatus = () => {
    const token = localStorage.getItem("jwt")
    if (token) {
      return true
    }
    else {
      return false
    }
  }

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      fetch(`${import.meta.env.VITE_BACKEND_URI}/api/getuserdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify({
          userid: JSON.parse(localStorage.getItem("user"))._id
        })
      }).then(res => res.json())
        .then(data => {
          setProfilephototopbar(data[0].profile_photo)
        })
    }
  }, [])

  const change = () => {
    setSidebar(!sidebar)
    if (sidebar) {
      document.body.querySelector('.topbar').style.left = "0"
      document.body.querySelector('.topbar').classList.add('entry')
      document.body.querySelector('.topbar').classList.remove('exit')
      document.body.querySelector('.hamburger').style.left = "43vw"
      document.body.querySelector('.hamburger').classList.add('entry')
      document.body.querySelector('.hamburger').classList.remove('exit')
    }
    else {
      document.body.querySelector('.topbar').style.left = "-42vw"
      document.body.querySelector('.topbar').classList.remove('entry')
      document.body.querySelector('.topbar').classList.add('exit')
      document.body.querySelector('.hamburger').style.left = "0vw"
    }
  }
  return (
    <>
      <div className='topbar flex justify-between'>
        <div className="menu left flex items-center gap-4">
          <NavLink to='/' style={{ textDecoration: 'none' }} draggable="false">
            <img src={logo} alt="" className='logo' draggable="false" />
          </NavLink>
          <NavLink to='/' style={{ textDecoration: 'none' }} draggable="false">
            <HomeOutlinedIcon />
          </NavLink>
          <DarkMode />
          {(loginStatus()) ?
            <NavLink to={'/searchusers'} draggable="false">
              <div className="search flex items-center gap-3">
                <h1 className='font-bold'>Search</h1>
              </div>
            </NavLink>
            :
            <NavLink to={'/signin'} draggable="false" onClick={() => notifySignin()}>
              <div className="search flex items-center gap-3">
                <h1 className='font-bold'>Search</h1>
              </div>
            </NavLink>
          }
        </div>
        <div className="menu right flex items-center gap-4">
          {(loginStatus()) ?
            <>
              <div className='flex flex-col lg:flex-row items-center gap-5 lg:gap-1'>
                <NavLink to='/wits' style={{ textDecoration: 'none' }} draggable="false">
                  <div className='flex m-0 lg:m-3 justify-start items-center gap-1'>
                    <Diversity3Icon />
                    <h3 className='font-bold'>Wits</h3>
                  </div>
                </NavLink>
                <NavLink to='/createpost' style={{ textDecoration: 'none' }} draggable="false">
                  <div className='flex m-0 lg:m-3 justify-start items-center gap-1'>
                    <AddCircleOutlineRoundedIcon />
                    <h3 className='font-bold'>Create Post</h3>
                  </div>
                </NavLink>
              </div>
              <div className="user flex items-center gap-2">
                <NavLink style={{ textDecoration: 'none' }} className={`logout_button`} onClick={() => {
                  change()
                  setModalOpen(true)
                }} draggable="false">
                  <span className='font-bold text-red-500'>Logout</span>
                </NavLink>
                <div className='userprofile'>
                  <NavLink to='/profile' style={{ textDecoration: 'none' }} draggable="false">
                    {(profilephototopbar && profilephototopbar != "") ?
                      <img src={profilephototopbar} alt="" className='userimage h-10 w-10' draggable="false" />
                      :
                      <img src={usericon} alt="" className='userimage h-10 w-10' draggable="false" />
                    }
                  </NavLink>
                  <NavLink to='/profile' style={{ textDecoration: 'none' }} draggable="false">
                    <span className='font-bold'>{JSON.parse(localStorage.getItem("user")).name}</span>
                  </NavLink>
                </div>
              </div>
            </>
            :
            <>
              <div className='flex items-center gap-1'>
                <NavLink to='/signup' style={{ textDecoration: 'none' }} draggable="false">
                  <h3 className='font-bold'>Sign Up</h3>
                </NavLink>
              </div>
              <div className="user flex items-center gap-2">
                <NavLink to='/signin' style={{ textDecoration: 'none' }} draggable="false">
                  <h3 className='font-bold'>Sign In</h3>
                </NavLink>
              </div></>}

        </div>
      </div >
      <button value={sidebar} onClick={change} className='hamburger mx-1'>
        <img src={hamburger} alt="" id='temp' draggable="false" />
      </button>
    </>
  )
}

export default Topbar