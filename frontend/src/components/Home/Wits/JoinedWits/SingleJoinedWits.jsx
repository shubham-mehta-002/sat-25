import React, { useState } from 'react'
import PeopleIcon from '@mui/icons-material/People';
import groupicon from '../../../../assets/wit_icon.jpg'
import { NavLink } from 'react-router-dom';
import { toast } from "react-toastify";
import { MyWitContext } from '../../../../Context/MyWitContext'
import Members from '../MyWits/Members';

const SingleJoinedWits = ({ witid, witName, witDescription, c_members, tags, witphoto, moderator }) => {
    const [showMembers, setShowMembers] = useState(false)
    const leavewit = () => {
        fetch(`${import.meta.env.VITE_BACKEND_URI}/api/leavewit`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                witid: witid,
                userid: JSON.parse(localStorage.getItem('user'))._id
            })
        }).then(res => res.json())
            .then(result => {
                if (result.error == "You must be logged in") {
                    navigate('/signin')
                    return
                }
                toast.success("Left WIT")
            })
    }
    return (
        <MyWitContext.Provider value={{ showMembers, setShowMembers }}>
            <div className='myWit w-full mx-10 lg:mx-40'>
                <div className='flex w-full fgh px-4 items-center gap-5'>
                    {witphoto && witphoto !== '' ?
                        <img src={witphoto} alt="" className='image' draggable="false" />
                        :
                        <img src={groupicon} alt="" className='image' draggable="false" />
                    }
                    <h3 className='text-center  py-4 text-lg font-bold'>{witName}</h3>
                </div>
                <p className='text-left px-4 py-3 overflow-x-hidden overflow-y-scroll'>Description: {witDescription}</p>
                <div className='divide'>
                    <p className='flex gap-3 py-3 items-center text-left px-4 cursor-pointer' onClick={() => setShowMembers(true)}>
                        <PeopleIcon fontSize='small' />
                        Members: {c_members + 1}
                    </p>
                    <p className='text-left px-4 py-3'>
                        Moderator:
                        {(moderator._id == JSON.parse(localStorage.getItem('user'))._id) ?
                            <NavLink to={`/profile`} draggable="false">
                                {`@${moderator.userName}`}
                            </NavLink>
                            :
                            <NavLink to={`/profile/${moderator._id}`} draggable="false">
                                {`@${moderator.userName}`}
                            </NavLink>
                        }
                    </p>
                    {(tags.length === 0) ?
                        <p>Tags: {tags.map(tag => { return (`#${tag} `) }
                        )}</p>
                        :
                        null}
                </div>
                <div className='py-2 flex w-full items-center'>
                    <NavLink className={`w-1/2 `} to={`/wits/${witid}`} draggable='false'>
                        <button className='editinfo asd editbutton'>Open</button>
                    </NavLink>
                    <div className='py-2 w-1/2'>
                        <button className='editinfo editbutton bg-red-500 hover:bg-red-300 text-white' onClick={() => leavewit()}>Leave</button>
                    </div>
                </div>
            </div>
            {showMembers && <Members witid={witid} setShowMembers={setShowMembers} />}

        </MyWitContext.Provider>
    )
}

export default SingleJoinedWits