import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './components/Home/Home'
import Signup from './components/Signup/Signup'
import Signin from './components/Signin/Signin'
import LogoutBox from './components/Home/Topbar/LogoutBox'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './components/Home/Profile/Profile'
import PostsPage from './components/Home/PostsPage/PostsPage'
import CreatePost from './components/Home/CreatePosts/CreatePost'
import { useState } from 'react'
import { LoginContext } from './Context/LoginContext'
import OtherProfile from './components/Home/Profile/OtherProfile'
import EditInfo from './components/Home/Profile/EditInfo'
import ChangePassword from './components/Home/Profile/ChangePassword'
import SearchUsers from './components/Home/SearchUsers/SearchUsers'
import SavedPosts from './components/Home/Profile/SavedPosts'
import Wits from './components/Home/Wits/Wits'
import JoinedWits from './components/Home/Wits/JoinedWits/JoinedWits'
import MyWits from './components/Home/Wits/MyWits/MyWits'
import SearchAndJoinWits from './components/Home/Wits/SearchAndJoinWits/SearchAndJoinWits'
import CreateWits from './components/Home/Wits/CreateWits/CreateWits'
import WitPostPage from './components/Home/Wits/WitPostPage/WitPostPage'
import CreateWitPost from './components/Home/Wits/WitPostPage/CreateWitPost'
import EditWit from './components/Home/Wits/EditWit/EditWit'
import WitReport from './components/Home/Wits/WitReport/WitReport'

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <BrowserRouter>
        <LoginContext.Provider value={{ modalOpen, setModalOpen }}>
          <div className="flex flex-col app">
            <Routes>
              <Route path="/" element={<Home />}>
                <Route path='' element={<PostsPage />} />
                <Route exact path='profile' element={<Profile />} />
                <Route exact path='profile/editinfo' element={<EditInfo />} />
                <Route path='profile/savedposts' element={<SavedPosts />} />
                <Route path='profile/editinfo/changepassword' element={<ChangePassword />} />
                <Route path='searchusers' element={<SearchUsers />} />
                <Route path='wits/' element={<Wits />}>
                  <Route path='' element={<JoinedWits/>} />
                  <Route exact path='mywits' element={<MyWits/>} />
                  <Route path='mywits/editwit/:editwitid' element={<EditWit/>} />
                  <Route path='mywits/witstats/:statswitid' element={<WitReport/>} />
                  <Route path='searchandjoin' element={<SearchAndJoinWits/>} />
                  <Route path='create' element={<CreateWits/>} />
                  <Route exact path=':witid' element={<WitPostPage/>} />
                  <Route path=':witid/createwitpost' element={<CreateWitPost/>} />
                </Route>
                <Route path='createpost' element={<CreatePost />} />
                <Route path='profile/:userid' element={<OtherProfile />} />
              </Route>
              <Route path="/signup" element={<Signup />}></Route>
              <Route path="/signin" element={<Signin />}></Route>
            </Routes>
            <ToastContainer />
          </div>
          {modalOpen && <LogoutBox setModalOpen={setModalOpen}></LogoutBox>}
        </LoginContext.Provider>
      </BrowserRouter>
    </>
  )
}

export default App
