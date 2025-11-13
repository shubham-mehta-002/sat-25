import React, { useEffect, useState } from 'react'
import usericon from "../../../../assets/usericon.png"
import { RiCloseLine } from "react-icons/ri";
import { NavLink } from 'react-router-dom';

const WitLikes = ({ setShowWitLikes, post_id }) => {
  const [likedData, setLikedData] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/getwitlikedby`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      },
      body: JSON.stringify({
        postId: post_id
      })
    })
      .then(res => res.json())
      .then(data => {
        setLikedData(data)
      })
  }, [])

  return (
    <>
      <div className="darkBg" onClick={() => setShowWitLikes(false)}></div>
      <div className="centered">
        <div className="modal">
          <div className="modalHeader">
            <h1 className="heading font-bold">Liked by: {likedData.length}</h1>
          </div>
          <div className="closeBtn">
            <button onClick={() => setShowWitLikes(false)}>
              <RiCloseLine></RiCloseLine>
            </button>
          </div>
          <div className="modalContent">
            {likedData.map((item) => {
              return (
                <div className="likedBy flex flex-col" key={item._id}>
                  <p className="font-bold text-left flex items-center justify-between mb-2">
                    {item._id == JSON.parse(localStorage.getItem("user"))._id ?
                      <NavLink draggable="false" to={`/profile`}>
                        {(item.profile_photo && item.profile_photo != "") ?
                          <img src={item.profile_photo} alt='' className='h-10 rounded-full w-10' />
                          :
                          <img src={usericon} alt='' className='h-10 rounded-full w-10 border border-gray-400' />
                        }
                      </NavLink>
                      :
                      <NavLink draggable="false" to={`/profile/${item._id}`}>
                        {(item.profile_photo && item.profile_photo != "") ?
                          <img src={item.profile_photo} alt='' className='h-10 rounded-full w-10' />
                          :
                          <img src={usericon} alt='' className='h-10 rounded-full w-10 border border-gray-400' />
                        }
                      </NavLink>}
                    {item._id == JSON.parse(localStorage.getItem("user"))._id ?
                      <NavLink draggable="false" to={`/profile`}>
                        {`@${item.userName}`}
                      </NavLink>
                      :
                      <NavLink draggable="false" to={`/profile/${item._id}`}>
                        {`@${item.userName}`}
                      </NavLink>}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default WitLikes