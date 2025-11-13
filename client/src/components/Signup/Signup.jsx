import React, { useState, useEffect } from 'react'
import './Signup.css'
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from '../navbar/Navbar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import background1 from '../../assets/background_1_ls.jpg'
import background2 from '../../assets/background_2_ls.jpg'
import background3 from '../../assets/background_3_ls.jpg'
import background4 from '../../assets/background_4_ls.jpg'

const Signup = () => {

  const [name, setName] = useState("")
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cpassword, setCpassword] = useState("")
  const [loadStatus, setLoadStatus] = useState(false)

  const [showpassword, setShowpassword] = useState(false)
  const [showcpassword, setShowcpassword] = useState(false)

  const notifySuccess = () => toast.success('Signup is Successfull!')
  const notifyUserName = () => toast.error('Username already exists. Try a different username!')
  const notifyEmail = () => toast.error('Email already Registered! Try Signing In!')
  const notifyInvalidEmail = () => toast.error('Enter correct Email!')
  const notifyInvalidUserName = () => toast.error('Invalid Username. Username must start with an alphabet, all other characters can be alphabets, numbers or an underscore and length should be between 8-30 characters')
  const notifyInvalidName = () => toast.error('Please enter your correct name in alphabets')
  const notifyPassword = () => toast.warning('Password must be atleast 8 character long and must contain alteast one uppercase letter, one lowercase letter, one number and one special character!')
  const notifyCPassword = () => toast.error('Passwords do not match!')
  const notifyFields = () => toast.info('Fill all the fields!')
  const notifyError = () => toast.error('Something went wrong!')

  const navigate = useNavigate();
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
 
  const postData = () => {
    setLoadStatus(true)
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (!(emailRegex.test(email))) {
      notifyInvalidEmail()
      setLoadStatus(false)
      return
    }
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        userName: userName,
        email: email,
        password: password,
        cpassword: cpassword,
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.Status == "Sign Up Successful") {
          notifySuccess()
          setLoadStatus(false)
          navigate('/signin')
        }
        else if (data.error == "User already exists with that email. Try loging in") {
          setLoadStatus(false)
          notifyEmail()
        }
        else if (data.error == "Invalid username") {
          setLoadStatus(false)
          notifyInvalidUserName()
        }
        else if (data.error == "Invalid name") {
          setLoadStatus(false)
          notifyInvalidName()
        }
        else if (data.error == "Username already exists. Try a different username.") {
          setLoadStatus(false)
          notifyUserName()
        }
        else if (data.error == "Passwords do not match") {
          setLoadStatus(false)
          notifyCPassword()
        }
        else if (data.error == "Enter Strong Password") {
          setLoadStatus(false)
          notifyPassword()
        }
        else if (data.error == "Please fill all the fields") {
          setLoadStatus(false)
          notifyFields()
        }
        else {
          setLoadStatus(false)
          notifyError()
        }
      })
      .catch(err => console.log(err))

  }
  return (
    <>
      <Navbar />
      <div className="signup flex items-center justify-evenly" style={{ backgroundImage: `url(${images[current]})` }}>
        <div className='form-info rounded-xl flex flex-col items-center px-3'>
          <p className='para text-center my-1'>Sign Up to WittyWeb to</p>
          <p className='para text-center my-1'>Connect with your Friends</p>
          <p className='para text-center my-1'>and Share your Thoughts!</p>
        </div>
        <div className='form rounded-xl py-10 px-9 flex flex-col gap-5 items-stretch text-xl'>
          <h1 className='text-3xl font-extrabold text-center'>SIGN UP</h1>
          <div>
            <input className='px-5 py-2 text-lg' type="email" name="email" id="email" placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <input className='px-5 py-2 text-lg' type="text" name="username" id="username" placeholder='Enter Username' value={userName} onChange={(e) => setUserName(e.target.value)} />
          </div>
          <div>
            <input className='px-5 py-2 text-lg' type="text" name="fullname" id="fname" placeholder='Enter Full Name' value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className='relative flex items-center'>
            {(showpassword) ?
              <>
                <input className='px-5 py-2 text-lg pr-11' type="text" name="password" id="password" placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <VisibilityIcon className="absolute right-2" style={{ color: 'white', cursor: 'pointer' }} onClick={() => setShowpassword(!showpassword)} />
              </>
              :
              <>
                <input className='px-5 py-2 text-lg pr-11' type="password" name="password" id="password" placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <VisibilityOffIcon className="absolute right-2" style={{ color: 'white', cursor: 'pointer' }} onClick={() => setShowpassword(!showpassword)} />
              </>
            }
          </div>
          <div className='relative flex items-center'>
            {(showcpassword) ?
              <>
                <input className='px-5 py-2 text-lg pr-11' type="text" name="cpassword" id="cpassword" placeholder='Enter Password to confirm' value={cpassword} onChange={(e) => setCpassword(e.target.value)} />
                <VisibilityIcon className="absolute right-2" style={{ color: 'white', cursor: 'pointer' }} onClick={() => setShowcpassword(!showcpassword)} />
              </>
              :
              <>
                <input className='px-5 py-2 text-lg pr-11' type="password" name="cpassword" id="cpassword" placeholder='Enter Password to confirm' value={cpassword} onChange={(e) => setCpassword(e.target.value)} />
                <VisibilityOffIcon className="absolute right-2" style={{ color: 'white', cursor: 'pointer' }} onClick={() => setShowcpassword(!showcpassword)} />
              </>
            }
          </div>
          <div>
            <button>
              {
                (loadStatus) ?
                  <div className='loader flex justify-center items-center bg-black cursor-not-allowed'>
                    <div className="newtons-cradle bg-black">
                      <div className="newtons-cradle__dot"></div>
                      <div className="newtons-cradle__dot"></div>
                      <div className="newtons-cradle__dot"></div>
                      <div className="newtons-cradle__dot"></div>
                    </div>
                  </div>
                  :
                  <input type="submit" value="SIGN UP" className='button_top border-2 border-black rounded-xl bg-black text-white p-5' onClick={postData} />
              }
            </button>
          </div>
          <div className='move'>
            <NavLink to="/signin" className={`font-semibold text-center hover:underline text-white`} draggable="false"><p>Already have an account? Sign In</p></NavLink>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup