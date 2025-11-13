import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import witicon from '../../../../assets/wit_icon.jpg'
import AddIcon from '@mui/icons-material/Add';
import Close from '@mui/icons-material/Close';
import { toast } from "react-toastify";

const EditWit = () => {
    const witid = useParams('editwitid')
    const [flag, setFlag] = useState(true)
    const [profilePhoto, setProfilePhoto] = useState("")
    const [profileDescription, setProfileDescription] = useState("")
    const [tagList, setTagList] = useState([])
    const [tag, setTag] = useState("")
    const [word, setWord] = useState("")
    const [bannedwordsList, setBannedwordsList] = useState([])
    const [witname, setWitname] = useState("")
    const [loadStatus, setLoadStatus] = useState(false)

    const notifyError = () => toast.error('Something went wrong!')
    const notifySuccessfulChange = () => toast.success('Wit Updated Successfully!')
    const navigate = useNavigate()


    const handleAddTag = () => {
        if (tagList.length >= 3) {
            notifytag()
            return
        }
        if (tag === '') {
            return
        }
        setTagList([...tagList, tag])
        setTag('')
    }

    const handleRemoveTag = (index) => {
        setTagList(tagList.filter((_, i) => i !== index))
    }


    const handleBannedWord = () => {
        if (bannedwordsList.length >= 10) {
            notifyBannedWords()
            return
        }
        if (word === '') {
            return
        }
        setBannedwordsList([...bannedwordsList, word])
        setWord('')
    }

    const handleRemoveBannedWord = (index) => {
        setBannedwordsList(bannedwordsList.filter((_, i) => i !== index))
    }


    const loadFile = (event) => {
        var output10 = document.getElementById('output10');
        output10.src = URL.createObjectURL(event.target.files[0]);

        output10.onload = function () {
            URL.revokeObjectURL(output10.src)
        }
    }

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URI}/api/getwitdata`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                witid: witid.editwitid,
                userid: JSON.parse(localStorage.getItem("user"))._id
            })
        }).then((res) => res.json())
            .then((data) => {
                setProfileDescription(data.description)
                setTagList(data.tags)
                setWitname(data.name)
                setBannedwordsList(data.banned_words)
                if (data.wit_image != "") {
                    setProfilePhoto(data.wit_image)
                }
                else {
                    setProfilePhoto(witicon)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const changeDetails = () => {
        setLoadStatus(true)
        fetch(`${import.meta.env.VITE_BACKEND_URI}/api/changewitdata`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                userid: JSON.parse(localStorage.getItem("user"))._id,
                witid: witid.editwitid,
                description: profileDescription,
                tags: tagList,
                banned_words: bannedwordsList
            })
        }).then(res => res.json())
            .then(data => {
                if (data.Status == "Data Updated Successfully") {
                    const data2 = new FormData()
                    data2.append("file", profilePhoto)
                    data2.append("upload_preset", "wittyweb")
                    data2.append("cloud_name", "wittywebcloud")
                    fetch("https://api.cloudinary.com/v1_1/wittywebcloud/image/upload", {
                        method: "POST",
                        body: data2
                    }).then((res) => res.json())
                        .then(data => {
                            fetch(`${import.meta.env.VITE_BACKEND_URI}/api/changewitprofilephoto`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                                },
                                body: JSON.stringify({
                                    userid: JSON.parse(localStorage.getItem("user"))._id,
                                    witid: witid.editwitid,
                                    profile_pic: data.url
                                })
                            }).then(res => res.json())
                            .then(data => {
                                    if (data.Status == "Profile Photo Updated Successfully") {
                                        setLoadStatus(false)
                                        navigate("/wits/mywits")
                                        notifySuccessfulChange()
                                    }
                                    else {
                                        notifyError()
                                        setLoadStatus(false)
                                    }
                                })
                        })
                }
                else {
                    notifyError()
                    setLoadStatus(false)
                }
            })
    }

    const removePhoto = () => {
        fetch(`${import.meta.env.VITE_BACKEND_URI}/api/removewitphoto`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                witid: witid.editwitid,
                userid: JSON.parse(localStorage.getItem("user"))._id
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.Status == "Profile Photo Removed Successfully") {
                    navigate("/wits/mywits")
                    notifySuccessfulChange()
                }
                else {
                    notifyError()
                }
            })
    }

    return (
        <>
            <div className="profile text-center flex flex-col gap-8">
                <h1 className='temp text-3xl font-bold'>Edit Your Wit @{witname}</h1>
                <div className='flex flex-col gap-6 min-w-min'>
                    <div className='flex items-center justify-evenly gap-6'>
                        <div className='flex flex-col gap-3'>
                            <div className='text-2xl font-bold'>Change your Wit Photo</div>
                            <div><input type="file" accept='image/*' onChange={(e) => {
                                setFlag(false)
                                loadFile(e)
                                setProfilePhoto(e.target.files[0])
                            }} className='fileinput w-[46%] lg:w-[100%]' /></div>
                            <div className="mt-7">
                                <button className='editinfo editbutton w-48 lg:w-60' onClick={() => removePhoto()}>Remove Wit Photo</button>
                            </div>
                        </div>
                        <div className='qwerty'>
                            {(flag == true) ?
                                <img src={profilePhoto} id='output10' alt="" className={`myimage2 min-h-4 min-w-4  `} draggable="false" />
                                :
                                <img src={URL.createObjectURL(profilePhoto)} id='output10' alt="" className={`myimage2 min-h-4 min-w-4  `} draggable="false" />
                            }
                        </div>
                    </div>
                    <div className='flex flex-col lg:flex-row items-center justify-around'>
                        <div className='text-lg font-semibold w-full lg:w-1/5 text-center lg:text-left'>Description</div>
                        <textarea value={profileDescription} onChange={(e) => setProfileDescription(e.target.value)} className="bio bio2 mx-0 w-4/5 lg:w-3/5 pt-1 px-1" placeholder='Write you bio'></textarea>
                    </div>
                    <div className='flex flex-col lg:flex-row items-center justify-around'>
                        <div className='text-lg font-semibold w-full lg:w-1/5 text-center lg:text-left'>Tags</div>
                        <div className='relative w-4/5 lg:w-3/5 flex flex-col items-start'>
                            <div className='relative w-full flex items-center'>
                                <input type="text" name="" className='bio2 pr-10 py-2 px-1' id="" placeholder='Enter the tags of the wit' value={tag} onChange={(e) => setTag(e.target.value)} />
                                <AddIcon className='absolute right-2 w-1/12' style={{ cursor: 'pointer' }} onClick={() => handleAddTag()} />
                            </div>
                            <p>Tags must be single word and in lowercase. Maximum 3 Tags</p>
                            <p className='flex flex-wrap overflow-scroll'>
                                {tagList.map((tag, index) => (
                                    <span key={index} className='flex items-center gap-2 mr-4 tagitem px-2'>
                                        {tag}
                                        <Close fontSize='small' style={{ cursor: 'pointer' }} onClick={() => handleRemoveTag(index)} />
                                    </span>
                                ))}
                            </p>
                        </div>
                    </div>
                    <div className='flex flex-col lg:flex-row items-center justify-around'>
                        <div className='text-lg font-semibold w-full lg:w-1/5 text-center lg:text-left'>Banned Words</div>
                        <div className='relative w-4/5 lg:w-3/5 flex flex-col items-start'>
                            <div className='relative w-full flex items-center'>
                                <input type="text" name="" className='bio2 pr-10 py-2 px-1' id="" placeholder='Enter the Banned words for the wit' value={word} onChange={(e) => setWord(e.target.value)} />
                                <AddIcon className='absolute right-2 w-1/12' style={{ cursor: 'pointer' }} onClick={() => handleBannedWord()} />
                            </div>
                            <p>Words must be single word and in Lowercase. Maximum 10 words</p>
                            <p className='flex flex-wrap'>
                                {bannedwordsList.map((tag, index) => (
                                    <span key={index} className='flex items-center gap-2 mr-4 tagitem px-2'>
                                        {tag}
                                        <Close fontSize='small' style={{ cursor: 'pointer' }} onClick={() => handleRemoveBannedWord(index)} />
                                    </span>
                                ))}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 justify-center mt-4 px-4">
                        <div className='flex flex-col lg:flex-row gap-2'>
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
                                    <NavLink to={"/wits/mywits"} draggable="false">
                                        <button className='editinfo editbutton w-60' onClick={() => changeDetails()}>Save</button>
                                    </NavLink>
                            }
                            <NavLink to={"/profile"} draggable="false">
                                <button className='editinfo editbutton w-60 bg-red-600 text-white hover:bg-red-400'>Cancel</button>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditWit