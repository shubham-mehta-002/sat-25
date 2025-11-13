import React from 'react'
import './Profile.css'
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import Post from '../Post/Post';
import { useNavigate, NavLink } from 'react-router-dom';
import { UserContext } from '../../../Context/UserContext'
import Followers from './Followers/Followers';
import usericon from '../../../assets/usericon.png'
import Followings from './Followings/Followings';

const Profile = () => {
  const [pic, setPic] = useState([])
  const [profilePhoto, setProfilePhoto] = useState("")
  const [profileBio, setProfileBio] = useState("")
  const [profileGender, setProfileGender] = useState("")
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])

  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)

  const navigate = useNavigate();
  const notifysignin = () => toast.info('Please sign in first!')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/profile`,
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        }
      })
      .then(res => res.json())
      .then(result => {
        if (result.error == "You must be logged in") {
          notifysignin()
          navigate('/signin')
          return
        }
        setPic(result.posts)
        setFollowers(result.followers)
        setFollowing(result.following)
        setProfileBio(result.profilebio)
        setProfileGender(result.profilegender)
        if (result.profilephoto && result.profilePhoto != "") {
          setProfilePhoto(result.profilephoto)
        }
        else {
          setProfilePhoto(usericon)
        }
      })
  }, [])

  return (
    <>
      <UserContext.Provider value={{ followers, setShowFollowers, following, setShowFollowing }}>
        <div className="profile text-center flex flex-col gap-8">
          <h1 className='temp text-3xl font-bold'>My Profile</h1>
          <div className='flex items-center justify-center gap-6'>
            <img src={profilePhoto} alt="" className='myimage' draggable="false" />
            <div className='flex flex-col items-center justify-center'>
              <h1 className='name text-3xl '>{JSON.parse(localStorage.getItem("user")).name}</h1>
              <h1 className='username text-xl'>@{JSON.parse(localStorage.getItem("user")).userName}</h1>
              {(profileGender == "Male") ? <h2 className='gender text-lg'>He/Him</h2>
                :
                (profileGender == "Female") ? <h2 className='gender text-lg'>She/Her</h2> : null}
            </div>
          </div>
          <div className="follow flex gap-11 justify-center items-center">
            <div className='followers flex flex-col cursor-pointer' onClick={() => setShowFollowers(true)}>
              <div className='font-semibold text-xl'>{followers.length}</div>
              <div>Followers</div>
            </div>
            <div className='following flex flex-col cursor-pointer' onClick={() => setShowFollowing(true)}>
              <div className='font-semibold text-xl'>{following.length}</div>
              <div>Following</div>
            </div>
            <NavLink to={"/profile/savedposts"}>
              <div className="savedposts flex flex-col items-center justify-center">
                <BookmarksIcon fontSize='small' className='icon' />
                <div>Saved Posts</div>
              </div>
            </NavLink>
          </div>
          <div className="bio">{profileBio}</div>
          <div className="editinfo">
            <NavLink to={"/profile/editinfo"} draggable="false">
              <button className='editbutton'>Edit Profile</button>
            </NavLink>
          </div>
          <div className="post_bar">
            <div className=' text-xl font-bold'>My Posts</div>
          </div>
          <div className='post-container gap-4 flex flex-col-reverse'>
            {pic.map((data) => {
              let count = 0
              count += data.comments.length
              data.comments.forEach(reply => {
                  count += reply.replies.length
              })
              return (
                <Post url={profilePhoto} username={`@${data.postedby.userName}`} caption={data.caption} content={data.image} post_id={data._id} key={data._id} liked={data.likes.includes(JSON.parse(localStorage.getItem("user"))._id)} disliked={data.dislikes.includes(JSON.parse(localStorage.getItem("user"))._id)} count_likes={data.likes.length} count_dislikes={data.dislikes.length} data={data} count_comments={count} deleteOption={true} />
              )
            })}
          </div>
        </div>
        {showFollowers && <Followers setShowFollowers={setShowFollowers} userid={JSON.parse(localStorage.getItem("user"))._id} />}
        {showFollowing && <Followings setShowFollowing={setShowFollowing} userid={JSON.parse(localStorage.getItem("user"))._id} />}
      </UserContext.Provider>
    </>
  )
}

export default Profile