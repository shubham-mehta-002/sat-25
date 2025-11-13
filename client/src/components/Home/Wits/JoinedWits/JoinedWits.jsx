import React, { useEffect, useState } from 'react'
import SingleJoinedWits from './SingleJoinedWits'

const JoinedWits = () => {
  const [joinedWitsList, setJoinedWitsList] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/getjoinedwits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({
        userid: JSON.parse(localStorage.getItem('user'))._id
      })
    }).then(res => res.json())
      .then(result => {
        setJoinedWitsList(result)
      })
  }, [])
  return (
    <>
      <div>
        <h2 className='font-bold text-xl mb-5'>JOINED WIT</h2>
        <div className='flex gap-6 max-w-full flex-wrap justify-center'>
          {joinedWitsList.map((wit, index) => {
            return (
              <SingleJoinedWits witid={wit._id} witName={wit.name} witDescription={wit.description} c_members={wit.members.length} key={index} tags={wit.tags} witphoto={wit.wit_image} moderator={wit.moderator} />
            )
          })}
        </div>
      </div >
    </>
  )
}

export default JoinedWits