import React, { useState } from 'react'
import PeopleIcon from '@mui/icons-material/People';
import './SingleMyWit.css'
import groupicon from '../../../../assets/wit_icon.jpg'
import { NavLink } from 'react-router-dom';
import { RiCloseLine } from 'react-icons/ri';
import { MyWitContext } from '../../../../Context/MyWitContext'
import Members from './Members';
import RequestList from './RequestList';

const SingleMyWit = ({ witid, witName, witDescription, c_members, tags, witphoto, moderator, c_witrequest }) => {
    const [showMembers, setShowMembers] = useState(false)
    const [showRequestList, setShowRequestList] = useState(false)
    const [countrequest, setCountrequest] = useState(c_witrequest)
    return (
        <MyWitContext.Provider value={{ showMembers, setShowMembers, showRequestList, setShowRequestList }}>
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
                <div className='py-2 flex gap-2 lg:gap-0 flex-col lg:flex-row w-full items-center'>
                    <NavLink className={`w-4/5 lg:w-1/3 `} to={`/wits/${witid}`} draggable='false'>
                        <button className='editinfo editbutton asd w-full'>Open</button>
                    </NavLink>
                    <NavLink className={`w-4/5 lg:w-1/3 `} to={`/wits/mywits/editwit/${witid}`} draggable='false'>
                        <button className='editinfo editbutton asd w-full'>Edit Wit</button>
                    </NavLink>
                    <NavLink className={`w-4/5 lg:w-1/3 `} to={`/wits/mywits/witstats/${witid}`} draggable='false'>
                        <button className='editinfo editbutton asd w-full'>Stats</button>
                    </NavLink>
                    <div className='w-4/5 lg:w-1/3 '>
                        <button className='editinfo editbutton asd relative w-full' onClick={() => setShowRequestList(true)}>
                            Requests
                            {(countrequest != 0) ?
                                <div className='absolute -top-3 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex justify-center items-center'>{c_witrequest}</div>
                                :
                                null
                            }
                        </button>
                    </div>
                </div>
            </div>
            {showMembers && <Members witid={witid} setShowMembers={setShowMembers} />}
            {showRequestList && <RequestList witid={witid} setShowRequestList={setShowRequestList} />}

        </MyWitContext.Provider>
    )
}
export default SingleMyWit