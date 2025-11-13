import React, { useState } from 'react'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { NavLink } from 'react-router-dom'
import usericon from '../../../assets/usericon.png'

const SearchUsers = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [searchedUsers, setSearchedUsers] = useState([])
    const searchuserindatabase = () => {
        fetch(`${import.meta.env.VITE_BACKEND_URI}/api/searchusersindatabase`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                searchQuery: searchQuery
            })
        }).then(res => res.json())
            .then(result => {
                if (result.error == "You must be logged in") {
                    navigate('/signin')
                    return
                }
                setSearchedUsers(result)
            })
    }
    return (
        <div className='profile text-center flex flex-col gap-8 items-center'>
            <h1 className='temp text-3xl font-bold w-full'>Search Users</h1>
            <div className='flex items-center justify-center gap-6 w-9/12'>
                <div className='search flex items-center gap-3 w-full'>
                    <SearchOutlinedIcon />
                    <input type="text" placeholder="Search..." className='input w-full' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => searchuserindatabase()} />
                </div>
            </div>
            <div className='search flex flex-col gap-11 justify-center items-center w-4/6 mt-4 overflow-y-scroll text-center max-h-[55vh]'>
                <div className='text-center w-full overflow-y-scroll'>
                    <p className='text-3xl font-bold pb-6'>Search Results</p>
                    {searchedUsers.filter((user) => user.userName && user.userName.toLowerCase().includes(searchQuery.toLowerCase())).map((user) => {
                        if (user._id == JSON.parse(localStorage.getItem("user"))._id) {
                            return null
                        }
                        return (<div className='flex items-center justify-between mb-3 lg:px-20'>
                            {(user.profile_photo && user.profile_photo != "") ?
                                <NavLink to={`/profile/${user._id}`} draggable="false">
                                    <img src={user.profile_photo} draggable="false" width={40} height={40} className='rounded-full min-h-6 min-w-6' alt="" />
                                </NavLink>
                                :
                                <NavLink to={`/profile/${user._id}`} draggable="false">
                                    <img src={usericon} draggable="false" width={40} height={40} className='rounded-full min-h-6 min-w-6' alt="" />
                                </NavLink>
                            }
                            <NavLink to={`/profile/${user._id}`} draggable="false">
                                <h1 className='text-lg'>{`@${user.userName}`}</h1>
                            </NavLink>
                        </div>)
                    })
                    }
                </div>
            </div>
        </div>
    )
}

export default SearchUsers