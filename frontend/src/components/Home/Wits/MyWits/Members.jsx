import React, { useEffect, useState } from 'react'
import { RiCloseLine } from "react-icons/ri";
import { NavLink } from 'react-router-dom';
import usericon from "../../../../assets/usericon.png"


const Members = ({ witid, setShowMembers }) => {
  const [member_array, setMember_array] = useState([])
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/getmembers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      },
      body: JSON.stringify({
        witid: witid
      })
    }).then(res => res.json())
      .then(result => {
        setMember_array(result.members)
      })
  }, [])
  return (
    <>
      <div className="darkBg" onClick={() => setShowMembers(false)}></div>
      <div className="centered">
        <div className="modal">
          <div className="modalHeader">
            <h1 className="heading font-bold">Members: {member_array.length+1}</h1>
          </div>
          <div className="closeBtn">
            <button onClick={() => setShowMembers(false)}>
              <RiCloseLine></RiCloseLine>
            </button>
          </div>
          <div className="modalContent">
            {member_array.map((item) => {
              return (
                <div className="likedBy flex flex-col" key={item._id}>
                  <p className="font-bold text-left flex items-center justify-between mb-2">
                    {item._id == JSON.parse(localStorage.getItem("user"))._id ?
                      <NavLink draggable="false" to={`/profile`}>
                        {(item.profile_photo && item.profile_photo != "")?
                        <img src={item.profile_photo} alt='' className='h-10 rounded-full w-10' />
                        :
                        <img src={usericon} alt='' className='h-10 rounded-full w-10 border border-gray-400' />
                      }
                      </NavLink>
                      :
                      <NavLink draggable="false" to={`/profile/${item._id}`}>
                        {(item.profile_photo && item.profile_photo != "")?
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

export default Members