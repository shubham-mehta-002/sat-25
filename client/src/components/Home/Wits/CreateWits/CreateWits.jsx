import React, { useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import './CreateWits.css'
import Close from '@mui/icons-material/Close';
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
import witicon from '../../../../assets/wit_icon.jpg'

const CreateWits = () => {
  const [tagsList, setTagsList] = useState([])
  const [tag, setTag] = useState('')
  const [witName, setWitName] = useState('')
  const [witDescription, setWitDescription] = useState('')
  const [witPhoto, setWitPhoto] = useState('')
  const [flag, setFlag] = useState(true)
  const [loadStatus, setLoadStatus] = useState(false)

  const notifytag = () => toast.error('Cannot add more than 3 tags')
  const notifyBannedWords = () => toast.error('Cannot add more than 10 Banned Words')
  const navigate = useNavigate()

  const handleAddTag = () => {
    if (tagsList.length >= 3) {
      notifytag()
      return
    }
    if (tag === '') {
      return
    }
    setTagsList([...tagsList, tag])
    setTag('')
  }

  const handleRemoveTag = (index) => {
    setTagsList(tagsList.filter((_, i) => i !== index))
  }

  const [BannedWordsList, setBannedWordsList] = useState([])
  const [bannedWord, setBannedWord] = useState('')

  const loadFile = (event) => {
    var output10 = document.getElementById('output10');
    output10.src = URL.createObjectURL(event.target.files[0]);

    output10.onload = function () {
      URL.revokeObjectURL(output10.src)
    }
  }

  const handleBannedWord = () => {
    if (BannedWordsList.length >= 10) {
      notifyBannedWords()
      return
    }
    if (bannedWord === '') {
      return
    }
    setBannedWordsList([...BannedWordsList, bannedWord])
    setBannedWord('')
  }

  const handleRemoveBannedWord = (index) => {
    setBannedWordsList(BannedWordsList.filter((_, i) => i !== index))
  }

  const createNewWit = () => {
    setLoadStatus(true)
    if (witName === '' || witDescription === '') {
      toast.error('Please fill all the fields')
      return
    }
    if (witDescription.length < 20) {
      toast.error('Description should be atleast 20 characters long')
      return
    }
    const data3 = new FormData()
    data3.append("file", witPhoto)
    data3.append("upload_preset", "wittyweb")
    data3.append("cloud_name", "wittywebcloud")
    fetch("https://api.cloudinary.com/v1_1/wittywebcloud/image/upload", {
      method: "POST",
      body: data3
    })
      .then((res) => res.json())
      .then(data => {
        fetch(`${import.meta.env.VITE_BACKEND_URI}/api/createwit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          },
          body: JSON.stringify({
            name: witName,
            moderator: JSON.parse(localStorage.getItem('user'))._id,
            description: witDescription,
            tags: tagsList,
            bannedwords: BannedWordsList,
            witphoto: data.url
          })
        }).then(res => res.json())
          .then(data => {
            if (data.error) {
              toast.error(data.error)
              setLoadStatus(false)
            } else {
              toast.success('Wit created successfully')
              setLoadStatus(false)
              navigate('/wits/mywits')
            }
          })
      })
  }

  return (
    <>
      <div>
        <h2 className='font-bold text-xl mb-5'>CREATE A NEW WIT</h2>
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-evenly gap-6'>
            <div className='flex flex-col gap-3'>
              <div className='text-2xl font-bold'>Upload Wit Photo</div>
              <div><input type="file" accept='image/*' onChange={(e) => {
                setFlag(false)
                loadFile(e)
                setWitPhoto(e.target.files[0])
              }} className='fileinput w-[46%] lg:w-[100%]' /></div>
              <div className="mt-7">
                <button className='editinfo editbutton w-48 lg:w-60' onClick={() => {
                  setFlag(true)
                  setWitPhoto('')
                }}>Remove Wit Photo</button>
              </div>
            </div>
            <div className='qwerty'>
              {(flag == true) ?
                <img src={witicon} id='output10' alt="" className={`myimage2 min-h-4 min-w-4 `} draggable="false" />
                :
                <img src={URL.createObjectURL(witPhoto)} id='output10' alt="" className={`myimage2 min-h-4 min-w-4 `} draggable="false" />
              }
            </div>
          </div>
          <div className='flex flex-col lg:flex-row w-full px-10 items-center'>
            <label htmlFor="name" className='w-full lg:w-1/5 text-center lg:text-left font-bold'>Name: </label>
            <input type="text" value={witName} onChange={(e) => setWitName(e.target.value)} className='bio2 w-4/5 py-2 px-1' name="" id="" placeholder='Enter the name of the wit' />
          </div>
          <div className='flex flex-col lg:flex-row w-full px-10 items-center'>
            <label htmlFor="description" className='w-full lg:w-1/5 text-center lg:text-left font-bold'>Description: </label>
            <textarea name="" value={witDescription} onChange={(e) => setWitDescription(e.target.value)} className='bio bio2 w-4/5 py-2 px-1' id="" placeholder='Enter the description of the wit'></textarea>
          </div>
          <div className='flex flex-col lg:flex-row w-full px-10 items-center'>
            <label htmlFor="Tags" className='w-full lg:w-1/5 text-center lg:text-left font-bold'>Tags: </label>
            <div className='relative w-4/5 flex flex-col items-start'>
              <div className='relative w-full flex items-center'>
                <input type="text" name="" className='bio2 pr-10 py-2 px-1' id="" placeholder='Enter the tags of the wit' value={tag} onChange={(e) => setTag(e.target.value)} />
                <AddIcon className='absolute right-2 w-1/12' style={{ cursor: 'pointer' }} onClick={() => handleAddTag()} />
              </div>
              <p>Tags must be single word and in lowercase. Maximum 3 Tags</p>
              <p className='flex flex-wrap overflow-scroll'>
                {tagsList.map((tag, index) => (
                  <span key={index} className='flex items-center gap-2 mr-4 tagitem px-2'>
                    {tag}
                    <Close fontSize='small' style={{ cursor: 'pointer' }} onClick={() => handleRemoveTag(index)} />
                  </span>
                ))}
              </p>
            </div>
          </div>
          <div className='flex flex-col lg:flex-row w-full px-10 items-center'>
            <label htmlFor="BannedWords" className='w-full lg:w-1/5 text-center lg:text-left font-bold'>Banned Words: </label>
            <div className='relative w-4/5 flex flex-col items-start'>
              <div className='relative w-full flex items-center'>
                <input type="text" name="" className='bio2 pr-10 py-2 px-1' id="" placeholder='Enter the Banned words for the wit' value={bannedWord} onChange={(e) => setBannedWord(e.target.value)} />
                <AddIcon className='absolute right-2 w-1/12' style={{ cursor: 'pointer' }} onClick={() => handleBannedWord()} />
              </div>
              <p>Words must be single word and in Lowercase. Maximum 10 words</p>
              <p className='flex flex-wrap'>
                {BannedWordsList.map((tag, index) => (
                  <span key={index} className='flex items-center gap-2 mr-4 tagitem px-2'>
                    {tag}
                    <Close fontSize='small' style={{ cursor: 'pointer' }} onClick={() => handleRemoveBannedWord(index)} />
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
        <div className='flex justify-center'>
          {
            (loadStatus) ?
              <div className='loader editinfo w-60 flex justify-center items-center bg-[var(--body_background)] cursor-not-allowed h-full'>
                <div className="newtons-cradle">
                  <div className="newtons-cradle__dot threat"></div>
                  <div className="newtons-cradle__dot threat"></div>
                  <div className="newtons-cradle__dot threat"></div>
                  <div className="newtons-cradle__dot threat"></div>
                </div>
              </div>
              :
              <button className='editinfo editbutton w-60 mt-5' onClick={() => createNewWit()}>Create</button>
          }
        </div>
      </div >
    </>
  )
}

export default CreateWits