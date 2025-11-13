import React, { useState, useEffect } from 'react'
import './Signin.css'
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Navbar from '../navbar/Navbar';
import background1 from '../../assets/background_1_ls.jpg'
import background2 from '../../assets/background_2_ls.jpg'
import background3 from '../../assets/background_3_ls.jpg'
import background4 from '../../assets/background_4_ls.jpg'

const Signin = () => {

  const [flagshowpassword, setFlagshowpassword] = useState(false)
  const [loadStatus, setLoadStatus] = useState(false)

  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [passsword, setPassword] = useState("")

  const navigate = useNavigate()

  const notifyIncorrectUserName = () => toast.error('Invalid username!')
  const notifyIncorrectEmail = () => toast.error('Invalid email!')
  const notifyIncorrectPassword = () => toast.error('Invalid password!')
  const notifyError = () => toast.error('Something went wrong!')
  const notifyFields = () => toast.info('Fill all the fields!')
  const notifySuccess = () => toast.success('Sign In Successfully!')

  const checkLoginData = () => {
    setLoadStatus(true)
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userName: userName,
        email: email,
        password: passsword
      })

    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          notifySuccess()
          localStorage.setItem('jwt', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          setLoadStatus(false)
          navigate('/')
        }
        else if (data.error == "Invalid username") {
          setLoadStatus(false)
          notifyIncorrectUserName()
        }
        else if (data.error == "Please fill all the fields") {
          setLoadStatus(false)
          notifyFields()
        }
        else if (data.error == "Invalid email") {
          setLoadStatus(false)
          notifyIncorrectEmail()
        }
        else if (data.error == "Invalid password") {
          setLoadStatus(false)
          notifyIncorrectPassword()
        }
        else {
          setLoadStatus(false)
          notifyError()
        }
      })
      .catch(err => console.log(err))
  }

  const images = [
    background1,
    background2,
    background3,
    background4
  ];
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((current) => (current + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [current, images.length]);

  return (
    <>
      <Navbar />
      <div className="signin flex justify-evenly items-center" style={{ backgroundImage: `url(${images[current]})` }}>
        <div className='form-info rounded-xl flex flex-col items-center px-3'>
          <p className='para text-center my-1'>Welcome Back to WittyWeb</p>
          <p className='para text-center my-1'>Was Waiting for you</p>
          <p className='para text-center my-1'>Sign In Now!</p>
        </div>
        <div className='form rounded-xl py-10 px-9 flex flex-col gap-5 items-stretch text-xl'>
          <h1 className='text-3xl font-extrabold text-center'>SIGN IN</h1>
          <div>
            <input className='px-5 py-2 text-lg' type="text" name="username" id="username" placeholder='Enter Username' value={userName} onChange={(e) => setUserName(e.target.value)} />
          </div>
          <div>
            <input className='px-5 py-2 text-lg' type="email" name="email" id="email" placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className='relative flex items-center'>
            {(flagshowpassword) ?
              <>
                <input className='px-5 py-2 text-lg pr-11' type="text" name="password" id="password" placeholder='Enter Password' value={passsword} onChange={(e) => setPassword(e.target.value)} />
                <VisibilityIcon className="absolute right-2" style={{ color: 'white', cursor: 'pointer' }} onClick={() => setFlagshowpassword(!flagshowpassword)} />
              </>
              :
              <>
                <input className='px-5 py-2 text-lg pr-11' type="password" name="password" id="password" placeholder='Enter Password' value={passsword} onChange={(e) => setPassword(e.target.value)} />
                <VisibilityOffIcon className="absolute right-2" style={{ color: 'white', cursor: 'pointer' }} onClick={() => setFlagshowpassword(!flagshowpassword)} />
              </>
            }
          </div>
          <div>
            <button>
              {loadStatus ?
                <div className='loader flex justify-center items-center bg-black cursor-not-allowed'>
                  <div className="newtons-cradle bg-black">
                    <div className="newtons-cradle__dot"></div>
                    <div className="newtons-cradle__dot"></div>
                    <div className="newtons-cradle__dot"></div>
                    <div className="newtons-cradle__dot"></div>
                  </div>
                </div>
                :
                <input type="submit" value="SIGN IN" className='button_top border-2 border-black rounded-xl bg-black text-white p-5' onClick={checkLoginData} />
              }
            </button>
          </div>
          <div>
            <NavLink to="/signup" className={`font-semibold text-center hover:underline text-white`} draggable="false"><p>Don't have an account? Sign Up</p></NavLink>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signin