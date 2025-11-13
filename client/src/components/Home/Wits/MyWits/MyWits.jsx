import React, { useEffect, useState } from 'react'
import SingleMyWit from './SingleMyWit'

const MyWits = () => {

  const [myWitsList, setMyWitsList] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/getmywits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      }
    }).then(res => res.json())
      .then(result => {
        setMyWitsList(result)
      })
  }, [])

  return (
    <>
      <div>
        <h2 className='font-bold text-xl mb-5'>MY WITS</h2>
        <div className='flex gap-6 max-w-full flex-wrap justify-center'>
          {myWitsList.map((wit, index) => {
            return (
                <SingleMyWit witid={wit._id} witName={wit.name} witDescription={wit.description} c_members={wit.members.length} key={index} tags={wit.tags} witphoto={wit.wit_image} moderator={wit.moderator} c_witrequest={wit.requests.length} />
            )
          })}
        </div>
      </div >
    </>
  )
}

export default MyWits