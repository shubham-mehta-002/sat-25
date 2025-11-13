import React, { useState } from 'react'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import usericon from "../../../../assets/usericon.png"
import { NavLink } from 'react-router-dom';
import SearchedWit from './SearchedWit';

const SearchAndJoinWits = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchedWits, setSearchedWits] = useState([])

  const searchwitindatabase = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URI}/api/getallwits`, {
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
        setSearchedWits(result)
      })
  }
  return (
    <div className='profile text-center flex flex-col gap-8 items-center'>
      <h1 className='temp text-xl font-bold w-full'>Search Wits</h1>
      <div className='flex items-center justify-center gap-6 w-9/12'>
        <div className='search flex items-center gap-3 w-full'>
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." className='input w-full' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => searchwitindatabase()} />
        </div>
      </div>
      <div className='search flex flex-col gap-11 justify-center items-center w-[95%] lg:w-5/6 mt-4 overflow-y-scroll text-center'>
        <div className='text-center w-full flex flex-col overflow-y-scroll'>
          <p className='text-xl font-bold pb-6'>Search Results</p>
          <div className='flex items-center justify-between mb-3 px-0 lg:px-10 w-full gap-3 flex-wrap'>
            {
              searchedWits.filter((wit) => wit.name && wit.name.toLowerCase().includes(searchQuery.toLowerCase())).map((wit, index) => {
                return (
                  <SearchedWit wit={wit} key={index} />
                )
              })
            }
            {
              searchedWits.filter((wit) => {
                let flag = false
                for (let word in wit.tags) {
                  if (searchQuery.toLowerCase().includes(wit.tags[word].toLowerCase()) || wit.tags[word].toLowerCase().includes(searchQuery.toLowerCase())) {
                    flag = true
                    break
                  }
                }
                return flag
              }).map((wit, index) => {
                return (
                  <SearchedWit wit={wit} key={index} />
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchAndJoinWits