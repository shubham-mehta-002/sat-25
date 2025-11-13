import React, { useEffect, useState } from 'react'
import PeopleIcon from '@mui/icons-material/People';
import groupicon from '../../../../assets/wit_icon.jpg'
import { NavLink } from 'react-router-dom';
import { toast } from "react-toastify";

const SearchedWit = ({ wit }) => {

    const [joinedStatus, setJoinedStatus] = useState('nothing')

    const requesttojoin = () => {
        fetch(`${import.meta.env.VITE_BACKEND_URI}/api/joinrequest`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                witid: wit._id,
                userid: JSON.parse(localStorage.getItem('user'))._id
            })
        }).then(res => res.json())
            .then(result => {
                if (result.error == "You must be logged in") {
                    navigate('/signin')
                    return
                }
                setJoinedStatus('requested')
                toast.success("Request Sent")
            })
    }

    useEffect(() => {
        if (wit.moderator._id == JSON.parse(localStorage.getItem('user'))._id) {
            setJoinedStatus('moderator')
        }
        else if (wit.members.some((element) => element._id == JSON.parse(localStorage.getItem('user'))._id)) {
            setJoinedStatus('joined')
        } else if (wit.requests.some(element => element._id == JSON.parse(localStorage.getItem('user'))._id)) {
            setJoinedStatus('requested')
        }
    }, [wit])

    const requesttocancel = () => {
        fetch(`${import.meta.env.VITE_BACKEND_URI}/api/cancelrequest`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                witid: wit._id,
                userid: JSON.parse(localStorage.getItem('user'))._id
            })
        }).then(res => res.json())
            .then(result => {
                if (result.error == "You must be logged in") {
                    navigate('/signin')
                    return
                }
                setJoinedStatus('nothing')
                toast.success("Request Canceled")
            })
    }

    const openwit = () => {

    }

    const leavewit = () => {
        fetch(`${import.meta.env.VITE_BACKEND_URI}/api/leavewit`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                witid: wit._id,
                userid: JSON.parse(localStorage.getItem('user'))._id
            })
        }).then(res => res.json())
            .then(result => {
                if (result.error == "You must be logged in") {
                    navigate('/signin')
                    return
                }
                setJoinedStatus('nothing')
                toast.success("Left WIT")
            })
    }

    return (
        <div className='myWit w-full overflow-x-hidden'>
            <div className='flex w-full fgh px-1 lg:px-4 items-center gap-5'>
                {wit.wit_image && wit.wit_image !== '' ?
                    <img src={wit.wit_image} alt="" className='image' draggable="false" />
                    :
                    <img src={groupicon} alt="" className='image' draggable="false" />
                }
                <h3 className='text-center  py-4 text-lg font-bold'>{wit.name}</h3>
            </div>
            <p className='text-left px-1 lg:px-4 py-3 overflow-x-hidden overflow-y-scroll'>Description: {wit.description}</p>
            <div className='divide'>
                <p className='flex gap-3 py-3 items-center text-left px-1 lg:px-4 cursor-pointer'>
                    <PeopleIcon fontSize='small' />
                    Members: {wit.members.length + 1}
                </p>
                <p className='text-left px-1 lg:px-4 py-3'>
                    Moderator:
                    {(wit.moderator._id == JSON.parse(localStorage.getItem('user'))._id) ?
                        <NavLink to={`/profile`} draggable="false">
                            {`@${wit.moderator.userName}`}
                        </NavLink>
                        :
                        <NavLink to={`/profile/${wit.moderator._id}`} draggable="false">
                            {`@${wit.moderator.userName}`}
                        </NavLink>
                    }
                </p>
                {(wit.tags.length !== 0) ?
                    <p>Tags: {wit.tags.map(tag => { return (`#${tag} `) }
                    )}</p>
                    :
                    null}
            </div>
            <div className='py-2 flex items-center w-full justify-center'>
                {(joinedStatus == 'nothing') ?
                    <button className='editinfo editbutton asd w-1/3' onClick={() => requesttojoin()}>Request To Join</button>
                    :
                    (joinedStatus == 'requested') ?
                        <button className='editinfo editbutton asd w-1/3' onClick={() => requesttocancel()}>Cancel Request</button>
                        :
                        (joinedStatus == 'joined') ?
                            <div className='flex justify-center items-center w-4/5 gap-3'>
                                <NavLink to={`/wits/${wit._id}`} className={`w-1/2 `} draggable='false'>
                                    <button className='editinfo editbutton asd w-full' onClick={() => openwit()}>Open</button>
                                </NavLink>
                                <button className='editinfo editbutton w-1/2 bg-red-500 hover:bg-red-300 text-white' onClick={() => leavewit()}>Leave</button>
                            </div>
                            :
                            <div className='flex justify-center items-center w-4/5 gap-3'>
                                <NavLink to={`/wits/${wit._id}`} className={`w-1/2 `} draggable='false'>
                                    <button className='editinfo editbutton asd' onClick={() => openwit()}>Open</button>
                                </NavLink>
                                <NavLink to={`/wits/mywits/editwit/${wit._id}`} className={`w-1/2 `} draggable='false'>
                                    <button className='editinfo editbutton asd px-[1px]' onClick={() => editwit()}>Edit Wit</button>
                                </NavLink>
                            </div>
                }
            </div>
        </div>
    )
}

export default SearchedWit