import React, { useState } from 'react'
import Topbar from './Topbar/Topbar'
import { Outlet } from 'react-router-dom'
import './Home.css'
import { Container } from '@mui/material'

const Home = () => {
  return (
    <>
      <div className="theme">
          <Topbar />
        <div className='layout'>
          <Container className='theme'>
            <Outlet />
          </Container>
        </div>
      </div>
    </>
  )
}

export default Home